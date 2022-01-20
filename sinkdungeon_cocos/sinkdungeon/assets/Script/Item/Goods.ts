import GoodsData from "../data/GoodsData";
import { EventHelper } from "../logic/EventHelper";
import Logic from "../logic/Logic";
import AudioPlayer from "../utils/AudioPlayer";

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
export default class Goods extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    sprite1: cc.Sprite;
    sprite2: cc.Sprite;
    sprite3: cc.Sprite;
    data: GoodsData = new GoodsData();
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite1 = this.node.getChildByName('sprite1').getComponent(cc.Sprite);
        this.sprite2 = this.node.getChildByName('sprite2').getComponent(cc.Sprite);
        this.sprite3 = this.node.getChildByName('sprite3').getComponent(cc.Sprite);
        this.node.on(cc.Node.EventType.TOUCH_END, (event:cc.Event.EventTouch)=>{
            EventHelper.emit(EventHelper.HUD_MART_SHELVES_DIALOG_PAY,{data:this.data});
            AudioPlayer.play(AudioPlayer.SELECT);
        });
        
    }

    init(data: GoodsData) {
        this.data = data;
        this.updateSprite();

    }
    private updateSprite() {
        if (!this.sprite1) {
            this.sprite1 = this.node.getChildByName('sprite1').getComponent(cc.Sprite);
            this.sprite2 = this.node.getChildByName('sprite2').getComponent(cc.Sprite);
            this.sprite3 = this.node.getChildByName('sprite3').getComponent(cc.Sprite);
        }
        this.sprite1.node.opacity = 255;
        this.sprite2.node.opacity = 255;
        this.sprite3.node.opacity = 255;
        this.sprite1.spriteFrame = Logic.spriteFrameRes(this.data.item.resName);
        this.sprite2.spriteFrame = Logic.spriteFrameRes(this.data.item.resName);
        this.sprite3.spriteFrame = Logic.spriteFrameRes(this.data.item.resName);
        this.sprite1.node.width = this.sprite1.spriteFrame.getRect().width;
        this.sprite2.node.width = this.sprite2.spriteFrame.getRect().width;
        this.sprite2.node.width = this.sprite2.spriteFrame.getRect().width;
        this.sprite1.node.height = this.sprite1.spriteFrame.getRect().height;
        this.sprite2.node.height = this.sprite2.spriteFrame.getRect().height;
        this.sprite2.node.height = this.sprite2.spriteFrame.getRect().height;

        this.label.string = `${this.data.item.nameCn}\n$:${this.data.item.price}`;
        if (this.data.count == 2) {
            this.sprite1.node.opacity = 0;
        } else if (this.data.count == 1) {
            this.sprite2.node.opacity = 0;
            this.sprite1.node.opacity = 0;
        } else if (this.data.count <= 0) {
            this.sprite1.node.opacity = 0;
            this.sprite2.node.opacity = 0;
            this.sprite3.node.opacity = 0;
        }
    }
    click() {
        //open
    }

    // update (dt) {}
}
