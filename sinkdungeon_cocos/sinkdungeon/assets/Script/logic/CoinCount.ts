import Logic from './Logic'
import { EventHelper } from './EventHelper'

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
export default class CoinCount extends cc.Component {
    anim: cc.Animation
    @property(cc.Label)
    label: cc.Label = null
    @property
    isReal = false
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation)
        EventHelper.on(EventHelper.HUD_ADD_COIN, detail => {
            this.addCount(detail.count, detail.isReal)
        })
    }

    start() {}
    addCount(value: string, isReal: boolean) {
        if (!this.anim) {
            return
        }
        let c = parseInt(value)
        if (isReal && this.isReal) {
            Logic.data.realCoins += c
        } else if (!isReal && !this.isReal) {
            Logic.data.coins += c
            if (c > 0) {
                Logic.data.coinCounts += c
                if (Logic.data.coinCounts >= 1) {
                    Logic.data.coinCounts = 0
                    EventHelper.emit(EventHelper.PLAYER_USEDREAM, { value: -1 })
                }
            }
        }
    }

    update(dt) {
        if (this.label) {
            this.label.string = `${this.isReal ? Logic.data.realCoins : Logic.data.coins}`
        }
    }
}
