import Status from "../Status";
import StatusData from "../Data/StatusData";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";
import { EventConstant } from "../EventConstant";
import Player from "../Player";
import Monster from "../Monster";

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


    @property(cc.Prefab)
    statusPrefab: cc.Prefab = null;
    private statusList: Status[];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.statusList = new Array();
    }

    start() {

    }
    addStatus(resName:string) {
        let sd = new StatusData();
        sd.valueCopy(Logic.debuffs[resName])
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
    private showStatus(data: StatusData) {
        //去除已经失效的状态
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            let s = this.statusList[i];
            if (!s || !s.node || !s.isValid || !s.isStatusRunning()) {
                this.statusList.splice(i, 1);
            }
        }
        //新的状态如果存在则刷新
        let hasStatus = false;
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            let s = this.statusList[i];
            if (s && s.node && s.isValid && s.isStatusRunning() && s.data.statusType == data.statusType) {
                s.data.duration=data.duration;
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
        status.showStatus(this.node.parent, data);
        this.statusList.push(status);
    }
    
    update(dt) {
        if (this.node.parent) {
            this.node.scaleX = this.node.parent.scaleX>0?1:-1;
        }
        if (this.isTimeDelay(dt)) {
            let monster = this.node.parent.getComponent(Monster);
            if(this.node.parent&&this.node.parent.getComponent(Player)){
                Logic.playerData.StatusTotalData.valueCopy(this.updateStatus());
                cc.director.emit(EventConstant.PLAYER_STATUSUPDATE);
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
    updateStatus(): StatusData {
        let e = new StatusData();
        e.Common.lifeDrain = 1;
        e.Common.criticalStrikeRate = 1;
        e.Common.dodge = 1;
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            let s = this.statusList[i];
            if (!s || !s.node || !s.isValid || !s.isStatusRunning()) {
                continue;
            }
            e.missRate += s.data.missRate?s.data.missRate:0;
            e.Common.damageMin += s.data.Common.damageMin?s.data.Common.damageMin:0;
            e.Common.damageMax += s.data.Common.damageMax?s.data.Common.damageMax:0;
            e.Common.defence += s.data.Common.defence?s.data.Common.defence:0;
            e.Common.criticalStrikeRate *= s.data.Common.criticalStrikeRate?(1-s.data.Common.criticalStrikeRate/100):1;
            e.Common.lifeDrain *= s.data.Common.lifeDrain?(1-s.data.Common.lifeDrain/100):1;
            e.Common.dodge *= s.data.Common.dodge?(1-s.data.Common.dodge/100):1;
            e.Common.lifeRecovery += s.data.Common.lifeRecovery?s.data.Common.lifeRecovery:0;
            e.Common.moveSpeed += s.data.Common.moveSpeed?s.data.Common.moveSpeed:0;
            e.Common.attackSpeed += s.data.Common.attackSpeed?s.data.Common.attackSpeed:0;
            e.Common.maxHealth += s.data.Common.maxHealth?s.data.Common.maxHealth:0;
            e.Common.realDamage += s.data.Common.realDamage?s.data.Common.realDamage:0;
            e.Common.realRate += s.data.Common.realRate?s.data.Common.realRate:0;
            e.Common.iceDamage += s.data.Common.iceDamage?s.data.Common.iceDamage:0;
            e.Common.iceDefence += s.data.Common.iceDefence?s.data.Common.iceDefence:0;
            e.Common.iceRate += s.data.Common.iceRate?s.data.Common.iceRate:0;
            e.Common.fireDamage += s.data.Common.fireDamage?s.data.Common.fireDamage:0;
            e.Common.fireDefence += s.data.Common.fireDefence?s.data.Common.fireDefence:0;
            e.Common.fireRate += s.data.Common.fireRate?s.data.Common.fireRate:0;
            e.Common.lighteningDamage += s.data.Common.lighteningDamage?s.data.Common.lighteningDamage:0;
            e.Common.lighteningDefence += s.data.Common.lighteningDefence?s.data.Common.lighteningDefence:0;
            e.Common.lighteningRate += s.data.Common.lighteningRate?s.data.Common.lighteningRate:0;
            e.Common.toxicDamage += s.data.Common.toxicDamage?s.data.Common.toxicDamage:0;
            e.Common.toxicDefence += s.data.Common.toxicDefence?s.data.Common.toxicDefence:0;
            e.Common.toxicRate += s.data.Common.toxicRate?s.data.Common.toxicRate:0;
            e.Common.curseDamage += s.data.Common.curseDamage?s.data.Common.curseDamage:0;
            e.Common.curseDefence += s.data.Common.curseDefence?s.data.Common.curseDefence:0;
            e.Common.curseRate += s.data.Common.curseRate?s.data.Common.curseRate:0;
        }
        e.Common.criticalStrikeRate=(1-e.Common.criticalStrikeRate)*100;
        e.Common.lifeDrain=(1-e.Common.lifeDrain)*100;
        e.Common.dodge=(1-e.Common.dodge)*100;
        return e;
    }
}
