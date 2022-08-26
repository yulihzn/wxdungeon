// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from '../../logic/EventHelper'
import Logic from '../../logic/Logic'
import AudioPlayer from '../../utils/AudioPlayer'
import LocalStorage from '../../utils/LocalStorage'
import BaseDialog from './BaseDialog'

const { ccclass, property } = cc._decorator

@ccclass
export default class SettingsDialog extends BaseDialog {
    @property(cc.Toggle)
    tgShadow: cc.Toggle = null
    @property(cc.Toggle)
    tgGamepad: cc.Toggle = null
    @property(cc.Toggle)
    tgFps: cc.Toggle = null
    @property(cc.Node)
    pcInfo: cc.Node = null
    onLoad() {}

    start() {}
    show() {
        super.show()
        this.pcInfo.active = !Logic.settings.showGamepad
        this.initToggle(this.tgShadow, Logic.settings.showSoftShadow)
        this.initToggle(this.tgGamepad, Logic.settings.showGamepad)
        this.initToggle(this.tgFps, Logic.settings.lowPower)
    }
    private initToggle(toggle: cc.Toggle, isOpen: boolean) {
        if (isOpen) {
            toggle.check()
        } else {
            toggle.uncheck()
        }
    }

    // update (dt) {}

    toggleShadow(toggle: cc.Toggle, customEventData: string) {
        AudioPlayer.play(AudioPlayer.SELECT)
        Logic.settings.showSoftShadow = toggle.isChecked
        LocalStorage.saveSystemSettings(Logic.settings)
    }
    toggleGamepad(toggle: cc.Toggle, customEventData: string) {
        AudioPlayer.play(AudioPlayer.SELECT)
        Logic.settings.showGamepad = toggle.isChecked
        LocalStorage.saveSystemSettings(Logic.settings)
        this.pcInfo.active = !Logic.settings.showGamepad
        EventHelper.emit(EventHelper.HUD_CONTROLLER_UPDATE_GAMEPAD)
    }
    toggleFps(toggle: cc.Toggle, customEventData: string) {
        AudioPlayer.play(AudioPlayer.SELECT)
        Logic.settings.lowPower = toggle.isChecked
        LocalStorage.saveSystemSettings(Logic.settings)
        EventHelper.emit(EventHelper.SETTINGS_LOW_POWER)
    }
    close() {
        cc.director.getScheduler().setTimeScale(1)
        AudioPlayer.play(AudioPlayer.SELECT)
        this.dismiss()
    }
    home() {
        AudioPlayer.play(AudioPlayer.SELECT)
        // Logic.saveData();
        cc.director.getScheduler().setTimeScale(1)
        cc.director.loadScene('start')
    }
}
