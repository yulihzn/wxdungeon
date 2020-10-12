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
    //职业json
    static professionList: ProfessionData[] = [];

    static level = 0;
    static chapterIndex = 0;
    static realLevel = 0;//真实世界层级
    static lastLevel = 0;//上次层级
    static lastChapterIndex = 0;//上次章节
    static playerData: PlayerData = new PlayerData();
    static inventoryManager: InventoryManager = new InventoryManager();

    static talentList: TalentData[] = new Array();
    static hasTalentMap: { [key: number]: boolean } = {};
    static isPickedTalent = false;

    static mapManager: MapManager = new MapManager();
    static worldLoader: WorldLoader = new WorldLoader();
    static coins = 0;//金币
    static oilGolds = 0;//油金
    static killCount = 0;//杀敌数
    static time = '00:00:00';
    static seed = 5;
    static isFirst = 0;
    static isCheatMode = false;//作弊
    static isDebug = false;//调试
    static dieFrom: FromData = new FromData();
    static isMapReset = false;
    static lastBgmIndex = 0;

    static profileManager: ProfileManager = new ProfileManager();

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
        Logic.profileManager.data.realLevel = Logic.realLevel;
        Logic.profileManager.data.lastLevel = Logic.lastLevel;
        Logic.profileManager.data.lastChapterIndex = Logic.lastChapterIndex;
        Logic.profileManager.data.chapterIndex = Logic.chapterIndex;
        Logic.profileManager.saveData();
        cc.sys.localStorage.setItem("coin", Logic.coins);
        cc.sys.localStorage.setItem("oilgold", Logic.oilGolds);
    }
    static resetData(chapter?: number) {
        //重置时间
        Logic.time = '00:00:00';
        //加载章节名
        Logic.profileManager.data.chapterIndex = chapter ? chapter : Logic.profileManager.data.chapterIndex;
        //加载关卡等级
        Logic.chapterIndex = Logic.profileManager.data.chapterIndex;
        Logic.level = Logic.profileManager.data.level;
        Logic.realLevel = Logic.profileManager.data.realLevel;
        Logic.lastLevel = Logic.profileManager.data.lastLevel;
        Logic.lastChapterIndex = Logic.profileManager.data.lastChapterIndex;
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
        let c = cc.sys.localStorage.getItem('coin');
        Logic.coins = c ? parseInt(c) : 0;
        let o = cc.sys.localStorage.getItem('oilgold');
        Logic.oilGolds = o ? parseInt(o) : 0;
        //重置技能选择状态
        Logic.isPickedTalent = false;
        //重置bgm
        Logic.lastBgmIndex = -1;
    }
    private static initTalentMap() {
        Logic.hasTalentMap = {};
        for (let t of Logic.talentList) {
            Logic.hasTalentMap[t.id] = true;
        }
    }
    static addTalent(id: number): boolean {
        let data = new TalentData();
        data.id = id;
        let hasit = false;
        for (let t of Logic.talentList) {
            if (id == t.id) {
                hasit = true;
            }
        }
        if (!hasit) {
            Logic.talentList.push(data);
            Logic.hasTalentMap[data.id] = true;
            Logic.isPickedTalent = true;
            return true;
        }
        return false;
    }
    static hashTalent(id: number): boolean {
        return Logic.hasTalentMap[id] && Logic.hasTalentMap[id] == true;
    }

    static changeDungeonSize() {
        let size = Logic.mapManager.getCurrentMapSize();
        if (size) {
            Dungeon.WIDTH_SIZE = size.x;
            Dungeon.HEIGHT_SIZE = size.y;
        }
    }
    static loadingNextRoom(dir: number) {
        Logic.mapManager.setCurrentRoomExitPos(Logic.playerData.pos);
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
    static loadingNextLevel(isGoReal:boolean,isBackDream:boolean,needSave:boolean,exitData?:ExitData) {
        
        //如果地图不存在停止加载
        if(exitData&&!isGoReal&&!isBackDream){
            let data = Logic.worldLoader.getLevelData(exitData.toChapter,exitData.toLevel);
            if(!data){
                return;
            }
        }
        if(Logic.playerData){
            Logic.mapManager.setCurrentRoomExitPos(Logic.playerData.pos);
        }
        //保存数据
        if(needSave){
            Logic.saveData();
        }
        
        if(isGoReal){
            //保存当前关卡等级
            Logic.lastLevel = Logic.level;
            Logic.lastChapterIndex = Logic.chapterIndex;
            Logic.level = Logic.realLevel;
            Logic.chapterIndex = 99;
        }
        if(isBackDream){
            Logic.realLevel = Logic.level;
            Logic.level = Logic.lastLevel;
            Logic.chapterIndex = Logic.lastChapterIndex;
        }
        
        // let levelLength = Logic.worldLoader.getChapterData(Logic.chapterIndex).list.length;
        // let chapterLength = Logic.worldLoader.getChapterLength();
        //如果关卡到底了判断是否是最后一章游戏完成
        // if (Logic.level > levelLength - 1 && Logic.chapterIndex >= chapterLength - 1) {
        //     Logic.profileManager.clearData();
        //     cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.SHOOT } });
        //     cc.director.loadScene('gamefinish');
        //     return;
        // }
        // if (Logic.level > levelLength - 1 && Logic.chapterIndex < chapterLength - 1&&!isGoReal&&!isBackDream) {
        //     Logic.chapterIndex++;
        //     Logic.level = 0;
        // }
        // if (Logic.level < 0 && Logic.chapterIndex > 0&&!isGoReal&&!isBackDream) {
        //     Logic.chapterIndex--;
        //     let length = Logic.worldLoader.getChapterData(Logic.chapterIndex).list.length;
        //     Logic.level = length - 1;
        // }
        let indexPos = cc.v3(Math.floor(Dungeon.WIDTH_SIZE / 2), Math.floor(Dungeon.HEIGHT_SIZE / 2));
        if(exitData&&!isBackDream){
            Logic.chapterIndex = exitData.toChapter;
            Logic.level = exitData.toLevel;
            let data = Logic.worldLoader.getLevelData(exitData.toChapter,exitData.toLevel);
            let ty = data.height*data.roomHeight-1-exitData.toPos.y;
            let roomX = Math.floor(exitData.toPos.x/data.roomWidth);
            let roomY = Math.floor(ty/data.roomHeight);
            indexPos = cc.v3(exitData.toPos.x%data.roomWidth,ty%data.roomHeight);
            Logic.mapManager.reset(cc.v3(roomX,roomY));
        }else{
            Logic.mapManager.reset();
        }
        Logic.changeDungeonSize();
        let exitPos = Logic.mapManager.getCurrentRoom().exitPos;
        if(exitData&&!isBackDream){
            Logic.playerData.pos = indexPos;
        }else if(exitPos.x!=-1&&exitPos.y!=-1){
            Logic.playerData.pos = exitPos;
        }
        //暂时不选择技能
        Logic.isPickedTalent = true;
        Logic.lastBgmIndex = -1;
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
    static lerp(a, b, r) {
        return a + (b - a) * r;
    };
    static genNonDuplicateID(): string {
        return Number(Random.rand().toString().substr(3, 16) + Date.now()).toString(36);
    }
    /**随机装备名字 */
    static getRandomEquipType(rand4save:Random4Save): string {
        return Logic.equipmentNameList[rand4save.getRandomNum(1, Logic.equipmentNameList.length - 1)];
    }
    /**随机可拾取物品 */
    static getRandomItemType(rand4save:Random4Save): string {
        return Logic.itemNameList[rand4save.getRandomNum(1, Logic.itemNameList.length - 1)];
    }
}
