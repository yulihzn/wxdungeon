import { EventConstant } from "../EventConstant";
import Monster from "../Monster";
import Player from "../Player";
import Kraken from "../Boss/Kraken";

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
export default class Bullet extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    damage: number = 1;
    @property
    speed: number = 500;
    @property
    isMelee:boolean = false;

    anim:cc.Animation;
    dir = 0;
    tagetPos = cc.v2(0,0);
    rigidBody:cc.RigidBody;
    hv = cc.v2(0,0);
    isFromPlayer = false;
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
        this.rigidBody = this.getComponent(cc.RigidBody);
    }
    onEnable(){
        this.tagetPos = cc.v2(0,0);
        this.rigidBody.linearVelocity = cc.v2(0,0);
    }
    //animation
    MeleeFinish(){
        cc.director.emit('destorybullet',{bulletNode:this.node});
    }
    //animation
    showBullet(hv:cc.Vec2){
        this.hv = hv;
        if(this.isMelee){
            this.anim.play(this.node.name+'Show');
        }
        this.fire(this.hv);
    }
    fire(hv){
        if(!this.rigidBody){
            this.rigidBody = this.getComponent(cc.RigidBody);
        }
        this.rigidBody.linearVelocity = cc.v2(this.speed*hv.x,this.speed*hv.y);
    }

    start () {

    }
    onBeginContact(contact, selfCollider:cc.PhysicsCollider, otherCollider:cc.PhysicsCollider) {
        let isDestory = true;
        if(selfCollider.body.node.name==otherCollider.body.node.name){
            isDestory = false;
        }
        if(this.isFromPlayer && otherCollider.body.node.name == 'Player'){
            isDestory = false;
        }
        if(otherCollider.sensor){
            isDestory = false;
        }
        if(otherCollider.tag==2){
            isDestory = false;
        }
        if(isDestory){
            this.attacking(otherCollider);
            if(!this.isMelee){
                cc.director.emit('destorybullet',{bulletNode:this.node});
            }
        }
    }
    attacking(attackTarget:cc.PhysicsCollider) {
        if (!attackTarget) {
            return;
        }
        let damage = this.damage;
        
        let monster = attackTarget.body.node.getComponent(Monster);
        if (monster && !monster.isDied) {
            monster.takeDamage(damage);
        }
        let player = attackTarget.body.node.getComponent(Player);
        if (player && !player.isDied) {
            player.takeDamage(damage);
        }
        let kraken = attackTarget.body.node.getComponent(Kraken);
        if (kraken && !kraken.isDied) {
            kraken.takeDamage(damage, cc.v2(0, 0));
        }
    }
  
    update (dt) {
        
    }
    
}
