// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Achievement from "../../logic/Achievement";
import CellphoneData from "../../data/CellphoneData";
import FurnitureData from "../../data/FurnitureData";
import ItemData from "../../data/ItemData";
import { EventHelper } from "../../logic/EventHelper";
import Logic from "../../logic/Logic";
import AudioPlayer from "../../utils/AudioPlayer";
import LocalStorage from "../../utils/LocalStorage";
import Utils from "../../utils/Utils";
import CellphoneItem from "../CellphoneItem";
import BaseDialog from "./BaseDialog";
import EquipmentAndItemDialog from "./EquipmentAndItemDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CellphoneDialog extends BaseDialog {
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
    @property(cc.Label)
    hourLabel: cc.Label = null;
    @property(cc.Label)
    dayLabel: cc.Label = null;
    currentSelectIndex: number;
    equipmentAndItemDialog: EquipmentAndItemDialog = null;
    itemList: ItemData[] = [];
    tabIndex = 0;
    onLoad() {
        this.itemSelect.opacity = 0;
        this.equipmentAndItemDialog = this.initDialog();
        this.dayLabel.string = Utils.getDay(Logic.realTime);
        this.hourLabel.string = Utils.getHour(Logic.realTime);
        this.updateList(this.tabIndex);
    }
    private initDialog() {
        let node = cc.instantiate(this.equipmentAndItemDialogPrefab);
        node.parent = this.node;
        let dialog = node.getComponent(EquipmentAndItemDialog);
        dialog.changeBgAndAnchor(EquipmentAndItemDialog.BG_TYPE_ARROW_NONE);
        dialog.hideDialog();
        return dialog;
    }
    private getItem(index: number, data: CellphoneData): CellphoneItem {
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
        if (index == 0) {
            this.tabSelect.position = cc.v3(-96, 320);
            AudioPlayer.play(AudioPlayer.SELECT);
        } else {
            this.tabSelect.position = cc.v3(96, 320);
            AudioPlayer.play(AudioPlayer.SELECT_FAIL);
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
        this.itemSelect.parent = item.node;
        this.itemSelect.position = cc.Vec3.ZERO;
        this.itemSelect.opacity = 200;
        AudioPlayer.play(AudioPlayer.SELECT);
        this.priceLabel.string = `${Math.floor(item.data.price)}`;
        this.buyButton.active = true;
        this.equipmentAndItemDialog.showDialog(cc.v3(-240, 160), null, item.data.itemData, null, item.data.furnitureData);
    }
    updateList(tabIndex: number) {
        this.clearSelect();
        this.list = [];
        this.content.removeAllChildren();
        this.tabIndex = tabIndex;
        let dataList: CellphoneData[] = [];
        if (tabIndex == 0) {
            let normallist: CellphoneData[] = [];
            let purchasedlist: CellphoneData[] = [];
            let index = 0;
            for (let key in Logic.furnitures) {
                let fd = new FurnitureData();
                fd.valueCopy(Logic.furnitures[key]);
                if(fd.price<=0){
                    continue;
                }
                let save = LocalStorage.getFurnitureData(fd.id);
                if (save) {
                    fd.isOpen = save.isOpen;
                    fd.purchased = save.purchased;
                }
                let data = new CellphoneData();
                data.createTime = new Date().getTime();
                data.type = CellphoneItem.TYPE_FURNITURE;
                data.furnitureData = fd;
                if (fd.purchased) {
                    purchasedlist.push(data);
                } else {
                    normallist.push(data);
                }
                this.list.push(this.getItem(index++, data));
            }
            dataList = normallist.concat(purchasedlist);
            for (let i = 0; i < this.list.length; i++) {
                this.list[i].updateData(dataList[i]);
            }
        } else {
            Utils.toast('这里空空如也。', true);
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
            let fd = current.data.furnitureData;
            if (!fd.purchased && Logic.coins >= fd.price) {
                EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: -fd.price });
                AudioPlayer.play(AudioPlayer.COIN);
                current.data.furnitureData.purchased = true;
                current.updateData();
                Achievement.addFurnituresAchievement(fd.id);
                LocalStorage.saveFurnitureData(fd);
                this.clearSelect();
                Utils.toast('购买成功,快递在眨眼之间就到了', true, true);
                AudioPlayer.play(AudioPlayer.CASHIERING);
                EventHelper.emit(EventHelper.HUD_FURNITURE_REFRESH,{id:fd.id});
            } else {
                Utils.toast('购买失败，余额不足', true, true);
                AudioPlayer.play(AudioPlayer.SELECT_FAIL);
            }
        }
    }
    update(dt) {
        if (this.isCheckTimeChangeDelay(dt)) {
            this.dayLabel.string = Utils.getDay(Logic.realTime);
            this.hourLabel.string = Utils.getHour(Logic.realTime);
        }
    }
    checkTimeChangeDelay = 0;
    isCheckTimeChangeDelay(dt: number): boolean {
        this.checkTimeChangeDelay += dt;
        if (this.checkTimeChangeDelay > 1) {
            this.checkTimeChangeDelay = 0;
            return true;
        }
        return false;
    }
    close() {
        AudioPlayer.play(AudioPlayer.SELECT);
        this.dismiss();
        this.content.removeAllChildren();
    }
    waitOneHour() {
        Logic.realTime += 60000 * 60;
        this.dayLabel.string = Utils.getDay(Logic.realTime);
        this.hourLabel.string = Utils.getHour(Logic.realTime);
    }

}
