// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from '../logic/Logic'

const { ccclass, property } = cc._decorator

@ccclass
export default class BrightnessBar extends cc.Component {
    @property(cc.Slider)
    slider: cc.Slider = null
    private selectorCallback: Function
    colorType: number
    static readonly SKIN = 0
    static readonly SKIN_COLORS = ['#ffe8d2', '#ffe1c5', '#ebcaac', '#e0c1a4', '#ccad8f', '#ad9075', '#997E5B', '#664e38', '#473524', '#291404', '#1f1711']
    onLoad() {}
    init() {}
    setSelectorCallback(callback: Function) {
        this.selectorCallback = callback
        this.updateAttribute()
    }
    selectRandom() {
        this.slider.progress = Logic.getRandomNum(0, 10) / 10
        this.updateAttribute()
    }
    updateAttribute() {
        if (this.selectorCallback) {
            let colors = BrightnessBar.SKIN_COLORS
            let num = Math.floor(this.slider.progress * 10)
            this.selectorCallback(cc.Color.WHITE.fromHEX(colors[num]))
        }
    }
}
