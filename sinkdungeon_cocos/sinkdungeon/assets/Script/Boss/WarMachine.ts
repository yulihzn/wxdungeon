import Boss from "./Boss";
import DamageData from "../Data/DamageData";
import Shooter from "../Shooter";
import Dungeon from "../Dungeon";

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
export default class WarMachine extends Boss {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    private anim: cc.Animation;
    shooter01: Shooter;//主炮
    shooter02: Shooter;//加特林左
    shooter03: Shooter;//加特林右
    shooter04: Shooter;//导弹左
    shooter05: Shooter;//导弹右
    private timeDelay = 0;
    rigidbody: cc.RigidBody;
    isMoving = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDied = false;
        this.isShow = false;
        this.anim = this.getComponent(cc.Animation);
        this.shooter01 = this.node.getChildByName('Shooter01').getComponent(Shooter);
        this.shooter02 = this.node.getChildByName('Shooter02').getComponent(Shooter);
        this.shooter03 = this.node.getChildByName('Shooter03').getComponent(Shooter);
        this.shooter04 = this.node.getChildByName('Shooter04').getComponent(Shooter);
        this.shooter05 = this.node.getChildByName('Shooter05').getComponent(Shooter);
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
        if (this.isDied || !this.isShow) {
            this.actionCount = 0;
            return;
        }
        this.actionCount++;
        if (this.dungeon) {
            this.fireShooter(this.shooter01,"bullet010",0,0);
            this.fireShooter(this.shooter02,"bullet011",0,2);
            this.fireShooter(this.shooter03,"bullet011",0,2);
            this.fireShooter(this.shooter04,"bullet012",0,0);
            this.fireShooter(this.shooter05,"bullet012",0,0);

        }
        let pos = cc.v2(1,0);
        if(this.actionCount > 10){
            pos = cc.v2(-1,0);
        }
        if(this.actionCount > 20){
            this.actionCount = 0;
        }
        if (!pos.equals(cc.Vec2.ZERO)) {
            pos = pos.normalizeSelf();
            this.move(pos, 20000);
        }
    }
    fireShooter(shooter:Shooter,bulletType:string,bulletArcExNum:number,bulletLineExNum:number):void{
        shooter.dungeon = this.dungeon;
        shooter.setHv(cc.v2(0,-1))
        shooter.data.bulletType = bulletType;
        shooter.data.bulletArcExNum = bulletArcExNum;
        shooter.data.bulletLineExNum = bulletLineExNum;
        shooter.fireBullet();
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
        if (this.actionTimeDelay > 2) {
            this.actionTimeDelay = 0;
            return true;
        }
        return false;
    }
    update (dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            this.updatePlayerPos();
        }
        if(this.isActionTimeDelay(dt)){
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

}
