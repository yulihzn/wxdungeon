import DataUtils from '../utils/DataUtils'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
/**
 * 任务条件和目的
 * 触发条件：拾取物品，使用物品，击杀目标，对话，进入房间，触发开关，指定时间
 * 结束条件：拾取物品，使用物品，击杀目标，对话，进入房间，触发开关，指定时间
 */
export default class QuestConditionData {
    pickedItemList = '' //拾取指定物品列表，每次拾取的时候判断背包和拾取物品是否满足条件item000,1;equip000;分号隔开，逗号后面是数量
    useItemList = '' //使用指定物品列表，每次使用判断是否满足使用次数item000,1;分号隔开，逗号后面是数量不填代表1
    killedList = '' //击杀指定目标或者指定目标死亡列表，每次使用判断是否满足使用次数monster000,1;分号隔开，逗号后面是数量不填代表1
    dialogueList = '' //触发目标对话列表，每次使用判断是否满足触发指定对话的指定id，quest000,1;分号隔开，逗号后面是id
    enterRoomList = '' //进入指定房间触发0,0,0,0章节，层数，房间xy坐标
    clearRoomList = '' //清理指定房间触发0,0,0,0章节，层数，房间xy坐标
    timeLimit = 0 //任务开始以后的时限
    startTime = 0 //最早开始时间
    endTime = 0 //最晚开始时间

    valueCopy(data: QuestConditionData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
    }
    clone(): QuestConditionData {
        let e = new QuestConditionData()
        e.valueCopy(this)
        return e
    }
}
