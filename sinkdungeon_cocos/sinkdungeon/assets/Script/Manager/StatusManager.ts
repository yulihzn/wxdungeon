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
        this.statusList.push(status);
        status.showStatus(this.node.parent, data);
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
            e.physicalDamage += s.data.physicalDamage;
            e.defence += s.data.defence;
            e.missRate += s.data.missRate;
            e.criticalStrikeRate *= (1-s.data.criticalStrikeRate/100);
            e.lifeDrain *= (1-s.data.lifeDrain/100);;
            e.lifeRecovery += s.data.lifeRecovery;
            e.moveSpeed += s.data.moveSpeed;
            e.attackSpeed += s.data.attackSpeed;
            e.dodge *= (1-s.data.dodge/100);
            e.maxHealth += s.data.maxHealth;
            e.realDamage += s.data.realDamage;
            e.realRate += s.data.realRate;
            e.iceDamage += s.data.iceDamage;
            e.iceDefence += s.data.iceDefence;
            e.iceRate += s.data.iceRate;
            e.fireDamage += s.data.fireDamage;
            e.fireDefence += s.data.fireDefence;
            e.fireRate += s.data.fireRate;
            e.lighteningDamage += s.data.lighteningDamage;
            e.lighteningDefence += s.data.lighteningDefence;
            e.lighteningRate += s.data.lighteningRate;
            e.toxicDamage += s.data.toxicDamage;
            e.toxicDefence += s.data.toxicDefence;
            e.toxicRate += s.data.toxicRate;
            e.curseDamage += s.data.curseDamage;
            e.curseDefence += s.data.curseDefence;
            e.curseRate += s.data.curseRate;
        }
        return e;
    }
}
