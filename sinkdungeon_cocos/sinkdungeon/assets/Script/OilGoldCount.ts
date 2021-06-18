import Logic from "./Logic";
import { EventHelper } from "./EventHelper";
import AudioPlayer from "./Utils/AudioPlayer";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class OilGoldCount extends cc.Component {
    
    
    anim: cc.Animation;
    @property(cc.Label)
    fragmentLabel: cc.Label = null;
    @property(cc.Label)
    gemLabel: cc.Label = null;
    gemCountLerp = 0;
    fragmentCountLerp = 0;
    @property(cc.ProgressBar)
    progreesBar:cc.ProgressBar = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        cc.director.on(EventHelper.HUD_ADD_OILGOLD, (event) => {
            this.addCount(event.detail.count);
        })
        cc.director.on(EventHelper.HUD_LOSE_OILGOLD, (event) => {
            if(this.node){
                let count = Logic.fragmentCount;
                this.addCount(`${-count}`);
                Logic.saveGroundOilGold(count);
            }
        })
    }

    start() {
    }
    addCount(value: string) {
        if (!this.anim) {
            return;
        }
        Logic.oilGolds += parseInt(value);
        let gemIndex = Logic.gemIndex;
        Logic.updateCount();
        if(gemIndex<Logic.gemIndex){
            AudioPlayer.play(AudioPlayer.LEVELUP);
        }
    }
    

    update(dt) {
        this.gemCountLerp = Logic.lerp(this.gemCountLerp, Logic.gemCount,dt * 5);
        this.fragmentCountLerp = Logic.lerp(this.fragmentCountLerp, Logic.fragmentCount,dt * 5);
        if (this.gemLabel) {
            this.gemLabel.string = `${this.gemCountLerp.toFixed(0)}`;
        }
        if (this.fragmentLabel) {
            this.fragmentLabel.string = `${this.fragmentCountLerp.toFixed(0)}/${Logic.OIL_GOLD_LIST[Logic.gemIndex]}`;
        }
        if(this.progreesBar){
            this.progreesBar.progress = Logic.lerp(this.progreesBar.progress, Logic.fragmentCount/Logic.OIL_GOLD_LIST[Logic.gemIndex], dt * 5);
        }

    }
}
