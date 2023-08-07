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
import Utils from '../utils/Utils'

const { ccclass, property } = cc._decorator

@ccclass
export default class HighPrecisionSlider extends cc.Component {
    @property(cc.Node)
    bar: cc.Node = null
    @property(cc.Node)
    handle: cc.Node = null
    startPos = cc.v3(0, 0)
    touchPos = cc.v2(0, 0)
    get progress(): number {
        return this.handle.x / this.bar.width + 0.5
    }
    set progress(value: number) {
        this.handle.setPosition(cc.v3(this.bar.width * (Utils.clamp(value, 1, 0) - 0.5), this.handle.y))
        this.updateAttribute()
    }
    private selectorCallback: (progress: number) => void
    onLoad() {
        this.handle.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.touchPos = event.getLocation()
            this.startPos = this.handle.position.clone()
        })
        this.handle.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let offset = event.getLocation().sub(this.touchPos)
            let x = Utils.clamp(this.startPos.x + offset.x / this.node.parent.scale, this.bar.width / 2, -this.bar.width / 2)
            this.handle.setPosition(x, 0)
            this.updateAttribute()
        })
    }
    init() {}
    setSelectorCallback(callback: (progress: number) => void) {
        this.selectorCallback = callback
        this.updateAttribute()
    }
    selectRandom() {
        this.handle.x = this.bar.width * (Math.random() - 0.5)
        this.updateAttribute()
    }
    updateAttribute() {
        if (this.selectorCallback) {
            this.selectorCallback(this.handle.x / this.bar.width + 0.5)
        }
    }
}
