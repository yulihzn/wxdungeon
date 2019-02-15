import PlayerData from "./PlayerData";
import InventoryManager from "../Manager/InventoryManager";
import RectDungeon from "../Rect/RectDungeon";
import RectRoom from "../Rect/RectRoom";
import BoxData from "./BoxData";
import ShopTableData from "./ShopTableData";
import MonsterData from "./MonsterData";
import ChestData from "./ChestData";
import EquipmentData from "./EquipmentData";

/**存档保存数据
 * 玩家的属性 目前血量 攻防抗性等 位置
 * 玩家的装备信息
 * 玩家的物品信息
 * 玩家的状态信息 保留永久状态 长时间状态
 * 当前的关卡 章节 当前关卡的地图数据
 * 目前房间的位置 地上道具建筑的位置和属性
 * 商店的购买状态
 * 每次进入一个房间的时候进行一次存档，保存当前房间内容
 */
export default class ProfileData {
    //地图数据管理类
    rectDungeon: RectDungeon = new RectDungeon(0);
    //当前房间下标
    currentPos: cc.Vec2 = cc.v2(0,0);
    //根据下标保存普通箱子的位置
    boxes: { [key: string]: BoxData[] } = {};
    //根据下标保存商店状态
    shopTables: { [key: string]: ShopTableData[] } = {};
    //根据下标保存箱子信息
    chests:{[key:string]:ChestData[]} = {};
    //根据下标+uuid保存地上的装备
    equipments:{[key:string]:EquipmentData[]} = {};
    chapterName:number = 0;
    hasSaveData:boolean = false;
    playerData:PlayerData = new PlayerData();
    inventoryManager: InventoryManager = new InventoryManager();
    ammo = 30;//子弹
    level = 0;
    constructor(){
        this.loadProfile();
    }
    saveData(){
        cc.sys.localStorage.setItem('profileData',JSON.stringify(this));
        console.log('save data');
    }
    clearData(){
        cc.sys.localStorage.setItem('profileData','');
        this.chapterName = 0;
        this.playerData = new PlayerData();
        this.inventoryManager = new InventoryManager();
        this.rectDungeon = new RectDungeon(0);
        this.currentPos = cc.v2(0,0);
        this.boxes = {};
        this.shopTables = {};
        this.chests = {};
        this.equipments = {};
        this.hasSaveData = false;
        this.ammo = 30;
        this.level = 0;
        console.log('clear data');
    }
    getSaveData():ProfileData{
        let s = cc.sys.localStorage.getItem('profileData');
        if(s){
            return JSON.parse(s);
        }
        return null;
    }
    loadProfile(){
        let data = this.getSaveData();
        if(!data){
            this.hasSaveData = false;
            return;
        }
        if(!data.playerData||!data.inventoryManager||!data.rectDungeon||!data.currentPos||!data.shopTables
        ||!data.boxes||!data.chests||!data.equipments){
            this.hasSaveData = false;
            return;
        }
        this.hasSaveData = true;
        this.playerData.valueCopy(data.playerData);
        this.chapterName = data.chapterName;
        for(let i =0;i<data.inventoryManager.list.length;i++){
            this.inventoryManager.list[i].valueCopy(data.inventoryManager.list[i]);
        }
        this.rectDungeon = this.rectDungeon.buildMapFromSave(data.rectDungeon);
        this.currentPos = data.currentPos?cc.v2(data.currentPos.x,data.currentPos.y):cc.v2(0,0);
        for(let key in data.boxes){
           let list = data.boxes[key];
           this.boxes[key] = new Array();
           for(let i = 0;i < list.length;i++){
               let box = new BoxData();
               box.valueCopy(list[i]);
               this.boxes[key][i] = box;
           }
        }
        for(let key in data.shopTables){
            let list = data.shopTables[key];
            this.shopTables[key] = new Array();
            for(let i = 0;i < list.length;i++){
                let tables = new ShopTableData();
                tables.valueCopy(list[i]);
                this.shopTables[key][i] = tables;
            }
         }

         for(let key in data.chests){
            let list = data.chests[key];
            this.chests[key] = new Array();
            for(let i = 0;i < list.length;i++){
                let chest = new ChestData();
                chest.valueCopy(list[i]);
                this.chests[key][i] = chest;
            }
         }
        
         for(let key in data.equipments){
            let list = data.equipments[key];
            this.equipments[key] = new Array();
            for(let i = 0;i < list.length;i++){
                let equip = new EquipmentData();
                equip.valueCopy(list[i]);
                this.equipments[key][i] = equip;
            }
         }
        console.log('profileData',this);
        
    }
}