import ProfileData from "../Data/ProfileData";
import TalentData from "../Data/TalentData";
import RectDungeon from "../Rect/RectDungeon";
import LocalStorage from "../Utils/LocalStorage";

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
        this.loadData(false);
    }
    private loadData(isSavePoint:boolean){
        //读取存档
        this.loadProfile(isSavePoint);
    }
   
    private getSaveData(isSavePoint:boolean):ProfileData{
        let s = LocalStorage.getValue(isSavePoint?LocalStorage.SAVE_DUNGEON_BY_POINT:LocalStorage.SAVE_DUNGEON);
        if(s){
            return JSON.parse(s);
        }
        return null;
    }
    saveData(isSavePoint:boolean){
        LocalStorage.putValue(isSavePoint?LocalStorage.SAVE_DUNGEON_BY_POINT:LocalStorage.SAVE_DUNGEON,this.data);
        this.hasSaveData = true;
        console.log('save data');
    }
    clearData(){
        cc.sys.localStorage.setItem('data','');
        this.hasSaveData = false;
        this.data = new ProfileData();
        console.log('clear data');
    }
    
    loadProfile(isSavePoint:boolean):boolean{
        let data = this.getSaveData(isSavePoint);
        if(!data){
            if(!isSavePoint){
                this.hasSaveData = false;
            }
            return false;
        }
        if(!data.playerData||!data.playerEquipList||!data.playerItemList||!data.rectDungeons
        ||!data.talentList){
            if(!isSavePoint){
                this.hasSaveData = false;
            }
            return false;
        }
        //清空当前数据
        this.data = new ProfileData();
        this.hasSaveData = true;
        //玩家数据
        this.data.playerData.valueCopy(data.playerData);
        //章节名称
        this.data.chapterIndex = data.chapterIndex;
        this.data.level = data.level;
        this.data.lastLevel = data.lastLevel;
        this.data.lastChapterIndex = data.lastChapterIndex;
        //玩家装备列表
        for(let i =0;i<data.playerEquipList.length;i++){
            this.data.playerEquipList[i]=data.playerEquipList[i];
        }
        //玩家物品列表
        if(data.playerItemList){
            for(let i=0;i<data.playerItemList.length;i++){
                this.data.playerItemList[i]=data.playerItemList[i];
            }
        }
        //加载技能
        for(let i =0;i<data.talentList.length;i++){
            let td = new TalentData();
            td.valueCopy(data.talentList[i]);
            this.data.talentList.push(td);
        }
        //加载地图数据
        for(let key in data.rectDungeons){
            let rect = new RectDungeon();
            rect.buildMapFromSave(data.rectDungeons[key]);
            this.data.rectDungeons[key] = rect;
         }
         //加载时间
         if(data.time){
             this.data.time = data.time;
         }
        console.log('data',this);
        return true;
    }
}
