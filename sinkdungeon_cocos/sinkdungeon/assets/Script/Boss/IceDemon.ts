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

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class IceDemon extends Boss {
    
    private anim: cc.Animation;
    shooter: Shooter;
    private timeDelay = 0;
    rigidbody: cc.RigidBody;
    isFaceRight = true;
    isMoving = false;
    darkSkill = new Skill();
    blinkSkill = new Skill();
    defenceSkill = new Skill();
    bugsSkill = new Skill();
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
        if (this.isDied || !this.isShow || this.blinkSkill.IsExcuting) {
            return false;
        }
        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage();
        if (this.data.currentHealth > this.data.Common.maxHealth) {
            this.data.currentHealth = this.data.Common.maxHealth;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
        return true;
    }

    killed() {
        if (this.isDied) {
            return;
        }
        this.node.runAction(cc.fadeOut(3));
        this.isDied = true;
        this.dungeon.fog.runAction(cc.scaleTo(1, 1.5));
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
        let newPos = this.dungeon.player.pos.clone();
        let pos = Dungeon.getPosInMap(newPos).sub(this.node.position);
        let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);
        this.isFaceRight = h > 0;
        let isHalf = this.data.currentHealth < this.data.Common.maxHealth / 2;
        if (playerDis < 100) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        }
        // if (Logic.getChance(20) && isHalf) {
        //     this.dark();
        // }
        // if (Logic.getChance(80)) {
        //     this.blink();
        // }
        // if (playerDis < 600 && !this.blinkSkill.IsExcuting) {
        //     this.fireSnake();
        // }
        // if (Logic.getChance(90) && !this.blinkSkill.IsExcuting) {
        //     this.fireBugs(isHalf);
        // }
        if (playerDis < 100) {
            this.attack();
        }
        if (!pos.equals(cc.Vec2.ZERO) && !this.meleeSkill.IsExcuting && !this.blinkSkill.IsExcuting && playerDis > 60) {
            pos = pos.normalizeSelf();
            this.move(pos, 300);
        }
    }
 
    blink(): void {
        this.blinkSkill.next(() => {
            this.blinkSkill.IsExcuting = true;
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
            let action = cc.sequence(cc.callFunc(() => { }),
                cc.fadeOut(1),
                cc.callFunc(() => {
                    let p = this.dungeon.player.pos.clone();
                    if (p.y > Dungeon.HEIGHT_SIZE - 1) {
                        p.y -= 1;
                    } else {
                        p.y += 1;
                    }
                    this.transportBoss(p.x, p.y);
                }),
                cc.fadeIn(1),
                cc.callFunc(() => {
                    this.attack();
                }));
            this.node.runAction(action);
            this.scheduleOnce(() => {
                this.blinkSkill.IsExcuting = false;
            }, 5);
        }, 10);
        return;
    }
    attack() {
        this.meleeSkill.next(() => {
            this.meleeSkill.IsExcuting = true;
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.play('IceDemonAttack001');
            this.scheduleOnce(()=>{this.meleeSkill.IsExcuting = false;},2);
        }, 3, true);

    }
    dark() {
        this.darkSkill.next(() => {
            let action = cc.sequence(cc.scaleTo(2, 1.5, 1.5), cc.rotateTo(6, 0), cc.scaleTo(2, 0.5, 0.5));
            this.dungeon.fog.runAction(action);
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            // this.anim.playAdditive('RahSpellDark');
        }, 20);

    }
    fireSnake() {
        this.defenceSkill.next(() => {
            this.shooter.setHv(cc.v2(0, -1));
            let pos = this.node.position.clone().add(this.shooter.node.position);
            let hv = this.dungeon.player.getCenterPosition().sub(pos);
            if (!hv.equals(cc.Vec2.ZERO)) {
                hv = hv.normalizeSelf();
                this.shooter.setHv(hv);
                this.fireShooter(this.shooter, "bullet014", 1, 0);
            }
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            // this.anim.playAdditive('RahSpellSnake');
        }, 6);
    }

    fireBugs(isHalf: boolean) {
        this.bugsSkill.next(() => {
            this.shooter.data.bulletLineInterval = 0.5;
            let pos = this.node.position.clone().add(this.shooter.node.position);
            let hv = this.dungeon.player.getCenterPosition().sub(pos);
            if (!hv.equals(cc.Vec2.ZERO)) {
                hv = hv.normalizeSelf();
                this.shooter.setHv(hv);
            }
            this.fireShooter(this.shooter, "bullet017", 99, 0);
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            // this.anim.playAdditive('RahSpellBugs');
        }, 4);


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
        if (player && this.meleeSkill.IsExcuting) {
            let d = new DamageData();
            d.physicalDamage = 3;
            player.takeDamage(d);
        }
    }
}
