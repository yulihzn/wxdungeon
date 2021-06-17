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
    
    OIL_GOLD_LIST = [
        100, 150, 200, 300, 500,
        1000, 1500, 2000, 3000, 5000,
        10000, 15000, 20000, 30000, 50000,
        100000, 150000, 200000, 300000, 500000,
        1000000, 1500000, 2000000, 3000000, 5000000]
    anim: cc.Animation;
    @property(cc.Label)
    fragmentLabel: cc.Label = null;
    @property(cc.Label)
    gemLabel: cc.Label = null;
    gemCountLerp = 0;
    gemCount = 0;
    fragmentCountLerp = 0;
    fragmentCount = 0;
    gemIndex = 0;
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
                let count = this.fragmentCount;
                this.addCount(`${-count}`);
                Logic.saveGroundOilGold(count);
            }
        })
        this.updateCount();
    }

    start() {
    }
    addCount(value: string) {
        if (!this.anim) {
            return;
        }
        Logic.oilGolds += parseInt(value);
        let gemIndex = this.gemIndex;
        this.updateCount();
        if(gemIndex<this.gemIndex){
            AudioPlayer.play(AudioPlayer.LEVELUP);
        }
    }
    updateCount() {
        let value = Logic.oilGolds;
        this.gemCount = 0;
        this.gemIndex = 0;
        for (let i = 0; i < this.OIL_GOLD_LIST.length; i++) {
            let offset = value - this.OIL_GOLD_LIST[i];
            if (offset >= 0) {
                value = offset;
                this.gemCount++;
            } else {
                this.gemIndex = i;
                break;
            }
        }
        this.fragmentCount = value;
    }

    update(dt) {
        this.gemCountLerp = Logic.lerp(this.gemCountLerp, this.gemCount,dt * 5);
        this.fragmentCountLerp = Logic.lerp(this.fragmentCountLerp, this.fragmentCount,dt * 5);
        if (this.gemLabel) {
            this.gemLabel.string = `${this.gemCountLerp.toFixed(0)}`;
        }
        if (this.fragmentLabel) {
            this.fragmentLabel.string = `${this.fragmentCountLerp.toFixed(0)}/${this.OIL_GOLD_LIST[this.gemIndex]}`;
        }
        if(this.progreesBar){
            this.progreesBar.progress = Logic.lerp(this.progreesBar.progress, this.fragmentCount/this.OIL_GOLD_LIST[this.gemIndex], dt * 5);
        }

    }
}
