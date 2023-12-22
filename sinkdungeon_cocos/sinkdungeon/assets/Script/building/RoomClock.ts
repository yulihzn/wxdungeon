// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from '../logic/Logic'
import TimeDelay from '../utils/TimeDelay'
import Utils from '../utils/Utils'

const { ccclass, property } = cc._decorator

@ccclass
export default class RoomClock extends cc.Component {
    @property(cc.Label)
    timeLabel: cc.Label = null

    checkTimeDelay = new TimeDelay(1)

    update(dt: number) {
        if (this.checkTimeDelay.check(dt)) {
            this.timeLabel.string = `${Utils.getHour(Logic.data.realTime)}`
        }
    }
}
