import EquipmentData from "../Data/EquipmentData";
import InventoryData from "../Data/InventoryData";
import ItemData from "../Data/ItemData";
import SuitData from "../Data/SuitData";
import NextStep from "../Utils/NextStep";

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
    weapon:EquipmentData = new EquipmentData();
    remote:EquipmentData = new EquipmentData();
    helmet:EquipmentData = new EquipmentData();
    clothes:EquipmentData = new EquipmentData();
    trousers:EquipmentData = new EquipmentData();
    gloves:EquipmentData = new EquipmentData();
    shoes:EquipmentData = new EquipmentData();
    cloak:EquipmentData = new EquipmentData();
    shield:EquipmentData = new EquipmentData();
    //buffer效果
    buffer:EquipmentData = new EquipmentData();
    equipList:EquipmentData[] = [];
    itemList:ItemData[] = [];
    inventoryList:InventoryData[] = [];
    itemCoolDownList:NextStep[]=[];
    suitMap: { [key: string]: SuitData } = {};
    
    clear(): void {
    }
    constructor(){
        this.equipList = [this.weapon,this.helmet,this.clothes,this.trousers,this.gloves,this.shoes,this.cloak,this.shield,this.buffer,this.remote];
        for(let i = 0;i <5;i++){
            let data = new ItemData();
            data.count = -1;
            this.itemList.push(data);
            this.itemCoolDownList.push(new NextStep());
        }
        this.suitMap = {};
    }
    getTotalEquipmentData():EquipmentData{
        let e = new EquipmentData();
        e.Common.add(this.weapon.Common)
        .add(this.helmet.Common)
        .add(this.trousers.Common)
        .add(this.gloves.Common)
        .add(this.shield.Common)
        .add(this.shoes.Common)
        .add(this.remote.Common)
        .add(this.clothes.Common)
        .add(this.cloak.Common)
        .add(this.buffer.Common);
        for(let key in this.suitMap){
            let suit = this.suitMap[key];
            if(suit){
                for(let i = 0;i<suit.count-1;i++){
                    e.Common.add(suit.CommonList[i]);
                }
            }
        }
        return e;
    }
}
