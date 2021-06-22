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
    static readonly INVENTORY_MAX = 30;
    public static readonly EMPTY = 'empty';
    public static readonly WEAPON = 'weapon';
    public static readonly REMOTE = 'remote';
    public static readonly SHIELD = 'shield';
    public static readonly CLOTHES = 'clothes';
    public static readonly HELMET = 'helmet';
    public static readonly CLOAK = 'cloak';
    public static readonly TROUSERS = 'trousers';
    public static readonly SHOES = 'shoes';
    public static readonly GLOVES = 'gloves';
    static readonly EQUIP_TAGS = [InventoryManager.WEAPON,InventoryManager.HELMET,InventoryManager.CLOTHES,InventoryManager.TROUSERS,InventoryManager.GLOVES
        ,InventoryManager.SHOES,InventoryManager.CLOAK,InventoryManager.SHIELD,InventoryManager.REMOTE];
    //buffer效果
    buffer:EquipmentData = new EquipmentData();
    itemList:ItemData[] = [];
    inventoryList:InventoryData[] = [];
    itemCoolDownList:NextStep[]=[];
    equips:{[key:string]:EquipmentData}={};
    suitMap: { [key: string]: SuitData } = {};
    suitEquipMap: { [key: string]: EquipmentData } = {};
    emptyEquipData = new EquipmentData();
    clear(): void {
    }
    constructor(){
        for(let name of InventoryManager.EQUIP_TAGS){
            this.equips[name]=new EquipmentData();
        }
        for(let i = 0;i <5;i++){
            let data = new ItemData();
            data.count = -1;
            this.itemList.push(data);
            this.itemCoolDownList.push(new NextStep());
        }
        this.suitMap = {};
        this.suitEquipMap = {};
    }
    getEquipBySuit(e:EquipmentData):EquipmentData{
        if(e&&this.suitEquipMap[e.suitType]){
            return this.suitEquipMap[e.suitType];
        }
        return this.emptyEquipData;
    }
    getTotalEquipData():EquipmentData{
        let e = new EquipmentData();
        for(let key in this.equips){
            e.Common.add(this.equips[key].Common);
        }
        e.Common.add(this.buffer.Common);
        for(let key in this.suitEquipMap){
            let equip = this.suitEquipMap[key];
            if(equip){
                e.Common.add(equip.Common);
            }
        }
        return e;
    }
}
