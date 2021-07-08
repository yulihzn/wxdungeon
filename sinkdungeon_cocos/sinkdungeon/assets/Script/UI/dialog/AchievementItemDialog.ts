// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EquipmentData from "../../Data/EquipmentData";
import ItemData from "../../Data/ItemData";
import NonPlayerData from "../../Data/NonPlayerData";
import Logic from "../../Logic";
import AudioPlayer from "../../Utils/AudioPlayer";
import BaseDialog from "./BaseDialog";
import EquipmentAndItemDialog from "./EquipmentAndItemDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AchievementItemDialog extends BaseDialog {
    @property(cc.Prefab)
    equipmentAndItemDialogPrefab:cc.Prefab = null;
    equipmentAndItemDialog: EquipmentAndItemDialog= null;
    @property(cc.Sprite)
    icon:cc.Sprite = null;
    onLoad() {
        this.equipmentAndItemDialog = this.initDialog();
    }
    private initDialog(){
        let node = cc.instantiate(this.equipmentAndItemDialogPrefab);
        node.parent = this.node;
        let dialog = node.getComponent(EquipmentAndItemDialog);
        dialog.changeBgAndAnchor(EquipmentAndItemDialog.BG_TYPE_ARROW_NONE);
        dialog.hideDialog();
        return dialog;
    }

    start() {

    }
    show(nonPlayerData?:NonPlayerData,itemData?:ItemData,equipData?:EquipmentData,spriteFrame?:cc.SpriteFrame) {
        super.show();
        if(spriteFrame){
            this.icon.spriteFrame = spriteFrame;
        }
        this.equipmentAndItemDialog.showDialog(cc.v3(80,230),nonPlayerData,itemData,equipData);
    }

    close() {
        AudioPlayer.play(AudioPlayer.SELECT);
        this.dismiss();
    }

}
