// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ExitData from "../Data/ExitData";
import ShadowOfSight from "../Effect/ShadowOfSight";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import Tips from "../UI/Tips";
import AudioPlayer from "../Utils/AudioPlayer";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SavePoint extends Building {
    anim: cc.Animation;
    isOpen = false;
    tips: Tips;
    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.lights = this.getComponentsInChildren(ShadowOfSight);
        this.tips = this.getComponentInChildren(Tips);
        this.tips.tipsType = Tips.SAVE_POINT;
        EventHelper.on(EventHelper.PLAYER_TAPTIPS
            , (detail) => {
                if (this.node && detail.tipsType == Tips.SAVE_POINT) {
                    if (this.isOpen && this.tips.node.active) {
                        if(detail.player){
                            Logic.playerData = detail.player.data.clone();
                        }
                        Logic.savePonit(this.data.defaultPos);
                        Logic.resetData();
                        EventHelper.emit(EventHelper.HUD_CAMERA_ZOOM_IN, {});
                        AudioPlayer.play(AudioPlayer.EXIT);
                        Logic.loadingNextLevel(ExitData.getRealWorldExitDataFromDream(Logic.chapterIndex, Logic.level));
                    }
                }
            });

    }
    start() {
        for (let light of this.lights) {
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
    update(dt) {
        if (this.lights.length > 0) {
            if (this.lights[0].showShadow && this.isCheckTimeDelay(dt)) {
                this.lights[0].rayRadius = Logic.lerp(this.lights[0].rayRadius, 300, dt * 5);
            }
        }

    }

    open() {
        if (this.isOpen) {
            return;
        }
        Logic.savePonit(this.data.defaultPos);
        this.isOpen = true;
        this.scheduleOnce(() => {
            this.anim.play('SavePointActive');
            this.scheduleOnce(() => {
                for (let light of this.lights) {
                    light.rayRadius = 0;
                    light.updateRender(true);
                }
                this.anim.play('SavePointIdleActive');
                this.tips.node.active = true;
            }, 1)
        }, 1)

    }
}
