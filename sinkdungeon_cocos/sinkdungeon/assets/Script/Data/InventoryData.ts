import BaseData from "./BaseData";
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


export default class InventoryData extends BaseData{
    index: number = 0;
    createTime: number = 0;
    equipmentData:EquipmentData;
    itemData:ItemData;
    type:number = 0;

    public valueCopy(data:InventoryData):void{
        if(!data){
            return;
        }
        this.type = data.type?data.type:0;
        if(data.equipmentData){
            this.equipmentData = new EquipmentData();
            this.equipmentData.valueCopy(data.equipmentData);
        }
        if(data.itemData){
            this.itemData = new ItemData();
            this.itemData.valueCopy(data.itemData);
        }
        this.itemData=data.itemData;
        this.index = data.index?data.index:0;
        this.createTime = data.createTime?data.createTime:0;
    }
    public clone():InventoryData{
        let e = new InventoryData();
        e.equipmentData = this.equipmentData;
        e.itemData = this.itemData;
        e.index = this.index;
        e.createTime = this.createTime;
        e.type = this.type;
        return e;
    }
    public setEmpty(){
        this.type = 0;
        this.equipmentData = null;
        this.itemData = null;
        this.createTime = 0;
    }
    
}
