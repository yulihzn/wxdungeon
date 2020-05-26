import BoxData from "../Data/BoxData";
import ShopTableData from "../Data/ShopTableData";
import ChestData from "../Data/ChestData";
import EquipmentData from "../Data/EquipmentData";
import ItemData from "../Data/ItemData";
import ProfileData from "../Data/ProfileData";
import TalentData from "../Data/TalentData";

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
/**
 * 存档管理，挂载Logic节点的时候就读取存档
 */
@ccclass
export default class ProfileManager{
    data:ProfileData = new ProfileData();
    hasSaveData:boolean = false;
    constructor(){
        this.loadData();
    }
    private loadData(){
        //清空当前数据
        this.data = new ProfileData();
        //读取存档
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
        if(!data.playerData||!data.playerEquipList||!data.playerItemList||!data.rectDungeon||!data.currentPos||!data.shopTables
        ||!data.boxes||!data.chests||!data.equipments||!data.items||!data.talentList){
            this.hasSaveData = false;
            return;
        }
        this.hasSaveData = true;
        //玩家数据
        this.data.playerData.valueCopy(data.playerData);
        //章节名称
        this.data.chapterIndex = data.chapterIndex;
        this.data.level = data.level;
        //玩家装备列表
        for(let i =0;i<data.playerEquipList.length;i++){
            this.data.playerEquipList[i]=data.playerEquipList[i];
        }
        //玩家物品列表
        if(data.playerItemList){
            for(let i=0;i<data.playerItemList.length;i++){
                this.data.playerItemList[i]=data.playerItemList[i];
            }
        }
        //加载技能
        for(let i =0;i<data.talentList.length;i++){
            let td = new TalentData();
            td.valueCopy(data.talentList[i]);
            this.data.talentList.push(td);
        }
        //加载地图数据
        this.data.rectDungeon = this.data.rectDungeon.buildMapFromSave(data.rectDungeon);
        //加载当前位置
        this.data.currentPos = data.currentPos?cc.v3(data.currentPos.x,data.currentPos.y):cc.v3(0,0);
        //加载箱子
        for(let key in data.boxes){
           let list = data.boxes[key];
           this.data.boxes[key] = new Array();
           for(let i = 0;i < list.length;i++){
               let box = new BoxData();
               box.valueCopy(list[i]);
               this.data.boxes[key][i] = box;
           }
        }
        //加载商店
        for(let key in data.shopTables){
            let list = data.shopTables[key];
            this.data.shopTables[key] = new Array();
            for(let i = 0;i < list.length;i++){
                let tables = new ShopTableData();
                tables.valueCopy(list[i]);
                this.data.shopTables[key][i] = tables;
            }
         }
         //加载宝箱
         for(let key in data.chests){
            let list = data.chests[key];
            this.data.chests[key] = new Array();
            for(let i = 0;i < list.length;i++){
                let chest = new ChestData();
                chest.valueCopy(list[i]);
                this.data.chests[key][i] = chest;
            }
         }
         //加载地上装备
         for(let key in data.equipments){
            let list = data.equipments[key];
            this.data.equipments[key] = new Array();
            for(let i = 0;i < list.length;i++){
                let equip = new EquipmentData();
                equip.valueCopy(list[i]);
                this.data.equipments[key][i] = equip;
            }
         }
         //加载地上物品
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
