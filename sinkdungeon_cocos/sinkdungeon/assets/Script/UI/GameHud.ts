import PlayerInfoDialog from "./PlayerInfoDialog";
import HealthBar from "../HealthBar";
import { EventConstant } from "../EventConstant";
import PlayerData from "../Data/PlayerData";

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

@ccclass
export default class GameHud extends cc.Component {
    @property(HealthBar)
    healthBar: HealthBar = null;
    @property(PlayerInfoDialog)
    playerInfoDialog: PlayerInfoDialog = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.on(EventConstant.HUD_UPDATE_PLAYER_INFODIALOG, (event) => {
            let data = new PlayerData();
            data.valueCopy(event.detail.data);
            this.statusUpdate(data);
        })
        cc.director.on(EventConstant.HUD_UPDATE_PLAYER_HEALTHBAR, (event) => {
            this.healthBarUpdate(event.detail.x,event.detail.y);
        })
    }
    private statusUpdate(data:PlayerData) {
        if (!this.playerInfoDialog) {
            return;
        }
        this.playerInfoDialog.refreshDialog(data, data.EquipmentTotalData, data.StatusTotalData);
    }

    private healthBarUpdate(currentHealth,maxHealth):void{
        if (this.healthBar) {
            this.healthBar.refreshHealth(currentHealth, maxHealth);
        }
    }
    start () {

    }

    // update (dt) {}
}
