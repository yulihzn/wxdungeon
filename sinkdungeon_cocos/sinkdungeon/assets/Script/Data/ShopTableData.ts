import EquipmentData from "./EquipmentData";
import ItemData from "./ItemData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class ShopTableData {
    pos:cc.Vec3;
    equipdata:EquipmentData;
    itemdata:ItemData;
    price = 60;
    shopType = 0;//0:equip 1:item
    isSaled = false;//是否卖出
    valueCopy(data:ShopTableData){
        this.pos = data.pos?cc.v3(data.pos.x,data.pos.y):cc.v3(0,0);
        if(!this.equipdata){
            this.equipdata = new EquipmentData();
        }
        if(!this.itemdata){
            this.itemdata = new ItemData();
        }
        if(data.equipdata){
            this.equipdata.valueCopy(data.equipdata);
        }
        if(data.itemdata){
            this.itemdata.valueCopy(data.itemdata);
        }
        this.price = data.price;
        this.isSaled = data.isSaled;
        this.shopType = data.shopType;
    }
}
