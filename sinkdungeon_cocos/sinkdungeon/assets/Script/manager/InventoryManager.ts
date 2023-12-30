import EquipmentData from '../data/EquipmentData'
import InventoryData from '../data/InventoryData'
import ItemData from '../data/ItemData'
import SuitData from '../data/SuitData'
import InventoryItem from '../ui/InventoryItem'
import Item from '../item/Item'
import Logic from '../logic/Logic'
import Player from '../logic/Player'
import TriggerData from '../data/TriggerData'
import FromData from '../data/FromData'
import InventoryDialog from '../ui/dialog/InventoryDialog'
import { EventHelper } from '../logic/EventHelper'
import Utils from '../utils/Utils'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class InventoryManager {
    static readonly MAX_BAG = 32
    static readonly MAX_EQUIP = 8
    static readonly MAX_ITEM = 6
    public static readonly EMPTY = 'empty' //10000000
    public static readonly WEAPON = 'weapon' //10010000
    public static readonly REMOTE = 'remote' //10020000
    public static readonly SHIELD = 'shield' //10030000
    public static readonly HELMET = 'helmet' //10040000
    public static readonly CLOTHES = 'clothes' //10050000
    public static readonly TROUSERS = 'trousers' //10060000
    public static readonly GLOVES = 'gloves' //10070000
    public static readonly SHOES = 'shoes' //10080000
    public static readonly CLOAK = 'cloak' //10090000
    static readonly EQUIP_TAGS = [
        InventoryManager.WEAPON,
        InventoryManager.REMOTE,
        InventoryManager.SHIELD,
        InventoryManager.HELMET,
        InventoryManager.CLOTHES,
        InventoryManager.TROUSERS,
        InventoryManager.GLOVES,
        InventoryManager.SHOES,
        InventoryManager.CLOAK
    ]
    static readonly TAG = cc.Enum({
        DEFAULT: 0, //默认
        EQUIP: 1, //装备区
        ITEM: 2, //物品区
        CUPBOARD: 3 //衣柜
    })

    //buffer效果
    buffer: EquipmentData = new EquipmentData()
    get itemList(): ItemData[] {
        if (Logic.data.chapterIndex == Logic.CHAPTER099) {
            return Logic.data.playerDatas[this.id].playerItemListReality
        } else {
            return Logic.data.playerDatas[this.id].playerItemList
        }
    }
    get inventoryList(): InventoryData[] {
        if (Logic.data.chapterIndex == Logic.CHAPTER099) {
            return Logic.data.playerDatas[this.id].playerInventoryListReality
        } else {
            return Logic.data.playerDatas[this.id].playerInventoryList
        }
    }
    get equips(): { [key: string]: EquipmentData } {
        if (Logic.data.chapterIndex == Logic.CHAPTER099) {
            return Logic.data.playerDatas[this.id].playerEquipsReality
        } else {
            return Logic.data.playerDatas[this.id].playerEquips
        }
    }
    id = ''
    suitMap: { [key: string]: SuitData } = {}
    suitEquipMap: { [key: string]: EquipmentData } = {}
    emptyEquipData = new EquipmentData()
    private totalEquipData = new EquipmentData()
    equipAndItemTimeDelays: Map<string, number> = new Map()
    constructor(id: string) {
        this.id = id
        this.emptyEquipData = new EquipmentData()
        this.totalEquipData = new EquipmentData()
        this.suitMap = {}
        this.suitEquipMap = {}
        for (let name of InventoryManager.EQUIP_TAGS) {
            if (!this.equips[name]) {
                this.equips[name] = new EquipmentData()
            }
        }
        for (let i = 0; i < InventoryManager.MAX_ITEM; i++) {
            if (i >= this.itemList.length) {
                let data = new ItemData()
                data.count = -1
                this.itemList.push(data)
            }
        }
    }
    clear(): void {}
    getEquipBySuit(e: EquipmentData): EquipmentData {
        if (e && this.suitEquipMap[e.suitType]) {
            return this.suitEquipMap[e.suitType]
        }
        return this.emptyEquipData
    }
    get TotalEquipData(): EquipmentData {
        return this.totalEquipData
    }
    /**更新总数据 */
    updateTotalEquipData(): void {
        let e = new EquipmentData()
        let exTriggers = []
        let affixs = []
        for (let key in this.equips) {
            let equip = this.equips[key]
            e.Common.add(equip.Common)
            for (let ex of equip.exTriggers) {
                exTriggers.push(ex)
            }
            for (let affix of equip.affixs) {
                affixs.push(affix)
            }
        }
        e.Common.add(this.buffer.Common)
        for (let key in this.suitEquipMap) {
            let equip = this.suitEquipMap[key]
            if (equip) {
                e.Common.add(equip.Common)
                for (let ex of equip.exTriggers) {
                    exTriggers.push(ex)
                }
            }
        }
        e.exTriggers = exTriggers
        e.affixs = affixs
        e.updateFinalCommon()
        this.totalEquipData = e
    }

    refreshSuits() {
        this.suitMap = {}
        this.suitEquipMap = {}
        //遍历列表计算相应套装集齐数
        for (let key in this.equips) {
            let equip = this.equips[key]
            if (equip.suitType.length < 1) {
                continue
            }
            if (!this.suitMap[equip.suitType]) {
                let data = new SuitData()
                data.valueCopy(Logic.suits[equip.suitType])
                data.count = 1
                this.suitMap[equip.suitType] = data
            } else {
                this.suitMap[equip.suitType].count++
            }
        }
        //遍历套装列表 添加玩家状态 生成对应装备的套装属性表
        for (let key in this.suitMap) {
            let suit = this.suitMap[key]
            let e = new EquipmentData()
            if (suit) {
                for (let i = 0; i < suit.count - 1; i++) {
                    if (i < suit.EquipList.length) {
                        e.add(suit.EquipList[i]) //叠加套装各种几率
                    }
                }
                this.suitEquipMap[key] = e
            }
        }
    }

    refreshEquipment(equipmentType: string, equipDataNew: EquipmentData, isInit: boolean, isReplace: boolean, callback: (type: string) => void) {
        if (!equipDataNew || !equipmentType) {
            return
        }
        let equip = Logic.inventoryMgr.equips[equipmentType]
        let hasEquip = equip && equip.equipmentType != InventoryManager.EMPTY
        if (!hasEquip) {
            if (equipmentType == InventoryManager.REMOTE && Logic.inventoryMgr.equips[InventoryManager.SHIELD].equipmentType != InventoryManager.EMPTY) {
                hasEquip = true
            }
            if (equipmentType == InventoryManager.SHIELD && Logic.inventoryMgr.equips[InventoryManager.REMOTE].equipmentType != InventoryManager.EMPTY) {
                hasEquip = true
            }
        }

        //1.如果是捡起到背包或者购买（非替换非初始化），且对应位置有装备，则直接放置到背包
        //2.如果当前装备等级高于玩家，则直接放置到背包
        if ((!isReplace && !isInit && equip && hasEquip) || equipDataNew.requireLevel > Logic.playerData.OilGoldData.level) {
            this.setEquipmentToBag(equipDataNew, isInit, Logic.inventoryMgr.inventoryList)
            return
        }
        //2.如果是长按的替换操作，替换新的，移出旧的到背包
        //更新当前装备数据
        if (equip) {
            this.setEquipmentToBag(equip, isInit, Logic.inventoryMgr.inventoryList)
            equip.valueCopy(equipDataNew)
            if (!isInit && this.id == Logic.data.lastPlayerId) {
                EventHelper.emit(EventHelper.HUD_INVENTORY_EQUIP_UPDATE)
            }
        }

        switch (equipmentType) {
            case InventoryManager.REMOTE:
                if (Logic.inventoryMgr.equips[equipmentType].equipmentType != InventoryManager.EMPTY) {
                    //替换盾牌到背包
                    this.setEquipmentToBag(Logic.inventoryMgr.equips[InventoryManager.SHIELD], isInit, Logic.inventoryMgr.inventoryList)
                    //清空盾牌数据
                    Logic.inventoryMgr.equips[InventoryManager.SHIELD].valueCopy(new EquipmentData())
                    if (callback) {
                        callback(InventoryManager.SHIELD)
                    }
                }
                break
            case InventoryManager.SHIELD:
                //如果当前盾牌不为空清空远程并展示盾牌栏，否则显示远程隐藏盾牌栏
                if (Logic.inventoryMgr.equips[equipmentType].equipmentType != InventoryManager.EMPTY) {
                    //替换远程到背包
                    this.setEquipmentToBag(Logic.inventoryMgr.equips[InventoryManager.REMOTE], isInit, Logic.inventoryMgr.inventoryList)
                    Logic.inventoryMgr.equips[InventoryManager.REMOTE].valueCopy(new EquipmentData())
                    if (callback) {
                        callback(InventoryManager.REMOTE)
                    }
                }
                break
        }
        if (callback) {
            callback(equipmentType)
        }
    }

    private setEquipmentToBag(equipData: EquipmentData, isInit: boolean, inventoryList: InventoryData[]) {
        //来自初始化或者空装备直接返回
        if (isInit || equipData.equipmentType == InventoryManager.EMPTY) {
            return
        }
        let data = InventoryManager.buildEquipInventoryData(equipData)
        //添加到背包
        let isAdded = InventoryDialog.addEquipOrItemToBag(data, inventoryList, InventoryManager.MAX_BAG, false, null)
        if (!isAdded) {
            Utils.toast('物品栏已满！')
            EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: equipData.img, equipmentData: equipData })
        }
    }

    static isEquipTag(str: string) {
        if (!str || str.length < 1) {
            return false
        }
        for (let name of InventoryManager.EQUIP_TAGS) {
            if (str.indexOf(name) > -1) {
                return true
            }
        }
        return false
    }
    static buildItemInventoryData(itemData: ItemData) {
        let newdata = new InventoryData()
        newdata.itemData = new ItemData()
        newdata.itemData.valueCopy(itemData)
        newdata.type = itemData.resName == Item.EMPTY ? InventoryItem.TYPE_EMPTY : InventoryItem.TYPE_ITEM
        newdata.createTime = new Date().getTime()
        newdata.id = newdata.itemData.id
        return newdata
    }
    static buildEquipInventoryData(equipmentData: EquipmentData) {
        let newdata = new InventoryData()
        newdata.equipmentData = new EquipmentData()
        newdata.equipmentData.valueCopy(equipmentData)
        newdata.type = equipmentData.equipmentType == InventoryManager.EMPTY ? InventoryItem.TYPE_EMPTY : InventoryItem.TYPE_EQUIP
        newdata.price = newdata.equipmentData.price
        newdata.createTime = new Date().getTime()
        newdata.id = newdata.equipmentData.id
        return newdata
    }

    static isItemEqualCanAdd(item1: ItemData, item2: ItemData): boolean {
        return item1 && item2 && item1.resName != Item.EMPTY && item1.resName == item2.resName && item1.count > 0 && item2.count > 0
    }
    getTimeDelay(timeDelay: number, interval: number, dt: number): number {
        if (!timeDelay) {
            timeDelay = 0
        }
        timeDelay += dt
        if (timeDelay > interval) {
            timeDelay = 0
            return timeDelay
        }
        return timeDelay
    }
    isTimeDelay(dt: number, key: string, interval: number): boolean {
        if (interval <= 0) {
            return false
        }
        let timeDelay = -1
        this.equipAndItemTimeDelays.set(key, this.getTimeDelay(this.equipAndItemTimeDelays.get(key), interval, dt))
        timeDelay = this.equipAndItemTimeDelays.get(key)
        return timeDelay == 0
    }
    updateLogic(dt: number, player: Player) {
        if (!Logic.isGamePause && player) {
            let totalData = this.TotalEquipData
            for (let d of totalData.exTriggers) {
                if (this.isTimeDelay(dt, d.uuid, d.autoInterval)) {
                    if (player) {
                        player.exTriggerDo(d, TriggerData.GROUP_AUTO, TriggerData.TYPE_AUTO, FromData.getClone(totalData.nameCn, totalData.img, player.node.position), null)
                    }
                }
            }

            for (let i = 0; i < this.itemList.length; i++) {
                let data = this.itemList[i]
                for (let d of data.exTriggers) {
                    if (this.isTimeDelay(dt, `itemIndex${i}`, d.autoInterval)) {
                        if (player) {
                            player.exTriggerDo(d, TriggerData.GROUP_AUTO, TriggerData.TYPE_AUTO, FromData.getClone(data.nameCn, data.resName, player.node.position), null)
                        }
                    }
                }
            }
        }
    }
}
