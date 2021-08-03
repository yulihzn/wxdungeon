// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Achievement from "../../Achievement";
import CellphoneData from "../../Data/CellphoneData";
import FurnitureData from "../../Data/FurnitureData";
import ItemData from "../../Data/ItemData";
import { EventHelper } from "../../EventHelper";
import Logic from "../../Logic";
import AudioPlayer from "../../Utils/AudioPlayer";
import LocalStorage from "../../Utils/LocalStorage";
import CellphoneItem from "../CellphoneItem";
import BaseDialog from "./BaseDialog";
import EquipmentAndItemDialog from "./EquipmentAndItemDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CellPhoneDialog extends BaseDialog {
    @property(cc.Prefab)
    item: cc.Prefab = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    equipmentAndItemDialogPrefab: cc.Prefab = null;
    @property(cc.Node)
    buyButton: cc.Node = null;
    list: CellphoneItem[] = [];
    @property(cc.Node)
    itemSelect: cc.Node = null;
    @property(cc.Node)
    tabSelect: cc.Node = null;
    @property(cc.Label)
    priceLabel: cc.Label = null;
    currentSelectIndex: number;
    equipmentAndItemDialog: EquipmentAndItemDialog = null;
    furnitureList: FurnitureData[] = [];
    itemList: ItemData[] = [];
    tabIndex = 0;
    onLoad() {
        this.itemSelect.opacity = 0;
        this.tabSelect.opacity = 0;
        this.equipmentAndItemDialog = this.initDialog();
        
        this.updateList(this.tabIndex);
    }
    private initDialog() {
        let node = cc.instantiate(this.equipmentAndItemDialogPrefab);
        node.parent = this.node.getChildByName('layer');
        let dialog = node.getComponent(EquipmentAndItemDialog);
        dialog.changeBgAndAnchor(EquipmentAndItemDialog.BG_TYPE_ARROW_NONE);
        dialog.hideDialog();
        return dialog;
    }
    private getItem(index: number, data: CellphoneData):CellphoneItem {
        let prefab = cc.instantiate(this.item);
        prefab.parent = this.content;
        let item = prefab.getComponent(CellphoneItem);
        item.init(this, index, data);
        return item;
    }

    start() {

    }

    show() {
        super.show();
        this.updateList(this.tabIndex);
    }
    //button
    changeTab(event: cc.Event, index: number) {
        if(index == 0){
            this.tabSelect.position = cc.v3(0,0);
        }else{
            this.tabSelect.position = cc.v3(0,0);
        }
        this.updateList(index);
    }
    clearSelect() {
        this.currentSelectIndex = -1;
        this.equipmentAndItemDialog.hideDialog();
        this.buyButton.active = false;
        this.priceLabel.string = ``;
        this.itemSelect.opacity = 0;
    }
    showSelect(item: CellphoneItem) {
        this.currentSelectIndex = item.index;
        this.itemSelect.position = this.itemSelect.parent.convertToNodeSpaceAR(item.node.convertToWorldSpaceAR(cc.Vec3.ZERO));
        this.itemSelect.opacity = 200;
        AudioPlayer.play(AudioPlayer.SELECT);
        this.priceLabel.string = `${Math.floor(item.data.price)}`;
        this.buyButton.active = true;
        this.equipmentAndItemDialog.showDialog(cc.v3(420, 160), null, item.data.itemData, null, item.data.furnitureData);
    }
    updateList(tabIndex: number) {
        this.clearSelect();
        this.list = [];
        let normallist: CellphoneItem[] = [];
        let purchasedlist: CellphoneItem[] = [];
        this.content.removeAllChildren();
        this.tabIndex = tabIndex;
        let index = 0;
        for (let key in Logic.furnitures) {
            let fd = new FurnitureData();
            fd.valueCopy(Logic.furnitures[key]);
            let save = LocalStorage.getFurnitureData(fd.id);
            fd.valueCopy(save);
            this.furnitureList.push(fd);
            let data = new CellphoneData();
            data.createTime = new Date().getTime();
            data.type = CellphoneItem.TYPE_FURNITURE;
            let item = this.getItem(index++, data);
            if (item.data.furnitureData) {
                if (item.data.furnitureData.purchased) {
                    purchasedlist.push(item);
                } else{
                    normallist.push(item);
                }
            }
        }
        if (tabIndex == 0) {
            this.list = normallist.concat(purchasedlist);
        }
    }
   
    //button 购买
    sale() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1 || this.list[this.currentSelectIndex].data.type == CellphoneItem.TYPE_EMPTY) {
            return;
        }
        let current = this.list[this.currentSelectIndex];
        if (current.data.type == CellphoneItem.TYPE_FURNITURE) {
            let data = current.data.furnitureData;
            if (!data.purchased&&Logic.coins >= data.price) {
                EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: -data.price });
                AudioPlayer.play(AudioPlayer.COIN);
                current.data.furnitureData.purchased = true;
                current.updateData(current.data);
                Achievement.addFurnituresAchievement(data.id);
            }
        }
        this.clearSelect();
    }
    // update (dt) {}

    close() {
        AudioPlayer.play(AudioPlayer.SELECT);
        this.dismiss();
    }

}
