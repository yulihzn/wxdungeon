// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from "../../EventHelper";
import Logic from "../../Logic";
import LocalStorage from "../../Utils/LocalStorage";
import BaseDialog from "./BaseDialog";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingsDialog extends BaseDialog {

    @property(cc.Toggle)
    tgShadow:cc.Toggle = null;

    onLoad () {
    }

    start () {

    }
    show(){
        super.show();
        if(LocalStorage.isSwitchOpen(LocalStorage.KEY_SWITCH_SHOW_SHADOW)){
            this.tgShadow.check()
        }else{
            this.tgShadow.uncheck();
        }
    }

    // update (dt) {}

    toggleShadow(toggle:cc.Toggle, customEventData:string){
        Logic.settings.showShadow = toggle.isChecked;
        LocalStorage.saveSwitch(LocalStorage.KEY_SWITCH_SHOW_SHADOW,Logic.settings.showShadow);
    }
    close(){
        this.dismiss();
    }
    home(){
        cc.director.emit(EventHelper.PLAYER_EXIT_FROM_SETTINGS);
    }
}
