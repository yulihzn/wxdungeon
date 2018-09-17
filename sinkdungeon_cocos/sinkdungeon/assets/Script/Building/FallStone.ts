import Player from "../Player";
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class FallStone extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    isFall = false;//是否已经下落
    anim: cc.Animation;
    isAuto = true;//是否自动下落
    isFalling = false;//是否下落中

    onLoad() {
        this.isFall = false;
    }
    fall() {
        this.anim = this.getComponent(cc.Animation);
        this.anim.play();
        this.isFalling = true;
    }
    //anim
    FallFinish() {
        this.isFall = true;
        setTimeout(() => { this.isFall = false; }, 100);
        setTimeout(() => {
            if(this.node){
                this.node.destroy();
            }
            }, 2000);
        
    }
    start() {

    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.getComponent(Player);
        if(player && !this.isAuto && !this.isFalling){
            this.fall();
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let player = other.getComponent(Player);
        if (player) {
            if (this.isFall&&this.isValid) {
                this.isFall = false;
                cc.director.emit(EventConstant.PLAYER_TAKEDAMAGE, { detail: { damage: 2 } });
            }
            
        }
    }
    // update (dt) {}
}
