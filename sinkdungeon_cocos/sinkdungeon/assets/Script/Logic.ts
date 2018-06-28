import PlayerData from "./Data/PlayerData";
import { EventConstant } from "./EventConstant";
import MapData from "./Data/MapData";

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
    public static rooms:MapData[] = new Array();
    public static chapterName = 'chapter01';
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //关闭调试
        cc.director.setDisplayStats(false);
        cc.game.addPersistRootNode(this.node);
        cc.director.on(EventConstant.LOADINGNEXTLEVEL,(event)=>{
            this.loadingNextLevel();
        });
        
    }

    start () {

    }
    loadingNextLevel(){
        Logic.level++;
        if(Logic.level>Logic.rooms.length){
            cc.director.loadScene('gamefinish')
        }else{
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
    // update (dt) {
    // }
}
