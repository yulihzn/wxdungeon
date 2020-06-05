import PlayerData from "./PlayerData";
import RectDungeon from "../Rect/RectDungeon";
import BoxData from "./BoxData";
import ShopTableData from "./ShopTableData";
import ChestData from "./ChestData";
import EquipmentData from "./EquipmentData";
import ItemData from "./ItemData";
import TalentData from "./TalentData";

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
    rectDungeon: RectDungeon = new RectDungeon();
    //当前房间下标 默认1-1
    currentPos: cc.Vec3 = cc.v3(1,1);
    //根据下标保存普通箱子的位置
    boxes: { [key: string]: BoxData[] } = {};
    //根据下标保存商店状态
    shopTables: { [key: string]: ShopTableData[] } = {};
    //根据下标保存箱子信息
    chests:{[key:string]:ChestData[]} = {};
    //根据下标+uuid保存地上的装备
    equipments:{[key:string]:EquipmentData[]} = {};
    //根据下标+uuid报错地上的物品
    items:{[key:string]:ItemData[]}={};
    chapterIndex:number = 0;
    playerData:PlayerData = new PlayerData();
    //玩家装备列表
    playerEquipList:EquipmentData[] = new Array();
    //玩家物品列表
    playerItemList:ItemData[] = new Array();
    talentList:TalentData[] = new Array();
    level = 0;
    clearData(){
        cc.sys.localStorage.setItem('profileData','');
        this.chapterIndex = 0;
        this.playerData = new PlayerData();
        this.talentList = new Array();
        this.playerEquipList = new Array();
        this.playerItemList = new Array();
        this.rectDungeon = new RectDungeon();
        this.currentPos = cc.v3(1,1);
        this.boxes = {};
        this.shopTables = {};
        this.chests = {};
        this.equipments = {};
        this.items = {};
        this.level = 0;
    }
}