// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EquipmentData from "../../Data/EquipmentData";
import FurnitureData from "../../Data/FurnitureData";
import ItemData from "../../Data/ItemData";
import NonPlayerData from "../../Data/NonPlayerData";
import EquipmentManager from "../../Manager/EquipmentManager";
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
        dialog.changeBgAndAnchor(EquipmentAndItemDialog.BG_TYPE_NONE);
        dialog.hideDialog();
        return dialog;
    }

    start() {

    }
    show(nonPlayerData?:NonPlayerData,itemData?:ItemData,equipData?:EquipmentData,furnitureData?:FurnitureData,spriteFrame?:cc.SpriteFrame) {
        super.show();
        if(spriteFrame){
            this.icon.spriteFrame = spriteFrame;
            this.icon.node.width = 160;
            this.icon.node.height = 160/spriteFrame.getRect().width*spriteFrame.getRect().height;
        }
        
        if(equipData){
            equipData = EquipmentManager.getOriginEquipData(equipData.img);
        }
        this.equipmentAndItemDialog.showDialog(cc.v3(80,150),nonPlayerData,itemData,equipData,null);
    }

    close() {
        AudioPlayer.play(AudioPlayer.SELECT);
        this.dismiss();
    }

}
