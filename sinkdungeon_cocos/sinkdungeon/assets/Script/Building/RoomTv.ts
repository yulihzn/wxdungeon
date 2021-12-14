// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ShadowOfSight from "../effect/ShadowOfSight";
import Logic from "../logic/Logic";
import AudioPlayer from "../utils/AudioPlayer";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoomTv extends Building {
    @property(cc.Sprite)
    screen: cc.Sprite = null;
    anim: cc.Animation;
    isOpen = false;
    channel = 0;

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

    open() {
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
            this.channel = Logic.getRandomNum(0, 5);
            this.switchChannel();
        }, 0.5)
    }
    private switchChannel() {
        this.unscheduleAllCallbacks();
        this.anim.stop();
        this.channel++;
        if (this.channel > 5) {
            this.channel = 0;
        }
        switch (this.channel) {
            case 0:
                this.anim.play('RoomTvOpenIdle');
                AudioPlayer.play(AudioPlayer.TVCOLOR, false, true);
                break;
            case 1:
                this.anim.play('RoomTvNoSignalIdle');
                AudioPlayer.play(AudioPlayer.TVWHITE, false, true);
                break;
            case 2:
                this.screen.spriteFrame = Logic.spriteFrameRes(`roomtvscreen4`);
                break;
            case 3:
                this.screen.spriteFrame = Logic.spriteFrameRes(`roomtvscreen5`);
                break;
            case 4:
                this.screen.spriteFrame = Logic.spriteFrameRes(`roomtvscreen6`);
                break;
            case 5:
                this.screen.spriteFrame = Logic.spriteFrameRes(`roomtvscreen7`);
                break;
            default:
                break;
        }
    }
    close() {
        if(!this.isOpen){
            return;
        }
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
    public interact() {
        if (this.isOpen) {
            this.switchChannel();
        } else {
            this.open();
        }
    }
}
