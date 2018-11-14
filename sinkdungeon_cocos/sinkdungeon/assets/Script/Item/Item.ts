import { EventConstant } from "../EventConstant";
import Player from "../Player";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";

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
    @property
    ammo:number = 0;
    anim:cc.Animation;
    isTaken = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.anim = this.getComponent(cc.Animation);
    }
    taken():void{
        if(!this.isTaken){
            this.anim.play('ItemTaken');
            this.isTaken = true;
            if(this.damage!=0){
                cc.director.emit(EventConstant.PLAYER_TAKEDAMAGE,{detail:{damage:new DamageData(this.damage)}});
            }
            if(this.ammo != 0){
                Logic.ammo+=this.ammo;
            }
            setTimeout(()=>{
                if(this.node){
                    this.node.active = false;
                }
            },3000);
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
