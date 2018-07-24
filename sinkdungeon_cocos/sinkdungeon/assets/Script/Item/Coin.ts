import Player from "../Player";
import Logic from "../Logic";
import { EventConstant } from "../EventConstant";

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
export default class Coin extends cc.Component {

    anim:cc.Animation;
    rigidBody:cc.RigidBody;
    value:number = 0;
    valueRes=['gem01','gem02','gem03','gem04'];
    isReady = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }
    onEnable(){
        this.anim = this.getComponent(cc.Animation);
        this.rigidBody = this.getComponent(cc.RigidBody);
        let speed = 500;
        let x = Math.random()*(Logic.getHalfChance()?1:-1)*speed;
        let y = Math.random()*(Logic.getHalfChance()?1:-1)*speed;
        this.rigidBody.linearVelocity = cc.v2(x,y);
        this.isReady = false;
        setTimeout(()=>{this.isReady = true;},1000);
    }
    changeValue(value:number){
        //目前只有1和10
        this.value = value;
        let index = 1;
        if(this.value == 10){
            index = 3;
        }else{
            index = 1;
        }
        this.node.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = Logic.spriteFrames[this.valueRes[index]];
    }

    start () {

    }
    onCollisionStay(other:cc.Collider,self:cc.Collider){
        let player = other.node.getComponent(Player);
        if (player&&this.node.active && this.isReady) {
            let p = player.node.position.clone();
            p.y+=10;
            let pos = p.sub(this.node.position);
            if (!pos.equals(cc.Vec2.ZERO)) {
                pos = pos.normalizeSelf();
                pos = pos.mul(200);
                this.rigidBody.linearVelocity = pos;
            }
        }
        if (self.tag == 1&&player&&this.node.active && this.isReady) {
            if(player&&this.node.active && this.isReady){
                this.isReady =false;
                cc.director.emit('destorycoin',{coinNode:this.node});
                cc.director.emit(EventConstant.HUD_ADD_COIN,{count:this.value});
            }
        }
        
    }
    update (dt) {
    }
}
