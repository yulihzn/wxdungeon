
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import InventoryData from "./InventoryData";


export default class FurnitureData {
    id = '';
    price = 60;//价格
    nameCn: string = '';
    nameEn: string = '';
    resName: string = '';
    info = '';
    desc = '';
    scale = 1;
    collider = '';
    isOpen = false;//是否已经打开
    purchased = false;//是否购买
    storageList:InventoryData[] = [];//储物列表
    storage=0;//储物容量

    valueCopy(data: FurnitureData) {
        if (!data) {
            return;
        }
        this.id = data.id?data.id:'';
        this.purchased = data.purchased;
        this.price = data.price;
        this.nameCn = data.nameCn ? data.nameCn : '';
        this.nameEn = data.nameEn ? data.nameEn : '';
        this.resName = data.resName ? data.resName : '';
        this.info = data.info ? data.info : '';
        this.scale = data.scale ? data.scale : 1;
        this.collider = data.collider ? data.collider : '';
        this.isOpen = data.isOpen;
        this.storage = data.storage?data.storage:0;
        if(this.storage>32){
            this.storage = 32;
        }
        if(data.storageList&&data.storage>0){
            this.storageList = [];
            for(let idata of data.storageList){
                let ida = new InventoryData();
                ida.valueCopy(idata);
                this.storageList.push(ida);
            }
        }
    }
    clone(): FurnitureData {
        let data = new FurnitureData();
        data.purchased = this.purchased;
        data.scale = this.scale;
        data.price = this.price;
        data.nameCn = this.nameCn;
        data.nameEn = this.nameEn;
        data.info = this.info;
        data.scale = this.scale;
        data.collider = this.collider;
        data.isOpen = this.isOpen;
        data.resName = this.resName;
        data.id = this.id;
        data.storage = this.storage;
        if(this.storageList&&this.storage>0){
            data.storageList = [];
            for(let idata of this.storageList){
                let ida = new InventoryData();
                ida.valueCopy(idata);
                data.storageList.push(ida);
            }
        }
        return data;
    }
}
