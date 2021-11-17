// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from "../../logic/EventHelper";
import Logic from "../../logic/Logic";
import AudioPlayer from "../../utils/AudioPlayer";
import LocalStorage from "../../utils/LocalStorage";
import BaseDialog from "./BaseDialog";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingsDialog extends BaseDialog {

    @property(cc.Toggle)
    tgShadow:cc.Toggle = null;
    @property(cc.Toggle)
    tgGamepad:cc.Toggle = null;
    @property(cc.Toggle)
    tgFps:cc.Toggle = null;
    onLoad () {
    }

    start () {

    }
    show(){
        super.show();
        this.initToggle(this.tgShadow,LocalStorage.isSwitchOpen(LocalStorage.KEY_SWITCH_SHOW_SHADOW));
        this.initToggle(this.tgGamepad,LocalStorage.isSwitchOpen(LocalStorage.KEY_SWITCH_SHOW_GAMEPAD));
        this.initToggle(this.tgFps,LocalStorage.isSwitchOpen(LocalStorage.KEY_SWITCH_LOW_POWER));
        
    }
    private initToggle(toggle:cc.Toggle,isOpen:boolean){
        if(isOpen){
            toggle.check();
        }else{
            toggle.uncheck();
        }
    }

    // update (dt) {}

    toggleShadow(toggle:cc.Toggle, customEventData:string){
        AudioPlayer.play(AudioPlayer.SELECT);
        Logic.settings.showShadow = toggle.isChecked;
        LocalStorage.saveSwitch(LocalStorage.KEY_SWITCH_SHOW_SHADOW,Logic.settings.showShadow);
    }
    toggleGamepad(toggle:cc.Toggle, customEventData:string){
        AudioPlayer.play(AudioPlayer.SELECT);
        Logic.settings.showGamepad = toggle.isChecked;
        LocalStorage.saveSwitch(LocalStorage.KEY_SWITCH_SHOW_GAMEPAD,Logic.settings.showGamepad);
        cc.director.emit(EventHelper.HUD_CONTROLLER_UPDATE_GAMEPAD);
    }
    toggleFps(toggle:cc.Toggle, customEventData:string){
        AudioPlayer.play(AudioPlayer.SELECT);
        Logic.settings.lowPower = toggle.isChecked;
        LocalStorage.saveSwitch(LocalStorage.KEY_SWITCH_LOW_POWER,Logic.settings.lowPower);
        cc.director.emit(EventHelper.SETTINGS_LOW_POWER);
    }
    close(){
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.getScheduler().setTimeScale(1);
        this.dismiss();
    }
    home(){
        AudioPlayer.play(AudioPlayer.SELECT);
        Logic.saveData();
        cc.director.loadScene('start');
    }
}
