import CaptainSword from "./CaptainSword";
import HealthBar from "../HealthBar";
import MonsterData from "../Data/MonsterData";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Player from "../Player";
import { EventConstant } from "../EventConstant";
import Shooter from "../Shooter";
import EquipmentManager from "../Manager/EquipmentManager";
import DamageData from "../Data/DamageData";
import StatusManager from "../Manager/StatusManager";
import Boss from "./Boss";
import Skill from "../Utils/Skill";
import AudioPlayer from "../Utils/AudioPlayer";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class IceDemon extends Boss {

    private anim: cc.Animation;
    shooter: Shooter;
    private timeDelay = 0;
    rigidbody: cc.RigidBody;
    isFaceRight = true;
    isMoving = false;
    dashSkill = new Skill();
    thronSkill = new Skill();
    defenceSkill = new Skill();
    meleeSkill = new Skill();

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDied = false;
        this.isShow = false;
        this.anim = this.getComponent(cc.Animation);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.statusManager = this.node.getChildByName("StatusManager").getComponent(StatusManager);
    }

    start() {
        super.start();
    }
    takeDamage(damage: DamageData): boolean {
        if (this.isDied || !this.isShow) {
            return false;
        }
        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage();
        if (this.data.currentHealth > this.data.Common.maxHealth) {
            this.data.currentHealth = this.data.Common.maxHealth;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
        this.defence();
        cc.director.emit(EventConstant.PLAY_AUDIO,{detail:{name:AudioPlayer.MONSTER_HIT}});
        return true;
    }

    killed() {
        if (this.isDied) {
            return;
        }
        this.node.runAction(cc.fadeOut(3));
        this.isDied = true;
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 5);
        this.getLoot();
    }
    bossAction(): void {
        if (this.isDied || !this.isShow || !this.dungeon) {
            return;
        }
        this.node.position = Dungeon.fixOuterMap(this.node.position);
        this.pos = Dungeon.getIndexInMap(this.node.position);
        this.changeZIndex();
        let pos = this.getMovePos();
        let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
        let isHalf = this.data.currentHealth < this.data.Common.maxHealth / 2;
        if (playerDis < 100) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        }
        if (playerDis < 100 && !this.defenceSkill.IsExcuting && !this.meleeSkill.IsExcuting && !this.thronSkill.IsExcuting&& !this.dashSkill.IsExcuting) {
            this.attack();
        }
        if (!this.meleeSkill.IsExcuting && !this.defenceSkill.IsExcuting && !this.thronSkill.IsExcuting) {
            this.dash();
        }
        if (!this.meleeSkill.IsExcuting && !this.defenceSkill.IsExcuting && !this.dashSkill.IsExcuting) {
            this.thron(isHalf);
        }
        if (!pos.equals(cc.Vec2.ZERO)
            && !this.meleeSkill.IsExcuting
            && !this.defenceSkill.IsExcuting
            && !this.thronSkill.IsExcuting
            && !this.dashSkill.IsExcuting
            && playerDis > 60) {
            pos = pos.normalizeSelf();
            this.move(pos, 500);
        }
    }
    getMovePos(): cc.Vec2 {
        let newPos = this.dungeon.player.pos.clone();
        if (this.dungeon.player.pos.x > this.pos.x) {
            newPos = newPos.addSelf(cc.v2(1, -1));
        } else {
            newPos = newPos.addSelf(cc.v2(-1, -1));
        }
        let pos = Dungeon.getPosInMap(newPos);
        pos.y+=32;
        pos =pos.sub(this.node.position);
        let h = pos.x;
        this.isFaceRight = h > 0;
        return pos;
    }
    thron(isHalf:boolean) {
        this.thronSkill.next(() => {
            this.thronSkill.IsExcuting = true;
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.play('IceDemonThron');
            let count = 1;
            this.schedule(() => {
                let p = this.pos.clone()
                let ps = [cc.v2(p.x, p.y + count), cc.v2(p.x, p.y - count), cc.v2(p.x + count, p.y + count), cc.v2(p.x + count, p.y - count),
                cc.v2(p.x + count, p.y), cc.v2(p.x - count, p.y), cc.v2(p.x - count, p.y + count), cc.v2(p.x - count, p.y - count)]
                for (let i = 0; i < ps.length; i++) {
                    this.dungeon.addIceThron(Dungeon.getPosInMap(ps[i]), true);
                }
                count++;
            }, 0.2, isHalf?7:5, 1)
            this.scheduleOnce(() => { this.thronSkill.IsExcuting = false; }, 4);
        }, 15, true);

    }
    attack() {

        this.meleeSkill.next(() => {
            this.meleeSkill.IsExcuting = true;
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.play('IceDemonAttack001');
            this.scheduleOnce(() => {
                let pos = this.getMovePos();
                if (!pos.equals(cc.Vec2.ZERO)) {
                    pos = pos.normalizeSelf();
                }
                let h = pos.x;
                let v = pos.y;
                let movement = cc.v2(h, v);
                movement = movement.mul(1500);
                this.rigidbody.linearVelocity = movement;
            }, 1);
            this.scheduleOnce(() => { this.meleeSkill.IsExcuting = false; }, 2);
        }, 3, true);

    }
    dash() {
        this.dashSkill.next(() => {
            this.dashSkill.IsExcuting = true;
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.play('IceDemonDash');
            this.scheduleOnce(() => {
                let pos = this.getMovePos();
                if (!pos.equals(cc.Vec2.ZERO)) {
                    pos = pos.normalizeSelf();
                }
                let h = pos.x;
                let v = pos.y;
                let movement = cc.v2(h, v);
                movement = movement.mul(2500);
                this.rigidbody.linearVelocity = movement;
            }, 2.4);
            this.scheduleOnce(() => { this.dashSkill.IsExcuting = false; }, 3);
        }, 8, true);

    }
    defence() {
        this.defenceSkill.next(() => {
            this.defenceSkill.IsExcuting = true;
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.play('IceDemonDefence');
            this.data.Common.defence = 9999;
            this.data.Common.fireDefence = 9999;
            this.data.Common.iceDefence = 9999;
            this.data.Common.toxicDefence = 9999;
            this.data.Common.lighteningDamage = 9999;
            this.data.Common.curseDefence = 9999;
            this.scheduleOnce(() => {
                this.defenceSkill.IsExcuting = false;
                this.data.Common.defence = 0;
                this.data.Common.fireDefence = 0;
                this.data.Common.iceDefence = 0;
                this.data.Common.toxicDefence = 0;
                this.data.Common.lighteningDamage = 0;
                this.data.Common.curseDefence = 0;
            }, 3);
        }, 6, true);
    }


    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number, angle?: number): void {
        shooter.dungeon = this.dungeon;
        // shooter.setHv(cc.v2(0, -1))
        shooter.data.bulletType = bulletType;
        shooter.data.bulletArcExNum = bulletArcExNum;
        shooter.data.bulletLineExNum = bulletLineExNum;
        shooter.fireBullet(angle);
    }
    showBoss() {
        this.isShow = true;
        if (this.healthBar) {
            this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
            this.healthBar.node.active = !this.isDied;
        }
    }
    actionTimeDelay = 0;
    isActionTimeDelay(dt: number): boolean {
        this.actionTimeDelay += dt;
        if (this.actionTimeDelay > 0.2) {
            this.actionTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 1) {
            this.timeDelay = 0;
        }
        if (this.isActionTimeDelay(dt)) {
            this.bossAction();
        }
        if (this.data.currentHealth < 1) {
            this.killed();
        }
        this.healthBar.node.active = !this.isDied;
        if (this.isDied) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        }
        this.node.scaleX = this.isFaceRight ? 1 : -1;
    }

    move(pos: cc.Vec2, speed: number) {
        if (this.isDied) {
            return;
        }
        if (!pos.equals(cc.Vec2.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.node.position);
        }
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let movement = cc.v2(h, v);
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;
        if (this.isMoving) {
            if (!this.anim.getAnimationState('IceDemonWalk').isPlaying) {
                this.anim.playAdditive('IceDemonWalk');
            }
        } else {
            if (this.anim.getAnimationState('IceDemonWalk').isPlaying) {
                this.anim.play('IceDemonIdle');
            }
        }
        this.changeZIndex();
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player && (this.meleeSkill.IsExcuting||this.dashSkill.IsExcuting)&&!this.isDied) {
            let d = new DamageData();
            d.physicalDamage = 3;
            player.takeDamage(d);
            player.addStatus(StatusManager.FROZEN);
        }
    }
    actorName(){
        return '冰魔';
    }
}
