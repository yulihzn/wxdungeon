import CaptainSword from "./CaptainSword";
import HealthBar from "../HealthBar";
import MonsterData from "../Data/MonsterData";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Player from "../Player";
import { EventConstant } from "../EventConstant";
import Shooter from "../Shooter";
import EquipmentManager from "../Manager/EquipmentManager";

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
export default class Captain extends cc.Component {


    @property(CaptainSword)
    sword: CaptainSword = null;
    healthBar: HealthBar = null;
    // LIFE-CYCLE CALLBACKS:
    data: MonsterData = new MonsterData();
    isDied = false;
    isShow = false;
    pos: cc.Vec2 = cc.v2(0, 0);
    isJumping = false;
    private anim: cc.Animation;
    rigidbody: cc.RigidBody;
    isFaceRight = true;
    isMoving = false;
    isAttacking = false;
    private timeDelay = 0;
    dungeon: Dungeon;
    isHurt = false;
    isFall = false;
    shooter: Shooter = null;
    onLoad () {
        this.isAttacking = false;
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.updatePlayerPos();
    }

    start () {
        this.changeZIndex();
        
        setTimeout(()=>{
            if(this.healthBar){
                this.healthBar.refreshHealth(this.data.currentHealth, this.data.maxHealth);
            }
        },100);
        
    }
    //Animation
    AttackStart(){
        this.sword.isShow = true;
    }
    //Animation
    AttackFinish(){
        this.sword.isShow = false;
    }
    //Animation
    JumpStart(){
        this.isJumping = true;
        this.getComponent(cc.PhysicsBoxCollider).sensor = true;
        this.getComponent(cc.PhysicsBoxCollider).apply();
    }
    //Animation
    JumpFinish(){
        this.isJumping = false;
        this.isFall = true;
        setTimeout(()=>{this.isFall = false;},100);
        this.getComponent(cc.PhysicsBoxCollider).sensor = false;
        this.getComponent(cc.PhysicsBoxCollider).apply();
    }
    //Animation
    OpenFire(){
        if(!this.dungeon || !this.shooter){
            return;
        }
        let angles1 = [0,15,-15,-30,30];
        let angles2 = [5,10,-10,-20,20];
        let angles3 = [-5,20,-20,-40,40];
        let hv = this.dungeon.player.node.position.sub(this.node.position);
        if (!hv.equals(cc.Vec2.ZERO)) {
            hv = hv.normalizeSelf();
            this.shooter.setHv(hv);
            this.shooter.dungeon = this.dungeon;
            for(let angle of angles1){
                this.shooter.fireBullet(angle);
            }
            if(this.data.currentHealth<this.data.maxHealth/2){
                setTimeout(()=>{
                    for(let angle of angles2){
                        this.shooter.fireBullet(angle);
                    }
                },100);
                setTimeout(()=>{
                    for(let angle of angles3){
                        this.shooter.fireBullet(angle);
                    }
                },200);
                
            }
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let player = other.getComponent(Player);
        if (player && self.tag == 1) {
            if (this.isFall) {
                this.isFall = false;
                cc.director.emit(EventConstant.PLAYER_TAKEDAMAGE, { detail: { damage: 2 } });
            }
        }
    }
    transportPlayer(x: number, y: number) {
        this.pos.x = x;
        this.pos.y = y;
        this.changeZIndex();
        this.updatePlayerPos();
    }
    changeZIndex() {
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - this.pos.y - 1) * 100 + 2;
    }
    updatePlayerPos() {
        this.node.x = this.pos.x * 64 + 32;
        this.node.y = this.pos.y * 64 + 32;
    }
    update (dt) {
        this.healthBar.node.active = !this.isDied;
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            this.JumpMove();
        }
        if (this.dungeon) {
            let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
            if (playerDis < 64 && !this.isHurt) {
                this.rigidbody.linearVelocity = cc.v2(0, 0);
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
    takeDamage(damage: number) {
        let isPlayJump = this.anim.getAnimationState("CaptainJump").isPlaying;
        if(this.isDied||isPlayJump){
            return;
        }
        this.data.currentHealth -= damage;
        if (this.data.currentHealth > this.data.maxHealth) {
            this.data.currentHealth = this.data.maxHealth;
        }
        let isPlayAttack = this.anim.getAnimationState("CaptainAttack").isPlaying;
        if(!isPlayAttack){
            this.anim.play('CaptainHit');
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.maxHealth);
        if(this.dungeon){
            let pos = this.dungeon.player.pos;
            if (pos.x > this.pos.x) {
                this.anim.playAdditive('KrakenSwingRight');
            } else if (pos.x < this.pos.x) {
                this.anim.playAdditive('KrakenSwingLeft');
            }
        }
    }
    killed() {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        this.anim.play('CaptainDie');
        let collider: cc.PhysicsCollider = this.getComponent('cc.PhysicsCollider');
        collider.sensor = true;
        setTimeout(() => { if (this.node) { this.node.active = false; } }, 5000);
        if(this.dungeon){
            cc.director.emit(EventConstant.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: 19 } });
            cc.director.emit(EventConstant.DUNGEON_ADD_HEART, { detail: { pos: this.node.position } });
            cc.director.emit(EventConstant.DUNGEON_ADD_AMMO, { detail: { pos: this.node.position } });
            this.dungeon.addEquipment(EquipmentManager.equipments[Logic.getRandomNum(0,EquipmentManager.equipments.length-1)], this.pos,null,3);
        }

    }
    bossAction(dungeon: Dungeon) {
        if (this.isDied) {
            return;
        }
        this.node.position = Dungeon.fixOuterMap(this.node.position);
        this.dungeon = dungeon;
        this.pos = Dungeon.getIndexInMap(this.node.position);
        this.changeZIndex();
        let newPos = dungeon.player.pos.clone();
        let pos = Dungeon.getPosInMap(newPos).sub(this.node.position);
        let playerDis = this.getNearPlayerDistance(dungeon.player.node);
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
        if (playerDis < 140 && !dungeon.player.isDied) {
            if(!this.anim.getAnimationState("CaptainAttack").isPlaying ){
                this.anim.play("CaptainAttack");
            }
        }else{
            let speed = 400;
            if(playerDis > 300){
                if(Logic.getHalfChance()){
                    this.anim.play("CaptainJump");
                    isPlayJump = true;
                }else{
                    speed = 50;
                    this.anim.play("CaptainFire");
                }
            }
            // if(playerDis>200){
            //     speed = 50;
            //     this.anim.play("CaptainFire");
            // }
            if (!pos.equals(cc.Vec2.ZERO)&&!isPlayJump) {
                pos = pos.normalizeSelf();
                this.move(pos, speed);
            }
        }
        
        
    }
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistance(this.node.position, playerNode.position);
        return dis;
    }
    JumpMove(){
        if(!this.dungeon || !this.isJumping){
            return;
        }
        let newPos = this.dungeon.player.pos.clone();
        let pos = Dungeon.getPosInMap(newPos).sub(this.node.position);
        if (!pos.equals(cc.Vec2.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.node.position);
            pos = pos.normalizeSelf();
            
        }
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let movement = cc.v2(h, v);
        let speed = 200;
        if(this.data.currentHealth<this.data.maxHealth/2){
            speed = 240;
        }
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;
    }
    move(pos: cc.Vec2, speed: number) {
        if (this.isDied || this.isHurt) {
            this.isHurt = false;
            return;
        }
        if (this.isAttacking && !pos.equals(cc.Vec2.ZERO)) {
            pos = pos.mul(0.5);
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
}
