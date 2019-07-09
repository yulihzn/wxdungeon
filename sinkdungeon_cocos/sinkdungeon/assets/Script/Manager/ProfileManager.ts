import BoxData from "../Data/BoxData";
import ShopTableData from "../Data/ShopTableData";
import ChestData from "../Data/ChestData";
import EquipmentData from "../Data/EquipmentData";
import ItemData from "../Data/ItemData";
import ProfileData from "../Data/ProfileData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ProfileManager{
    data:ProfileData = null;
    hasSaveData:boolean = false;
    constructor(){
        this.init();
    }
    init(){
        this.data = new ProfileData();
        this.loadProfile();
    }
   
    getSaveData():ProfileData{
        let s = cc.sys.localStorage.getItem('data');
        if(s){
            return JSON.parse(s);
        }
        return null;
    }
    saveData(){
        cc.sys.localStorage.setItem('data',JSON.stringify(this.data));
        console.log('save data');
    }
    clearData(){
        cc.sys.localStorage.setItem('data','');
        this.hasSaveData = false;
        this.data.clearData();
        console.log('clear data');
    }
    
    loadProfile(){
        let data = this.getSaveData();
        if(!data){
            this.hasSaveData = false;
            return;
        }
        if(!data.playerData||!data.inventoryManager||!data.rectDungeon||!data.currentPos||!data.shopTables
        ||!data.boxes||!data.chests||!data.equipments||!data.items||!data.talentList){
            this.hasSaveData = false;
            return;
        }
        this.hasSaveData = true;
        this.data.playerData.valueCopy(data.playerData);
        this.data.chapterName = data.chapterName;
        for(let i =0;i<data.inventoryManager.list.length;i++){
            this.data.inventoryManager.list[i].valueCopy(data.inventoryManager.list[i]);
        }
        // for(let i =0;i<data.talentList.length;i++){
        //     this.talentList[i].valueCopy(data.talentList[i]);
        // }
        this.data.rectDungeon = this.data.rectDungeon.buildMapFromSave(data.rectDungeon);
        this.data.currentPos = data.currentPos?cc.v2(data.currentPos.x,data.currentPos.y):cc.v2(0,0);
        for(let key in data.boxes){
           let list = data.boxes[key];
           this.data.boxes[key] = new Array();
           for(let i = 0;i < list.length;i++){
               let box = new BoxData();
               box.valueCopy(list[i]);
               this.data.boxes[key][i] = box;
           }
        }
        for(let key in data.shopTables){
            let list = data.shopTables[key];
            this.data.shopTables[key] = new Array();
            for(let i = 0;i < list.length;i++){
                let tables = new ShopTableData();
                tables.valueCopy(list[i]);
                this.data.shopTables[key][i] = tables;
            }
         }

         for(let key in data.chests){
            let list = data.chests[key];
            this.data.chests[key] = new Array();
            for(let i = 0;i < list.length;i++){
                let chest = new ChestData();
                chest.valueCopy(list[i]);
                this.data.chests[key][i] = chest;
            }
         }
        
         for(let key in data.equipments){
            let list = data.equipments[key];
            this.data.equipments[key] = new Array();
            for(let i = 0;i < list.length;i++){
                let equip = new EquipmentData();
                equip.valueCopy(list[i]);
                this.data.equipments[key][i] = equip;
            }
         }

         for(let key in data.items){
            let list = data.items[key];
            this.data.items[key] = new Array();
            for(let i = 0;i < list.length;i++){
                let item = new ItemData();
                item.valueCopy(list[i]);
                this.data.items[key][i] = item;
            }
         }
        console.log('data',this);
        
    }
}
