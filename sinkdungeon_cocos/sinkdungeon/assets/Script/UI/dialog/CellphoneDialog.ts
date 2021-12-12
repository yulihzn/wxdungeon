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
        this.dayLabel.string = this.getDay(Logic.realTime);
        this.hourLabel.string = this.getHour(Logic.realTime);
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
                let save = LocalStorage.getFurnitureData(fd.id);
                fd.valueCopy(save);
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
            Utils.toast('这里空空如也', true);
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
                Utils.toast('购买成功,快递将在下次进入房间送达', true);
                AudioPlayer.play(AudioPlayer.CASHIERING);
            } else {
                Utils.toast('购买失败，余额不足', true);
                AudioPlayer.play(AudioPlayer.SELECT_FAIL);
            }
        }
    }
    update(dt) {
        if (this.isCheckTimeChangeDelay(dt)) {
            this.dayLabel.string = this.getDay(Logic.realTime);
            this.hourLabel.string = this.getHour(Logic.realTime);
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
        this.dayLabel.string = this.getDay(Logic.realTime);
        this.hourLabel.string = this.getHour(Logic.realTime);
    }

    private getDay(time: number) {
        let date = new Date(time);
        let m = date.getMonth() + 1;
        let d = date.getDate();
        return `${m < 10 ? '0' : ''}${m}月${d < 10 ? '0' : ''}${d}日 ${this.getWeek(date)}`;
    }
    private getHour(time: number) {
        let date = new Date(time);
        let h = date.getHours() + 1;
        if (h > 23) {
            h = 0;
        }
        let m = date.getMinutes();
        return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
    }
    private getFull(time: number) {
        let date = new Date(time);
        return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() + ". " + date.getHours() + "." + date.getMinutes() + "." + date.getSeconds() + ".";
    }
    private getWeek(date: Date) {
        let week = '';
        if (date.getDay() == 0) week = "星期日";
        if (date.getDay() == 1) week = "星期一";
        if (date.getDay() == 2) week = "星期二";
        if (date.getDay() == 3) week = "星期三";
        if (date.getDay() == 4) week = "星期四";
        if (date.getDay() == 5) week = "星期五";
        if (date.getDay() == 6) week = "星期六";
        return week;
    }
}
