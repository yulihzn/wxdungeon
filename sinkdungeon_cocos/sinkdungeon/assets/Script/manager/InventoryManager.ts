import EquipmentData from '../data/EquipmentData'
import InventoryData from '../data/InventoryData'
import ItemData from '../data/ItemData'
import SuitData from '../data/SuitData'
import InventoryItem from '../ui/InventoryItem'
import NextStep from '../utils/NextStep'
import Item from '../item/Item'
import BuildingData from '../data/BuildingData'
import Logic from '../logic/Logic'

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
    itemList: ItemData[] = []
    inventoryList: InventoryData[] = []
    itemCoolDownList: NextStep[] = []
    equips: { [key: string]: EquipmentData } = {}
    suitMap: { [key: string]: SuitData } = {}
    suitEquipMap: { [key: string]: EquipmentData } = {}
    emptyEquipData = new EquipmentData()
    private totalEquipData = new EquipmentData()
    clear(): void {}
    constructor() {
        this.itemList = []
        this.equips = {}
        this.inventoryList = []
        this.itemCoolDownList = []
        this.emptyEquipData = new EquipmentData()
        this.totalEquipData = new EquipmentData()
        this.suitMap = {}
        this.suitEquipMap = {}
        for (let name of InventoryManager.EQUIP_TAGS) {
            this.equips[name] = new EquipmentData()
        }
        for (let i = 0; i < InventoryManager.MAX_ITEM; i++) {
            let data = new ItemData()
            data.count = -1
            this.itemList.push(data)
            this.itemCoolDownList.push(new NextStep())
        }
    }
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
        newdata.type = equipmentData.equipmetType == InventoryManager.EMPTY ? InventoryItem.TYPE_EMPTY : InventoryItem.TYPE_EQUIP
        newdata.price = newdata.equipmentData.price
        newdata.createTime = new Date().getTime()
        newdata.id = newdata.equipmentData.id
        return newdata
    }

    static isItemEqualCanAdd(item1: ItemData, item2: ItemData): boolean {
        return item1 && item2 && item1.resName != Item.EMPTY && item1.resName == item2.resName && item1.count > 0 && item2.count > 0
    }
}
