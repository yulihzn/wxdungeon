// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ShadowOfSight from "../effect/ShadowOfSight";
import Logic from "../Logic";
import AudioPlayer from "../utils/AudioPlayer";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoomTv extends Building {
    @property(cc.Sprite)
    screen: cc.Sprite = null;
    anim: cc.Animation;
    isOpen = false;

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.lights = this.getComponentsInChildren(ShadowOfSight);
    }
    start() {
        for (let light of this.lights) {
            light.updateRender(false);
        }
    }
    // update (dt) {}

    private open() {
        this.isOpen = true;
        if (this.lights) {
            for (let light of this.lights) {
                light.updateRender(true);
            }
        }

        this.unscheduleAllCallbacks();
        this.anim.stop();
        this.anim.play('RoomTvOpen');
        this.scheduleOnce(() => {
            if (Logic.getHalfChance()) {
                this.anim.play('RoomTvNoSignalIdle');
                AudioPlayer.play(AudioPlayer.TVWHITE,false,true);
            } else {
                this.anim.play('RoomTvOpenIdle');
                AudioPlayer.play(AudioPlayer.TVCOLOR,false,true);
            }
        }, 0.5)
    }
    private close() {
        this.isOpen = false;
        if (this.lights) {
            for (let light of this.lights) {
                light.updateRender(false);
            }
        }
        this.unscheduleAllCallbacks();
        this.anim.stop();
        this.anim.play('RoomTvClose');
        AudioPlayer.stopAllEffect();
        this.scheduleOnce(() => {
            this.anim.play('RoomTvClosedIdle');
        }, 0.5)
    }
    public interact(){
        if(this.isOpen){
            this.close();
        }else{
            this.open();
        }
    }
}
