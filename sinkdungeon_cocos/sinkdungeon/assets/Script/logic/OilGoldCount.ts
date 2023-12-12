import Logic from './Logic'
import { EventHelper } from './EventHelper'
import AudioPlayer from '../utils/AudioPlayer'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class OilGoldCount extends cc.Component {
    anim: cc.Animation
    @property(cc.Label)
    fragmentLabel: cc.Label = null
    @property(cc.Label)
    gemLabel: cc.Label = null
    gemCountLerp = 0
    fragmentCountLerp = 0
    @property(cc.ProgressBar)
    progreesBar: cc.ProgressBar = null
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation)
        EventHelper.on(EventHelper.HUD_ADD_OILGOLD, detail => {
            this.addCount(detail.count)
        })
        EventHelper.on(EventHelper.HUD_LOSE_OILGOLD, detail => {
            if (this.node) {
                let count = Logic.playerData.OilGoldData.fragments
                this.addCount(`${-count}`)
                Logic.saveGroundOilGold(count)
            }
        })
    }

    start() {}
    addCount(value: string) {
        if (!this.anim) {
            return
        }
        Logic.data.oilGolds += parseInt(value)
        let gemIndex = Logic.playerData.OilGoldData.index
        Logic.playerData.OilGoldData.valueCopy(Logic.getOilGoldData(Logic.data.oilGolds))
        if (gemIndex < Logic.playerData.OilGoldData.index) {
            AudioPlayer.play(AudioPlayer.LEVELUP)
        }
        EventHelper.emit(EventHelper.PLAYER_UPDATE_OILGOLD_DATA)
    }

    update(dt) {
        this.gemCountLerp = Logic.lerp(this.gemCountLerp, Logic.playerData.OilGoldData.level, dt * 5)
        this.fragmentCountLerp = Logic.lerp(this.fragmentCountLerp, Logic.playerData.OilGoldData.fragments, dt * 5)
        if (this.gemLabel) {
            this.gemLabel.string = `${this.gemCountLerp.toFixed(0)}`
        }
        if (this.fragmentLabel) {
            this.fragmentLabel.string = `${this.fragmentCountLerp.toFixed(0)}/${Logic.OIL_GOLD_LIST[Logic.playerData.OilGoldData.index]}`
        }
        if (this.progreesBar) {
            this.progreesBar.progress = Logic.lerp(
                this.progreesBar.progress,
                Logic.playerData.OilGoldData.fragments / Logic.OIL_GOLD_LIST[Logic.playerData.OilGoldData.index],
                dt * 5
            )
        }
    }
}
