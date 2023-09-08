import { EventHelper } from './../logic/EventHelper'
import PlayerInfoDialog from './PlayerInfoDialog'
import HealthBar from '../logic/HealthBar'
import PlayerData from '../data/PlayerData'
import Logic from '../logic/Logic'
import SettingsDialog from './dialog/SettingsDialog'
import MartShelvesDialog from './dialog/MartShelvesDialog'
import InventoryDialog from './dialog/InventoryDialog'
import AudioPlayer from '../utils/AudioPlayer'
import SatietyView from './SatietyView'
import DollMachineDialog from './dialog/DollMachineDialog'
import Dialogue from './Dialogue'
import CellphoneDialog from './dialog/CellphoneDialog'
import ActionSettingDialog from './dialog/ActionSettingDialog'
import Utils from '../utils/Utils'
import QuestBoardDialog from './dialog/QuestBoardDialog'
import GameAlertDialog from './dialog/GameAlertDialog'
import MetalTalentDialog from './dialog/MetalTalentDialog'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class GameHud extends cc.Component {
    @property(HealthBar)
    healthBar: HealthBar = null
    @property(HealthBar)
    dreamBar: HealthBar = null
    @property(HealthBar)
    bossHealthBar: HealthBar = null
    @property(PlayerInfoDialog)
    playerInfoDialog: PlayerInfoDialog = null
    @property(cc.Label)
    level: cc.Label = null
    @property(cc.Label)
    clock: cc.Label = null
    @property(cc.Node)
    damageCorner: cc.Node = null
    @property(cc.Node)
    pasueButton: cc.Node = null
    @property(cc.Node)
    zoomButton: cc.Node = null
    @property(SettingsDialog)
    settingsDialog: SettingsDialog = null
    @property(MartShelvesDialog)
    martShelvesDialog: MartShelvesDialog = null
    @property(cc.Label)
    completeLabel: cc.Label = null
    @property(cc.Label)
    oilGoldLabel: cc.Label = null
    @property(InventoryDialog)
    inventoryDialog: InventoryDialog = null
    @property(cc.Node)
    followArrows: cc.Node = null
    @property(SatietyView)
    satietyView: SatietyView = null
    @property(DollMachineDialog)
    dollMachineDialog: DollMachineDialog = null
    @property(cc.Label)
    AmmoLabel: cc.Label = null
    @property(Dialogue)
    dialogue: Dialogue = null
    @property(CellphoneDialog)
    cellphoneDialog: CellphoneDialog = null
    @property(ActionSettingDialog)
    actionSettingDialog: ActionSettingDialog = null
    @property(QuestBoardDialog)
    questBoardDialog: QuestBoardDialog = null
    @property(MetalTalentDialog)
    metalTalentDialog: MetalTalentDialog = null
    @property(GameAlertDialog)
    gameAlertDialog: GameAlertDialog = null

    private arrowList: cc.Node[] = []
    private isCompleteShowed = false
    private checkTimeDelay = 0
    private startCountTime = true

    onLoad() {
        EventHelper.on(EventHelper.HUD_UPDATE_PLAYER_INFODIALOG, detail => {
            this.statusUpdate(detail.dataId)
        })
        EventHelper.on(EventHelper.HUD_UPDATE_PLAYER_HEALTHBAR, detail => {
            this.healthBarUpdate(detail.x, detail.y)
        })
        EventHelper.on(EventHelper.HUD_UPDATE_PLAYER_DREAMBAR, detail => {
            this.dreamBarUpdate(detail.x, detail.y)
        })
        EventHelper.on(EventHelper.HUD_SHAKE_PLAYER_DREAMBAR, detail => {
            if (this.dreamBar) {
                this.dreamBar.shake()
            }
        })
        EventHelper.on(EventHelper.HUD_UPDATE_PLAYER_LIFE_BAR, detail => {
            this.lifeBarUpdate(detail.sanity, detail.solid, detail.poo, detail.liquid, detail.pee)
        })

        EventHelper.on(EventHelper.HUD_DAMAGE_CORNER_SHOW, detail => {
            this.showDamageCorner()
            if (this.healthBar) {
                this.healthBar.shake()
            }
        })
        EventHelper.on(EventHelper.HUD_MART_SHELVES_DIALOG, detail => {
            this.showMartShelvesDialog(detail.type, detail.goodsNameList)
        })
        EventHelper.on(EventHelper.HUD_COMPLETE_SHOW, detail => {
            this.showComplete(detail.map)
        })
        EventHelper.on(EventHelper.HUD_OILGOLD_LOSE_SHOW, detail => {
            this.showOilGoldInfo(true)
        })
        EventHelper.on(EventHelper.HUD_OILGOLD_RECOVERY_SHOW, detail => {
            this.showOilGoldInfo(false)
        })
        EventHelper.on(EventHelper.HUD_INVENTORY_SHOW, detail => {
            this.showInventoryDialog(detail.id, detail.isCast)
        })
        EventHelper.on(EventHelper.HUD_CANCEL_OR_PAUSE, detail => {
            this.cancelOrPause()
        })
        EventHelper.on(EventHelper.HUD_STOP_COUNTTIME, detail => {
            this.startCountTime = false
        })
        EventHelper.on(EventHelper.HUD_FADE_IN, detail => {
            this.fadeIn()
        })
        EventHelper.on(EventHelper.HUD_FADE_OUT, detail => {
            this.fadeOut()
        })
        EventHelper.on(EventHelper.HUD_DOLL_MACHINE_DIALOG, detail => {
            this.showDollMachineDialog()
        })
        EventHelper.on(EventHelper.HUD_UPDATE_PLAYER_AMMO, detail => {
            this.ammoUpdate(detail.x, detail.y)
        })
        EventHelper.on(EventHelper.HUD_CELLPHONE_SHOW, detail => {
            this.showCellphoneDialog()
        })
        EventHelper.on(EventHelper.HUD_ACTION_SETTING_DIALOG, detail => {
            this.showActionSettingDialog()
        })
        EventHelper.on(EventHelper.HUD_QUEST_BOARD_SHOW, detail => {
            this.showQuestBoardDialog()
        })
        EventHelper.on(EventHelper.HUD_METAL_TALENT_SHOW, detail => {
            this.showMetalTalentDialog()
        })
        EventHelper.on(EventHelper.DIALOG_ALERT_SHOW, detail => {
            if (this.gameAlertDialog) {
                this.gameAlertDialog.init(detail.msg, detail.ok, detail.cancel)
                this.gameAlertDialog.show()
            }
        })
        if (this.clock) {
            this.clock.string = `${Utils.getPlayTime(Logic.totalTime)}`
        }
        if (this.level) {
            this.level.string = `${Logic.worldLoader.getCurrentLevelData().name}`
        }
        if (this.damageCorner) {
            this.damageCorner.opacity = 0
        }
        this.pasueButton.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.pauseGame()
        })
        this.zoomButton.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            EventHelper.emit(EventHelper.HUD_CAMERA_ZOOM_IN, {})
        })
        this.zoomButton.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            EventHelper.emit(EventHelper.HUD_CAMERA_ZOOM_OUT, {})
        })
        this.zoomButton.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            EventHelper.emit(EventHelper.HUD_CAMERA_ZOOM_OUT, {})
            EventHelper.emit(EventHelper.TEST_SHOW_NODE_COUNT)
        })
        let finalData = Logic.playerData.FinalCommon
        this.healthBarUpdate(Logic.playerData.currentHealth, Logic.playerData.getHealth(finalData).y)
        this.dreamBarUpdate(Logic.playerData.currentDream, Logic.playerData.getDream(finalData).y)
        this.ammoUpdate(Logic.playerData.currentAmmo, finalData.MaxAmmo)
        this.fadeIn()
        this.initFollowArrows()
    }
    private initFollowArrows() {
        this.arrowList.push(this.followArrows.getChildByName('arrow0'))
        this.arrowList.push(this.followArrows.getChildByName('arrow1'))
        this.arrowList.push(this.followArrows.getChildByName('arrow2'))
        this.arrowList.push(this.followArrows.getChildByName('arrow3'))
        for (let arrow of this.arrowList) {
            arrow.active = false
        }
    }
    private showOilGoldInfo(isLose: boolean) {
        if (!this.oilGoldLabel) {
            return
        }
        let arr0 = ['碎', '碎片', '碎片丢', '碎片丢失', '碎片丢失', '碎片丢失', '碎片丢失', '碎片丢失', '碎片丢失', '碎片丢失', '碎片丢', '碎片', '碎', '']
        let arr1 = ['碎', '碎片', '碎片找', '碎片找回', '碎片找回', '碎片找回', '碎片找回', '碎片找回', '碎片找回', '碎片找回', '碎片找', '碎片', '碎', '']
        if (!isLose) AudioPlayer.play(AudioPlayer.COMPLETE)
        let arr = isLose ? arr0 : arr1
        this.oilGoldLabel.node.color = isLose ? cc.Color.RED : cc.color().fromHEX('#EDB411')
        this.oilGoldLabel.node.parent.color = isLose ? cc.Color.RED : cc.color().fromHEX('#EDB411')
        let i = 0
        this.oilGoldLabel.string = ''
        this.oilGoldLabel.unscheduleAllCallbacks()
        let itl = 0.15
        cc.tween(this.oilGoldLabel.node.parent)
            .to(itl, { height: 80, width: 80 })
            .to(itl * 3, { width: 1000 })
            .delay(itl * arr.length)
            .to(itl, { height: 0 })
            .start()
        this.oilGoldLabel.schedule(
            () => {
                if (i < arr.length) {
                    this.oilGoldLabel.string = arr[i++]
                }
            },
            itl,
            arr.length
        )
    }
    private showComplete(map: Map<Number, Boolean>) {
        if (!this.completeLabel || this.isCompleteShowed) {
            return
        }
        let arr = ['清', '清理', '清理完', '清理完成', '清理完成', '清理完成', '清理完成', '清理完成', '清理完成', '清理完成', '清理完', '清理', '清', '']
        let i = 0
        this.completeLabel.string = ''
        this.completeLabel.unscheduleAllCallbacks()
        this.isCompleteShowed = true
        let itl = 0.1
        let delay = 0.5
        cc.tween(this.completeLabel.node.parent)
            .to(itl, { height: 80, width: 80 })
            .call(() => {
                AudioPlayer.play(AudioPlayer.COMPLETE)
            })
            .to(itl * 3, { width: 1000 })
            .delay(itl * arr.length)
            .to(itl, { height: 0 })
            .start()
        this.completeLabel.schedule(
            () => {
                if (i < arr.length) {
                    this.completeLabel.string = arr[i++]
                }
            },
            itl,
            arr.length,
            delay
        )
        if (map && map.size > 0) {
            for (let i = 0; i < 4; i++) {
                if (map.has(i)) {
                    this.arrowList[i].active = true
                    this.arrowList[i].getChildByName('sprite').color = map.get(i) ? cc.Color.WHITE : cc.color(55, 55, 55, 255)
                } else {
                    this.arrowList[i].active = false
                }
            }
        }
    }
    private fadeOut() {
        if (!this.node) {
            return
        }
        this.node.opacity = 255
        cc.tween(this.node).to(0.5, { opacity: 0 }).start()
    }
    private fadeIn() {
        if (!this.node) {
            return
        }
        this.node.opacity = 0
        cc.tween(this.node).to(3, { opacity: 255 }).start()
    }
    private statusUpdate(dataId: string) {
        if (!this.playerInfoDialog) {
            return
        }
        let data = Logic.getPlayerDataById(dataId)
        this.playerInfoDialog.refreshDialog(data, data.EquipmentTotalData, data.StatusTotalData)
    }

    private showDamageCorner() {
        if (!this.damageCorner) {
            return
        }
        this.damageCorner.stopAllActions()
        this.damageCorner.opacity = 255
        this.damageCorner.scale = 1
        cc.tween(this.damageCorner)
            .parallel(cc.tween(this.damageCorner).to(0.5, { scale: 1.05 }), cc.tween(this.damageCorner).to(1, { opacity: 0 }))
            .start()
    }
    private ammoUpdate(current: number, max: number): void {
        if (this.AmmoLabel) {
            this.AmmoLabel.string = `${current <= 0 ? '-' : current}/${max <= 0 ? '-' : max}`
            cc.tween(this.AmmoLabel.node).to(0.05, { scale: 1.05 }).to(0.05, { scale: 0.95 }).to(0.1, { scale: 1.05 }).to(0.05, { scale: 1 }).start()
        }
    }
    private healthBarUpdate(currentHealth, maxHealth): void {
        if (this.healthBar) {
            this.healthBar.refreshHealth(currentHealth, maxHealth)
        }
    }
    private dreamBarUpdate(currentHealth, maxHealth): void {
        if (this.dreamBar) {
            this.dreamBar.refreshHealth(currentHealth, maxHealth)
        }
    }
    private lifeBarUpdate(sanity: number, solid: number, poo: number, liquid: number, pee: number): void {
        if (this.satietyView) {
            this.satietyView.refreshPercent(sanity, solid, poo, liquid, pee)
        }
    }
    start() {}

    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 1) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    get HasModalDialogShow() {
        return (
            this.settingsDialog.node.active ||
            this.martShelvesDialog.node.active ||
            this.cellphoneDialog.node.active ||
            this.actionSettingDialog.node.active ||
            this.dollMachineDialog.node.active ||
            this.questBoardDialog.node.active ||
            this.metalTalentDialog.node.active ||
            this.dialogue.isShow ||
            this.inventoryDialog.node.active
        )
    }
    get IsTimeCountDialogShow() {
        return this.cellphoneDialog.node.active
    }
    closeCurrentOtherDialog() {
        if (this.martShelvesDialog.isShow) {
            this.martShelvesDialog.dismiss()
            return true
        }
        if (this.cellphoneDialog.isShow) {
            this.cellphoneDialog.dismiss()
            return true
        }
        if (this.actionSettingDialog.isShow) {
            this.actionSettingDialog.dismiss()
            return true
        }
        if (this.dollMachineDialog.isShow) {
            this.dollMachineDialog.dismiss()
            return true
        }
        if (this.questBoardDialog.isShow) {
            this.questBoardDialog.dismiss()
            return true
        }
        if (this.metalTalentDialog.isShow) {
            this.metalTalentDialog.dismiss()
            return true
        }
        if (this.inventoryDialog.isShow) {
            this.inventoryDialog.dismiss()
            return true
        }
        if (this.dialogue.isShow) {
            return true
        }
        return false
    }

    update(dt: number) {
        if (this.isCheckTimeDelay(dt)) {
            if (this.clock && this.startCountTime) {
                this.changeTime()
                this.clock.string = `${Utils.getPlayTime(Logic.totalTime)}`
            }
        }
        if (this.HasModalDialogShow) {
            Logic.isGamePause = true
        } else {
            Logic.isGamePause = false
        }
    }
    useItem() {}
    changeTime() {
        if (Logic.isGamePause && !this.IsTimeCountDialogShow) {
            return
        }
        Logic.totalTime += 1000
        if (Logic.isDreaming()) {
            Logic.dreamTime += 60000
        } else {
            Logic.realTime += 10000
        }
        EventHelper.emit(EventHelper.HUD_TIME_TICK)
    }

    private cancelOrPause() {
        if (!this.node) {
            return
        }
        AudioPlayer.play(AudioPlayer.SELECT)
        if (this.closeCurrentOtherDialog()) {
            return
        }
        this.showSettingsDialog()
    }
    //button
    showCellphoneDialog(): void {
        if (!this.cellphoneDialog) {
            return
        }
        if (this.cellphoneDialog.isShow) {
            this.cellphoneDialog.dismiss()
        } else {
            this.cellphoneDialog.show()
        }
    }
    showActionSettingDialog(): void {
        if (!this.actionSettingDialog) {
            return
        }
        if (this.actionSettingDialog.isShow) {
            this.actionSettingDialog.dismiss()
        } else {
            this.actionSettingDialog.show()
        }
    }
    //button
    pauseGame(): void {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.showSettingsDialog()
    }
    //button
    showInventoryDialog(id: string, isCast: boolean) {
        if (!this.node) {
            return
        }
        AudioPlayer.play(AudioPlayer.SELECT)
        if (this.inventoryDialog.isShow) {
            this.inventoryDialog.dismiss()
        } else if (id && id.length > 0) {
            this.inventoryDialog.showFurniture(id)
        } else if (isCast) {
            this.inventoryDialog.showCast()
        } else {
            this.inventoryDialog.show()
        }
    }
    showSettingsDialog() {
        if (!this.node) {
            return
        }
        if (this.settingsDialog.isShow) {
            this.settingsDialog.dismiss()
            cc.director.getScheduler().setTimeScale(1)
        } else {
            this.scheduleOnce(() => {
                if (this.settingsDialog.isShow && !this.settingsDialog.isAniming) {
                    cc.director.getScheduler().setTimeScale(0)
                } else {
                    cc.director.getScheduler().setTimeScale(1)
                }
            }, 1)

            this.settingsDialog.show()
        }
    }
    showMartShelvesDialog(type: string, goodsList: string[]) {
        if (!this.martShelvesDialog) {
            return
        }
        if (this.martShelvesDialog.isShow) {
            this.martShelvesDialog.dismiss()
        } else {
            this.martShelvesDialog.updateUI(type, goodsList)
            this.martShelvesDialog.show()
        }
    }
    showDollMachineDialog() {
        if (!this.dollMachineDialog) {
            return
        }
        if (this.dollMachineDialog.isShow) {
            this.dollMachineDialog.dismiss()
        } else {
            this.dollMachineDialog.show()
        }
    }
    showQuestBoardDialog() {
        if (!this.questBoardDialog) {
            return
        }
        if (this.questBoardDialog.isShow) {
            this.questBoardDialog.dismiss()
        } else {
            this.questBoardDialog.show()
        }
    }
    showMetalTalentDialog() {
        if (!this.metalTalentDialog) {
            return
        }
        if (this.metalTalentDialog.isShow) {
            this.metalTalentDialog.dismiss()
        } else {
            this.metalTalentDialog.show()
        }
    }
}
