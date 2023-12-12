// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from '../logic/Logic'
import Utils from '../utils/Utils'

const { ccclass, property } = cc._decorator

@ccclass
export default class RoomClock extends cc.Component {
    @property(cc.Label)
    timeLabel: cc.Label = null

    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 1) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    update(dt: number) {
        if (this.isCheckTimeDelay(dt)) {
            this.timeLabel.string = `${Utils.getHour(Logic.data.realTime)}`
        }
    }
}
