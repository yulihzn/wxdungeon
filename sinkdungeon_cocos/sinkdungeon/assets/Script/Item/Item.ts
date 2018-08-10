import { EventConstant } from "../EventConstant";
import Player from "../Player";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//物品
const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    @property
    damage: number = -1;
    anim:cc.Animation;
    isTaken = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.anim = this.getComponent(cc.Animation);
    }
    taken():void{
        if(this.damage!=0 && !this.isTaken){
            this.anim.play('ItemTaken');
            this.isTaken = true;
            cc.director.emit(EventConstant.PLAYER_TAKEDAMAGE,{detail:{damage:this.damage}});
            setTimeout(()=>{this.node.active = false;},3000);
        }
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        let player = other.node.getComponent(Player);
        if(player){
            this.taken();
        }
    }
    // update (dt) {}
}
