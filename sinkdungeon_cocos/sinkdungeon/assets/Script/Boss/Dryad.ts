import Boss from "./Boss";
import DamageData from "../Data/DamageData";
import Shooter from "../Shooter";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Player from "../Player";
import StatusManager from "../Manager/StatusManager";
import Skill from "../Utils/Skill";
import BossAttackCollider from "./BossAttackCollider";

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
export default class Dryad extends Boss {

    @property(BossAttackCollider)
    hand01:BossAttackCollider = null;
    @property(BossAttackCollider)
    hand02:BossAttackCollider = null;
    private anim: cc.Animation;
    shooter01: Shooter;//主炮
    shooter02: Shooter;//加特林左
    shooter03: Shooter;//加特林右
    private timeDelay = 0;
    rigidbody: cc.RigidBody;
    isMoving = false;
    @property(cc.Node)
    flower01:cc.Node = null;
    @property(cc.Node)
    flower02:cc.Node = null;
    // LIFE-CYCLE CALLBACKS:
    twoFlowerSkill = new Skill();
    twineGrassSkill = new Skill();
    meleeSkill = new Skill();
    stoneSkill = new Skill();

    onLoad() {
        this.isDied = false;
        this.isShow = false;
        this.anim = this.getComponent(cc.Animation);
        this.shooter01 = this.node.getChildByName('Shooter01').getComponent(Shooter);
        this.shooter02 = this.node.getChildByName('Shooter02').getComponent(Shooter);
        this.shooter03 = this.node.getChildByName('Shooter03').getComponent(Shooter);
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.statusManager = this.node.getChildByName("StatusManager").getComponent(StatusManager);
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
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 5);
        this.getLoot();
    }
    bossAction(): void {
        if (this.isDied || !this.isShow || !this.dungeon) {
            return;
        }
        this.changeZIndex();
        if(!this.twoFlowerSkill.IsExcuting&&!this.stoneSkill.IsExcuting){
            this.attack();
        }
        if(!this.meleeSkill.IsExcuting&&!this.stoneSkill.IsExcuting){
            this.twoFlowers();
        }
        if(!this.meleeSkill.IsExcuting&&!this.twoFlowerSkill.IsExcuting){
            this.fireStone();
        }
        this.twineGrass();

    }
    attack() {
        this.meleeSkill.next(() => {
            this.meleeSkill.IsExcuting = true;
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            let attackName = 'DryadAttack01';
            if(Logic.getHalfChance()){
                this.anim.play('DryadAttack01');
            this.hand01.showCollider(2,1);
                
            }else{
                this.anim.play('DryadAttack02');
            this.hand02.showCollider(2,1);
            }
            this.scheduleOnce(()=>{this.anim.play('DryadIdle');this.meleeSkill.IsExcuting = false;},2);
        }, 2, true);
        

    }
    twineGrass(){
        this.twineGrassSkill.next(()=>{
            this.schedule(()=>{
                this.dungeon.addTwineGrass(Dungeon.getPosInMap(this.dungeon.player.pos.clone()), true);
            },1,2);
        },8,true);
    }
    twoFlowers(){
        this.twoFlowerSkill.next(()=>{
            this.twoFlowerSkill.IsExcuting = true;
            this.shooter02.setHv(cc.v2(0,-1));
            this.shooter03.setHv(cc.v2(0,-1));
            //动画总共4秒
            this.anim.play('DryadOpen');
            //动画总共3秒，2秒的时候开始发射
            this.flower01.getComponent(cc.Animation).play();
            this.flower02.getComponent(cc.Animation).play();
            this.scheduleOnce(()=>{
                this.shooter02.data.bulletLineInterval = 0.5;
                this.shooter03.data.bulletLineInterval = 0.5;
                this.fireShooter(this.shooter02, "bullet021", 99, 2);
                this.fireShooter(this.shooter03, "bullet021", 99, 2);
            },2);
            this.scheduleOnce(()=>{this.anim.play('DryadIdle');this.twoFlowerSkill.IsExcuting = false;},4);

        },6,true)
    }
    fireStone() {
        this.stoneSkill.next(() => {
            this.stoneSkill.IsExcuting = true;
            this.anim.play('DryadStone');
            this.scheduleOnce(()=>{
                let pos = this.node.position.clone().add(this.shooter01.node.position);
                let hv = this.dungeon.player.getCenterPosition().sub(pos);
                if (!hv.equals(cc.Vec2.ZERO)) {
                    hv = hv.normalizeSelf();
                    this.shooter01.setHv(hv);
                    this.fireShooter(this.shooter01, "bullet022", 0, 0);
                }
            },1.1);
            this.scheduleOnce(()=>{this.stoneSkill.IsExcuting = false;this.anim.play('DryadIdle');},2);
        }, 8,true);
    }
   
    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number,angle?:number): void {
        shooter.dungeon = this.dungeon;
        shooter.data.bulletType = bulletType;
        shooter.data.bulletArcExNum = bulletArcExNum;
        shooter.data.bulletLineExNum = bulletLineExNum;
        shooter.fireBullet(angle,cc.Vec2.ZERO);
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
        this.rigidbody.linearVelocity = cc.Vec2.ZERO;
    }
    
}
