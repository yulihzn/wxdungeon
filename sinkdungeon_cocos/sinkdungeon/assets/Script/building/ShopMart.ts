// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "../Player";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopMart extends Building {
    anim:cc.Animation;
    isOpen = false;
    
    onLoad(){
        this.anim = this.getComponent(cc.Animation);
    }
    // update (dt) {}

    open(){
        // this.isOpen = true;
        
        // this.anim.play('RoomTvOpen');
        // this.scheduleOnce(()=>{
        //     this.anim.play(Logic.getHalfChance()?'RoomTvOpenIdle':'RoomTvNoSignalIdle');
        // },0.5)
    }
    close(){
        // this.isOpen = false;
        // if(this.lights){
        //     for(let light of this.lights){
        //         light.showLight = false;
        //     }
        // }
        // this.anim.play('RoomTvClose');
        // this.scheduleOnce(()=>{
        //     this.anim.play('RoomTvClosedIdle');
        // },0.5)
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
     
        let player = other.node.getComponent(Player);
        if (player) {
            this.open();
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
 
        let player = other.node.getComponent(Player);
        if (player) {
            this.close();
        }
    }
}
