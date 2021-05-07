// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import InventoryData from "../../Data/InventoryData";
import Equipment from "../../Equipment/Equipment";
import EquipmentDialog from "../../Equipment/EquipmentDialog";
import { EventHelper } from "../../EventHelper";
import Item from "../../Item/Item";
import ItemDialog from "../../Item/ItemDialog";
import Logic from "../../Logic";
import InventoryManager from "../../Manager/InventoryManager";
import InventoryItem from "../InventoryItem";
import BaseDialog from "./BaseDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InventoryDialog extends BaseDialog {
    @property(cc.Prefab)
    item: cc.Prefab = null;
    @property(cc.Node)
    layout: cc.Node = null;
    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;
    @property(EquipmentDialog)
    equipmentDialog: EquipmentDialog = null;
    @property(ItemDialog)
    itemDialog: ItemDialog = null;
    @property(cc.Node)
    useButton: cc.Node = null;
    @property(cc.Node)
    dropButton: cc.Node = null;
    list: InventoryItem[] = [];
    @property(cc.Node)
    select: cc.Node = null;
    currentSelectItem: InventoryItem;
    onLoad() {
        this.select.opacity = 0;
        this.layout.removeAllChildren();
        for (let i = 0; i < InventoryManager.INVENTORY_MAX; i++) {
            let data = new InventoryData();
            data.index = i;
            data.createTime = new Date().getTime();
            this.list.push(this.getItem(data));
        }
    }
    private getItem(data: InventoryData) {
        let prefab = cc.instantiate(this.item);
        prefab.parent = this.layout;
        let item = prefab.getComponent(InventoryItem);
        item.init(this, data);
        return item;
    }

    start() {

    }
    show() {
        super.show();
        this.updateList();
    }
    clearSelect() {
        this.currentSelectItem = null;
        this.itemDialog.hideDialog();
        this.equipmentDialog.hideDialog();
        this.useButton.active = false;
        this.dropButton.active = false;
        this.select.opacity = 0;
    }
    showSelect(item: InventoryItem) {
        this.currentSelectItem = item;
        this.select.position = this.node.convertToNodeSpaceAR(item.node.convertToWorldSpaceAR(cc.Vec3.ZERO));
        this.select.opacity = 200;
        if (item.data.type == InventoryItem.TYPE_EQUIP) {
            this.useButton.active = true;
            this.dropButton.active = true;
            this.itemDialog.hideDialog();
            this.equipmentDialog.showDialog(item.data.equipmentData);
        } else {
            this.useButton.active = true;
            this.dropButton.active = true;
            this.equipmentDialog.hideDialog();
            this.itemDialog.showDialog(item.data.itemData);
        }
    }
    updateList() {
        let list: InventoryData[] = [];
        this.clearSelect();
        for (let i = 0; i < InventoryManager.INVENTORY_MAX; i++) {
            if (i < Logic.inventoryManager.inventoryList.length && Logic.inventoryManager.inventoryList[i].type != InventoryItem.TYPE_EMPTY) {
                let data = Logic.inventoryManager.inventoryList[i];
                data.index = i;
                this.list[i].init(this, data);
                list.push(Logic.inventoryManager.inventoryList[i]);
            } else {
                this.list[i].data.index = i;
                this.list[i].setEmpty();
            }
        }
        list.sort((a, b) => {
            return a.createTime - b.createTime;
        });
        Logic.inventoryManager.inventoryList = list;
    }
    //button
    use() {
        if (!this.currentSelectItem || this.currentSelectItem.data.type == InventoryItem.TYPE_EMPTY) {
            return;
        }
        if (this.currentSelectItem.data.type == InventoryItem.TYPE_EQUIP) {
            let equipData = this.currentSelectItem.data.equipmentData;
            EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipData: equipData, isReplace: true, index: this.currentSelectItem.data.index });
            this.currentSelectItem.setEmpty();
            this.clearSelect();
        } else {
            let itemData = this.currentSelectItem.data.itemData;
            EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemData: itemData, isReplace: true, index: this.currentSelectItem.data.index });
            this.currentSelectItem.setEmpty();
            this.clearSelect();
        }
    }
    //button
    drop() {
        if (!this.currentSelectItem || this.currentSelectItem.data.type == InventoryItem.TYPE_EMPTY) {
            return;
        }
        if (this.currentSelectItem.data.type == InventoryItem.TYPE_EQUIP) {
            let equipData = this.currentSelectItem.data.equipmentData;
            if (equipData.equipmetType != Equipment.EMPTY) {
                EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: equipData.img, equipmentData: equipData });
            }
        } else {
            let itemData = this.currentSelectItem.data.itemData;
            if (itemData.resName != Item.EMPTY) {
                EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM
                    , { res: itemData.resName, count: itemData.count })
            }
        }
        Logic.inventoryManager.inventoryList[this.currentSelectItem.data.index].setEmpty();
        this.list[this.currentSelectItem.data.index].setEmpty();
        this.currentSelectItem.setEmpty();
        this.clearSelect();
    }
    // update (dt) {}

    close() {
        this.dismiss();
    }

}
