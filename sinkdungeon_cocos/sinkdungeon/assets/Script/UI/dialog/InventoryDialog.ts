// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EquipmentDialog from "../../Equipment/EquipmentDialog";
import ItemDialog from "../../Item/ItemDialog";
import BaseDialog from "./BaseDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InventoryDialog extends BaseDialog {
    @property(cc.Prefab)
    item: cc.Prefab = null;
    @property(cc.Node)
    layout:cc.Node=null;
    @property(cc.ToggleContainer)
    toggleContainer:cc.ToggleContainer=null;
    @property(EquipmentDialog)
    equipmentDialog:EquipmentDialog=null;
    @property(ItemDialog)
    itemDialog:ItemDialog=null;
    @property(cc.Node)
    useButton:cc.Node=null;
    @property(cc.Node)
    dropButton:cc.Node=null;
    onLoad() {
    }

    start() {

    }
    show() {
        super.show();

    }

    // update (dt) {}

    close() {
        this.dismiss();
    }

}
