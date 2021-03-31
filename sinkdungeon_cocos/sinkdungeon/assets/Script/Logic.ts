import PlayerData from "./Data/PlayerData";
import EquipmentData from "./Data/EquipmentData";
import MapManager from "./Manager/MapManager";
import Dungeon from "./Dungeon";
import MonsterData from "./Data/MonsterData";
import StatusData from "./Data/StatusData";
import InventoryManager from "./Manager/InventoryManager";
import BulletData from "./Data/BulletData";
import ItemData from "./Data/ItemData";
import Random from "./Utils/Random";
import TalentData from "./Data/TalentData";
import ProfileManager from "./Manager/ProfileManager";
import AudioPlayer from "./Utils/AudioPlayer";
import FromData from "./Data/FromData";
import WorldLoader from "./Map/WorldLoader";
import ProfessionData from "./Data/ProfessionData";
import Random4Save from "./Utils/Random4Save";
import ExitData from "./Data/ExitData";
import Settings from "./Model/Settings";
import LocalStorage from "./Utils/LocalStorage";
import SavePointData from "./Data/SavePointData";

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
    static readonly CHAPTER05: number = 5;
    static readonly CHAPTER099: number = 99;
    static equipments: { [key: string]: EquipmentData } = null;
    static equipmentNameList: string[] = [];
    static itemNameList: string[] = [];
    static goodsNameList: string[] = [];
    //怪物json
    static monsters: { [key: string]: MonsterData } = null;
    //npc json
    static nonplayers: { [key: string]: MonsterData } = null;
    //图片资源
    static spriteFrames: { [key: string]: cc.SpriteFrame } = null;
    //状态json
    static debuffs: { [key: string]: StatusData } = null;
    //子弹json
    static bullets: { [key: string]: BulletData } = null;
    //物品json
    static items: { [key: string]: ItemData } = null;
    //技能json
    static talents: { [key: string]: TalentData } = null;
    //职业json
    static professionList: ProfessionData[] = [];
    //建筑资源
    static buildings: { [key: string]: cc.Prefab } = null;

    static level = 0;
    static chapterIndex = 0;
    static playerData: PlayerData = new PlayerData();
    static inventoryManager: InventoryManager = new InventoryManager();

    static talentList: TalentData[] = new Array();
    static hasTalentMap: { [key: string]: boolean } = {};

    static mapManager: MapManager = new MapManager();
    static worldLoader: WorldLoader = new WorldLoader();
    static coins = 0;//金币
    static oilGolds = 0;//油金
    static killCount = 0;//杀敌数
    static coinDreamCount = 0;//金币累加数
    static time = '00:00:00';
    static seed = 5;
    static isFirst = 0;
    static jumpChapter = 0;
    static shipTransportScene = 0;
    static isCheatMode = false;//作弊
    static isDebug = false;//调试
    static isTour = false;//游览
    static isDialogShow = false;
    static dieFrom: FromData = new FromData();
    static isMapReset = false;
    static lastBgmIndex = 0;
    static savePoinitData: SavePointData = new SavePointData();

    static profileManager: ProfileManager = new ProfileManager();

    static settings: Settings = new Settings();

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
    }

    start() {

    }
    static saveData() {
        Logic.profileManager.data.playerData = Logic.playerData.clone();
        Logic.profileManager.data.playerEquipList = Logic.inventoryManager.list;
        Logic.profileManager.data.playerItemList = Logic.inventoryManager.itemList;
        Logic.profileManager.data.rectDungeons[Logic.mapManager.rectDungeon.id] = Logic.mapManager.rectDungeon;
        Logic.profileManager.data.level = Logic.level;
        Logic.profileManager.data.chapterIndex = Logic.chapterIndex;
        Logic.profileManager.data.time = Logic.time;
        Logic.profileManager.data.savePointData = Logic.savePoinitData.clone();
        Logic.profileManager.saveData();
        LocalStorage.saveData(LocalStorage.KEY_COIN, Logic.coins);
        LocalStorage.saveData(LocalStorage.KEY_COIN_DREAM_COUNT, Logic.coinDreamCount);
        LocalStorage.saveData(LocalStorage.KEY_OIL_GOLD, Logic.oilGolds);
    }
    static resetData(chapter?: number) {
        //重置时间
        Logic.time = Logic.profileManager.data.time;
        //加载章节名
        Logic.profileManager.data.chapterIndex = chapter ? chapter : Logic.profileManager.data.chapterIndex;
        //加载关卡等级
        Logic.chapterIndex = Logic.profileManager.data.chapterIndex;
        Logic.level = Logic.profileManager.data.level;
        //加载最近使用的存档点
        Logic.savePoinitData = Logic.profileManager.data.savePointData.clone();
        //加载玩家数据
        Logic.playerData = Logic.profileManager.data.playerData.clone();
        //加载装备
        Logic.inventoryManager = new InventoryManager();
        for (let i = 0; i < Logic.profileManager.data.playerEquipList.length; i++) {
            Logic.inventoryManager.list[i].valueCopy(Logic.profileManager.data.playerEquipList[i]);
        }
        for (let i = 0; i < Logic.profileManager.data.playerItemList.length; i++) {
            Logic.inventoryManager.itemList[i].valueCopy(Logic.profileManager.data.playerItemList[i]);
        }
        //加载技能列表
        Logic.talentList = Logic.profileManager.data.talentList;
        Logic.initTalentMap();
        //设置地图重置状态在loading完成处理地图
        Logic.isMapReset = true;
        //重置地牢宽高
        Dungeon.WIDTH_SIZE = 15;
        Dungeon.HEIGHT_SIZE = 9;
        //加载金币
        let c = LocalStorage.getValueFromData(LocalStorage.KEY_COIN);
        Logic.coins = c ? parseInt(c) : 0;
        let c1 = LocalStorage.getValueFromData(LocalStorage.KEY_COIN_DREAM_COUNT);
        Logic.coinDreamCount = c1 ? parseInt(c1) : 0;
        let o = LocalStorage.getValueFromData(LocalStorage.KEY_OIL_GOLD);
        Logic.oilGolds = o ? parseInt(o) : 0;
        //重置bgm
        Logic.lastBgmIndex = -1;
    }
    private static initTalentMap() {
        Logic.hasTalentMap = {};
        for (let t of Logic.talentList) {
            Logic.hasTalentMap[t.resName] = true;
        }
    }
    static addTalent(resName: string): boolean {
        let data = new TalentData();
        data.resName = resName;
        let hasit = false;
        for (let t of Logic.talentList) {
            if (resName == t.resName) {
                hasit = true;
            }
        }
        if (!hasit) {
            Logic.talentList.push(data);
            Logic.hasTalentMap[data.resName] = true;
            return true;
        }
        return false;
    }
    static hashTalent(resName: string): boolean {
        return Logic.hasTalentMap[resName] && Logic.hasTalentMap[resName] == true;
    }

    static changeDungeonSize() {
        let size = Logic.mapManager.getCurrentMapSize();
        if (size) {
            Dungeon.WIDTH_SIZE = size.x;
            Dungeon.HEIGHT_SIZE = size.y;
        }
    }
    static savePonit(pos: cc.Vec3) {
        //99chapter存档点无效
        if (Logic.chapterIndex == Logic.CHAPTER099) {
            return;
        }
        let savePointData = new SavePointData();
        //转换当前坐标为地图坐标
        let levelData = Logic.worldLoader.getCurrentLevelData();
        let roomPos = Logic.mapManager.rectDungeon.currentPos;
        let mapPos = cc.v3(0, 0);
        mapPos.x = levelData.roomWidth * roomPos.x + pos.x;
        mapPos.y = levelData.height * levelData.roomHeight - 1 - levelData.roomWidth * roomPos.y - pos.y;
        savePointData.x = mapPos.x;
        savePointData.y = mapPos.y;
        savePointData.level = Logic.level;
        savePointData.chapter = Logic.chapterIndex;
        Logic.savePoinitData.valueCopy(savePointData);
        //保存数据
        Logic.saveData();
    }
    static loadingNextRoom(dir: number) {
        Logic.mapManager.rand4save = null;
        //保存数据
        Logic.saveData();
        AudioPlayer.play(AudioPlayer.EXIT);
        let room = Logic.mapManager.loadingNextRoom(dir);
        if (room) {
            Logic.changeDungeonSize();
            switch (dir) {
                case 0: Logic.playerData.pos = cc.v3(Logic.playerData.pos.x, 1); break;
                case 1: Logic.playerData.pos = cc.v3(Logic.playerData.pos.x, Dungeon.HEIGHT_SIZE - 2); break;
                case 2: Logic.playerData.pos = cc.v3(Dungeon.WIDTH_SIZE - 2, Logic.playerData.pos.y); break;
                case 3: Logic.playerData.pos = cc.v3(1, Logic.playerData.pos.y); break;
            }
            cc.director.loadScene('loading');
        }
    }
    static loadingNextLevel(exitData: ExitData) {
        if (!exitData) {
            return;
        }
        //如果地图不存在停止加载
        let levelData = Logic.worldLoader.getLevelData(exitData.toChapter, exitData.toLevel);
        if (!levelData) {
            return;
        }
        //如果是从梦境进入现实或者跨章节需要调整当前章节已经清理的房间为重生状态并保存
        if (exitData.fromChapter != Logic.CHAPTER099 && exitData.fromChapter != exitData.toChapter) {
            Logic.mapManager.rectDungeon.changeAllClearRoomsReborn();
        }
        Logic.saveData();
        /**************加载exitData关卡数据***************** */
        Logic.chapterIndex = exitData.toChapter;
        Logic.level = exitData.toLevel;
        //地图数据的y轴向下的
        let ty = levelData.height * levelData.roomHeight - 1 - exitData.toPos.y;
        let roomX = Math.floor(exitData.toPos.x / levelData.roomWidth);
        let roomY = Math.floor(ty / levelData.roomHeight);
        Logic.playerData.pos = cc.v3(exitData.toPos.x % levelData.roomWidth, ty % levelData.roomHeight);
        Logic.mapManager.reset(cc.v3(roomX, roomY));
        Logic.changeDungeonSize();
        Logic.lastBgmIndex = -1;
        if (exitData.fromChapter == Logic.CHAPTER00 && Logic.chapterIndex == Logic.CHAPTER01) {
            Logic.shipTransportScene = 1;
        } else if (exitData.fromChapter == Logic.CHAPTER02 && Logic.chapterIndex == Logic.CHAPTER01) {
            Logic.shipTransportScene = 2;
        } else if (exitData.fromChapter == Logic.CHAPTER01 && Logic.chapterIndex == Logic.CHAPTER00) {
            Logic.shipTransportScene = 2;
        } else if (exitData.fromChapter == Logic.CHAPTER01 && Logic.chapterIndex == Logic.CHAPTER02) {
            Logic.shipTransportScene = 1;
        }
        cc.director.loadScene('loading');
    }

    static getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Random.rand() * (max - min));
    }
    static getHalfChance(): boolean {
        return Random.rand() > 0.5;
    }
    static getChance(rate: number): boolean {
        return Logic.getRandomNum(0, 100) < rate;
    }
    static getDistance(v1, v2) {
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;
        return Math.sqrt(x * x + y * y);
    }
    static lerp(a: number, b: number, r: number): number {
        return a + (b - a) * r;
    };
    static genNonDuplicateID(): string {
        return Number(Random.rand().toString().substr(3, 16) + Date.now()).toString(36);
    }
    /**随机装备名字 */
    static getRandomEquipType(rand4save: Random4Save): string {
        return Logic.equipmentNameList[rand4save.getRandomNum(1, Logic.equipmentNameList.length - 1)];
    }
    /**随机可拾取物品 */
    static getRandomItemType(rand4save: Random4Save): string {
        return Logic.itemNameList[rand4save.getRandomNum(1, Logic.itemNameList.length - 1)];
    }
    static spriteFrameRes(spriteFrameName: string) {
        return Logic.spriteFrames[spriteFrameName] ? Logic.spriteFrames[spriteFrameName] : null;
    }
    static getBuildings(name: string): cc.Prefab {
        return Logic.buildings[name];
    }
}
