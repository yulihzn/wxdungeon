import Player from "../Player";
import Logic from "../Logic";
import { EventConstant } from "../EventConstant";
import Random from "../Utils/Random";
import AudioPlayer from "../Utils/AudioPlayer";

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
    static readonly FACE_VALUE = 10;
    anim:cc.Animation;
    rigidBody:cc.RigidBody;
    value:number = 0;
    valueRes=['gem01','gem02','gem03','gem04'];
    isReady = false;
    player:Player;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }
    onEnable(){
        this.anim = this.getComponent(cc.Animation);
        this.rigidBody = this.getComponent(cc.RigidBody);
        let speed = 800;
        let x = Random.rand()*(Logic.getHalfChance()?1:-1)*speed;
        let y = Random.rand()*(Logic.getHalfChance()?1:-1)*speed;
        this.rigidBody.linearVelocity = cc.v2(x,y);
        this.rigidBody.linearDamping = 30;
        this.isReady = false;
        this.scheduleOnce(()=>{this.isReady = true;},0.5);
    }
    changeValue(value:number){
        //目前只有1和10
        this.value = value;
        let index = 1;
        if(this.value == Coin.FACE_VALUE){
            index = 3;
            this.node.scale = 1.2;
        }else{
            index = 1;
            this.node.scale = 1;
        }
        this.node.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = Logic.spriteFrames[this.valueRes[index]];
    }

    start () {

    }
   
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistance(this.node.position, playerNode.position.clone().addSelf(cc.v2(0,32)));
        return dis;
    }
    update (dt) {
        if(this.isCheckTimeDelay(dt)){
            if (this.player&&this.getNearPlayerDistance(this.player.node)<400&&this.node.active && this.isReady) {
                let p = this.player.node.position.clone();
                p.y+=10;
                let pos = p.sub(this.node.position);
                if (!pos.equals(cc.Vec2.ZERO)) {
                    pos = pos.normalizeSelf();
                    pos = pos.mul(800);
                    this.rigidBody.linearVelocity = pos;
                    this.rigidBody.linearDamping = 1;
                }
            }
            
        }
        if (this.player&&this.getNearPlayerDistance(this.player.node)<64&&this.node.active && this.isReady) {
            this.isReady =false;
            cc.director.emit(EventConstant.PLAY_AUDIO,{detail:{name:AudioPlayer.COIN}});
            cc.director.emit(EventConstant.HUD_ADD_COIN,{detail:{count:this.value}});
            cc.director.emit('destorycoin',{detail:{coinNode:this.node}});
        }
    }
}
