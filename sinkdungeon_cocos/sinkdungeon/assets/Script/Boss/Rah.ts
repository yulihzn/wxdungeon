import Boss from "./Boss";
import DamageData from "../Data/DamageData";
import Shooter from "../Shooter";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Player from "../Player";

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

    private anim: cc.Animation;
    shooter: Shooter;
    private timeDelay = 0;
    rigidbody: cc.RigidBody;
    isMoving = false;
    isBugsCoolDown = false;
    isSnakeCoolDown = false;
    isDarkCoolDown = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDied = false;
        this.isShow = false;
        this.anim = this.getComponent(cc.Animation);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.rigidbody = this.getComponent(cc.RigidBody);
    }

    start() {

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
        return true;
    }

    killed() {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
    }
    actionCount = 0;
    bossAction(): void {
        if (this.isDied || !this.isShow || !this.dungeon) {
            this.actionCount = 0;
            return;
        }
        let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
        if (playerDis < 300) {
            this.fireSnake();
        }
        let isHalf = this.data.currentHealth < this.data.Common.maxHealth / 2;
        if (Logic.getChance(90)) { this.fireBugs(isHalf); }
        if (isHalf) {
            this.actionCount++;
            let pos = cc.v2(1, 0);
            if (this.actionCount > 10) {
                pos = cc.v2(-1, 0);
            }
            if (this.actionCount > 20) {
                this.actionCount = 0;
            }
            if (!pos.equals(cc.Vec2.ZERO)) {
                pos = pos.normalizeSelf();
                this.move(pos, 500);
            }
        }

    }
    initGuns() {
        this.isBugsCoolDown = false;
        this.isDarkCoolDown = false;
        this.isSnakeCoolDown = false;
        let pos = this.node.position.clone().add(this.shooter.node.position);
        let hv = this.dungeon.player.getCenterPosition().sub(pos);
        if (!hv.equals(cc.Vec2.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter.setHv(hv);
        }
    }
    fireSnake() {
        if (this.isSnakeCoolDown) {
            return;
        }
        this.isSnakeCoolDown = true;
        this.shooter.setHv(cc.v2(0, -1));
        let pos = this.node.position.clone().add(this.shooter.node.position);
        let hv = this.dungeon.player.getCenterPosition().sub(pos);
        if (!hv.equals(cc.Vec2.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter.setHv(hv);
            this.fireShooter(this.shooter, "bullet016", 0, 0);
        }
        setTimeout(() => { this.isSnakeCoolDown = false; }, 6000);
    }

    fireBugs(isHalf: boolean) {
        if (this.isBugsCoolDown) {
            return;
        }
        this.isBugsCoolDown = true;
        this.shooter.data.bulletLineInterval = 500;
        let pos = this.node.position.clone().add(this.shooter.node.position);
        let hv = this.dungeon.player.getCenterPosition().sub(pos);
        if (!hv.equals(cc.Vec2.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter.setHv(hv);
            this.fireShooter(this.shooter, "bullet016", 0, 1);
        }
        let cooldown = 3000;
        let angle = Logic.getRandomNum(0, 15);
        angle = Logic.getHalfChance() ? angle : -angle;
        if (isHalf) {
            this.fireShooter(this.shooter, "bullet011", 0, 1);
            cooldown = 1500;
        } else {
            this.fireShooter(this.shooter, "bullet011", 0, 1);
        }
        setTimeout(() => { this.isBugsCoolDown = false; }, cooldown);
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
        this.initGuns();
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
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            let d = new DamageData();
            d.physicalDamage = 2;
            player.takeDamage(d);
        }
    }
}
