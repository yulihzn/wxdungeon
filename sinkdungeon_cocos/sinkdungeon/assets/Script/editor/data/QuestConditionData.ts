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
import QuestTargetData from './QuestTargetData'

/**
 * 任务条件和目的
 * 触发条件：拾取物品，使用物品，击杀目标，对话，进入房间，触发开关，指定时间
 * 结束条件：拾取物品，使用物品，击杀目标，对话，进入房间，触发开关，指定时间
 */
export default class QuestConditionData {
    static readonly ITEM_PICK = 'item_pick'
    static readonly ITEM_USE = 'item_use'
    static readonly ITEM_DROP = 'item_drop'
    static readonly EQUIP_PICK = 'equip_pick'
    static readonly EQUIP_ON = 'equip_wear'
    static readonly EQUIP_OFF = 'equip_wear'
    static readonly EQUIP_DROP = 'equip_drop'
    static readonly NPC_KILL = 'npc_kill'
    static readonly NPC_ALIVE = 'npc_alive'
    static readonly MONSTER_KILL = 'monster_kill'
    static readonly MONSTER_ALIVE = 'monster_alive'
    static readonly BOSS_KILL = 'boss_kill'
    static readonly BOSS_ALIVE = 'boss_alive'
    static readonly BUILDING_TRIGGER = 'building_trigger'
    static readonly ROOM_ENTER = 'room_enter'
    static readonly ROOM_CLEAR = 'room_clear'
    static readonly ROOM_LEAVE = 'room_leave'
    /**
     *
     * 拾取/使用/放下 指定物品列表，每次拾取的时候判断背包和拾取物品是否满足条件item000,pick,1;equip000,use,1;equip000,drop分号隔开，逗号后面是use模式时候指使用次数,是pick模式时指拥有数量,不填代表1
     * 指定目标死亡/存活列表，每次使用判断是否满足使用次数monster000,kill,1;npc000,alive,1分号隔开，逗号后面是数量不填代表1
     * 触发建筑列表，每次使用判断是否满足使用次数furniture000,trigger,1;分号隔开，逗号后面是次数不填代表1
     * //进入/离开/清理 指定房间触发0,0,0,0,0章节，层数，房间xy坐标，最后第二位0代表进入，1代表离开，2代表清理最后一位代表次数
     */
    list: QuestTargetData[] = []
    mapThingsList = '' //指定地图刷出物品.npc以及地图元素列表item000,0,0,0,0,0,0;npc000,0,0,0,0,0,0;z1,0,0,0,0,0
    startTime = 0 //开始时间
    endTime = 0 //开始时间
    isExpand = false //editor 是否展开
    coins = 0 //金币
    realCoins = 0 //货币
    oilGolds = 0 //经验
    statusList = '' //状态列表

    valueCopy(data: QuestConditionData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        if (data.list) {
            this.list = []
            for (let c of data.list) {
                this.list.push(new QuestTargetData().valueCopy(c))
            }
        }
    }
    copyList(list: QuestTargetData[]) {
        if (list) {
            this.list = []
            for (let c of list) {
                this.list.push(new QuestTargetData().valueCopy(c))
            }
        }
    }

    clone(): QuestConditionData {
        let e = new QuestConditionData()
        e.valueCopy(this)
        return e
    }
}
