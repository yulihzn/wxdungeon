import Status from "../Status";
import StatusData from "../Data/StatusData";
import Logic from "../Logic";
import { EventHelper } from "../EventHelper";
import Player from "../Player";
import NonPlayer from "../NonPlayer";
import FromData from "../Data/FromData";

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
export default class StatusManager extends cc.Component {
    public static readonly FROZEN = "status001";
    public static readonly BURNING = "status002";
    public static readonly DIZZ = "status003";
    public static readonly TOXICOSIS = "status004";
    public static readonly CURSING = "status005";
    public static readonly BLEEDING = "status006";
    public static readonly ATTACKPLUS = "status007";
    public static readonly FASTMOVE = "status008";
    public static readonly FASTATTACK = "status009";
    public static readonly PERFECTDEFENCE = "status010";
    public static readonly HEALING = "status011";
    public static readonly RECOVERY = "status012";
    public static readonly STONE = "status013";
    public static readonly TWINE = "status014";
    public static readonly SHIELD_NORMAL = "status015";
    public static readonly SHIELD_LONG = "status016";
    public static readonly BOTTLE_HEALING = "status017";
    public static readonly TALENT_AIMED = "status018";
    public static readonly SHOES_SPEED = "status019";
    public static readonly CLOTHES_RECOVERY = "status020";
    public static readonly WEREWOLFDEFENCE = "status021";
    public static readonly GOLDAPPLE = "status022";
    public static readonly MAGIC_WEAPON = "status023";
    public static readonly MAGIC_WEAPON_STRONG = "status024";
    public static readonly FROZEN_STRONG = "status025";
    public static readonly TALENT_INVISIBLE = "status026";
    public static readonly SHIELD_PARRY = "status027";
    public static readonly TALENT_FLASH_DIZZ = "status028";
    public static readonly TALENT_FLASH_SPEED = "status029";
    public static readonly BOTTLE_REMOTE = "status030";
    public static readonly WINE_CLOUD = "status033";
    

    @property(cc.Prefab)
    statusPrefab: cc.Prefab = null;
    private statusList: Status[];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.statusList = new Array();
    }

    start() {

    }
    addStatus(resName:string,from:FromData) {
        if(resName.length<1){
            return;
        }
        let sd = new StatusData();
        sd.valueCopy(Logic.debuffs[resName])
        sd.From.valueCopy(from);
        this.showStatus(sd);
    }
    hasStatus(resName:string):boolean{
        let hasStatus = false;
        let sd = new StatusData();
        sd.valueCopy(Logic.debuffs[resName]);
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            let s = this.statusList[i];
            if (s && s.node && s.isValid && s.isStatusRunning() && s.data.statusType == sd.statusType) {
                hasStatus = true;
                break;
            }
        }
        return hasStatus;
    }
    stopStatus(resName:string):void{
        let sd = new StatusData();
        sd.valueCopy(Logic.debuffs[resName]);
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            let s = this.statusList[i];
            if (s && s.node && s.isValid && s.isStatusRunning() && s.data.statusType == sd.statusType) {
                s.stopStatus();
            }
        }
        return undefined;
    }
    stopAllStatus():void{
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            let s = this.statusList[i];
            s.stopStatus();
        }
    }
    private showStatus(data: StatusData) {
        //去除已经失效的状态
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            let s = this.statusList[i];
            if (!s || !s.node || !s.isValid || !s.isStatusRunning()) {
                this.statusList.splice(i, 1);
            }
        }
        //新的状态如果存在则刷新且重新触发
        let hasStatus = false;
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            let s = this.statusList[i];
            if (s && s.node && s.isValid && s.isStatusRunning() && s.data.statusType == data.statusType) {
                s.data.duration=data.duration;
                s.showStatus(this.node.parent, data);
                hasStatus = true;
                break;
            }
        }
        if(hasStatus){
            return;
        }
        
        let statusNode: cc.Node = cc.instantiate(this.statusPrefab);
        statusNode.parent = this.node;
        statusNode.active = true;
        let status = statusNode.getComponent(Status);
        this.statusList.push(status);
        status.showStatus(this.node.parent, data);
    }
    
    update(dt) {
        if (this.node.parent) {
            this.node.scaleX = this.node.parent.scaleX>0?1:-1;
        }
        if (this.isTimeDelay(dt)) {
            let monster = this.node.parent.getComponent(NonPlayer);
            if(this.node.parent&&this.node.parent.getComponent(Player)){
                Logic.playerData.StatusTotalData.valueCopy(this.updateStatus());
                cc.director.emit(EventHelper.PLAYER_STATUSUPDATE);
            }else if(this.node.parent&&monster){
                monster.data.StatusTotalData.valueCopy(this.updateStatus());
            }
        }
    }
    private timeDelay = 0;
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }
    private updateStatus(): StatusData {
        let e = new StatusData();
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            let s = this.statusList[i];
            if (!s || !s.node || !s.isValid || !s.isStatusRunning()) {
                continue;
            }
            e.missRate += s.data.missRate?s.data.missRate:0;
            e.Common.add(s.data.Common);
        }
        return e;
    }
}
