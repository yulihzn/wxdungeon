import CaptainSword from "./CaptainSword";
import HealthBar from "../HealthBar";
import MonsterData from "../Data/MonsterData";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Player from "../Player";
import { EventHelper } from "../EventHelper";
import Shooter from "../Shooter";
import EquipmentManager from "../Manager/EquipmentManager";
import DamageData from "../Data/DamageData";
import StatusManager from "../Manager/StatusManager";
import Boss from "./Boss";
import Skill from "../Utils/Skill";
import AudioPlayer from "../Utils/AudioPlayer";
import FromData from "../Data/FromData";
import Achievements from "../Achievement";
import { ColliderTag } from "../Actor/ColliderTag";

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
export default class Captain extends Boss {
    
    @property(CaptainSword)
    sword: CaptainSword = null;
    
    healthBar: HealthBar = null;
    private anim: cc.Animation;
    rigidbody: cc.RigidBody;
    isFaceRight = true;
    isMoving = false;
    private timeDelay = 0;
    isFall = false;
    shooter: Shooter = null;
    exshooter:Shooter = null;
    attackSkill = new Skill();
    fireSkill = new Skill();
    jumpSkill = new Skill();
    onLoad () {
        this.attackSkill.IsExcuting = false;
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.exshooter = this.node.getChildByName('ExShooter').getComponent(Shooter);
        this.shooter.from.valueCopy(FromData.getClone(this.actorName(),'captain_head'));
        this.exshooter.from.valueCopy(FromData.getClone(this.actorName(),'captain_head'));
        this.updatePlayerPos();
    }

