// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import InventoryData from "../../Data/InventoryData";
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
    currentSelectIndex: number;
    onLoad() {
        this.select.opacity = 0;
        this.layout.removeAllChildren();
        for (let i = 0; i < InventoryManager.INVENTORY_MAX; i++) {
            let data = new InventoryData();
            data.createTime = new Date().getTime();
            this.list.push(this.getItem(i, data));
        }
        cc.director.on(EventHelper.HUD_INVENTORY_ALL_UPDATE
            , (event) => {
                if (this.node) {
                    this.updateList(Logic.bagSortIndex);
                }
            });
        cc.director.on(EventHelper.HUD_INVENTORY_ITEM_UPDATE
            , (event) => {
                if (this.node) {
                    let data = Logic.inventoryManager.inventoryList[event.detail.index];
                    this.list[event.detail.index].updateData(data);
                }
            });
        this.toggleContainer.toggleItems[Logic.bagSortIndex].isChecked = true;
    }
    private getItem(index: number, data: InventoryData) {
        let prefab = cc.instantiate(this.item);
        prefab.parent = this.layout;
        let item = prefab.getComponent(InventoryItem);
        item.init(this, index, data);
        return item;
    }

    start() {

    }
    show() {
        super.show();
        this.updateList(Logic.bagSortIndex);
    }
    //toggle
    changeSort(toggle: cc.Toggle, index: number) {
        Logic.bagSortIndex = index;
        this.updateList(index);
    }
    clearSelect() {
        this.currentSelectIndex = -1;
        this.itemDialog.hideDialog();
        this.equipmentDialog.hideDialog();
        this.useButton.active = false;
        this.dropButton.active = false;
        this.select.opacity = 0;
    }
    showSelect(item: InventoryItem) {
        this.currentSelectIndex = item.index;
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
    updateList(sortIndex: number) {
        this.clearSelect();
        let itemlist: InventoryData[] = [];
        let equiplist: InventoryData[] = [];
        let list: InventoryData[] = [];
        for (let i = 0; i < Logic.inventoryManager.inventoryList.length; i++) {
            let data = Logic.inventoryManager.inventoryList[i];
            if (data.type != InventoryItem.TYPE_EMPTY) {
                list.push(data);
                if (data.type == InventoryItem.TYPE_EQUIP) {
                    equiplist.push(data);
                } else if (data.type == InventoryItem.TYPE_ITEM) {
                    itemlist.push(data);
                }
            }
        }
        if (sortIndex == 0) {
            list.sort((a, b) => {
                return a.createTime - b.createTime;
            });
        } else if (sortIndex == 1) {
            itemlist.sort((a, b) => {
                return a.createTime - b.createTime;
            });
            equiplist.sort((a, b) => {
                return a.createTime - b.createTime;
            });
            list = equiplist.concat(itemlist);
        } else if (sortIndex == 2) {
            itemlist.sort((a, b) => {
                return a.createTime - b.createTime;
            });
            equiplist.sort((a, b) => {
                return b.equipmentData.level - a.equipmentData.level;
            });
            list = equiplist.concat(itemlist);
        }
        for (let i = 0; i < InventoryManager.INVENTORY_MAX; i++) {
            if (i < list.length && list[i].type != InventoryItem.TYPE_EMPTY) {
                let data = list[i];
                this.list[i].updateData(data);
            } else {
                this.list[i].setEmpty();
            }
        }
        Logic.inventoryManager.inventoryList = list;
    }
    //button 装备
    use() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1 || this.list[this.currentSelectIndex].data.type == InventoryItem.TYPE_EMPTY) {
            return;
        }
        let current = this.list[this.currentSelectIndex];
        if (current.data.type == InventoryItem.TYPE_EQUIP) {
            let equipData = current.data.equipmentData.clone();
            if (equipData.equipmetType != InventoryManager.EMPTY) {
                //置空当前放下的数据，清除选中
                Logic.inventoryManager.inventoryList[this.currentSelectIndex].setEmpty();
                this.list[this.currentSelectIndex].setEmpty();
                EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipData: equipData, isReplace: true, index: this.currentSelectIndex });
            }
        } else {
            let itemData = current.data.itemData.clone();
            if (itemData.resName != Item.EMPTY) {
                //置空当前放下的数据，清除选中
                Logic.inventoryManager.inventoryList[this.currentSelectIndex].setEmpty();
                this.list[this.currentSelectIndex].setEmpty();
                EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemData: itemData, isReplace: true, index: this.currentSelectIndex });
            }
        }

        this.clearSelect();
    }
    //button 放下
    drop() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1 || this.list[this.currentSelectIndex].data.type == InventoryItem.TYPE_EMPTY) {
            return;
        }
        let current = this.list[this.currentSelectIndex];
        if (current.data.type == InventoryItem.TYPE_EQUIP) {
            let equipData = current.data.equipmentData;
            if (equipData.equipmetType != InventoryManager.EMPTY) {
                EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: equipData.img, equipmentData: equipData });
            }
        } else {
            let itemData = current.data.itemData;
            if (itemData.resName != Item.EMPTY) {
                EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM
                    , { res: itemData.resName, count: itemData.count })
            }
        }
        //置空当前放下的数据，清除选中
        Logic.inventoryManager.inventoryList[this.currentSelectIndex].setEmpty();
        this.list[this.currentSelectIndex].setEmpty();
        this.clearSelect();
    }
    // update (dt) {}

    close() {
        this.dismiss();
    }

}