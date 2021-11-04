import Boss from "./Boss";
import DamageData from "../data/DamageData";
import Shooter from "../logic/Shooter";
import Dungeon from "../logic/Dungeon";
import StatusManager from "../manager/StatusManager";
import NextStep from "../utils/NextStep";
import Random from "../utils/Random";
import AudioPlayer from "../utils/AudioPlayer";
import FromData from "../data/FromData";
import Achievement from "../logic/Achievement";
import IndexZ from "../utils/IndexZ";
import ActorUtils from "../utils/ActorUtils";
import Logic from "../logic/Logic";
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
export default class Dragon extends Boss {
    init(type: number): void {
        throw new Error("Method not implemented.");
    }

    private anim: cc.Animation;
    shooter01: Shooter;
    private timeDelay = 0;
    rigidbody: cc.RigidBody;
    isMoving = false;
    fireSkill = new NextStep();
    rainSkill = new NextStep();
    isRainReady = false;
    physicBox: CCollider;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sc.isDied = false;
        this.sc.isShow = false;
        this.anim = this.getComponent(cc.Animation);
        this.shooter01 = this.node.getChildByName('Shooter01').getComponent(Shooter);
        this.shooter01.from.valueCopy(FromData.getClone(this.actorName(), 'dragonhead'));
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.statusManager = this.node.getChildByName("StatusManager").getComponent(StatusManager);
        this.physicBox = this.getComponent(CCollider);
    }

    start() {
    }
    takeDamage(damage: DamageData): boolean {
        if (this.sc.isDied || !this.sc.isShow || this.rainSkill.IsExcuting) {
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
        this.sc.isDied = true;
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 5);
        this.getLoot();
    }
    fireFire() {
        this.fireSkill.next(() => {
            this.fireSkill.IsExcuting = true;
            this.anim.play('DragonFire');
            this.scheduleOnce(() => {
                this.shooter01.setHv(cc.v3(0, -1));
                this.shooter01.data.bulletLineInterval = 0.5;
                this.fireShooter(this.shooter01, "bullet200", 2, 5);
            }, 1.1);
            this.scheduleOnce(() => {
                this.fireSkill.IsExcuting = false;
                this.anim.play('DragonIdle');
            }, 2);
        }, 5, true);
    }
    fireRain(): void {
        if (!this.isRainReady) {
            return;
        }
        this.rainSkill.next(() => {
            this.rainSkill.IsExcuting = true;
            this.physicBox.sensor = true;
            this.rigidbody.linearVelocity = cc.v2(0, 0);
            this.anim.stop();
            this.anim.play('DragonFlyHigh');
            this.scheduleOnce(() => {
                this.anim.play('DragonFlyLow');
                this.physicBox.sensor = false;
            }, 13);
            this.scheduleOnce(() => {
                this.rainSkill.IsExcuting = false;
            }, 15);
            this.schedule(() => {
                this.dungeon.addFallStone(this.dungeon.player.node.position, true, true);
                this.dungeon.addFallStone(Dungeon.getPosInMap(cc.v3(Random.getRandomNum(0, Dungeon.WIDTH_SIZE - 1), Random.getRandomNum(0, Dungeon.HEIGHT_SIZE - 1))), true, true);
                this.dungeon.addFallStone(Dungeon.getPosInMap(cc.v3(Random.getRandomNum(0, Dungeon.WIDTH_SIZE - 1), Random.getRandomNum(0, Dungeon.HEIGHT_SIZE - 1))), true, true);
                this.dungeon.addFallStone(Dungeon.getPosInMap(cc.v3(Random.getRandomNum(0, Dungeon.WIDTH_SIZE - 1), Random.getRandomNum(0, Dungeon.HEIGHT_SIZE - 1))), true, true);
            }, 0.5, 20, 2);
        }, 30)
    }
    actionCount = 0;
    bossAction(): void {
        if (this.sc.isDied || !this.sc.isShow || !this.dungeon) {
            this.actionCount = 0;
            return;
        }
        this.changeZIndex();
        this.fireRain();
        if (!this.rainSkill.IsExcuting) {
            this.fireFire();
        }
        if (!this.rainSkill.IsExcuting) {
            this.actionCount++;
            let pos = cc.v3(1, 0);
            if (this.actionCount > 10) {
                pos = cc.v3(-1, 0);
            }
            if (this.actionCount > 20) {
                this.actionCount = 0;
            }
            if (!pos.equals(cc.Vec3.ZERO)) {
                pos = pos.normalizeSelf();
                this.move(pos, 800);
            }
        }
    }
    changeZIndex() {
        this.node.zIndex = IndexZ.OVERHEAD;
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
        let movement = cc.v2(h, v);
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;

        this.changeZIndex();
    }
    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number, angle?: number): void {
        shooter.dungeon = this.dungeon;
        shooter.data.bulletType = bulletType;
        shooter.data.bulletArcExNum = bulletArcExNum;
        shooter.data.bulletLineExNum = bulletLineExNum;
        shooter.setHv(cc.v3(0, -1));
        shooter.fireBullet(angle, cc.Vec3.ZERO);
    }
    showBoss() {
        this.sc.isShow = true;
        if (this.healthBar) {
            this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
            this.healthBar.node.active = !this.sc.isDied;
        }
        this.scheduleOnce(() => { this.isRainReady = true }, 10);
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
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        let target = ActorUtils.getEnemyCollisionTarget(other);
        if (target && !this.sc.isDied && !this.physicBox.sensor) {
            let d = new DamageData();
            d.physicalDamage = 3;
            target.takeDamage(d, FromData.getClone(this.actorName(), 'dragonhead'), this);
        }
    }
    actorName() {
        return '末日黑龙';
    }
}
