// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import DataUtils from '../utils/DataUtils'
import InventoryData from './InventoryData'

export default class FurnitureData {
    id = ''
    price = 0 //价格
    nameCn: string = ''
    nameEn: string = ''
    resName: string = ''
    info = ''
    desc = ''
    scale = 1
    collider = ''
    isOpen = false //是否已经打开
    purchased = false //是否购买
    storageList: InventoryData[] = [] //储物列表
    storage = 0 //储物容量
    height = 32 //家具高度
    spritePos = ''

    valueCopy(data: FurnitureData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.height = data.height ?? 32
        this.scale = data.scale ?? 1
        if (this.storage > 32) {
            this.storage = 32
        }
        if (data.storageList && data.storage > 0) {
            this.storageList = []
            for (let idata of data.storageList) {
                let ida = new InventoryData()
                ida.valueCopy(idata)
                this.storageList.push(ida)
            }
        }
    }
    clone(): FurnitureData {
        let data = new FurnitureData()
        data.valueCopy(this)

        return data
    }
}
