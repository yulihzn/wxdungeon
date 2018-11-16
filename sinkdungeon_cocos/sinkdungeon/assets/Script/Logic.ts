import PlayerData from "./Data/PlayerData";
import { EventConstant } from "./EventConstant";
import MapData from "./Data/MapData";
import EquipmentData from "./Data/EquipmentData";
import RectDungeon from "./Rect/RectDungeon";
import RectRoom from "./Rect/RectRoom";
import MapManager from "./Manager/MapManager";
import Dungeon from "./Dungeon";
import FootBoard from "./Building/FootBoard";
import Box from "./Building/Box";
import BoxData from "./Data/BoxData";
import ShopTableData from "./Data/ShopTableData";
import MonsterData from "./Data/MonsterData";
import StatusData from "./Data/StatusData";
import InventoryManager from "./Manager/InventoryManager";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Logic extends cc.Component {
    static readonly BOSS_LEVEL_1: number = 10;
    static level = 1;
    static playerData:PlayerData = new PlayerData();
    static inventoryManager:InventoryManager = new InventoryManager();
    static roomStrs = ['startroom', 'endroom', 'traproom', 'lootroom', 'dangerroom', 'puzzleroom', 'merchantroom', 'bossroom'];
    
    static mapManger:MapManager = new MapManager();
    static chapterName = 'chapter01';
    static equipments: { [key: string]: EquipmentData } = null;
    static monsters:{[key:string]:MonsterData} = null;
    static spriteFrames:{ [key: string]: cc.SpriteFrame } = null;
    static debuffs:{[key:string]:StatusData} = null;
    // static currentRectRoom:RectRoom = null;
    static currentDir:number=0;
    static coins = 0;//金币
    static ammo = 30;//子弹
    static killCount = 0;//杀敌数
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //关闭调试
        // cc.director.setDisplayStats(false);
        cc.game.setFrameRate(60);
        cc.game.addPersistRootNode(this.node);
        // cc.view.enableAntiAlias(false);
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        cc.director.getPhysicsManager().enabled = true;
    //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
    // cc.PhysicsManager.DrawBits.e_pairBit |
    // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
    // cc.PhysicsManager.DrawBits.e_jointBit |
    // cc.PhysicsManager.DrawBits.e_shapeBit
    ;
        cc.director.on(EventConstant.LOADINGNEXTLEVEL,(event)=>{
            this.loadingNextLevel();
        });
        cc.director.on(EventConstant.LOADINGROOM,(event)=>{
            this.loadingNextRoom(event.detail.dir);
        });
        
    }

    start () {

    }
    static resetData(){
        Logic.level = 1;
        Logic.playerData = new PlayerData();
        Logic.inventoryManager = new InventoryManager();
        Logic.mapManger.reset(Logic.level);
        let c = cc.sys.localStorage.getItem('coin');
        Logic.coins = c?c:0;
        Logic.ammo = 30;
        // Logic.playerData.updateHA(cc.v2(999,999),1);
    }
    static changeDungeonSize(){
        let mapData: string[][] = Logic.getCurrentMapData().map;
            if (mapData && mapData.length > 0) {
                Dungeon.WIDTH_SIZE = mapData.length;
                Dungeon.HEIGHT_SIZE = mapData[0].length;
                // Logic.playerData.pos=cc.v2(Math.round(Dungeon.WIDTH_SIZE/2-1),Math.round(Dungeon.HEIGHT_SIZE/2-1));
            }
    }
    loadingNextRoom(dir:number){
        let room = Logic.mapManger.loadingNextRoom(dir);
        if(room){
            Logic.changeDungeonSize();
            switch(dir){
                case 0:Logic.playerData.pos=cc.v2(Math.round(Dungeon.WIDTH_SIZE/2-1),0);break;
                case 1:Logic.playerData.pos=cc.v2(Math.round(Dungeon.WIDTH_SIZE/2-1),Dungeon.HEIGHT_SIZE-1);break;
                case 2:Logic.playerData.pos=cc.v2(Dungeon.WIDTH_SIZE-1,Math.round(Dungeon.HEIGHT_SIZE/2-1));break;
                case 3:Logic.playerData.pos=cc.v2(0,Math.round(Dungeon.HEIGHT_SIZE/2-1));break;
            }
            cc.director.loadScene('loading');
        }
    }
    loadingNextLevel(){
        Logic.level++;
        //最多五层
        if(Logic.level>5){
            cc.director.loadScene('gamefinish')
        }else{
            Logic.mapManger.reset(Logic.level);
            Logic.changeDungeonSize();
            Logic.playerData.pos=cc.v2(Math.round(Dungeon.WIDTH_SIZE/2-1),Math.round(Dungeon.HEIGHT_SIZE/2-1));
            cc.director.loadScene('loading');
        }
    }
    static getCurrentMapData():MapData{
        return Logic.mapManger.getCurrentMapData();
    }
    static getCurrentMapBoxes():BoxData[]{
        return Logic.mapManger.getCurrentMapBoxes();
    }
    static getCurrentMapShopTables():ShopTableData[]{
        return Logic.mapManger.getCurrentMapShopTables();
    }
    static isBossLevel(level: number): boolean {
		return level == Logic.BOSS_LEVEL_1;
	}
    static getRandomNum(min, max): number {//生成一个随机数从[min,max]
		return min + Math.round(Math.random() * (max - min));
    }
    static getHalfChance(): boolean {
		return Math.random()>0.5;
    }

    static getDistance(v1, v2) {
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;
        return Math.sqrt(x*x+y*y);
    }
    
}
