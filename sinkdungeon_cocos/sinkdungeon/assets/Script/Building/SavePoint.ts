// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from "../Logic";
import Player from "../Player";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SavePoint extends Building {
    anim:cc.Animation;
    isOpen = false;
    
    onLoad(){
        this.anim = this.getComponent(cc.Animation);

    }
    // update (dt) {}

    open(){
        if(this.isOpen){
            return;
        }
        Logic.savePonit();
        this.isOpen = true;
        this.scheduleOnce(()=>{
            this.anim.play('SavePointActive');
            this.scheduleOnce(()=>{
                this.anim.play('SavePointIdleActive');
            },1)
        },1)
        
    }
}
