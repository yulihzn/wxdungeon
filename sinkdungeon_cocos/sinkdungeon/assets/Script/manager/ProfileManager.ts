import ProfileData from "../data/ProfileData";
import TalentData from "../data/TalentData";
import RectDungeon from "../rect/RectDungeon";
import LocalStorage from "../utils/LocalStorage";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
/**
 * 存档管理，挂载Logic节点的时候就读取存档
 */
@ccclass
export default class ProfileManager{
    data:ProfileData = new ProfileData();
    hasSaveData:boolean = false;
    constructor(){
        this.loadData();
    }
    private loadData(){
        //读取存档
        this.loadProfile();
    }
   
    private getSaveData():ProfileData{
        let s = LocalStorage.getValue(false?LocalStorage.SAVE_DUNGEON_BY_POINT:LocalStorage.SAVE_DUNGEON);
        if(s){
            return JSON.parse(s);
        }
        return null;
    }
    saveData(){
        LocalStorage.putValue(LocalStorage.SAVE_DUNGEON,this.data);
        this.hasSaveData = true;
        console.log('save data');
    }
    clearData(){
        cc.sys.localStorage.setItem(LocalStorage.SAVE_DUNGEON,'');
        this.hasSaveData = false;
        this.data = new ProfileData();
        console.log('clear data');
    }
    
    loadProfile():boolean{
        let data = this.getSaveData();
        if(!data){
            this.hasSaveData = false;
            return false;
        }
        if(!data.savePointData||!data.playerData||!data.playerEquips||!data.playerItemList||!data.rectDungeons){
            this.hasSaveData = false;
            return false;
        }
        //清空当前数据
        this.data = new ProfileData();
        this.hasSaveData = true;
        //玩家数据
        this.data.playerData.valueCopy(data.playerData);
        //章节名称
        this.data.chapterIndex = data.chapterIndex;
        this.data.chapterMaxIndex = data. chapterMaxIndex;
        this.data.level = data.level;
        //存档点
        this.data.savePointData.valueCopy(data.savePointData);
        //掉落翠金
        this.data.oilGolds = data.oilGolds?data.oilGolds:0;
        this.data.groundOilGoldData.valueCopy(data.groundOilGoldData);
        //玩家装备列表
        for(let key in data.playerEquips){
            this.data.playerEquips[key]=data.playerEquips[key];
        }
        //玩家物品列表
        if(data.playerItemList){
            for(let i=0;i<data.playerItemList.length;i++){
                this.data.playerItemList[i]=data.playerItemList[i];
            }
        }
        //玩家背包列表
        if(data.playerInventoryList){
            for(let i=0;i<data.playerInventoryList.length;i++){
                this.data.playerInventoryList[i]=data.playerInventoryList[i];
            }
        }
       
        //npc列表
        if(data.nonPlayerList){
            for(let i=0;i<data.nonPlayerList.length;i++){
                this.data.nonPlayerList[i]=data.nonPlayerList[i];
            }
        }
        //加载地图数据
        for(let key in data.rectDungeons){
            let rect = new RectDungeon();
            rect.buildMapFromSave(data.rectDungeons[key]);
            this.data.rectDungeons[key] = rect;
         }
         //加载怪物击杀玩家数据
         if(data.killPlayerCounts){
             this.data.killPlayerCounts = data.killPlayerCounts;
         }

         //加载时间
         if(data.time){
             this.data.time = data.time;
         }
         if(data.realTime){
            this.data.realTime = data.realTime;
        }
        console.log('data',this);
        return true;
    }
}
