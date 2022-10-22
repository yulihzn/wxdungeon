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
 * 任务条件和目的
 * 触发条件：拾取物品，使用物品，击杀目标，对话，进入房间，触发开关，指定时间
 * 结束条件：拾取物品，使用物品，击杀目标，对话，进入房间，触发开关，指定时间
 */
export default class QuestConditionData {
    static readonly ITEM_PICK = 'item_pick'
    static readonly ITEM_USE = 'item_use'
    static readonly ITEM_DROP = 'item_drop'
    static readonly NPC_KILL = 'npc_kill'
    static readonly NPC_ALIVE = 'npc_alive'
    static readonly BUILDING_TRIGGER = 'building_trigger'
    itemList = '' // 拾取/使用/放下 指定物品列表，每次拾取的时候判断背包和拾取物品是否满足条件item000,pick,1;equip000,use,1;equip000,drop分号隔开，逗号后面是use模式时候指使用次数,是pick模式时指拥有数量,不填代表1
    npcList = '' //指定目标死亡/存活列表，每次使用判断是否满足使用次数monster000,kill,1;npc000,alive,1分号隔开，逗号后面是数量不填代表1
    buildingList = '' //触发建筑列表，每次使用判断是否满足使用次数furniture000,trigger,1;分号隔开，逗号后面是次数不填代表1
    dialogueList = '' //触发目标对话列表，每次使用判断是否满足触发指定对话的指定id，quest000,1;分号隔开，逗号后面是id
    roomList = '' //进入/离开/清理 指定房间触发0,0,0,0,0章节，层数，房间xy坐标，最后第二位0代表进入，1代表离开，2代表清理最后一位代表次数
    timeLimit = 0 //任务开始以后的时限
    startTime = 0 //最早开始时间
    endTime = 0 //最晚开始时间
    isExpand = false //editor 是否展开

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