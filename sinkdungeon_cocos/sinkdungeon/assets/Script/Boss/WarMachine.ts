import Boss from "./Boss";
import DamageData from "../Data/DamageData";
import Shooter from "../Shooter";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import StatusManager from "../Manager/StatusManager";
import AudioPlayer from "../Utils/AudioPlayer";
import { EventHelper } from "../EventHelper";
import FromData from "../Data/FromData";
import Achievement from "../Achievement";
import ActorUtils from "../Utils/ActorUtils";

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
    isMissileCoolDown = false;
    isGatlingCoolDown = false;
    isMainGunCoolDown = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sc.isDied = false;
        this.sc.isShow = false;
        this.anim = this.getComponent(cc.Animation);
        this.shooter01 = this.node.getChildByName('Shooter01').getComponent(Shooter);
        this.shooter02 = this.node.getChildByName('Shooter02').getComponent(Shooter);
        this.shooter03 = this.node.getChildByName('Shooter03').getComponent(Shooter);
        this.shooter04 = this.node.getChildByName('Shooter04').getComponent(Shooter);
        this.shooter05 = this.node.getChildByName('Shooter05').getComponent(Shooter);
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.statusManager = this.node.getChildByName("StatusManager").getComponent(StatusManager);
        let from = FromData.getClone(this.actorName(),'bossmachinehead');
        this.shooter01.from.valueCopy(from);
        this.shooter02.from.valueCopy(from);
        this.shooter03.from.valueCopy(from);
        this.shooter04.from.valueCopy(from);
        this.shooter05.from.valueCopy(from);
        
    }

    start() {
        this.initGuns();
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
        cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.MONSTER_HIT}});
        return true;
    }

    killed() {
        if (this.sc.isDied) {
            return;
        }
        if(this.anim){
            this.anim.pause();
        }
        Achievement.addMonsterKillAchievement(this.data.resName);
        this.sc.isDied = true;
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 5);
        this.getLoot();
    }
    actionCount = 0;
    bossAction(): void {
        if (this.sc.isDied || !this.sc.isShow || !this.dungeon) {
            this.actionCount = 0;
            return;
        }
        this.changeZIndex();
        let isHalf = this.data.currentHealth < this.data.Common.maxHealth / 2;
        if (this.dungeon) {
            if (Logic.getChance(90)) { this.fireMainGun(); }
        }
        let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
        if (playerDis < 300) {
            this.fireMissile(isHalf);
        } else if (Logic.getChance(20)) {
            this.fireMissile(isHalf);
        }
        this.fireGatling(isHalf);
        if (isHalf) {
            this.actionCount++;
            let pos = cc.v3(1, 0);
            if (this.actionCount > 10) {
                cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.MELEE}});
                pos = cc.v3(-1, 0);
            }
            if (this.actionCount > 20) {
                cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.MELEE}});
                this.actionCount = 0;
            }
            if (!pos.equals(cc.Vec3.ZERO)) {
                pos = pos.normalizeSelf();
                this.move(pos, 600);
            }
        }
        this.shooter01.setHv(cc.v3(0, -1));
        let pos = this.node.position.clone().add(this.shooter01.node.position);
        let hv = this.dungeon.player.getCenterPosition().sub(pos);
        if (!hv.equals(cc.Vec3.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter01.setHv(hv);
        }

    }
    initGuns(){
        this.isMainGunCoolDown = false;
        this.isGatlingCoolDown = false;
        this.isMissileCoolDown = false;
        this.shooter01.setHv(cc.v3(0, -1));
        this.shooter02.setHv(cc.v3(0, -1));
        this.shooter03.setHv(cc.v3(0, -1));
        this.shooter04.setHv(cc.v3(0, -1));
        this.shooter05.setHv(cc.v3(0, -1));
        let pos = this.node.position.clone().add(this.shooter01.node.position);
        let hv = this.dungeon.player.getCenterPosition().sub(pos);
        if (!hv.equals(cc.Vec3.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter01.setHv(hv);
        }
    }
    fireMainGun() {
        if (this.isMainGunCoolDown) {
            return;
        }
        this.isMainGunCoolDown = true;
        this.anim.play('WarMachineMainGunShoot');
        this.scheduleOnce(() => { this.isMainGunCoolDown = false; }, 10);
    }
    //Anim
    MainGunShootFinish(){
        this.shooter01.setHv(cc.v3(0, -1));
        let pos = this.node.position.clone().add(this.shooter01.node.position);
        let hv = this.dungeon.player.getCenterPosition().sub(pos);
        if (!hv.equals(cc.Vec3.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter01.setHv(hv);
            this.fireShooter(this.shooter01, "bullet016", 0, 0,0,cc.v3(48,0));
        }
        this.anim.play('WarMachineIdle');
    }
    fireGatling(isHalf: boolean) {
        if (this.isGatlingCoolDown) {
            return;
        }
        this.isGatlingCoolDown = true;
        this.shooter02.setHv(cc.v3(0, -1));
        this.shooter03.setHv(cc.v3(0, -1));
        this.shooter02.data.bulletLineInterval = 0.5;
        this.shooter03.data.bulletLineInterval = 0.5;
        let cooldown = 6;
        let angle = Logic.getRandomNum(0,15);
        angle = Logic.getHalfChance()?angle:-angle;
        if (isHalf) {
            this.fireShooter(this.shooter02, "bullet111", 0, 4);
            this.fireShooter(this.shooter03, "bullet111", 0, 4);
            cooldown = 3;
        } else {
            this.fireShooter(this.shooter02, "bullet111", 2, 2);
            this.fireShooter(this.shooter03, "bullet111", 2, 2);
        }
        this.scheduleOnce(() => { this.isGatlingCoolDown = false; }, cooldown);
    }
    fireMissile(isHalf: boolean) {
        if (this.isMissileCoolDown) {
            return;
        }
        this.isMissileCoolDown = true;
        this.shooter04.setHv(cc.v3(0, -1));
        this.shooter05.setHv(cc.v3(0, -1));
        this.shooter04.data.bulletLineInterval=0.5;
        this.shooter05.data.bulletLineInterval=0.5;
        this.fireShooter(this.shooter04, "bullet015", 2, isHalf?1:0);
        this.fireShooter(this.shooter05, "bullet015", 2, isHalf?1:0);
        this.scheduleOnce(() => { this.isMissileCoolDown = false; }, isHalf?8:16);
    }
    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number,angle?:number,defaultPos?: cc.Vec3): void {
        shooter.dungeon = this.dungeon;
        // shooter.setHv(cc.v3(0, -1))
        shooter.data.bulletType = bulletType;
        shooter.data.bulletArcExNum = bulletArcExNum;
        shooter.data.bulletLineExNum = bulletLineExNum;
        shooter.fireBullet(angle,defaultPos);
    }
    showBoss() {
        this.initGuns();
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
    updateLogic(dt:number) {
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
        this.changeZIndex();
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        let target = ActorUtils.getEnemyCollisionTarget(other);
        if(target&&!this.sc.isDied){
            let d = new DamageData();
            d.physicalDamage = 5;
            target.takeDamage(d,FromData.getClone(this.actorName(),'bossmachinehead'),this);
        }
    }
    actorName(){
        return '战争机器';
    }
}
