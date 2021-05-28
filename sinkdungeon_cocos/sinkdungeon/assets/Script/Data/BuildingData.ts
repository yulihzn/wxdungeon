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


export default class BuildingData {
    defaultPos:cc.Vec3;//默认下标
    position:cc.Vec3;//当前位置
    isOpen = false;//宝箱是否打开或者建筑物是否触发
    quality = 1;//宝箱品质
    equipdata:EquipmentData;//携带装备数据
    itemdata:ItemData;//携带物品数据
    price = 60;//商品价格
    shopType = 0;//0:装备 1:物品
    isSaled = false;//是否卖出
    maxHealth = 1;//最大生命,默认1
    currentHealth = 1;//当前生命,默认1
    generatorList:string[] = [];
    generatorCount = 0;
    generatorInterval = 0;
    interact = 0;//是否可以互动拾取
    rollover = 0;//是否翻倒

    valueCopy(data:BuildingData){
        this.defaultPos = data.defaultPos?cc.v3(data.defaultPos.x,data.defaultPos.y):cc.v3(0,0);
        this.position = data.position?cc.v3(data.position.x,data.position.y):cc.v3(0,0);
        if(data.equipdata){
            this.equipdata = new EquipmentData();
            this.equipdata.valueCopy(data.equipdata);
        }
        if(data.itemdata){
            this.itemdata = new ItemData();
            this.itemdata.valueCopy(data.itemdata);
        }
        this.price = data.price;
        this.isSaled = data.isSaled;
        this.shopType = data.shopType;
        this.quality = data.quality?data.quality:1;
        this.isOpen = data.isOpen;
        this.maxHealth = data.maxHealth?data.maxHealth:0;
        this.currentHealth = data.currentHealth?data.currentHealth:0;
        this.generatorList = [];
        if(data.generatorList){
            this.generatorList = data.generatorList;
        }
        this.generatorCount = data.generatorCount?data.generatorCount:0;
        this.generatorInterval = data.generatorInterval?data.generatorInterval:0;
        this.interact = data.interact?data.interact:0;
        this.rollover = data.rollover?data.rollover:0;
    }
    clone():BuildingData{
        let data = new BuildingData();
        data.defaultPos=this.defaultPos;
        data.position=this.position;
        data.isOpen=this.isOpen;
        data.quality=this.quality;
        if(this.equipdata){
            data.equipdata = new EquipmentData();
            data.equipdata.valueCopy(this.equipdata);
        }
        if(this.itemdata){
            data.itemdata = new ItemData();
            data.itemdata.valueCopy(this.itemdata);
        }
        data.price = this.price;
        data.shopType = this.shopType;
        data.isSaled = this.isSaled;
        data.maxHealth = this.maxHealth;
        data.currentHealth = this.currentHealth;
        data.generatorInterval = this.generatorInterval;
        data.generatorCount = this.generatorCount;
        data.generatorList = this.generatorList;
        data.interact = this.interact;
        data.rollover = this.rollover;
        return data;
    }
}
