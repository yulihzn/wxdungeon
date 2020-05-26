import PlayerData from "./Data/PlayerData";
import { EventHelper } from "./EventHelper";
import EquipmentData from "./Data/EquipmentData";
import MapManager from "./Manager/MapManager";
import Dungeon from "./Dungeon";
import MonsterData from "./Data/MonsterData";
import StatusData from "./Data/StatusData";
import InventoryManager from "./Manager/InventoryManager";
import ProfileData from "./Data/ProfileData";
import BulletData from "./Data/BulletData";
import ItemData from "./Data/ItemData";
import Random from "./Utils/Random";
import TalentData from "./Data/TalentData";
import ProfileManager from "./Manager/ProfileManager";
import AudioPlayer from "./Utils/AudioPlayer";
import FromData from "./Data/FromData";
import WorldLoader from "./Map/WorldLoader";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Logic extends cc.Component {
    static readonly BOSS_LEVEL_1: number = 10;
    static readonly CHAPTER00: number = 0;
    static readonly CHAPTER01: number = 1;
    static readonly CHAPTER02: number = 2;
    static readonly CHAPTER03: number = 3;
    static readonly CHAPTER04: number = 4;
    static equipments: { [key: string]: EquipmentData } = null;
    static equipmentNameList:string[] = [];
    static itemNameList:string[] = [];
    //怪物json
    static monsters: { [key: string]: MonsterData } = null;
    //图片资源
    static spriteFrames: { [key: string]: cc.SpriteFrame } = null;
    //状态json
    static debuffs: { [key: string]: StatusData } = null;
    //子弹json
    static bullets: { [key: string]: BulletData } = null;
    //物品json
    static items: { [key: string]: ItemData } = null;

    static level = 0;
    static chapterIndex = 0;

    static playerData: PlayerData = new PlayerData();
    static inventoryManager: InventoryManager = new InventoryManager();

    static talentList:TalentData[] = new Array();
    static hasTalentMap: { [key: number]: boolean } = {};
    static isPickedTalent = false;

    static mapManager: MapManager = new MapManager();
    static worldLoader: WorldLoader = new WorldLoader();
    static coins = 0;//金币
    static oilGolds = 0;//油金
    static ammo = 30;//子弹
    static killCount = 0;//杀敌数
    static time = '00:00:00';
    static seed = 5;
    static isFirst = 0;
    static isCheatMode = false;//作弊
    static isDebug = false;//调试
    static dieFrom:FromData = new FromData();
    static isMapReset = false;

    static profileManager:ProfileManager = new ProfileManager();

    onLoad() {
        //关闭调试
        // cc.director.setDisplayStats(false);
        cc.game.setFrameRate(60);
        cc.game.addPersistRootNode(this.node);
        // cc.view.enableAntiAlias(false);
        // cc.macro.DOWNLOAD_MAX_CONCURRENT = 10;
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        // manager.enabledDebugDraw = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit;
        cc.director.on(EventHelper.LOADINGNEXTLEVEL, (event) => {
            this.loadingNextLevel();
        });
        cc.director.on(EventHelper.LOADINGROOM, (event) => {
            this.loadingNextRoom(event.detail.dir);
        });
    }

    start() {
       
    }
    static saveData(){
        Logic.profileManager.data.playerData = Logic.playerData.clone();
        Logic.profileManager.data.playerEquipList = Logic.inventoryManager.list;
        Logic.profileManager.data.playerItemList = Logic.inventoryManager.itemList;
        Logic.profileManager.data.rectDungeon = Logic.mapManager.rectDungeon;
        Logic.profileManager.saveData();
        cc.sys.localStorage.setItem("coin",Logic.coins);
        cc.sys.localStorage.setItem("oilgold",Logic.oilGolds);
    }
    static resetData(chapter?:number) {
        //重置时间
        Logic.time = '00:00:00';
        //加载章节名
        Logic.profileManager.data.chapterIndex = chapter?chapter:Logic.profileManager.data.chapterIndex;
        Logic.chapterIndex = Logic.profileManager.data.chapterIndex;
        //加载关卡等级
        Logic.level = Logic.profileManager.data.level;
        //加载玩家数据
        Logic.playerData = Logic.profileManager.data.playerData.clone();
        //加载装备
        Logic.inventoryManager = new InventoryManager();
        for(let i =0;i<Logic.profileManager.data.playerEquipList.length;i++){
            Logic.inventoryManager.list[i].valueCopy(Logic.profileManager.data.playerEquipList[i]);
        }
        for(let i =0;i<Logic.profileManager.data.playerItemList.length;i++){
            Logic.inventoryManager.itemList[i].valueCopy(Logic.profileManager.data.playerItemList[i]);
        }
        //加载技能列表
        Logic.talentList = Logic.profileManager.data.talentList;
        Logic.initTalentMap();
        //加载子弹
        Logic.ammo = Logic.profileManager.data.ammo;
        //设置地图重置状态在loading完成处理地图
        Logic.isMapReset = true;
        //重置地牢宽高
        Dungeon.WIDTH_SIZE = 15;
        Dungeon.HEIGHT_SIZE = 9;
        //加载金币
        let c = cc.sys.localStorage.getItem('coin');
        Logic.coins = c ? parseInt(c) : 0;
        let o = cc.sys.localStorage.getItem('oilgold');
        Logic.oilGolds = o ? parseInt(o) : 0;
        //重置技能选择状态
        Logic.isPickedTalent = false;
    }
    private static initTalentMap() {
        Logic.hasTalentMap = {};
        for (let t of Logic.talentList) {
            Logic.hasTalentMap[t.id] = true;
        }
    }
    static addTalent(id: number) :boolean{
        let data = new TalentData();
        data.id = id;
        let hasit = false;
        for (let t of Logic.talentList) {
            if(id == t.id){
                hasit = true;
            }
        }
        if(!hasit){
            Logic.talentList.push(data);
            Logic.hasTalentMap[data.id] = true;
            Logic.isPickedTalent = true;
            return true;
        }
        return false;
    }
    static hashTalent(id: number): boolean {
        return Logic.hasTalentMap[id]&&Logic.hasTalentMap[id]==true;
    }
    
    static changeDungeonSize() {
        let size = Logic.mapManager.getCurrentMapSize();
        if (size) {
            Dungeon.WIDTH_SIZE = size.x;
            Dungeon.HEIGHT_SIZE = size.y;
        }
    }
    private loadingNextRoom(dir: number) {
        let room = Logic.mapManager.loadingNextRoom(dir);
        if (room) {
            Logic.changeDungeonSize();
            switch (dir) {
                case 0: Logic.playerData.pos = cc.v3(Math.round(Dungeon.WIDTH_SIZE / 2 - 1), 0); break;
                case 1: Logic.playerData.pos = cc.v3(Math.round(Dungeon.WIDTH_SIZE / 2 - 1), Dungeon.HEIGHT_SIZE - 1); break;
                case 2: Logic.playerData.pos = cc.v3(Dungeon.WIDTH_SIZE - 1, Math.round(Dungeon.HEIGHT_SIZE / 2 - 1)); break;
                case 3: Logic.playerData.pos = cc.v3(0, Math.round(Dungeon.HEIGHT_SIZE / 2 - 1)); break;
            }
            cc.director.loadScene('loading');
            
        }
    }
    private loadingNextLevel() {
        Logic.level++;
        //层数读取章节关卡列表
        if (Logic.level > Logic.worldLoader.getChapterData(Logic.chapterIndex).list.length-1 && Logic.chapterIndex >= Logic.CHAPTER04) {
            Logic.profileManager.clearData();
            cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.SHOOT}});
            cc.director.loadScene('gamefinish')
        } else {
            if(Logic.chapterIndex < Logic.CHAPTER04 && Logic.level > Logic.worldLoader.getChapterData(Logic.chapterIndex).list.length-1){
                Logic.profileManager.data.chapterIndex++;
                Logic.chapterIndex++;
                Logic.level = 1;
            }
            Logic.mapManager.reset(Logic.worldLoader.getRandomLevelData(Logic.chapterIndex,Logic.level));
            Logic.profileManager.data.currentPos = Logic.mapManager.currentPos.clone();
            Logic.profileManager.data.rectDungeon = Logic.mapManager.rectDungeon;
            
            Logic.changeDungeonSize();
            Logic.playerData.pos = cc.v3(Math.round(Dungeon.WIDTH_SIZE / 2 - 1), Math.round(Dungeon.HEIGHT_SIZE / 2 - 1));
            Logic.isPickedTalent = false;
            cc.director.loadScene('loading');
        }
    }
    
    static getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Random.rand() * (max - min));
    }
    static getHalfChance(): boolean {
        return Random.rand() > 0.5;
    }
    static getChance(rate:number):boolean{
        return Logic.getRandomNum(0, 100) < rate;
    }
    static getDistance(v1, v2) {
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;
        return Math.sqrt(x * x + y * y);
    }
    static lerp(a, b, r) {
        return a + (b - a) * r;
    };
    static genNonDuplicateID():string{
        return Number(Random.rand().toString().substr(3,16) + Date.now()).toString(36);
      }
    /**随机装备名字 */
    static getRandomEquipType():string{
        return Logic.equipmentNameList[Random.getRandomNum(1,Logic.equipmentNameList.length-1)];
    }
    /**随机可拾取物品 */
    static getRandomItemType():string{
        return Logic.itemNameList[Random.getRandomNum(1,Logic.itemNameList.length-1)];
    }
}
