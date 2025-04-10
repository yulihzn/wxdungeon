import DataUtils from '../utils/DataUtils'
import BaseData from './BaseData'
import EquipmentData from './EquipmentData'
import ItemData from './ItemData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class InventoryData extends BaseData {
    id: number = 0
    createTime: number = 0
    quality: number = 0
    equipmentData: EquipmentData
    itemData: ItemData
    price: number
    type: number = 0

    public valueCopy(data: InventoryData): InventoryData {
        if (!data) {
            return this
        }
        DataUtils.baseCopy(this, data)
        if (data.equipmentData) {
            this.equipmentData = new EquipmentData()
            this.equipmentData.valueCopy(data.equipmentData)
            this.price = this.equipmentData.price
            this.id = this.equipmentData.id
            this.quality = this.equipmentData.quality
        }
        if (data.itemData) {
            this.itemData = new ItemData()
            this.itemData.valueCopy(data.itemData)
            this.price = this.itemData.price
            this.id = this.itemData.id
            this.quality = 0
        }
        return this
    }
    public clone(): InventoryData {
        let e = new InventoryData()
        e.valueCopy(this)
        return e
    }
    public setEmpty() {
        this.type = 0
        this.equipmentData = null
        this.itemData = null
        this.createTime = 0
        this.id = 0
        this.price = 0
        this.quality = 0
    }
}
