import PlayerInfoDialog from "./PlayerInfoDialog";
import HealthBar from "../HealthBar";
import { EventConstant } from "../EventConstant";
import PlayerData from "../Data/PlayerData";
import Logic from "../Logic";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameHud extends cc.Component {
    @property(HealthBar)
    healthBar: HealthBar = null;
    @property(PlayerInfoDialog)
    playerInfoDialog: PlayerInfoDialog = null;
    @property(cc.Label)
    level: cc.Label = null;
    @property(cc.Label)
    clock: cc.Label = null;
    @property(cc.Node)
    damageCorner:cc.Node = null;
    private checkTimeDelay = 0;
    private startCountTime = true;

    private hour = 0;
    private minute = 0;
    private second = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.on(EventConstant.HUD_UPDATE_PLAYER_INFODIALOG, (event) => {
            let data = new PlayerData();
            data.valueCopy(event.detail.data);
            this.statusUpdate(data);
        })
        cc.director.on(EventConstant.HUD_UPDATE_PLAYER_HEALTHBAR, (event) => {
            this.healthBarUpdate(event.detail.x, event.detail.y);
        })
        cc.director.on(EventConstant.HUD_DAMAGE_CORNER_SHOW, (event) => {
            this.showDamageCorner();
        })
        cc.director.on(EventConstant.HUD_STOP_COUNTTIME
            , (event) => { this.startCountTime = false; });
        if (this.clock) {
            this.clock.string = `${Logic.time}`;
        }
        if (this.level) {
            this.level.string = `Level ${Logic.chapterName + 1}-${Logic.level}`;
        }
        if(this.damageCorner){
            this.damageCorner.opacity = 0;
        }
    }
    private statusUpdate(data: PlayerData) {
        if (!this.playerInfoDialog) {
            return;
        }
        this.playerInfoDialog.refreshDialog(data, data.EquipmentTotalData, data.StatusTotalData);
    }

    private showDamageCorner(){
        if(!this.damageCorner){
            return;
        }
        this.damageCorner.stopAllActions();
        this.damageCorner.opacity = 255;
        this.damageCorner.scale = 1;
        this.damageCorner.runAction(cc.spawn(cc.scaleTo(0.5,1.05),cc.fadeOut(1)));
    }
    private healthBarUpdate(currentHealth, maxHealth): void {
        if (this.healthBar) {
            this.healthBar.refreshHealth(currentHealth, maxHealth);
        }
    }
    start() {
        let arr = Logic.time.split(':');
        this.hour = parseInt(arr[0]);
        this.minute = parseInt(arr[1]);
        this.second = parseInt(arr[2]);
    }

    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 1) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }

    update(dt) {
        if (this.isCheckTimeDelay(dt)) {
            if (this.clock && this.startCountTime) {
                this.changeTime();
                this.clock.string = `${Logic.time}`;
            }
        }
    }
    changeTime() {
        this.second = this.second + 1;
        if (this.second >= 60) {
            this.second = 0;
            this.minute = this.minute + 1;
        }
        if (this.minute >= 60) {
            this.minute = 0;
            this.hour = this.hour + 1;
        }
        let strHour = `${this.hour}`;
        strHour = strHour.length > 1 ? strHour : '0' + strHour;
        let strMinute = `${this.minute}`;
        strMinute = strMinute.length > 1 ? strMinute : '0' + strMinute;
        let strSecond = `${this.second}`;
        strSecond = strSecond.length > 1 ? strSecond : '0' + strSecond;
        Logic.time = strHour + ':' + strMinute + ':' + strSecond;

    }
}
