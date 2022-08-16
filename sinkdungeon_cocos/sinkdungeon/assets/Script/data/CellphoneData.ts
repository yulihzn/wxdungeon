import DataUtils from '../utils/DataUtils'
import BaseData from './BaseData'
import FurnitureData from './FurnitureData'
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

export default class CellphoneData extends BaseData {
    createTime: number = 0
    furnitureData: FurnitureData
    itemData: ItemData
    price: number
    type: number = 0

    public valueCopy(data: CellphoneData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        // this.type = data.type?data.type:0;
        // this.price = data.price?data.price:0;
        if (data.furnitureData) {
            this.furnitureData = new FurnitureData()
            this.furnitureData.valueCopy(data.furnitureData)
            this.price = this.furnitureData.price
        }
        if (data.itemData) {
            this.itemData = new ItemData()
            this.itemData.valueCopy(data.itemData)
        }
        this.itemData = data.itemData
        // this.createTime = data.createTime?data.createTime:0;
    }
    public clone(): CellphoneData {
        let e = new CellphoneData()
        e.valueCopy(this)
        // e.furnitureData = this.furnitureData;
        // e.itemData = this.itemData;
        // e.createTime = this.createTime;
        // e.type = this.type;
        // e.price = this.price;
        return e
    }
    public setEmpty() {
        this.type = 0
        this.furnitureData = null
        this.itemData = null
        this.createTime = 0
        this.price = 0
    }
}
