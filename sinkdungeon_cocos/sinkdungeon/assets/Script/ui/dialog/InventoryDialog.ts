// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AvatarData from "../../data/AvatarData";
import InventoryData from "../../data/InventoryData";
import { EventHelper } from "../../logic/EventHelper";
import Item from "../../item/Item";
import Logic from "../../logic/Logic";
import InventoryManager from "../../manager/InventoryManager";
import AudioPlayer from "../../utils/AudioPlayer";
import InventoryItem from "../InventoryItem";
import BaseDialog from "./BaseDialog";
import EquipmentAndItemDialog from "./EquipmentAndItemDialog";
import Utils from "../../utils/Utils";
import Talent from "../../talent/Talent";
import Inventory from "../../logic/Inventory";
import EquipmentData from "../../data/EquipmentData";
import ItemData from "../../data/ItemData";
import FurnitureData from "../../data/FurnitureData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InventoryDialog extends BaseDialog {
    @property(cc.Prefab)
    item: cc.Prefab = null;
    @property(cc.Node)
    layer:cc.Node = null;
    @property(cc.Node)
    layout: cc.Node = null;
    @property(cc.Node)
    layoutEquip: cc.Node = null;
    @property(cc.Node)
    layoutItem: cc.Node = null;
    @property(cc.Node)
    layoutOther: cc.Node = null;
    @property(cc.Node)
    otherDialog: cc.Node = null;
    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;
    @property(cc.Prefab)
    equipmentAndItemDialogPrefab: cc.Prefab = null;
    @property(cc.Node)
    useButton: cc.Node = null;
    @property(cc.Node)
    dropButton: cc.Node = null;
    @property(cc.Node)
    saleButton: cc.Node = null;
    list: InventoryItem[] = [];
    equipList: InventoryItem[] = [];
    itemList: InventoryItem[] = [];
    otherList: InventoryItem[] = [];
    furnitureId:string = '';
    @property(cc.Node)
    select: cc.Node = null;
    @property(cc.Label)
    discountLabel: cc.Label = null;
    currentSelectIndex: number;
    discount = 0.5;
    equipmentAndItemDialog: EquipmentAndItemDialog = null;
    onLoad() {
        this.select.opacity = 0;
        this.equipmentAndItemDialog = this.initDialog();
        this.layout.removeAllChildren();
        for (let i = 0; i < InventoryManager.INVENTORY_MAX; i++) {
            let data = new InventoryData();
            data.createTime = new Date().getTime();
            this.list.push(this.getItem(i, data, this.layout));
        }
        this.layoutEquip.removeAllChildren();
        for (let i = 0; i < InventoryManager.INVENTORY_EQUIP_MAX; i++) {
            let data = new InventoryData();
            data.createTime = new Date().getTime();
            this.equipList.push(this.getItem(InventoryManager.INVENTORY_MAX + i, data, this.layoutEquip));
        }
        this.layoutItem.removeAllChildren();
        for (let i = 0; i < InventoryManager.INVENTORY_ITEM_MAX; i++) {
            let data = new InventoryData();
            data.createTime = new Date().getTime();
            this.itemList.push(this.getItem(InventoryManager.INVENTORY_MAX + InventoryManager.INVENTORY_EQUIP_MAX + i, data, this.layoutItem));
        }
        this.layoutOther.removeAllChildren();
        EventHelper.on(EventHelper.HUD_INVENTORY_ALL_UPDATE
            , (detail) => {
                if (this.node) {
                    this.updateList(Logic.bagSortIndex);
                    this.updateEquipList();
                    this.updateItemList();
                    if(this.furnitureId.length>0){
                        this.updateOtherList(Logic.sortIndexs[this.furnitureId]);
                    }
                }
            });
        EventHelper.on(EventHelper.HUD_INVENTORY_EQUIP_UPDATE
            , (detail) => {
                if (this.node) {
                    this.updateEquipList();
                }
            });
        EventHelper.on(EventHelper.HUD_INVENTORY_ITEM_UPDATE
            , (detail) => {
                if (this.node) {
                    this.updateItemList();
                }
            });
        EventHelper.on(EventHelper.HUD_INVENTORY_SELECT_UPDATE
            , (detail) => {
                if (this.node) {
                    let data = Logic.inventoryManager.inventoryList[detail.index];
                    this.list[detail.index].updateData(data);
                }
            });
        this.toggleContainer.toggleItems[Logic.bagSortIndex].isChecked = true;
        if (Logic.playerData.AvatarData.organizationIndex == AvatarData.HUNTER) {
            this.discount += 0.1;
        }
        if (Talent.TALENT_010 == Logic.playerData.AvatarData.professionData.talent) {
            this.discount += 0.1;
        }
    }
    private initDialog() {
        let node = cc.instantiate(this.equipmentAndItemDialogPrefab);
        node.parent = this.node.getChildByName('layer');
        let dialog = node.getComponent(EquipmentAndItemDialog);
        dialog.changeBgAndAnchor(EquipmentAndItemDialog.BG_TYPE_ARROW_NONE);
        dialog.hideDialog();
        return dialog;
    }
    private getItem(index: number, data: InventoryData, layout: cc.Node) {
        let prefab = cc.instantiate(this.item);
        prefab.parent = layout;
        let item = prefab.getComponent(InventoryItem);
        item.init(this, index, data);
        return item;
    }

    start() {

    }
    show() {
        this.furnitureId = '';
        this.layer.x = 0;
        this.otherDialog.active = false;
        super.show();
        this.updateList(Logic.bagSortIndex);
        this.updateEquipList();
        this.updateItemList();
        this.updateOtherList(0);
    }
    showFurniture(id:string){
        this.layer.x = 0;
        this.otherDialog.active = true;
        this.furnitureId = id;
        super.show();
        cc.tween(this.layer).delay(0.3).to(0.5,{x:145}).start();
        this.updateList(Logic.bagSortIndex);
        this.updateEquipList();
        this.updateItemList();
        this.updateOtherList(Logic.sortIndexs[id]);
    }
    //toggle
    changeSort(toggle: cc.Toggle, index: number) {
        Logic.bagSortIndex = index;
        this.updateList(index);
    }
    changeFurnitureSort(toggle: cc.Toggle, index: number) {
        Logic.sortIndexs[this.furnitureId] = index;
        this.updateOtherList(index);
    }
    clearSelect() {
        this.currentSelectIndex = -1;
        this.equipmentAndItemDialog.hideDialog();
        this.useButton.active = false;
        this.dropButton.active = false;
        this.saleButton.active = false;
        this.select.opacity = 0;
    }
    showSelect(item: InventoryItem) {
        this.currentSelectIndex = item.index;
        this.select.position = this.node.convertToNodeSpaceAR(item.node.convertToWorldSpaceAR(cc.Vec3.ZERO));
        this.select.opacity = 200;
        this.useButton.getComponentInChildren(cc.Label).string = this.currentSelectIndex >= InventoryManager.INVENTORY_MAX ? '卸下' : '装备';
        if(this.furnitureId.length>0){
            if(this.currentSelectIndex >= InventoryManager.INVENTORY_MAX+InventoryManager.INVENTORY_EQUIP_MAX+InventoryManager.INVENTORY_ITEM_MAX){
                this.dropButton.getComponentInChildren(cc.Label).string = '取出';
            }else{
                this.dropButton.getComponentInChildren(cc.Label).string = '存入';
            }
        }else{
            this.dropButton.getComponentInChildren(cc.Label).string = '放下';
        }
        
        AudioPlayer.play(AudioPlayer.SELECT);
        if (item.data.type == InventoryItem.TYPE_EQUIP) {
            this.discountLabel.string = `-${this.discount * 100}%(${Math.floor(item.data.equipmentData.price * this.discount)})`;
            this.useButton.active = true;
            this.dropButton.active = true;
            this.saleButton.active = true;
            this.equipmentAndItemDialog.showDialog(cc.v3(420, 260), null, null, item.data.equipmentData, null);
        } else {
            this.discountLabel.string = `-${this.discount * 100}%(${Math.floor(item.data.itemData.count > 1 ? item.data.itemData.price * item.data.itemData.count * this.discount : item.data.itemData.price * this.discount)})`;
            this.useButton.active = true;
            this.dropButton.active = true;
            this.saleButton.active = true;
            this.equipmentAndItemDialog.showDialog(cc.v3(420, 160), null, item.data.itemData, null, null);
        }
    }

    private updateItemList() {
        let itemlist: InventoryData[] = [];
        for (let itemdata of Logic.inventoryManager.itemList) {
            let data = Inventory.buildItemInventoryData(itemdata);
            itemlist.push(data);
        }
        for (let i = 0; i < InventoryManager.INVENTORY_ITEM_MAX; i++) {
            if (i < itemlist.length && itemlist[i].type != InventoryItem.TYPE_EMPTY) {
                let data = itemlist[i];
                this.itemList[i].updateData(data);
            } else {
                this.itemList[i].setEmpty();
            }
        }
    }
    private updateEquipList() {
        let equiplist: InventoryData[] = [];
        for (let key in Logic.inventoryManager.equips) {
            let equipdata = Logic.inventoryManager.equips[key];
            let needAdd = false;
            if (key != InventoryManager.REMOTE && key != InventoryManager.SHIELD) {
                needAdd = true;
            } else {
                if (key == InventoryManager.REMOTE) {
                    if (equipdata.equipmetType == InventoryManager.REMOTE || Logic.inventoryManager.equips[InventoryManager.SHIELD].equipmetType == InventoryManager.EMPTY) {
                        needAdd = true;
                    }
                } else if (key == InventoryManager.SHIELD) {
                    if (equipdata.equipmetType == InventoryManager.SHIELD) {
                        needAdd = true;
                    }
                }
            }
            if (needAdd) {
                let data = Inventory.bulidEquipInventoryData(equipdata);
                equiplist.push(data);
            }
        }
        for (let i = 0; i < InventoryManager.INVENTORY_EQUIP_MAX; i++) {
            if (i < equiplist.length && equiplist[i].type != InventoryItem.TYPE_EMPTY) {
                let data = equiplist[i];
                this.equipList[i].updateData(data);
            } else {
                this.equipList[i].setEmpty();
            }
        }
    }
    
    private updateOtherList(sortIndex: number) {
        this.clearSelect();
        this.otherList = [];
        this.layoutOther.removeAllChildren();
        if(this.furnitureId.length<1){
            return;
        }
        let furnitureData = Logic.inventoryManager.furnitureMap.get(this.furnitureId);
        if(!furnitureData){
            return;
        }
        for (let i = 0; i < furnitureData.storageList.length; i++) {
            let data = new InventoryData();
            data.valueCopy(furnitureData.storageList[i]);
            this.otherList.push(this.getItem(InventoryManager.INVENTORY_MAX + InventoryManager.INVENTORY_EQUIP_MAX + InventoryManager.INVENTORY_ITEM_MAX + i, data, this.layoutOther));
        }
        let list = this.getSortList(sortIndex,furnitureData.storageList);
        for (let i = 0; i < furnitureData.storage; i++) {
            if (i < list.length && list[i].type != InventoryItem.TYPE_EMPTY) {
                let data = list[i];
                this.list[i].updateData(data);
            } else {
                this.list[i].setEmpty();
            }
        }
        furnitureData.storageList = list;
    }
    private updateList(sortIndex: number) {
        this.clearSelect();
        // let itemlist: InventoryData[] = [];
        // let equiplist: InventoryData[] = [];
        // let list: InventoryData[] = [];
        // for (let i = 0; i < Logic.inventoryManager.inventoryList.length; i++) {
        //     let data = Logic.inventoryManager.inventoryList[i];
        //     if (data.type != InventoryItem.TYPE_EMPTY) {
        //         list.push(data);
        //         if (data.type == InventoryItem.TYPE_EQUIP) {
        //             equiplist.push(data);
        //         } else if (data.type == InventoryItem.TYPE_ITEM) {
        //             itemlist.push(data);
        //         }
        //     }
        // }
        let list = this.getSortList(sortIndex,Logic.inventoryManager.inventoryList);
        // if (sortIndex == 0) {//时间排序
        //     list.sort((a, b) => {
        //         return a.createTime - b.createTime;
        //     });
        // } else if (sortIndex == 1) {//类别排序
        //     list.sort((a, b) => {
        //         return a.id - b.id;
        //     });
        // } else if (sortIndex == 2) {//品质排序
        //     itemlist.sort((a, b) => {
        //         return a.id - b.id;
        //     });
        //     equiplist.sort((a, b) => {
        //         return b.equipmentData.level - a.equipmentData.level;
        //     });
        //     list = equiplist.concat(itemlist);
        // } else if (sortIndex == 3) {//价格排序
        //     list.sort((a, b) => {
        //         return b.price - a.price;
        //     });
        // }
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
    private getSortList(sortIndex: number,inventoryList:InventoryData[]){
        let itemlist: InventoryData[] = [];
        let equiplist: InventoryData[] = [];
        let list: InventoryData[] = [];
        for (let i = 0; i < inventoryList.length; i++) {
            let data = inventoryList[i];
            if (data.type != InventoryItem.TYPE_EMPTY) {
                list.push(data);
                if (data.type == InventoryItem.TYPE_EQUIP) {
                    equiplist.push(data);
                } else if (data.type == InventoryItem.TYPE_ITEM) {
                    itemlist.push(data);
                }
            }
        }
        if (sortIndex == 0) {//时间排序
            list.sort((a, b) => {
                return a.createTime - b.createTime;
            });
        } else if (sortIndex == 1) {//类别排序
            list.sort((a, b) => {
                return a.id - b.id;
            });
        } else if (sortIndex == 2) {//品质排序
            itemlist.sort((a, b) => {
                return a.id - b.id;
            });
            equiplist.sort((a, b) => {
                return b.equipmentData.level - a.equipmentData.level;
            });
            list = equiplist.concat(itemlist);
        } else if (sortIndex == 3) {//价格排序
            list.sort((a, b) => {
                return b.price - a.price;
            });
        }
        return list;
    }
  
    //button 装备
    use() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1) {
            return;
        }
        //装备栏卸下
        if (this.currentSelectIndex >= InventoryManager.INVENTORY_MAX 
            && this.currentSelectIndex < InventoryManager.INVENTORY_MAX + InventoryManager.INVENTORY_EQUIP_MAX) {
            AudioPlayer.play(AudioPlayer.SELECT);
            let current = this.equipList[this.currentSelectIndex - InventoryManager.INVENTORY_MAX];
            if (current.data.type == InventoryItem.TYPE_EMPTY) {
                return;
            }
            let equipData = current.data.equipmentData;
            EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipmetType: equipData.equipmetType, equipData: new EquipmentData(), isReplace: true });
            current.setEmpty();
            this.clearSelect();
            return;
        }
        //物品栏卸下
        if (this.currentSelectIndex >= InventoryManager.INVENTORY_MAX + InventoryManager.INVENTORY_EQUIP_MAX 
            && this.currentSelectIndex < InventoryManager.INVENTORY_MAX + InventoryManager.INVENTORY_EQUIP_MAX + InventoryManager.INVENTORY_ITEM_MAX) {
            AudioPlayer.play(AudioPlayer.SELECT);
            let current = this.itemList[this.currentSelectIndex - InventoryManager.INVENTORY_MAX - InventoryManager.INVENTORY_EQUIP_MAX];
            if (current.data.type == InventoryItem.TYPE_EMPTY) {
                return;
            }
            EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemIndex: this.currentSelectIndex - InventoryManager.INVENTORY_MAX - InventoryManager.INVENTORY_EQUIP_MAX });
            current.setEmpty();
            this.clearSelect();
            return;
        }

        //背包物品装备
        let list = this.list;
        let selectIndex = this.currentSelectIndex;
        let isOther = this.currentSelectIndex >= InventoryManager.INVENTORY_MAX+InventoryManager.INVENTORY_EQUIP_MAX+InventoryManager.INVENTORY_ITEM_MAX;
        if(isOther){
            list = this.otherList;
            selectIndex = this.currentSelectIndex - InventoryManager.INVENTORY_MAX-InventoryManager.INVENTORY_EQUIP_MAX-InventoryManager.INVENTORY_ITEM_MAX;
        }

        if (list[selectIndex].data.type == InventoryItem.TYPE_EMPTY) {
            return;
        }
        AudioPlayer.play(AudioPlayer.SELECT);
        let current = list[selectIndex];
        if (current.data.type == InventoryItem.TYPE_EQUIP) {
            let equipData = new EquipmentData();
            equipData.valueCopy(current.data.equipmentData);
            if (equipData.equipmetType != InventoryManager.EMPTY) {
                if (equipData.requireLevel > Logic.playerData.OilGoldData.level) {
                    Utils.toast(`当前人物等级太低，无法装备`);
                    return;
                }
                //置空当前放下的数据，清除选中
                list[this.currentSelectIndex].setEmpty();
                if(isOther){
                    Logic.inventoryManager.furnitureMap.get(this.furnitureId).storageList[selectIndex].setEmpty();
                    EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipmetType: equipData.equipmetType, equipData: equipData, isReplace: true });
                }else{
                    Logic.inventoryManager.inventoryList[selectIndex].setEmpty();
                    EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipmetType: equipData.equipmetType, equipData: equipData, isReplace: true, index: this.currentSelectIndex });
                }
            }
        } else {
            let itemData = new ItemData();
            itemData.valueCopy(current.data.itemData);
            if (itemData.resName != Item.EMPTY) {
                //置空当前放下的数据，清除选中
                list[selectIndex].setEmpty();
                if(isOther){
                    Logic.inventoryManager.furnitureMap.get(this.furnitureId).storageList[selectIndex].setEmpty();
                    EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemData: itemData, isReplace: true});
                }else{
                    Logic.inventoryManager.inventoryList[this.currentSelectIndex].setEmpty();
                    EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemData: itemData, isReplace: true, index: this.currentSelectIndex });
                }
            }
        }

        this.clearSelect();
    }
    //button 放下 存取
    drop() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1) {
            return;
        }
        //装备栏直接放下
        if (this.currentSelectIndex >= InventoryManager.INVENTORY_MAX && this.currentSelectIndex < InventoryManager.INVENTORY_MAX + InventoryManager.INVENTORY_EQUIP_MAX) {
            AudioPlayer.play(AudioPlayer.SELECT);
            let current = this.equipList[this.currentSelectIndex - InventoryManager.INVENTORY_MAX];
            if (current.data.type == InventoryItem.TYPE_EMPTY) {
                return;
            }
            let equipData = current.data.equipmentData;
            if(this.furnitureId.length>0){
                EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipmetType: equipData.equipmetType, equipData: new EquipmentData(), isReplace: true ,isFurniture:true});
            }else{
                EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipmetType: equipData.equipmetType, equipData: new EquipmentData(), isReplace: true, isDrop: true });
                EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: equipData.img, equipmentData: equipData });
            }
            current.setEmpty();
            this.clearSelect();
            return;
        }
        //物品栏直接放下
        if (this.currentSelectIndex >= InventoryManager.INVENTORY_MAX + InventoryManager.INVENTORY_EQUIP_MAX && this.currentSelectIndex < InventoryManager.INVENTORY_MAX + InventoryManager.INVENTORY_EQUIP_MAX + InventoryManager.INVENTORY_ITEM_MAX) {
            AudioPlayer.play(AudioPlayer.SELECT);
            let current = this.itemList[this.currentSelectIndex - InventoryManager.INVENTORY_MAX - InventoryManager.INVENTORY_EQUIP_MAX];
            if (current.data.type == InventoryItem.TYPE_EMPTY) {
                return;
            }
            let itemData = current.data.itemData;
            EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemIndex: this.currentSelectIndex - InventoryManager.INVENTORY_MAX - InventoryManager.INVENTORY_EQUIP_MAX, isDrop: true });
            EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM
                , { res: itemData.resName, count: itemData.count })
            current.setEmpty();
            this.clearSelect();
            return;
        }
        //背包放下
        if (this.list[this.currentSelectIndex].data.type == InventoryItem.TYPE_EMPTY) {
            return;
        }
        AudioPlayer.play(AudioPlayer.SELECT);
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
    //button 出售
    sale() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1) {
            return;
        }
        //装备栏直接售出
        if (this.currentSelectIndex >= InventoryManager.INVENTORY_MAX && this.currentSelectIndex < InventoryManager.INVENTORY_MAX + InventoryManager.INVENTORY_EQUIP_MAX) {
            AudioPlayer.play(AudioPlayer.SELECT);
            let current = this.equipList[this.currentSelectIndex - InventoryManager.INVENTORY_MAX];
            if (current.data.type == InventoryItem.TYPE_EMPTY) {
                return;
            }
            let equipData = current.data.equipmentData;
            EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipmetType: equipData.equipmetType, equipData: new EquipmentData(), isReplace: true, isDrop: true });
            EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: Math.floor(equipData.price * this.discount) });
            AudioPlayer.play(AudioPlayer.COIN);
            current.setEmpty();
            this.clearSelect();
            return;
        }
        //物品栏直接售出
        if (this.currentSelectIndex >= InventoryManager.INVENTORY_MAX + InventoryManager.INVENTORY_EQUIP_MAX && this.currentSelectIndex < InventoryManager.INVENTORY_MAX + InventoryManager.INVENTORY_EQUIP_MAX + InventoryManager.INVENTORY_ITEM_MAX) {
            AudioPlayer.play(AudioPlayer.SELECT);
            let current = this.itemList[this.currentSelectIndex - InventoryManager.INVENTORY_MAX - InventoryManager.INVENTORY_EQUIP_MAX];
            if (current.data.type == InventoryItem.TYPE_EMPTY) {
                return;
            }
            let itemData = current.data.itemData;
            EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemIndex: this.currentSelectIndex - InventoryManager.INVENTORY_MAX - InventoryManager.INVENTORY_EQUIP_MAX, isDrop: true });
            EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: Math.floor(itemData.count > 1 ? itemData.price * itemData.count * this.discount : itemData.price * this.discount) });
            AudioPlayer.play(AudioPlayer.COIN);
            current.setEmpty();
            this.clearSelect();
            return;
        }
        //背包售出
        if (this.list[this.currentSelectIndex].data.type == InventoryItem.TYPE_EMPTY) {
            return;
        }
        AudioPlayer.play(AudioPlayer.SELECT);
        let current = this.list[this.currentSelectIndex];
        if (current.data.type == InventoryItem.TYPE_EQUIP) {
            let equipData = current.data.equipmentData;
            if (equipData.equipmetType != InventoryManager.EMPTY) {
                EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: Math.floor(equipData.price * this.discount) });
                AudioPlayer.play(AudioPlayer.COIN);
            }
        } else {
            let itemData = current.data.itemData;
            if (itemData.resName != Item.EMPTY) {
                EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: Math.floor(itemData.count > 1 ? itemData.price * itemData.count * this.discount : itemData.price * this.discount) });
                AudioPlayer.play(AudioPlayer.COIN);
            }
        }
        //置空当前放下的数据，清除选中
        Logic.inventoryManager.inventoryList[this.currentSelectIndex].setEmpty();
        this.list[this.currentSelectIndex].setEmpty();
        this.clearSelect();
    }
    // update (dt) {}

    close() {
        AudioPlayer.play(AudioPlayer.SELECT);
        this.dismiss();
    }

}
