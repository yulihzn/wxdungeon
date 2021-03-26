// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ShadowOfSight from "../Effect/ShadowOfSight";
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
        this.lights = this.getComponentsInChildren(ShadowOfSight);

    }
    start(){
        for(let light of this.lights){
            light.updateRender(false);
        }
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.05) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update (dt) {
        if(this.lights.length>0){
            if(this.lights[0].showShadow&&this.isCheckTimeDelay(dt)){
                this.lights[0].rayRadius = Logic.lerp(this.lights[0].rayRadius,300,dt*5);
            }
        }
        
    }

    open(){
        if(this.isOpen){
            return;
        }
        Logic.savePonit();
        this.isOpen = true;
        this.scheduleOnce(()=>{
            this.anim.play('SavePointActive');
            this.scheduleOnce(()=>{
                for(let light of this.lights){
                    light.rayRadius = 0;
                    light.updateRender(true);
                }
                this.anim.play('SavePointIdleActive');
            },1)
        },1)
        
    }
}
