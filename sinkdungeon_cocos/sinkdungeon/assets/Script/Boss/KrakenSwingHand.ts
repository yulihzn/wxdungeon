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
export default class KrakenSwingHand extends cc.Component {
    @property
    damage = 2;
    // LIFE-CYCLE CALLBACKS:
    

    // onLoad () {}

    start () {

    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        if(other.tag == 3){
            if(this.node.active){
                this.node.stopAllActions();
                cc.director.emit(EventConstant.PLAYER_TAKEDAMAGE,{damage:this.damage});
            }
        }
    }
    // update (dt) {}
}
