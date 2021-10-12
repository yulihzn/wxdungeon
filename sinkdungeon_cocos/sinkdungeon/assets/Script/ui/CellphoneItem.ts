import CellphoneData from "../data/CellphoneData";
import Logic from "../logic/Logic";
import AudioPlayer from "../utils/AudioPlayer";
import CellphoneDialog from "./dialog/CellphoneDialog";

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
export default class CellphoneItem extends cc.Component {
    static readonly TYPE_EMPTY = 0;
    static readonly TYPE_FURNITURE = 1;
    static readonly TYPE_ITEM = 2;
    isSelect = false;
    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    disableCover: cc.Node = null;
    index = 0;//列表里的下标
    data: CellphoneData = new CellphoneData();
    dialog: CellphoneDialog;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.isSelect && this.index == this.dialog.currentSelectIndex) {
                this.isSelect = false;
            } else {
                this.isSelect = this.data.type != CellphoneItem.TYPE_EMPTY;
            }
            if(this.data.type == CellphoneItem.TYPE_FURNITURE&&this.data.furnitureData&&this.data.furnitureData.purchased){
                this.isSelect = false;
            }
            this.dialog.clearSelect();
            if (this.isSelect) {
                this.dialog.showSelect(this);
            }else{
                AudioPlayer.play(AudioPlayer.SELECT_FAIL);
            }

        }, this)
    }
    init(cellphoneDialog: CellphoneDialog, index: number, data: CellphoneData) {
        this.dialog = cellphoneDialog;
        this.index = index;
        this.isSelect = false;
        this.updateData(data);
    }
    updateData(data?:CellphoneData) {
        this.isSelect = false;
        this.data.valueCopy(data);
        this.label.string = ``;
        this.sprite.spriteFrame = null;
        this.disableCover.active = false;
        let spriteFrame = null;
        if (this.data.type == CellphoneItem.TYPE_ITEM&&this.data.itemData) {
            this.label.string = `${this.data.itemData.nameCn}\n${this.data.itemData.price}`;
            spriteFrame = Logic.spriteFrameRes(this.data.itemData.resName);
        } else if (this.data.type == CellphoneItem.TYPE_FURNITURE&&this.data.furnitureData) {
            spriteFrame = Logic.spriteFrameRes(this.data.furnitureData.resName);
            this.label.string = `${this.data.furnitureData.nameCn}\n${this.data.furnitureData.price}`;
            this.disableCover.active = this.data.furnitureData.purchased;
        }
        if (spriteFrame) {
            this.sprite.spriteFrame = spriteFrame;
            let w = spriteFrame.getOriginalSize().width;
            let h = spriteFrame.getOriginalSize().height;
            this.sprite.node.width = w * 4;
            this.sprite.node.height = h * 4;
            if (this.sprite.node.height > 128) {
                this.sprite.node.height = 128;
                this.sprite.node.width = 128 / spriteFrame.getOriginalSize().height * spriteFrame.getOriginalSize().width;
            }
        }
    }
    setEmpty() {
        this.label.string = ``;
        this.sprite.spriteFrame = null;
    }
    start() {

    }

    // update (dt) {}
}
