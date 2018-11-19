import Status from "../Status";
import StatusData from "../Data/StatusData";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";
import { EventConstant } from "../EventConstant";

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


    @property(cc.Prefab)
    statusPrefab: cc.Prefab = null;
    private statusList: Status[];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.statusList = new Array();
    }

    start() {

    }
    addStatus(resName) {
        let sd = new StatusData();
        sd.valueCopy(Logic.debuffs[resName])
        this.showStatus(sd);
    }
    private showStatus(data: StatusData) {
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            let s = this.statusList[i];
            if (!s || !s.node || !s.isValid || !s.isStatusRunning()) {
                this.statusList.splice(i, 1);
            }
        }
        console.log(this.statusList.length);
        let statusNode: cc.Node = cc.instantiate(this.statusPrefab);
        statusNode.parent = this.node;
        statusNode.active = true;
        let status = statusNode.getComponent(Status);
        status.showStatus(this.node.parent, data);
        this.statusList.push(status);
    }
    update(dt) {
        if (this.node.parent) {
            this.node.scaleX = this.node.parent.scaleX;
        }
        if (this.isTimeDelay(dt)) {
            Logic.playerData.statusTotalData = this.updateStatus();
            cc.director.emit(EventConstant.PLAYER_STATUSUPDATE);
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
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            let s = this.statusList[i];
            if (!s || !s.node || !s.isValid || !s.isStatusRunning()) {
                continue;
            }
            e.physicalDamage += s.data.physicalDamage?s.data.physicalDamage:0;
            e.defence += s.data.defence?s.data.defence:0;
            e.missRate += s.data.missRate?s.data.missRate:0;
            e.criticalStrikeRate *= s.data.criticalStrikeRate?(1-s.data.criticalStrikeRate/100):1;
            e.lifeDrain *= s.data.lifeDrain?(1-s.data.lifeDrain/100):1;
            e.lifeRecovery += s.data.lifeRecovery?s.data.lifeRecovery:0;
            e.moveSpeed += s.data.moveSpeed?s.data.moveSpeed:0;
            e.attackSpeed += s.data.attackSpeed?s.data.attackSpeed:0;
            e.dodge *= s.data.dodge?(1-s.data.dodge/100):1;
            e.maxHealth += s.data.maxHealth?s.data.maxHealth:0;
            e.realDamage += s.data.realDamage?s.data.realDamage:0;
            e.realRate += s.data.realRate?s.data.realRate:0;
            e.iceDamage += s.data.iceDamage?s.data.iceDamage:0;
            e.iceDefence += s.data.iceDefence?s.data.iceDefence:0;
            e.iceRate += s.data.iceRate?s.data.iceRate:0;
            e.fireDamage += s.data.fireDamage?s.data.fireDamage:0;
            e.fireDefence += s.data.fireDefence?s.data.fireDefence:0;
            e.fireRate += s.data.fireRate?s.data.fireRate:0;
            e.lighteningDamage += s.data.lighteningDamage?s.data.lighteningDamage:0;
            e.lighteningDefence += s.data.lighteningDefence?s.data.lighteningDefence:0;
            e.lighteningRate += s.data.lighteningRate?s.data.lighteningRate:0;
            e.toxicDamage += s.data.toxicDamage?s.data.toxicDamage:0;
            e.toxicDefence += s.data.toxicDefence?s.data.toxicDefence:0;
            e.toxicRate += s.data.toxicRate?s.data.toxicRate:0;
            e.curseDamage += s.data.curseDamage?s.data.curseDamage:0;
            e.curseDefence += s.data.curseDefence?s.data.curseDefence:0;
            e.curseRate += s.data.curseRate?s.data.curseRate:0;
        }
        return e;
    }
}
