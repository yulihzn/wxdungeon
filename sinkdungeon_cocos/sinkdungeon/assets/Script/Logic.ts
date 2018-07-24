import PlayerData from "./Data/PlayerData";
import { EventConstant } from "./EventConstant";
import MapData from "./Data/MapData";
import EquipmentData from "./Data/EquipmentData";
import InventoryData from "./Data/InventoryData";
import RectDungeon from "./Rect/RectDungeon";
import RectRoom from "./Rect/RectRoom";
import MapManager from "./Manager/MapManager";
import Dungeon from "./Dungeon";

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
    static inventoryData:InventoryData = new InventoryData();
    static roomStrs = ['startroom', 'endroom', 'traproom', 'lootroom', 'dangerroom', 'puzzleroom', 'merchantroom', 'bossroom'];
    
    static mapManger:MapManager = new MapManager();
    static chapterName = 'chapter01';
    static equipments: { [key: string]: EquipmentData } = null;
    static spriteFrames:{ [key: string]: cc.SpriteFrame } = null;
    // static currentRectRoom:RectRoom = null;
    static currentDir:number=0;
    static coins = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //关闭调试
        cc.director.setDisplayStats(false);
        cc.game.addPersistRootNode(this.node);
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
    //     manager.enabledDebugDraw = true;
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
        Logic.inventoryData = new InventoryData();
        Logic.mapManger.reset(Logic.level);
        Logic.coins = 0;
    }
    loadingNextRoom(dir:number){
        let room = Logic.mapManger.loadingNextRoom(dir);
        if(room){
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
            cc.director.loadScene('loading');
        }
    }
    static getCurrentMapData():MapData{
        return Logic.mapManger.getCurrentMapData();
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
    static setAlias(node:cc.Node){
        let ss = node.getComponentsInChildren(cc.Sprite);
            for (let i = 0; i < ss.length; i++) {
                if (ss[i].spriteFrame) {
                    ss[i].spriteFrame.getTexture().setAliasTexParameters();
                }
            }
    }
    // update (dt) {
    // }
}
