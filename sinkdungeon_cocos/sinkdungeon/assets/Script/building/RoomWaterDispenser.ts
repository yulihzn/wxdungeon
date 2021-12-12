// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "../logic/Player";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoomWaterDispenser extends Building {
    @property(cc.Node)
    cup: cc.Node = null;
    hasWater = false;
    anim:cc.Animation;
    isAniming = false;

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
    }
    init(indexPos: cc.Vec3) {
        this.data.defaultPos = indexPos;
    }
    getWater(player:Player){
        if(this.isAniming){
            return;
        }
        if(this.hasWater){
            this.cup.opacity = 0;
            this.hasWater = false;
            player.drink();
        }else{
            this.isAniming = true;
            this.anim.play('RoomWaterDispenser');
        }
        
    }
    //动画结束
    AnimFinish(){
        this.hasWater = true;
        this.isAniming = false;
    }

    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 5) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt:number){
       
    }

}
