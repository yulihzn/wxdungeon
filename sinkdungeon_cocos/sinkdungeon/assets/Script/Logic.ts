import PlayerData from "./Data/PlayerData";
import { EventConstant } from "./EventConstant";
import MapData from "./Data/MapData";
import EquipmentData from "./Data/EquipmentData";
import InventoryData from "./Data/InventoryData";
import RectDungeon from "./Rect/RectDungeon";

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
    public static readonly BOSS_LEVEL_1: number = 10;
    public static level = 1;
    public static playerData:PlayerData = new PlayerData();
    public static inventoryData:InventoryData = new InventoryData();
    public static rooms:MapData[] = new Array();
    public static chapterName = 'chapter01';
    public static equipments: { [key: string]: EquipmentData } = null;
    public static spriteFrames:{ [key: string]: cc.SpriteFrame } = null;
    public static rectDungeon:RectDungeon=null;
    public static currentMapIndex:cc.Vec2 = cc.v2(0,0);
    public static currentDir:number=0;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //关闭调试
        cc.director.setDisplayStats(false);
        cc.game.addPersistRootNode(this.node);
        cc.director.getPhysicsManager().enabled = true;
    //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
    // cc.PhysicsManager.DrawBits.e_pairBit |
    // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
    // cc.PhysicsManager.DrawBits.e_jointBit |
    // cc.PhysicsManager.DrawBits.e_shapeBit
    // ;
        cc.director.on(EventConstant.LOADINGNEXTLEVEL,(event)=>{
            this.loadingNextLevel();
        });
        cc.director.on(EventConstant.LOADINGROOM,(event)=>{
            this.loadingNextRoom();
        });
        
    }

    start () {

    }
    loadingNextRoom(){
        // Logic.rectDungeon.getNeighborRoomType(Logic.currentMapIndex.x,Logic.currentMapIndex.y,Logic.dir)
        cc.director.loadScene('loading');
    }
    loadingNextLevel(){
        Logic.level++;
        //最多五层
        if(Logic.level>5){
            cc.director.loadScene('gamefinish')
        }else{
            Logic.rectDungeon = new RectDungeon(Logic.level);
            Logic.currentMapIndex = cc.v2(Logic.rectDungeon.startRoom.x,Logic.rectDungeon.startRoom.y)
            cc.director.loadScene('loading');
        }
    }
    public static getCurrentMapData():MapData{
        if(Logic.rooms.length>Logic.level-1){
            return Logic.rooms[Logic.level-1]
        }
        return null;
    }
    public static isBossLevel(level: number): boolean {
		return level == Logic.BOSS_LEVEL_1;
	}
    public static getRandomNum(min, max): number {//生成一个随机数从[min,max]
		return min + Math.round(Math.random() * (max - min));
    }
    public static getHalfChance(): boolean {
		return Math.random()>0.5;
    }
    public static setAlias(node:cc.Node){
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
