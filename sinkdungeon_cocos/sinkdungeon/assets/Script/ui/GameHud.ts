import PlayerInfoDialog from "./PlayerInfoDialog";
import HealthBar from "../logic/HealthBar";
import { EventHelper } from "../logic/EventHelper";
import PlayerData from "../data/PlayerData";
import Logic from "../logic/Logic";
import SettingsDialog from "./dialog/SettingsDialog";
import MartShelvesDialog from "./dialog/MartShelvesDialog";
import InventoryDialog from "./dialog/InventoryDialog";
import AudioPlayer from "../utils/AudioPlayer";

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
    @property(HealthBar)
    dreamBar: HealthBar = null;
    @property(HealthBar)
    bossHealthBar: HealthBar = null;
    @property(PlayerInfoDialog)
    playerInfoDialog: PlayerInfoDialog = null;
    @property(cc.Label)
    level: cc.Label = null;
    @property(cc.Label)
    clock: cc.Label = null;
    @property(cc.Node)
    damageCorner: cc.Node = null;
    @property(cc.Node)
    pasueButton: cc.Node = null;
    @property(cc.Node)
    zoomButton: cc.Node = null;
    @property(SettingsDialog)
    settingsDialog: SettingsDialog = null;
    @property(MartShelvesDialog)
    martShelvesDialog: MartShelvesDialog = null;
    @property(cc.Label)
    completeLabel: cc.Label = null;
    @property(cc.Label)
    oilGoldLabel: cc.Label = null;
    @property(InventoryDialog)
    inventoryDialog: InventoryDialog = null;
    @property(cc.Node)
    followArrows:cc.Node = null;
    private arrowList:cc.Node[]= [];
    private isCompleteShowed = false;
    private checkTimeDelay = 0;
    private startCountTime = true;

    private hour = 0;
    private minute = 0;
    private second = 0;

    onLoad() {
        cc.director.on(EventHelper.HUD_UPDATE_PLAYER_INFODIALOG, (event) => {
            let data = new PlayerData();
            data.valueCopy(event.detail.data);
            this.statusUpdate(data);
        })
        cc.director.on(EventHelper.HUD_UPDATE_PLAYER_HEALTHBAR, (event) => {
            this.healthBarUpdate(event.detail.x, event.detail.y);
        })
        cc.director.on(EventHelper.HUD_UPDATE_PLAYER_DREAMBAR, (event) => {
            this.dreamBarUpdate(event.detail.x, event.detail.y);
        })
        cc.director.on(EventHelper.HUD_SHAKE_PLAYER_DREAMBAR, (event) => {
            if (this.dreamBar) {
                this.dreamBar.shake();
            }
        })
        cc.director.on(EventHelper.HUD_DAMAGE_CORNER_SHOW, (event) => {
            this.showDamageCorner();
            if (this.healthBar) {
                this.healthBar.shake();
            }
        })
        cc.director.on(EventHelper.HUD_MART_SHELVES_DIALOG, (event) => {
            this.showMartShelvesDialog(event.detail.type, event.detail.goodsNameList);
        })
        EventHelper.on(EventHelper.HUD_COMPLETE_SHOW, (detail) => {
            this.showComplete(detail.map);
        })
        cc.director.on(EventHelper.HUD_OILGOLD_LOSE_SHOW, (event) => {
            this.showOilGoldInfo(true);
        })
        cc.director.on(EventHelper.HUD_OILGOLD_RECOVERY_SHOW, (event) => {
            this.showOilGoldInfo(false);
        })
        cc.director.on(EventHelper.HUD_INVENTORY_SHOW, (event) => {
            this.showInventoryDialog();
        })
        cc.director.on(EventHelper.HUD_CANCEL_OR_PAUSE, (event) => {
            this.cancelOrPause();
        })
        cc.director.on(EventHelper.HUD_STOP_COUNTTIME
            , (event) => { this.startCountTime = false; });
        cc.director.on(EventHelper.HUD_FADE_IN, (event) => {
            this.fadeIn();
        })
        cc.director.on(EventHelper.HUD_FADE_OUT, (event) => {
            this.fadeOut();
        })
        if (this.clock) {
            this.clock.string = `${Logic.time}`;
        }
        if (this.level) {
            this.level.string = `${Logic.worldLoader.getCurrentLevelData().name}`;
        }
        if (this.damageCorner) {
            this.damageCorner.opacity = 0;
        }
        this.pasueButton.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.pauseGame();
        });
        this.zoomButton.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            EventHelper.emit(EventHelper.HUD_CAMERA_ZOOM_IN, {});
        });
        this.zoomButton.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            EventHelper.emit(EventHelper.HUD_CAMERA_ZOOM_OUT, {});
        });
        this.zoomButton.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            EventHelper.emit(EventHelper.HUD_CAMERA_ZOOM_OUT, {});
            EventHelper.emit(EventHelper.TEST_SHOW_NODE_COUNT);
        });
        this.healthBarUpdate(Logic.playerData.currentHealth, Logic.playerData.getHealth().y);
        this.dreamBarUpdate(Logic.playerData.currentDream, Logic.playerData.getDream().y);
        this.fadeIn();
        this.initFollowArrows();
    }
    private initFollowArrows(){
        this.arrowList.push(this.followArrows.getChildByName('arrow0'));
        this.arrowList.push(this.followArrows.getChildByName('arrow1'));
        this.arrowList.push(this.followArrows.getChildByName('arrow2'));
        this.arrowList.push(this.followArrows.getChildByName('arrow3'));
        for(let arrow of this.arrowList){
            arrow.active = false;
        }
    }
    private showOilGoldInfo(isLose: boolean) {
        if (!this.oilGoldLabel) {
            return;
        }
        let arr0 = ['碎', '碎片', '碎片丢', '碎片丢失', '碎片丢失', '碎片丢失', '碎片丢失', '碎片丢失', '碎片丢失', '碎片丢失', '碎片丢', '碎片', '碎', ''];
        let arr1 = ['碎', '碎片', '碎片找', '碎片找回', '碎片找回', '碎片找回', '碎片找回', '碎片找回', '碎片找回', '碎片找回', '碎片找', '碎片', '碎', ''];
        if (!isLose) AudioPlayer.play(AudioPlayer.COMPLETE);
        let arr = isLose ? arr0 : arr1;
        let i = 0;
        this.oilGoldLabel.string = '';
        this.oilGoldLabel.unscheduleAllCallbacks();
        this.oilGoldLabel.schedule(() => {
            if (i < arr.length) {
                this.oilGoldLabel.string = arr[i++];
            }
        }, 0.15, arr.length);
    }
    private showComplete(map:Map<Number,Boolean>) {
        if (!this.completeLabel || this.isCompleteShowed) {
            return;
        }
        AudioPlayer.play(AudioPlayer.COMPLETE);
        let arr = ['清', '清理', '清理完', '清理完成', '清理完成', '清理完成', '清理完成', '清理完成', '清理完成', '清理完成', '清理完', '清理', '清', ''];
        let i = 0;
        this.completeLabel.string = '';
        this.completeLabel.unscheduleAllCallbacks();
        this.isCompleteShowed = true;
        this.completeLabel.schedule(() => {
            if (i < arr.length) {
                this.completeLabel.string = arr[i++];
            }
        }, 0.1, arr.length, 0.5);
        if(map&&map.size>0){
            for(let i = 0;i<4;i++){
                if(map.has(i)){
                    this.arrowList[i].active = true;
                } else{
                    this.arrowList[i].active = false;
                }
            }
        }
        
    }
    private fadeOut() {
        if (!this.node) {
            return;
        }
        this.node.opacity = 255;
        cc.tween(this.node).to(0.5, { opacity: 0 }).start();
    }
    private fadeIn() {
        if (!this.node) {
            return;
        }
        this.node.opacity = 0;
        cc.tween(this.node).to(3, { opacity: 255 }).start();
    }
    private statusUpdate(data: PlayerData) {
        if (!this.playerInfoDialog) {
            return;
        }
        this.playerInfoDialog.refreshDialog(data, data.EquipmentTotalData, data.StatusTotalData);
    }

    private showDamageCorner() {
        if (!this.damageCorner) {
            return;
        }
        this.damageCorner.stopAllActions();
        this.damageCorner.opacity = 255;
        this.damageCorner.scale = 1;
        cc.tween(this.damageCorner).parallel(cc.tween(this.damageCorner).to(0.5, { scale: 1.05 }), cc.tween(this.damageCorner).to(1, { opacity: 0 })).start();
    }
    private healthBarUpdate(currentHealth, maxHealth): void {
        if (this.healthBar) {
            this.healthBar.refreshHealth(currentHealth, maxHealth);
        }
    }
    private dreamBarUpdate(currentHealth, maxHealth): void {
        if (this.dreamBar) {
            this.dreamBar.refreshHealth(currentHealth, maxHealth);
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

    update(dt: number) {
        if (this.isCheckTimeDelay(dt)) {
            if (this.clock && this.startCountTime) {
                this.changeTime();
                this.clock.string = `${Logic.time}`;
            }
        }
        if (this.settingsDialog.node.active || this.martShelvesDialog.node.active) {
            Logic.isGamePause = true;
        } else {
            Logic.isGamePause = false;
        }
    }
    useItem() {

    }
    changeTime() {
        if (Logic.isGamePause) {
            return;
        }
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
    private cancelOrPause() {
        if (!this.node) {
            return;
        }
        if (this.inventoryDialog.isShow) {
            this.inventoryDialog.dismiss();
            return;
        }
        if (this.martShelvesDialog.isShow) {
            this.martShelvesDialog.dismiss();
            return;
        }
        this.showSettingsDialog();
    }
    //button
    pauseGame(): void {
        AudioPlayer.play(AudioPlayer.SELECT);
        this.showSettingsDialog();
    }
    showInventoryDialog() {
        if (!this.node) {
            return;
        }
        if (this.inventoryDialog.isShow) {
            this.inventoryDialog.dismiss();
        } else {
            this.inventoryDialog.show();
        }
    }
    showSettingsDialog() {
        if (!this.node) {
            return;
        }
        if (this.settingsDialog.isShow) {
            this.settingsDialog.dismiss();
            cc.director.getScheduler().setTimeScale(1);
        } else {
            this.scheduleOnce(() => {
                if (this.settingsDialog.isShow && !this.settingsDialog.isAniming) {
                    cc.director.getScheduler().setTimeScale(0);
                } else {
                    cc.director.getScheduler().setTimeScale(1);
                }
            }, 1)

            this.settingsDialog.show();
        }
    }
    showMartShelvesDialog(type: string, goodsList: string[]) {
        if (!this.martShelvesDialog) {
            return;
        }
        if (this.martShelvesDialog.isShow) {
            this.martShelvesDialog.dismiss();
        } else {
            this.martShelvesDialog.updateUI(type, goodsList);
            this.martShelvesDialog.show();
        }
    }
}
