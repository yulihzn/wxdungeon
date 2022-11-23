// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BuildingData from '../../data/BuildingData'
import EquipmentData from '../../data/EquipmentData'
import ItemData from '../../data/ItemData'
import NonPlayerData from '../../data/NonPlayerData'
import Logic from '../../logic/Logic'
import DataUtils from '../../utils/DataUtils'

/**
 * 任务条件和目的
 * 触发条件：拾取物品，使用物品，击杀目标，对话，进入房间，触发开关，指定时间
 * 结束条件：拾取物品，使用物品，击杀目标，对话，进入房间，触发开关，指定时间
 */
export default class QuestTargetData {
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
    static readonly ROOM_LEAVE = 'room_leave'
    static readonly ROOM_CLEAR = 'room_clear'

    static readonly TARGET_ROOM = 'target_room'
    static readonly TARGET_FURNITURE = 'target_furniture'
    static readonly TARGET_NPC = 'target_npc'
    static readonly TARGET_BOSS = 'target_boss'
    static readonly TARGET_MONSTER = 'target_monster'
    static readonly TARGET_EQUIP = 'target_equip'
    static readonly TARGET_ITEM = 'target_item'

    /**
     *
     * 拾取/使用/放下 指定物品列表，每次拾取的时候判断背包和拾取物品是否满足条件item000,pick,1;equip000,use,1;equip000,drop分号隔开，逗号后面是use模式时候指使用次数,是pick模式时指拥有数量,不填代表1
     * 指定目标死亡/存活列表，每次使用判断是否满足使用次数monster000,kill,1;npc000,alive,1分号隔开，逗号后面是数量不填代表1
     * 触发建筑列表，每次使用判断是否满足使用次数furniture000,trigger,1;分号隔开，逗号后面是次数不填代表1
     */
    conditionList = ''
    roomList = '' //进入/离开/清理 指定房间触发0,0,0,0,0章节，层数，房间xy坐标，最后第二位0代表进入，1代表离开，2代表清理最后一位代表次数
    startTime = 0 //开始时间
    endTime = 0 //开始时间
    resId = '' //资源id
    triggerType = '' //触发类型
    count = 1 //次数
    desc = '' //描述
    targetType = '' //目标类型
    chapter = 0 //章节
    level = 0 //层数
    x = 0 //坐标
    y = 0 //坐标
    z = 0 //坐标

    status = 0 //完成状态

    valueCopy(data: QuestTargetData) {
        if (!data) {
            return this
        }
        DataUtils.baseCopy(this, data)
        return this
    }
    clone(): QuestTargetData {
        let e = new QuestTargetData()
        e.valueCopy(this)
        return e
    }
    static build(resId: string, targetType: string, tiggerType: string, count: number) {
        let data = new QuestTargetData()
        data.resId = resId
        data.targetType = targetType
        data.triggerType = tiggerType
        data.count = count
        return data
    }

    getDesc(isEditMode?: boolean) {
        if (this.desc.length > 0) {
            return this.desc
        }
        let str = ''
        let trigger = ''
        let title = ''
        let count = this.count
        switch (this.triggerType) {
            case QuestTargetData.BUILDING_TRIGGER:
                title = '建筑'
                trigger = `触发${count}次`
                break
            case QuestTargetData.ITEM_DROP:
                title = '物品'
                trigger = `丢弃`
                break
            case QuestTargetData.ITEM_PICK:
                title = '物品'
                trigger = `拾取${count}个`
                break
            case QuestTargetData.ITEM_USE:
                title = '物品'
                trigger = `使用${count}次`
                break
            case QuestTargetData.EQUIP_PICK:
                title = '装备'
                trigger = `拾取${count}个`
                break
            case QuestTargetData.EQUIP_ON:
                title = '装备'
                trigger = `装备${count}个`
                break
            case QuestTargetData.EQUIP_OFF:
                title = '装备'
                trigger = `脱下`
                break
            case QuestTargetData.EQUIP_DROP:
                title = '装备'
                trigger = `丢弃`
                break
            case QuestTargetData.NPC_ALIVE:
                title = 'NPC'
                trigger = `存活${count}个`
                break
            case QuestTargetData.NPC_KILL:
                title = 'BOSS'
                trigger = `击杀${count}个`
                break
            case QuestTargetData.BOSS_ALIVE:
                title = 'BOSS'
                trigger = `存活${count}个`
                break
            case QuestTargetData.BOSS_KILL:
                title = 'NPC'
                trigger = `击杀${count}个`
                break
            case QuestTargetData.MONSTER_ALIVE:
                title = '生物'
                trigger = `存活${count}个`
                break
            case QuestTargetData.MONSTER_KILL:
                title = '生物'
                trigger = `击杀${count}个`
                break
            case QuestTargetData.ROOM_ENTER:
                title = '地点'
                trigger = count > 1 ? `进入${count}一次` : `进入`
                break
            case QuestTargetData.ROOM_LEAVE:
                title = '地点'
                trigger = count > 1 ? `离开${count}一次` : `进入`
                break
            case QuestTargetData.ROOM_CLEAR:
                title = '地点'
                trigger = count > 1 ? `清理${count}一次` : `清理`
                break
        }
        if (isEditMode) {
            str = `类型：${title}\n触发条件：${trigger}\n资源名：${this.resId}\n`
        } else {
            str = `${trigger}${this.getTargetName()}`
        }
        return str
    }
    getTargetName() {
        let str = ''
        switch (this.targetType) {
            case QuestTargetData.TARGET_ROOM:
                str = `地点[${this.chapter},${this.level},${this.x},${this.y},${this.z}]`
                break
            case QuestTargetData.TARGET_BOSS:
                let nd1 = new NonPlayerData()
                nd1.valueCopy(Logic.bosses[this.resId])
                str = nd1.nameCn
                break
            case QuestTargetData.TARGET_EQUIP:
                let data = new EquipmentData()
                data.valueCopy(Logic.equipments[this.resId])
                str = data.nameCn
                break
            case QuestTargetData.TARGET_ITEM:
                let itemData = new ItemData()
                itemData.valueCopy(Logic.items[this.resId])
                str = itemData.nameCn
                break
            case QuestTargetData.TARGET_FURNITURE:
                let fd = new BuildingData()
                fd.valueCopy(Logic.furnitures[this.resId])
                str = fd.nameCn
                break
            case QuestTargetData.TARGET_MONSTER:
                let nd2 = new NonPlayerData()
                nd2.valueCopy(Logic.monsters[this.resId])
                str = nd2.nameCn
                break
            case QuestTargetData.TARGET_NPC:
                let nd3 = new NonPlayerData()
                nd3.valueCopy(Logic.nonplayers[this.resId])
                str = nd3.nameCn
                break
        }
        return str
    }
}
