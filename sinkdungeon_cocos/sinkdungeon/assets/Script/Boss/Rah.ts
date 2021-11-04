import Boss from "./Boss";
import DamageData from "../data/DamageData";
import Shooter from "../logic/Shooter";
import Dungeon from "../logic/Dungeon";
import Logic from "../logic/Logic";
import StatusManager from "../manager/StatusManager";
import NextStep from "../utils/NextStep";
import { EventHelper } from "../logic/EventHelper";
import AudioPlayer from "../utils/AudioPlayer";
import FromData from "../data/FromData";
import Achievement from "../logic/Achievement";
import ActorUtils from "../utils/ActorUtils";
import CCollider from "../collider/CCollider";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rah extends Boss {
    init(type: number): void {
        throw new Error("Method not implemented.");
    }

    private anim: cc.Animation;
    shooter: Shooter;
    private timeDelay = 0;
    rigidbody: cc.RigidBody;
    isFaceRight = true;
    isMoving = false;
    darkSkill = new NextStep();
    blinkSkill = new NextStep();
    snakeSkill = new NextStep();
    bugsSkill = new NextStep();
    meleeSkill = new NextStep();
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sc.isDied = false;
        this.sc.isShow = false;
        this.anim = this.getComponent(cc.Animation);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.statusManager = this.node.getChildByName("StatusManager").getComponent(StatusManager);
        this.shooter.from.valueCopy(FromData.getClone(this.actorName(), 'bossrahhead'));
    }

    start() {
        super.start();
    }
    takeDamage(damage: DamageData): boolean {
        if (this.sc.isDied || !this.sc.isShow || this.blinkSkill.IsExcuting) {
            return false;
        }

        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage();
        if (this.data.currentHealth > this.data.Common.maxHealth) {
            this.data.currentHealth = this.data.Common.maxHealth;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
        let hitNames = [AudioPlayer.MONSTER_HIT, AudioPlayer.MONSTER_HIT1, AudioPlayer.MONSTER_HIT2];
        AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)]);
        return true;
    }

    killed() {
        if (this.sc.isDied) {
            return;
        }
        Achievement.addMonsterKillAchievement(this.data.resName);
        cc.tween(this.node).to(3, { opacity: 0 }).start();
        this.sc.isDied = true;
        cc.tween(this.dungeon.fog).to(3, { scale: 5 }).start();
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 5);
        this.getLoot();
    }
    bossAction(): void {
        if (this.sc.isDied || !this.sc.isShow || !this.dungeon) {
            return;
        }
        this.entity.Transform.position = Dungeon.fixOuterMap(this.entity.Transform.position);
        this.pos = Dungeon.getIndexInMap(this.entity.Transform.position);
        this.changeZIndex();
        let newPos = this.dungeon.player.pos.clone();
        let pos = Dungeon.getPosInMap(newPos).sub(this.entity.Transform.position);
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
        if (Logic.getChance(20) && isHalf) {
            this.dark();
        }
        if (Logic.getChance(80)) {
            this.blink();
        }
        if (playerDis < 600 && !this.blinkSkill.IsExcuting) {
            this.fireSnake();
        }
        if (Logic.getChance(90) && !this.blinkSkill.IsExcuting) {
            this.fireBugs(isHalf);
        }
        if (playerDis < 100 && !this.blinkSkill.IsExcuting) {
            this.attack();
        }
        if (!pos.equals(cc.Vec3.ZERO) && !this.meleeSkill.IsExcuting && !this.blinkSkill.IsExcuting && playerDis > 100) {
            pos = pos.normalizeSelf();
            this.move(pos, 100);
        }
    }

    blink(): void {
        this.blinkSkill.next(() => {
            cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.BLINK } });
            this.blinkSkill.IsExcuting = true;
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
            cc.tween(this.node).to(1, { opacity: 0 }).call(() => {
                let p = this.dungeon.player.pos.clone();
                if (p.y > Dungeon.HEIGHT_SIZE - 1) {
                    p.y -= 1;
                } else {
                    p.y += 1;
                }
                this.transportBoss(p.x, p.y);
            }).to(1, { opacity: 255 }).call(() => {
                this.attack();
            }).start();
            this.scheduleOnce(() => {
                this.blinkSkill.IsExcuting = false;
            }, 5);
        }, 10);
        return;
    }
    attack() {
        this.meleeSkill.next(() => {
            cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.MELEE } });
            this.meleeSkill.IsExcuting = true;
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.playAdditive('RahAttack001');
        }, 2, true);

    }
    dark() {
        this.darkSkill.next(() => {
            cc.tween(this.dungeon.fog).to(2, { scale: 1.75 }).to(6, { angle: 0 }).to(2, { scale: 0.6 }).start();
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.playAdditive('RahSpellDark');
        }, 20);

    }
    fireSnake() {
        this.snakeSkill.next(() => {
            this.shooter.setHv(cc.v3(0, -1));
            let pos = this.entity.Transform.position.clone().add(this.shooter.node.position);
            let hv = this.dungeon.player.getCenterPosition().sub(pos);
            if (!hv.equals(cc.Vec3.ZERO)) {
                hv = hv.normalizeSelf();
                this.shooter.setHv(hv);
                this.fireShooter(this.shooter, "bullet014", 1, 0);
            }
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.playAdditive('RahSpellSnake');
        }, 6);
    }

    fireBugs(isHalf: boolean) {
        this.bugsSkill.next(() => {
            this.shooter.data.bulletLineInterval = 0.5;
            let pos = this.entity.Transform.position.clone().add(this.shooter.node.position);
            let hv = this.dungeon.player.getCenterPosition().sub(pos);
            if (!hv.equals(cc.Vec3.ZERO)) {
                hv = hv.normalizeSelf();
                this.shooter.setHv(hv);
            }
            this.fireShooter(this.shooter, "bullet017", 99, 0);
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.playAdditive('RahSpellBugs');
        }, 4);


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
    updateLogic(dt: number) {
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
            this.pos = Dungeon.getIndexInMap(this.entity.Transform.position);
        }
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let movement = cc.v2(h, v);
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;
        // if (this.isMoving) {
        //     if (!this.anim.getAnimationState('CaptainMove').isPlaying) {
        //         this.anim.playAdditive('CaptainMove');
        //     }
        // } else {
        //     if (this.anim.getAnimationState('CaptainMove').isPlaying) {
        //         this.anim.play('CaptainIdle');
        //     }
        // }
        this.changeZIndex();
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        let target = ActorUtils.getEnemyCollisionTarget(other);
        if (target && this.meleeSkill.IsExcuting && !this.sc.isDied) {
            let d = new DamageData();
            d.physicalDamage = 15;
            target.takeDamage(d, FromData.getClone(this.actorName(), 'bossrahhead'), this);
        }
    }
    actorName() {
        return '机械拉神';
    }
}
