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
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //关闭调试
        cc.director.setDisplayStats(false);
        cc.game.addPersistRootNode(this.node);
        cc.director.on(EventConstant.LOADINGNEXTLEVEL,(event)=>{
            this.loadingNextLevel();
        });
        cc.loader.loadRes('Rooms/chapter01',(err:Error,resource)=>{
            if(err){
				cc.error(err);
			}else{
                let strs:string= resource;
                let arr = strs.split('level');
                Logic.rooms = new Array();
                for(let str of arr){
                    if(str){
                        str = str.substring(str.indexOf('=')+1,str.length)
                        Logic.rooms.push(new MapData(str));
                    }
                }
                Logic.rooms
			}
        })
    }

    start () {

    }
    loadingNextLevel(){
        Logic.level++;
        cc.director.loadScene('loading');
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
