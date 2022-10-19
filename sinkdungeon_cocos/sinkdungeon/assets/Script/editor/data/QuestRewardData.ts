// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import DataUtils from '../../utils/DataUtils'

/**
 * 任务奖励
 */
export default class QuestRewardData {
    itemList = '' //物品列表item000,1;equip000;分号隔开，逗号后面是数量
    coins = 0 //金币
    realCoins = 0 //货币
    oilGolds = 0 //经验
    statusList = '' //状态列表

    valueCopy(data: QuestRewardData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
    }
    clone(): QuestRewardData {
        let e = new QuestRewardData()
        e.valueCopy(this)
        return e
    }
}
