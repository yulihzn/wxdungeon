import InventoryData from "../data/InventoryData";
import { EventHelper } from "../logic/EventHelper";
import Logic from "../logic/Logic";
import InventoryManager from "../manager/InventoryManager";
import Player from "../logic/Player";
import InventoryDialog from "./dialog/InventoryDialog";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class InventoryItem extends cc.Component {
    static readonly TYPE_EMPTY = 0;
    static readonly TYPE_EQUIP = 1;
    static readonly TYPE_ITEM = 2;
    isSelect = false;
    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.Label)
    label: cc.Label = null;
    index = 0;//列表里的下标
    data: InventoryData = new InventoryData();
    dialog: InventoryDialog;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.isSelect && this.index == this.dialog.currentSelectIndex) {
                this.isSelect = false;
            } else {
                this.isSelect = this.data.type != InventoryItem.TYPE_EMPTY;
            }
            this.dialog.clearSelect();
            if (this.isSelect) {
                this.dialog.showSelect(this);
            }

        }, this)

    }
    init(inventoryDialog: InventoryDialog, index: number, data: InventoryData) {
        this.dialog = inventoryDialog;
        this.index = index;
        this.isSelect = false;
        this.updateData(data);
    }
    updateData(data: InventoryData) {
        this.isSelect = false;
        this.data.valueCopy(data);
        this.label.string = ``;
        this.sprite.spriteFrame = null;
        if (this.data.type == InventoryItem.TYPE_ITEM && this.data.itemData) {
            this.label.string = `${data.itemData.count > 0 ? ('x' + data.itemData.count) : ''}`;
            this.sprite.spriteFrame = Logic.spriteFrameRes(this.data.itemData.resName);
        } else if (this.data.equipmentData) {
            let spriteFrame = Logic.spriteFrameRes(this.data.equipmentData.img);
            if (this.data.equipmentData.equipmetType == InventoryManager.CLOTHES) {
                spriteFrame = Logic.spriteFrameRes(this.data.equipmentData.img + 'anim0');
            } else if (this.data.equipmentData.equipmetType == InventoryManager.HELMET) {
                spriteFrame = Logic.spriteFrameRes(this.data.equipmentData.img + 'anim0');
            } else if (this.data.equipmentData.equipmetType == InventoryManager.REMOTE) {
                spriteFrame = Logic.spriteFrameRes(this.data.equipmentData.img + 'anim0');
            }
            this.sprite.spriteFrame = spriteFrame;
        }
    }
    setEmpty() {
        this.data.setEmpty();
        this.label.string = ``;
        this.sprite.spriteFrame = null;
    }
    start() {

    }

    // update (dt) {}
}