    start () {
        super.start();
    }
    //Animation
    AttackDamageStart(){
        this.sword.isShow = true;
    }
    //Animation
    AttackDamageFinish(){
        this.sword.isShow = false;
    }
    //Animation
    AttackStart(){
        this.attackSkill.IsExcuting = true;
        cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.MELEE}});
    }
    //Animation
    AttackFinish(){
        this.attackSkill.IsExcuting = false;
    }
    //Animation
    JumpStart(){
        this.jumpSkill.IsExcuting = true;
        this.getComponent(cc.PhysicsBoxCollider).sensor = true;
        this.getComponent(cc.PhysicsBoxCollider).apply();
    }
    //Animation
    JumpFinish(){
        this.jumpSkill.IsExcuting = false;
        this.isFall = true;
        this.scheduleOnce(()=>{this.isFall = false;},0.1);
        this.getComponent(cc.PhysicsBoxCollider).sensor = false;
        this.getComponent(cc.PhysicsBoxCollider).apply();
        if(!this.dungeon || !this.exshooter){
            return;
        }
        let hv = this.dungeon.player.getCenterPosition().sub(this.node.position);
        if (!hv.equals(cc.Vec3.ZERO)) {
            hv = hv.normalizeSelf();
            this.exshooter.setHv(hv);
            this.exshooter.dungeon = this.dungeon;
            this.exshooter.data.bulletType = "bullet033";
            this.exshooter.data.bulletArcExNum = 99;
            this.exshooter.data.bulletLineInterval = 1;
            if(this.data.currentHealth<this.data.Common.maxHealth/2){
                this.exshooter.data.bulletLineExNum = 1;
            }
            this.exshooter.fireBullet(0,cc.v3(0,0));

        }
    }
    fireWithAngles(angles:number[]){
        if(!this.dungeon || !this.shooter){
            return;
        }
        let hv = this.dungeon.player.getCenterPosition().sub(this.node.position);
        if (!hv.equals(cc.Vec3.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter.setHv(hv);
            this.shooter.dungeon = this.dungeon;
            this.shooter.data.bulletType = "bullet002";
            for(let angle of angles){
                this.shooter.fireBullet(angle);
            }
        }
    }
    //Animation
    OpenFire(){
        if(!this.dungeon || !this.shooter){
            return;
        }
        let angles1 = [0,10,15,-30,-40,-10,-15,30,40];
        let angles2 = [5,10,-10];
        let angles3 = [-5,10,20,-10,-20,-30,-40,30,40];
        this.shooter.data.bulletArcExNum = 0;
        this.fireWithAngles(angles1);
        if(this.data.currentHealth<this.data.Common.maxHealth/2){
            this.scheduleOnce(()=>{this.fireWithAngles(angles2);},0.3);
            this.scheduleOnce(()=>{this.fireWithAngles(angles3);},0.5);
            
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let player = other.getComponent(Player);
        if (player && self.tag == ColliderTag.BOSS_ASS) {
            if (this.isFall&&!this.isDied) {
                this.isFall = false;
                let dd = new DamageData();
                dd.physicalDamage = 2;
                player.takeDamage(dd,FromData.getClone(this.actorName(),'captain_head'),this);
            }
        }
    }
    
    update (dt) {
        this.healthBar.node.active = !this.isDied;
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            this.bossAction();
            this.JumpMove();
        }
        if (this.dungeon) {
            let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
            if (playerDis < 64) {
                this.rigidbody.linearVelocity = cc.Vec2.ZERO;
            }
        }
        if (this.isDied) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        }
        this.healthBar.node.active = !this.isDied;
        if (this.data.currentHealth < 1) {
            this.killed();
        }
        this.node.scaleX = this.isFaceRight ? 1 : -1;
    }
    takeDamage(damage: DamageData):boolean {
        let isPlayJump = this.anim.getAnimationState("CaptainJump").isPlaying;
        if(this.isDied||isPlayJump){
            return false;
        }
        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage();
        if (this.data.currentHealth > this.data.Common.maxHealth) {
            this.data.currentHealth = this.data.Common.maxHealth;
        }
        
        // this.anim.playAdditive('CaptainHit');
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
        cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.MONSTER_HIT}});
        return true;
    }
    
    killed() {
        if (this.isDied) {
            return;
        }
        Achievements.addMonsterKillAchievement(this.data.resName);
        this.isDied = true;
        this.anim.play('CaptainDie');
        let collider: cc.PhysicsCollider = this.getComponent('cc.PhysicsCollider');
        collider.sensor = true;
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 5);
        this.getLoot();

    }
    bossAction() {
        if (this.isDied || !this.dungeon) {
            return;
        }
        this.node.position = Dungeon.fixOuterMap(this.node.position);
        this.pos = Dungeon.getIndexInMap(this.node.position);
        this.changeZIndex();
        let newPos = this.dungeon.player.pos.clone();
        let pos = Dungeon.getPosInMap(newPos).sub(this.node.position);
        let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
        let isPlayJump = this.anim.getAnimationState("CaptainJump").isPlaying;
        let isPlayFire = this.anim.getAnimationState("CaptainFire").isPlaying;
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);
        this.isFaceRight = h > 0;
        if(isPlayJump||isPlayFire){
            return;
        }
        let speed = 200;
        if(!isPlayJump){
            this.fireSkill.next(()=>{
                speed = 50;
                this.anim.play("CaptainFire");
            },5)
        }
        if (playerDis < 140 && !this.dungeon.player.isDied) {
            this.attackSkill.next(()=>{
                this.attackSkill.IsExcuting = true;
                this.anim.play("CaptainAttack");
            },1);
        }else{
            if(playerDis > 300){
                this.jumpSkill.next(()=>{
                    this.anim.play("CaptainJump");
                    isPlayJump = true;
                },5);
                
            }
          
            if (!pos.equals(cc.Vec3.ZERO)&&!isPlayJump && !this.attackSkill.IsExcuting) {
                pos = pos.normalizeSelf();
                this.move(pos, speed);
            }
        }
        
        
    }
    
    JumpMove(){
        if(!this.dungeon || !this.jumpSkill.IsExcuting){
            return;
        }
        let newPos = this.dungeon.player.pos.clone();
        let pos = Dungeon.getPosInMap(newPos).sub(this.node.position);
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.node.position);
            pos = pos.normalizeSelf();
            
        }
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let movement = cc.v2(h, v);
        let speed = 200;
        if(this.data.currentHealth<this.data.Common.maxHealth/2){
            speed = 240;
        }
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;
    }
    move(pos: cc.Vec3, speed: number) {
        if (this.isDied) {
            return;
        }
        if (this.attackSkill.IsExcuting && !pos.equals(cc.Vec3.ZERO)) {
            pos = pos.mul(0.5);
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
            this.isFaceRight = h > 0;
        }
        if (this.isMoving) {
            if (!this.anim.getAnimationState('CaptainMove').isPlaying) {
                this.anim.playAdditive('CaptainMove');
            }
        } else {
            if (this.anim.getAnimationState('CaptainMove').isPlaying) {
                this.anim.play('CaptainIdle');
            }
        }
        this.changeZIndex();
    }
    actorName(){
        return '邪恶船长';
    }
}
