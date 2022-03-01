import DataUtils from "../utils/DataUtils";
import IndexZ from "../utils/IndexZ";
import DamageData from "./DamageData";
import FromData from "./FromData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class DialogueData {
    id = 0;
    interval = 0.1;//频率
    delay = 0;
    count = 0;//展示次数 -1：每次都展示
    type = 0;
    isRotate = false;//是否旋转
    isFromEnemy = false;//是否来自敌人
    canBreakBuilding = false;//是否破坏建筑
    canBreakBullet = false;//是否破坏子弹
    canBeatBack = false;//是否击退或者反弹
    from:FromData = new FromData();//来源
    statusList:string[] = [];
    
    valueCopy(data:DialogueData){
        if(!data){
            return;
        }
        DataUtils.baseCopy(this,data);
        this.interval = data.interval?data.interval:0.1;
        // this.delay = data.delay?data.delay:0;
        // this.count = data.count?data.count:0;
        this.type = data.type?data.type:IndexZ.ACTOR;
        // this.isFromEnemy = data.isFromEnemy?data.isFromEnemy:false;
        // this.canBreakBuilding = data.canBreakBuilding?data.canBreakBuilding:false;
        // this.canBreakBullet = data.canBreakBullet?data.canBreakBullet:false;
        // this.isRotate = data.isRotate?data.isRotate:false;
        // this.canBeatBack = data.canBeatBack?data.canBeatBack:false;
        this.statusList = data.statusList?data.statusList:[];
        this.from.valueCopy(data.from);
    }
    clone():DialogueData{
        let e = new DialogueData();
        e.valueCopy(this);
        // e.interval = this.interval;
        // e.delay = this.delay;
        // e.count = this.count;
        // e.isFromEnemy = this.isFromEnemy;
        // e.canBreakBuilding = this.canBreakBuilding;
        // e.canBreakBullet = this.canBreakBullet;
        // e.canBeatBack = this.canBeatBack;
        // e.from = this.from.clone();
        // e.statusList = this.statusList;
        // e.type = this.type;
        // e.isRotate = this.isRotate;
        return e;
    }
}
