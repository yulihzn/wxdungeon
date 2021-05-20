import Dungeon from "../Dungeon";
import { EventHelper } from "../EventHelper";
import Shooter from "../Shooter";
import DamageData from "../Data/DamageData";
import StatusManager from "../Manager/StatusManager";
import Boss from "./Boss";
import NextStep from "../Utils/NextStep";
import AudioPlayer from "../Utils/AudioPlayer";
import FromData from "../Data/FromData";
import Achievements from "../Achievement";
import AreaOfEffectData from "../Data/AreaOfEffectData";
import IndexZ from "../Utils/IndexZ";
import ActorUtils from "../Utils/ActorUtils";

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
    dashSkill = new NextStep();
    thronSkill = new NextStep();
    defenceSkill = new NextStep();
    meleeSkill = new NextStep();
    @property(cc.Prefab)
    groundThron: cc.Prefab = null;
    @property(cc.Prefab)
    selfThron: cc.Prefab = null;
    thronPool:cc.NodePool;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sc.isDied = false;
        this.sc.isShow = false;
        this.anim = this.getComponent(cc.Animation);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.shooter.from.valueCopy(FromData.getClone(this.actorName(), 'bossicepart01'));
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.statusManager = this.node.getChildByName("StatusManager").getComponent(StatusManager);
    }

    start() {
        super.start();
    }
  
    takeDamage(damage: DamageData): boolean {
        if (this.sc.isDied || !this.sc.isShow) {
            return false;
        }

        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage();
        if (this.data.currentHealth > this.data.Common.maxHealth) {
            this.data.currentHealth = this.data.Common.maxHealth;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
        let isHalf = this.data.currentHealth < this.data.Common.maxHealth / 2;
        this.defence(isHalf);
        if (this.defenceSkill.IsExcuting) {
            AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_HIT);
        } else {
            AudioPlayer.play(AudioPlayer.MONSTER_HIT);
        }
        return true;
    }

    killed() {
        if (this.sc.isDied) {
            return;
        }
        Achievements.addMonsterKillAchievement(this.data.resName);
        cc.tween(this.node).to(3,{opacity:0}).start();
        this.sc.isDied = true;
        this.anim.play('IceDemonDefence');
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 5);
        this.getLoot();
    }
    bossAction(): void {
        if (this.sc.isDied || !this.sc.isShow || !this.dungeon) {
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
        if (playerDis < 200 && !this.defenceSkill.IsExcuting && !this.meleeSkill.IsExcuting && !this.thronSkill.IsExcuting && !this.dashSkill.IsExcuting) {
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
        // if (this.dungeon.player.pos.x > this.pos.x) {
        //     newPos = newPos.addSelf(cc.v3(1, -1));
        // } else {
        //     newPos = newPos.addSelf(cc.v3(-1, -1));
        // }
        let pos = Dungeon.getPosInMap(newPos);
        pos.y += 32;
        pos = pos.sub(this.node.position);
        let h = pos.x;
        this.isFaceRight = h > 0;
        return pos;
    }
    thronGround(isHalf: boolean) {
        this.thronSkill.next(() => {
            this.thronSkill.IsExcuting = true;
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.play('IceDemonThron');
            let count = 1;
            this.scheduleOnce(() => { AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_THRON); }, 1);
            this.scheduleOnce(() => { AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_THRON); }, 2);
            this.schedule(() => {
                let p = this.pos.clone()
                let ps = [cc.v3(p.x, p.y + count), cc.v3(p.x, p.y - count), cc.v3(p.x + count, p.y + count), cc.v3(p.x + count, p.y - count),
                cc.v3(p.x + count, p.y), cc.v3(p.x - count, p.y), cc.v3(p.x - count, p.y + count), cc.v3(p.x - count, p.y - count)]
                for (let i = 0; i < ps.length; i++) {
                    // this.dungeon.addIceThron(Dungeon.getPosInMap(ps[i]), true);
                    let d = new DamageData();
                    d.physicalDamage = 3;
                    this.shooter.dungeon = this.dungeon;
                    this.shooter.fireAoe(this.selfThron, new AreaOfEffectData()
                        .init(0, 2, 0.4, 4, IndexZ.getActorZIndex(Dungeon.getPosInMap(ps[i])), true, true, true,false, true, d, FromData.getClone('冰刺', 'bossicethron02'), [StatusManager.FROZEN]), Dungeon.getPosInMap(ps[i]).subSelf(this.getCenterPosition()), 0,null,true);

                }
                count++;
            }, 0.2, isHalf ? 7 : 5, 1);
            if (isHalf) {
                this.scheduleOnce(() => {
                    let p = this.pos.clone();
                    let ps = [cc.v3(p.x + 2, p.y + 1), cc.v3(p.x + 2, p.y - 1), cc.v3(p.x - 2, p.y + 1), cc.v3(p.x - 2, p.y - 1)
                        , cc.v3(p.x + 4, p.y + 2), cc.v3(p.x + 4, p.y - 2), cc.v3(p.x - 4, p.y + 2), cc.v3(p.x - 4, p.y - 2)
                        , cc.v3(p.x + 5, p.y + 3), cc.v3(p.x + 5, p.y - 3), cc.v3(p.x - 5, p.y + 3), cc.v3(p.x - 5, p.y - 3)
                        , cc.v3(p.x + 6, p.y + 2), cc.v3(p.x + 6, p.y - 2), cc.v3(p.x - 6, p.y + 2), cc.v3(p.x - 6, p.y - 2)
                        , cc.v3(p.x + 6, p.y + 4), cc.v3(p.x + 6, p.y - 4), cc.v3(p.x - 6, p.y + 4), cc.v3(p.x - 6, p.y - 4)
                        , cc.v3(p.x + 1, p.y + 2), cc.v3(p.x + 1, p.y - 2), cc.v3(p.x - 1, p.y + 2), cc.v3(p.x - 1, p.y - 2)
                        , cc.v3(p.x + 2, p.y + 4), cc.v3(p.x + 2, p.y - 4), cc.v3(p.x - 2, p.y + 4), cc.v3(p.x - 2, p.y - 4)
                        , cc.v3(p.x + 3, p.y + 5), cc.v3(p.x + 3, p.y - 5), cc.v3(p.x - 3, p.y + 5), cc.v3(p.x - 3, p.y - 5)
                        , cc.v3(p.x + 2, p.y + 6), cc.v3(p.x + 2, p.y - 6), cc.v3(p.x - 2, p.y + 6), cc.v3(p.x - 2, p.y - 6)
                        , cc.v3(p.x + 4, p.y + 6), cc.v3(p.x + 4, p.y - 6), cc.v3(p.x - 4, p.y + 6), cc.v3(p.x - 4, p.y - 6)];
                    for (let i = 0; i < ps.length; i++) {
                        // this.dungeon.addIceThron(Dungeon.getPosInMap(ps[i]), true);
                        let d = new DamageData();
                        d.physicalDamage = 3;
                        this.shooter.dungeon = this.dungeon;
                        this.shooter.fireAoe(this.selfThron, new AreaOfEffectData()
                            .init(0, 2, 0.4, 4, IndexZ.getActorZIndex(Dungeon.getPosInMap(ps[i])), true, true, true,false, true, d, FromData.getClone('冰刺', 'bossicethron02'), [StatusManager.FROZEN]), Dungeon.getPosInMap(ps[i]).subSelf(this.getCenterPosition()), 0,null,true);


                    }
                }, 1.5)
            }

            this.scheduleOnce(() => { this.thronSkill.IsExcuting = false; }, 4);
        }, 15, true);

    }
    thronSelf() {
        this.scheduleOnce(() => { AudioPlayer.play(AudioPlayer.SKILL_ICETHRON); }, 1);
        const angles = [0, 45, 90, 135, 180, 225, 270, 315];
        const posRight = [cc.v3(0,20),cc.v3(-10,10),cc.v3(-20,0),cc.v3(-10,-10),cc.v3(0,-20),cc.v3(10,-10),cc.v3(20,0),cc.v3(10,60)];
        const posLeft = [cc.v3(0,-20),cc.v3(-10,-10),cc.v3(-20,0),cc.v3(-10,10),cc.v3(0,20),cc.v3(10,10),cc.v3(20,0),cc.v3(10,-10)];
        let d = new DamageData();
        d.magicDamage = 1;
        for (let i = 0; i < angles.length; i++) {
            this.shooter.dungeon = this.dungeon;
            this.shooter.fireAoe(this.selfThron, new AreaOfEffectData()
        .init(0, 2, 0.4, 3, IndexZ.OVERHEAD, true, true, true,false, true, d, FromData.getClone(this.actorName(), 'bossicepart01'), [StatusManager.FROZEN]),cc.v3(this.isFaceRight?posRight[i]:posLeft[i]),angles[i],null,true);
        }
    }
    attack() {
        this.meleeSkill.next(() => {
            this.meleeSkill.IsExcuting = true;
            cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MELEE } });
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
            this.scheduleOnce(() => { AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_DASH); }, 2.5);
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
    defence(isHalf:boolean) {
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
            if(isHalf){
                this.thronSelf();
            }
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
        this.sc.isShow = true;
        if (this.healthBar) {
            this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
            this.healthBar.node.active = !this.sc.isDied;
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
        this.healthBar.node.active = !this.sc.isDied;
        if (this.sc.isDied) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        }
        this.node.scaleX = this.isFaceRight ? 1 : -1;
    }

    move(pos: cc.Vec3, speed: number) {
        if (this.sc.isDied) {
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
        let target = ActorUtils.getEnemyCollisionTarget(other);
        if (target && (this.meleeSkill.IsExcuting || this.dashSkill.IsExcuting) && !this.sc.isDied) {
            let d = new DamageData();
            d.physicalDamage = 3;
            let from = FromData.getClone(this.actorName(), 'bossicepart01');
            if (target.takeDamage(d, from, this)) {
                target.addStatus(StatusManager.FROZEN, from);
            }
        }
    }
    actorName() {
        return '冰魔';
    }
}
