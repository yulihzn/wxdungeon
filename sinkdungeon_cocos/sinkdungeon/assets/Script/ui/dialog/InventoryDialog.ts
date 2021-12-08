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
import EquipmentData from "../../data/EquipmentData";
import ItemData from "../../data/ItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InventoryDialog extends BaseDialog {
    @property(cc.Prefab)
    item: cc.Prefab = null;
    @property(cc.Node)
    layer: cc.Node = null;
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
    furnitureId: string = '';
    @property(cc.Node)
    select: cc.Node = null;
    @property(cc.Label)
    discountLabel: cc.Label = null;
    currentSelectIndex: number;
    discount = 0.5;
    equipmentAndItemDialog: EquipmentAndItemDialog = null;
    static MAX_BAG: any;
    onLoad() {
        this.select.opacity = 0;
        this.equipmentAndItemDialog = this.initDialog();
        this.initLayout(this.layout, InventoryManager.MAX_BAG, 0);
        this.initLayout(this.layoutEquip, InventoryManager.MAX_EQUIP, InventoryManager.MAX_BAG);
        this.initLayout(this.layoutItem, InventoryManager.MAX_ITEM, InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP);
        this.initLayout(this.layoutOther, 0, 0);
        EventHelper.on(EventHelper.HUD_INVENTORY_ALL_UPDATE
            , (detail) => {
                if (this.node) {
                    this.updateList(Logic.bagSortIndex);
                    this.updateEquipList();
                    this.updateItemList();
                    if (this.furnitureId.length > 0) {
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
                    let furnitureId: string = detail.furnitureId;
                    if (furnitureId && furnitureId.length > 0) {
                        data = Logic.inventoryManager.furnitureMap.get(furnitureId).storageList[detail.index];
                        this.otherList[detail.index].updateData(data);
                    } else {
                        this.list[detail.index].updateData(data);
                    }
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
    private initLayout(layout: cc.Node, max: number, extraMax: number) {
        layout.removeAllChildren();
        for (let i = 0; i < max; i++) {
            let data = new InventoryData();
            data.createTime = new Date().getTime();
            this.equipList.push(this.getItem(extraMax + i, data, layout));
        }
    }
    private getItem(index: number, data: InventoryData, layout: cc.Node) {
        let prefab = cc.instantiate(this.item);
        prefab.parent = layout;
        let item = prefab.getComponent(InventoryItem);
        item.init(this, index, data);
        return item;
    }

    show() {
        this._show('');
    }
    showFurniture(id: string) {
        this._show(id);
    }
    private _show(id: string) {
        this.layer.x = 0;
        let isFuriniture = id && id.length > 0;
        this.otherDialog.active = isFuriniture;
        this.furnitureId = isFuriniture ? id : '';
        super.show();
        this.updateList(Logic.bagSortIndex);
        this.updateEquipList();
        this.updateItemList();
        this.updateOtherList(isFuriniture ? Logic.sortIndexs[id] : 0);
        if (isFuriniture) {
            cc.tween(this.layer).delay(0.3).to(0.5, { x: 145 }).start();
        }
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
        this.useButton.getComponentInChildren(cc.Label).string = this.currentSelectIndex >= InventoryManager.MAX_BAG ? '卸下' : '装备';
        if (this.furnitureId.length > 0) {
            if (this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM) {
                this.dropButton.getComponentInChildren(cc.Label).string = '取出';
            } else {
                this.dropButton.getComponentInChildren(cc.Label).string = '存入';
            }
        } else {
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
        let list: InventoryData[] = [];
        for (let itemdata of Logic.inventoryManager.itemList) {
            let data = InventoryManager.buildItemInventoryData(itemdata);
            list.push(data);
        }
        for (let i = 0; i < InventoryManager.MAX_ITEM; i++) {
            if (i < list.length && list[i].type != InventoryItem.TYPE_EMPTY) {
                let data = list[i];
                this.itemList[i].updateData(data);
            } else {
                this.itemList[i].setEmpty();
            }
        }
    }
    private updateEquipList() {
        let list: InventoryData[] = [];
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
                let data = InventoryManager.bulidEquipInventoryData(equipdata);
                list.push(data);
            }
        }
        for (let i = 0; i < InventoryManager.MAX_EQUIP; i++) {
            if (i < list.length && list[i].type != InventoryItem.TYPE_EMPTY) {
                let data = list[i];
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
        if (this.furnitureId.length < 1) {
            return;
        }
        let furnitureData = Logic.inventoryManager.furnitureMap.get(this.furnitureId);
        if (!furnitureData) {
            return;
        }
        for (let i = 0; i < furnitureData.storage; i++) {
            let data = new InventoryData();
            if (i < furnitureData.storageList.length) {
                data.valueCopy(furnitureData.storageList[i]);
            }
            this.otherList.push(this.getItem(InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM + i, data, this.layoutOther));
        }
        let list = this.getSortList(sortIndex, furnitureData.storageList);
        for (let i = 0; i < furnitureData.storage; i++) {
            if (i < list.length && list[i].type != InventoryItem.TYPE_EMPTY) {
                let data = list[i];
                this.otherList[i].updateData(data);
            } else {
                this.otherList[i].setEmpty();
            }
        }
        furnitureData.storageList = list;
    }
    private updateList(sortIndex: number) {
        this.clearSelect();
        let list = this.getSortList(sortIndex, Logic.inventoryManager.inventoryList);
        for (let i = 0; i < InventoryManager.MAX_BAG; i++) {
            if (i < list.length && list[i].type != InventoryItem.TYPE_EMPTY) {
                let data = list[i];
                this.list[i].updateData(data);
            } else {
                this.list[i].setEmpty();
            }
        }
        Logic.inventoryManager.inventoryList = list;
    }
    private getSortList(sortIndex: number, inventoryList: InventoryData[]) {
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
    private getItemInsertIndex(itemData:ItemData,list: InventoryData[], max: number): number {
        //可插入的下标,默认为列表末尾，如果已满为-1，遍历选中第一个空位
        let insertIndex = list.length < max ? list.length : -1;
        //遍历选中相同item
        for (let i = 0; i < list.length; i++) {
            let idata = list[i];
            if (InventoryManager.isItemEqualCanAdd(idata.itemData,itemData)) {
                insertIndex = i;
                break;
            }
        }
        if(insertIndex == -1){
            return this.getEmptyInsertIndex(list,max);
        }
        return insertIndex;
    }
    private getEmptyInsertIndex(list: InventoryData[], max: number): number {
        //可插入的下标,默认为列表末尾，如果已满为-1，遍历选中第一个空位
        let insertIndex = list.length < max ? list.length : -1;
        //遍历选中第一个空位
        for (let i = 0; i < list.length; i++) {
            let idata = list[i];
            if (idata.type == InventoryItem.TYPE_EMPTY) {
                insertIndex = i;
                break;
            }
        }
        return insertIndex;
    }
    /**
     * 添加装备到指定背包或储物箱
     * @param data 需要添加的数据
     * @param dataList 被添加的数据列表
     * @param inventoryItemList 被添加的ui列表
     * @returns 是否添加成功
     */
    private addEquipToBag(data: InventoryData, dataList: InventoryData[], inventoryItemList: InventoryItem[]): boolean {
        let insertIndex = this.getEmptyInsertIndex(dataList, inventoryItemList.length);
        if (insertIndex == -1) {
            return false;
        } else {
            let d = new InventoryData();
            d.valueCopy(data);
            if (insertIndex < dataList.length) {
                
                dataList[insertIndex] = d;
                inventoryItemList[insertIndex].updateData(d);
            } else {
                dataList.push(d);
                inventoryItemList[dataList.length - 1].updateData(d);
            }
            return true;
        }
    }
    private addItemToBag(data: InventoryData, dataList: InventoryData[], inventoryItemList: InventoryItem[]): boolean {
        let insertIndex = this.getItemInsertIndex(data.itemData,dataList, inventoryItemList.length);
        if (insertIndex == -1) {
            return false;
        } else {
            let d = new InventoryData();
            d.valueCopy(data);
            if (insertIndex < dataList.length) {
                let item1 = d.itemData
                let item2 = dataList[insertIndex].itemData;
                if(InventoryManager.isItemEqualCanAdd(item1,item2)){
                    let count = item1.count+item2.count;
                    d.itemData.valueCopy(item2);
                    d.itemData.count = count;
                }
                dataList[insertIndex] = d;
                inventoryItemList[insertIndex].updateData(d);
            } else {
                dataList.push(d);
                inventoryItemList[dataList.length - 1].updateData(d);
            }
            return true;
        }
    }
    

    /**脱下装备 */
    private takeOffEquip(): boolean {
        let isSelectEquip = this.currentSelectIndex >= InventoryManager.MAX_BAG
            && this.currentSelectIndex < InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP;
        if (!isSelectEquip) {
            return false;
        }
        AudioPlayer.play(AudioPlayer.SELECT);
        let current = this.equipList[this.currentSelectIndex - InventoryManager.MAX_BAG];
        if (current.data.type == InventoryItem.TYPE_EMPTY) {
            return false;
        }
        let equipData = current.data.equipmentData.clone();
        let list = Logic.inventoryManager.inventoryList;
        //添加到背包
        let isAdded = this.addEquipToBag(current.data, list, this.list);
        //背包已满检查是否打开储物箱，添加到储物箱
        if (!isAdded && this.furnitureId && this.furnitureId.length > 0) {
            list = Logic.inventoryManager.furnitureMap.get(this.furnitureId).storageList;
            isAdded = this.addEquipToBag(current.data, list, this.otherList);
        }
        //背包已满，或者打开的储物箱已满，直接放置到地上
        if (!isAdded) {
            Utils.toast('物品栏已满');
            EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: equipData.img, equipmentData: equipData });
        }
        //清空该装备栏并更新ui
        Logic.inventoryManager.equips[equipData.equipmetType] = new EquipmentData();
        EventHelper.emit(EventHelper.PLAYER_EQUIPMENT_REFRESH, { equipmetType: equipData.equipmetType });
        current.setEmpty();
        this.clearSelect();
        return true;
    }
    private takeOffItem(): boolean {
        let isSelectItem = this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP
            && this.currentSelectIndex < InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM;
        if (!isSelectItem) {
            return false;
        }
        AudioPlayer.play(AudioPlayer.SELECT);
        let current = this.itemList[this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP];
        if (current.data.type == InventoryItem.TYPE_EMPTY) {
            return false;
        }
        let itemData = new ItemData();
        itemData.valueCopy(current.data.itemData);
        EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemIndex: this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP });
        current.setEmpty();
        this.clearSelect();
        return true;
    }
    /**穿上装备 */
    private takeOnEquip(selectIndex: number, dataList: InventoryData[], inventoryItemList: InventoryItem[]) {
        if (inventoryItemList[selectIndex].data.type == InventoryItem.TYPE_EMPTY) {
            return;
        }
        AudioPlayer.play(AudioPlayer.SELECT);
        let current = inventoryItemList[selectIndex];
        if (current.data.type == InventoryItem.TYPE_EQUIP) {
            //佩戴装备
            let equipData = current.data.equipmentData.clone();
            if (equipData.equipmetType != InventoryManager.EMPTY) {
                if (equipData.requireLevel > Logic.playerData.OilGoldData.level) {
                    Utils.toast(`当前人物等级太低，无法装备`);
                    return;
                }
                //置空当前背包需要装备的数据
                inventoryItemList[this.currentSelectIndex].setEmpty();
                dataList[this.currentSelectIndex].setEmpty();
                //设置装备栏数据并更新ui
                Logic.inventoryManager.equips[equipData.equipmetType] = equipData;
                EventHelper.emit(EventHelper.PLAYER_EQUIPMENT_REFRESH, { equipmetType: equipData.equipmetType });
            }
        } else {
            let itemData = new ItemData();
            itemData.valueCopy(current.data.itemData);
            if (itemData.resName != Item.EMPTY) {
                //置空当前背包需要装备的数据
                inventoryItemList[selectIndex].setEmpty();
                dataList[selectIndex].setEmpty();
                //设置物品栏数据并更新ui
                Logic.inventoryManager.itemList[itemData] = equipData;
                EventHelper.emit(EventHelper.PLAYER_EQUIPMENT_REFRESH, { equipmetType: equipData.equipmetType });
            }
        }
        //清除选中
        this.clearSelect();
    }


    //button 装备或者脱下
    use() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1) {
            return;
        }
        //装备栏卸下
        if (this.takeOffEquip()) {
            return;
        }
        //物品栏卸下
        if (this.takeOffItem()) {
            return;
        }
        //背包和储物箱物品装备
        let list = this.list;
        let selectIndex = this.currentSelectIndex;
        let isOther = this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM;
        if (isOther) {
            list = this.otherList;
            selectIndex = this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP - InventoryManager.MAX_ITEM;
        }

        if (list[selectIndex].data.type == InventoryItem.TYPE_EMPTY) {
            return;
        }
        AudioPlayer.play(AudioPlayer.SELECT);
        let current = list[selectIndex];
        if (current.data.type == InventoryItem.TYPE_EQUIP) {
            //佩戴装备
            let equipData = current.data.equipmentData.clone();
            if (equipData.equipmetType != InventoryManager.EMPTY) {
                if (equipData.requireLevel > Logic.playerData.OilGoldData.level) {
                    Utils.toast(`当前人物等级太低，无法装备`);
                    return;
                }
                //置空当前放下的数据，清除选中
                list[this.currentSelectIndex].setEmpty();
                if (isOther) {
                    Logic.inventoryManager.furnitureMap.get(this.furnitureId).storageList[selectIndex].setEmpty();
                    EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipmetType: equipData.equipmetType, equipData: equipData, isReplace: true });
                } else {
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
                if (isOther) {
                    Logic.inventoryManager.furnitureMap.get(this.furnitureId).storageList[selectIndex].setEmpty();
                    EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemData: itemData, isReplace: true });
                } else {
                    Logic.inventoryManager.inventoryList[selectIndex].setEmpty();
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
        //装备栏直接放下，如果是储物箱则是存入
        if (this.currentSelectIndex >= InventoryManager.MAX_BAG && this.currentSelectIndex < InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP) {
            AudioPlayer.play(AudioPlayer.SELECT);
            let current = this.equipList[this.currentSelectIndex - InventoryManager.MAX_BAG];
            if (current.data.type == InventoryItem.TYPE_EMPTY) {
                return;
            }
            let equipData = current.data.equipmentData;
            if (this.furnitureId.length > 0) {
                EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipmetType: equipData.equipmetType, equipData: new EquipmentData(), isReplace: true, furnitureId: this.furnitureId });
            } else {
                EventHelper.emit(EventHelper.PLAYER_CHANGEEQUIPMENT, { equipmetType: equipData.equipmetType, equipData: new EquipmentData(), isReplace: true, isDrop: true });
                EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: equipData.img, equipmentData: equipData });
            }
            current.setEmpty();
            this.clearSelect();
            return;
        }
        //物品栏直接放下，如果是储物箱则是存入
        if (this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP && this.currentSelectIndex < InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM) {
            AudioPlayer.play(AudioPlayer.SELECT);
            let current = this.itemList[this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP];
            if (current.data.type == InventoryItem.TYPE_EMPTY) {
                return;
            }
            let itemData = current.data.itemData;
            if (this.furnitureId.length > 0) {
                EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemIndex: this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP, isDrop: true });
            } else {
                EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemIndex: this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP, furnitureId: this.furnitureId });
                EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { res: itemData.resName, count: itemData.count })
            }
            current.setEmpty();
            this.clearSelect();
            return;
        }
        //背包放下
        let list = this.list;
        let selectIndex = this.currentSelectIndex;
        let isOther = this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM;
        if (isOther) {
            list = this.otherList;
            selectIndex = this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP - InventoryManager.MAX_ITEM;
        }
        if (list[selectIndex].data.type == InventoryItem.TYPE_EMPTY) {
            return;
        }
        AudioPlayer.play(AudioPlayer.SELECT);
        let current = list[selectIndex];
        if (current.data.type == InventoryItem.TYPE_EQUIP) {
            let equipData = current.data.equipmentData;
            if (equipData.equipmetType != InventoryManager.EMPTY) {
                if (this.furnitureId.length > 0) {
                    InventoryManager.setEquipmentToBag(equipData, false, false, selectIndex, this.furnitureId);
                } else {
                    EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: equipData.img, equipmentData: equipData });
                }
            }
        } else {
            let itemData = current.data.itemData;
            if (itemData.resName != Item.EMPTY) {
                if (isOther) {
                    InventoryManager.setItemToBag(itemData, selectIndex, this.furnitureId);
                } else {
                    if (this.furnitureId.length > 0) {
                        InventoryManager.setItemToBag(itemData, selectIndex, '');
                    } else {
                        EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { res: itemData.resName, count: itemData.count })
                    }
                }
            }
        }
        //置空当前放下的数据，清除选中
        if (isOther) {
            Logic.inventoryManager.furnitureMap.get(this.furnitureId).storageList[selectIndex].setEmpty();
        } else {
            Logic.inventoryManager.inventoryList[selectIndex].setEmpty();
        }
        list[selectIndex].setEmpty();
        this.clearSelect();
    }
    //button 出售
    sale() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1) {
            return;
        }
        //装备栏直接售出
        if (this.currentSelectIndex >= InventoryManager.MAX_BAG && this.currentSelectIndex < InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP) {
            AudioPlayer.play(AudioPlayer.SELECT);
            let current = this.equipList[this.currentSelectIndex - InventoryManager.MAX_BAG];
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
        if (this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP && this.currentSelectIndex < InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM) {
            AudioPlayer.play(AudioPlayer.SELECT);
            let current = this.itemList[this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP];
            if (current.data.type == InventoryItem.TYPE_EMPTY) {
                return;
            }
            let itemData = current.data.itemData;
            EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemIndex: this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP, isDrop: true });
            EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: Math.floor(itemData.count > 1 ? itemData.price * itemData.count * this.discount : itemData.price * this.discount) });
            AudioPlayer.play(AudioPlayer.COIN);
            current.setEmpty();
            this.clearSelect();
            return;
        }
        //背包售出
        let list = this.list;
        let selectIndex = this.currentSelectIndex;
        let isOther = this.currentSelectIndex >= InventoryManager.MAX_BAG + InventoryManager.MAX_EQUIP + InventoryManager.MAX_ITEM;
        if (isOther) {
            list = this.otherList;
            selectIndex = this.currentSelectIndex - InventoryManager.MAX_BAG - InventoryManager.MAX_EQUIP - InventoryManager.MAX_ITEM;
        }
        if (list[selectIndex].data.type == InventoryItem.TYPE_EMPTY) {
            return;
        }
        AudioPlayer.play(AudioPlayer.SELECT);
        let current = list[selectIndex];
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
        if (isOther) {
            Logic.inventoryManager.furnitureMap.get(this.furnitureId).storageList[selectIndex].setEmpty();
        } else {
            Logic.inventoryManager.inventoryList[selectIndex].setEmpty();
        }
        list[selectIndex].setEmpty();
        this.clearSelect();
    }
    // update (dt) {}

    close() {
        AudioPlayer.play(AudioPlayer.SELECT);
        this.dismiss();
    }


}
