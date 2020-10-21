import Dungeon from "../Dungeon";
import Player from "../Player";
import { EventHelper } from "../EventHelper";
import Shooter from "../Shooter";
import DamageData from "../Data/DamageData";
import StatusManager from "../Manager/StatusManager";
import Boss from "./Boss";
import Skill from "../Utils/Skill";
import AudioPlayer from "../Utils/AudioPlayer";
import FromData from "../Data/FromData";
import Achievements from "../Achievement";
import AreaOfEffectData from "../Data/AreaOfEffectData";

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
    @property(cc.Prefab)
    icethron:cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDied = false;
        this.isShow = false;
        this.anim = this.getComponent(cc.Animation);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.shooter.from.valueCopy(FromData.getClone(this.actorName(),'bossicepart01'));
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
        if(this.defenceSkill.IsExcuting){
            AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_HIT);
        }else{
            AudioPlayer.play(AudioPlayer.MONSTER_HIT);
        }
        return true;
    }

    killed() {
        if (this.isDied) {
            return;
        }
        Achievements.addMonsterKillAchievement(this.data.resName);
        this.node.runAction(cc.fadeOut(3));
        this.isDied = true;
        this.anim.play('IceDemonDefence');
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
        if (playerDis < 200 && !this.defenceSkill.IsExcuting && !this.meleeSkill.IsExcuting && !this.thronSkill.IsExcuting&& !this.dashSkill.IsExcuting) {
            this.attack();
        }
        if (!this.meleeSkill.IsExcuting && !this.defenceSkill.IsExcuting && !this.thronSkill.IsExcuting) {
            this.dash();
        }
        if (!this.meleeSkill.IsExcuting && !this.defenceSkill.IsExcuting && !this.dashSkill.IsExcuting) {
            this.thronGround(isHalf);
        }
        if (!pos.equals(cc.Vec3.ZERO)
            && !this.meleeSkill.IsExcuting
            && !this.defenceSkill.IsExcuting
            && !this.thronSkill.IsExcuting
            && !this.dashSkill.IsExcuting
            && playerDis > 60) {
            pos = pos.normalizeSelf();
            this.move(pos, 500);
        }
    }
    getMovePos(): cc.Vec3 {
        let newPos = this.dungeon.player.pos.clone();
        if (this.dungeon.player.pos.x > this.pos.x) {
            newPos = newPos.addSelf(cc.v3(1, -1));
        } else {
            newPos = newPos.addSelf(cc.v3(-1, -1));
        }
        let pos = Dungeon.getPosInMap(newPos);
        pos.y+=32;
        pos =pos.sub(this.node.position);
        let h = pos.x;
        this.isFaceRight = h > 0;
        return pos;
    }
    thronGround(isHalf:boolean) {
        this.thronSkill.next(() => {
            this.thronSkill.IsExcuting = true;
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.play('IceDemonThron');
            let count = 1;
            this.scheduleOnce(()=>{AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_THRON);},1);
            this.scheduleOnce(()=>{AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_THRON);},2);
            this.schedule(() => {
                let p = this.pos.clone()
                let ps = [cc.v3(p.x, p.y + count), cc.v3(p.x, p.y - count), cc.v3(p.x + count, p.y + count), cc.v3(p.x + count, p.y - count),
                cc.v3(p.x + count, p.y), cc.v3(p.x - count, p.y), cc.v3(p.x - count, p.y + count), cc.v3(p.x - count, p.y - count)]
                for (let i = 0; i < ps.length; i++) {
                    this.dungeon.addIceThron(Dungeon.getPosInMap(ps[i]), true);
                }
                count++;
            }, 0.2, isHalf?7:5, 1);
            if(isHalf){
                this.scheduleOnce(()=>{
                    let p = this.pos.clone();
                    let ps = [cc.v3(p.x+2,p.y+1),cc.v3(p.x+2,p.y-1),cc.v3(p.x-2,p.y+1),cc.v3(p.x-2,p.y-1)
                        ,cc.v3(p.x+4,p.y+2),cc.v3(p.x+4,p.y-2),cc.v3(p.x-4,p.y+2),cc.v3(p.x-4,p.y-2)
                        ,cc.v3(p.x+5,p.y+3),cc.v3(p.x+5,p.y-3),cc.v3(p.x-5,p.y+3),cc.v3(p.x-5,p.y-3)
                        ,cc.v3(p.x+6,p.y+2),cc.v3(p.x+6,p.y-2),cc.v3(p.x-6,p.y+2),cc.v3(p.x-6,p.y-2)
                        ,cc.v3(p.x+6,p.y+4),cc.v3(p.x+6,p.y-4),cc.v3(p.x-6,p.y+4),cc.v3(p.x-6,p.y-4)
                        ,cc.v3(p.x+1,p.y+2),cc.v3(p.x+1,p.y-2),cc.v3(p.x-1,p.y+2),cc.v3(p.x-1,p.y-2)
                        ,cc.v3(p.x+2,p.y+4),cc.v3(p.x+2,p.y-4),cc.v3(p.x-2,p.y+4),cc.v3(p.x-2,p.y-4)
                        ,cc.v3(p.x+3,p.y+5),cc.v3(p.x+3,p.y-5),cc.v3(p.x-3,p.y+5),cc.v3(p.x-3,p.y-5)
                        ,cc.v3(p.x+2,p.y+6),cc.v3(p.x+2,p.y-6),cc.v3(p.x-2,p.y+6),cc.v3(p.x-2,p.y-6)
                        ,cc.v3(p.x+4,p.y+6),cc.v3(p.x+4,p.y-6),cc.v3(p.x-4,p.y+6),cc.v3(p.x-4,p.y-6)];
                        for (let i = 0; i < ps.length; i++) {
                            this.dungeon.addIceThron(Dungeon.getPosInMap(ps[i]), true);
                        }
                },1.5)
            }
           
            this.scheduleOnce(() => { this.thronSkill.IsExcuting = false; }, 4);
        }, 15, true);

    }
    thronSelf(isNotDefend:boolean,isHalf:boolean) {
        this.scheduleOnce(() => { AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_DASH); }, 1);
        const angles1 = [0, 45, 90, 135, 180, 225, 270, 315];
        const angles2 = [15, 60, 105, 150, 195, 240, 285, 330];
        let distance1 = [100];
        let distance2 = [100, 150];
        let distance3 = [100, 150, 200];
        let scale1 = [3];
        let scale2 = [3, 4];
        let scale3 = [3, 4, 5];
        let scale4 = [3, 5];
        let a1 = [angles1];
        let a2 = [angles1, angles2];
        let a3 = [angles1, angles2, angles1];
        let a = a1;
        let scale = scale1;
        let distance = distance1;
        if (isHalf) {
            a = a2;
            scale = scale2;
            distance = distance2;
        }
        if (isNotDefend) {
            a = a2;
            scale = scale4;
            distance = distance2;
            if (isHalf) {
                a = a3;
                scale = scale3;
                distance = distance3;
            }
        }
        let d = new DamageData();
        d.magicDamage = 1;
        let index = 0;
        this.schedule(() => {
            for (let i = 0; i < a[index].length; i++) {
                this.shooter.fireAoe(this.icethron, new AreaOfEffectData()
            .init(0, 0.1, 0, scale[index], true, true, true, true, true, d, new FromData(), [StatusManager.FROZEN]),cc.v3(distance[index],0),a[index][i]);
            }
            index++;
        }, 0.5, a.length - 1);
    }
    attack() {
        this.meleeSkill.next(() => {
            this.meleeSkill.IsExcuting = true;
            cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.MELEE}});
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.play('IceDemonAttack001');
            this.scheduleOnce(() => {
                AudioPlayer.play(AudioPlayer.BOOS_ICEDEMON_ATTACK);
                let pos = this.getMovePos();
                if (!pos.equals(cc.Vec3.ZERO)) {
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
            this.scheduleOnce(()=>{AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_DASH);},2.5);
            this.anim.play('IceDemonDash');
            this.scheduleOnce(() => {
                let pos = this.getMovePos();
                if (!pos.equals(cc.Vec3.ZERO)) {
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
            this.data.Common.magicDefence = 9999;
            AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_DEFEND);
            this.scheduleOnce(() => {
                this.defenceSkill.IsExcuting = false;
                this.data.Common.defence = 0;
                this.data.Common.magicDefence = 0;
            }, 3);
        }, 6, true);
    }


    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number, angle?: number): void {
        shooter.dungeon = this.dungeon;
        // shooter.setHv(cc.v3(0, -1))
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

    move(pos: cc.Vec3, speed: number) {
        if (this.isDied) {
            return;
        }
        if (!pos.equals(cc.Vec3.ZERO)) {
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
            let from = FromData.getClone(this.actorName(),'bossicepart01');
            if(player.takeDamage(d,from,this)){
                player.addStatus(StatusManager.FROZEN,from);
            }
        }
    }
    actorName(){
        return '冰魔';
    }
}
