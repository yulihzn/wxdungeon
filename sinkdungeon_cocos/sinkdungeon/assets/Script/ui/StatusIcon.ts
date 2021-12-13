// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import StatusData from "../data/StatusData";
import Logic from "../logic/Logic";
import StatusIconDialog from "./dialog/StatusIconDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StatusIcon extends cc.Component {

    anim: cc.Animation;
    label: cc.Label;
    private stateRunning: boolean = false;
    sprite: cc.Sprite = null;
    data: StatusData = new StatusData();
    dialog:StatusIconDialog;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.label = this.node.getChildByName('sprite').getChildByName('label').getComponent(cc.Label);
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.label = this.node.getChildByName('sprite').getChildByName('label').getComponent(cc.Label);
        this.anim = this.getComponent(cc.Animation);
    }

    start() {
    }
    showStatus(data: StatusData) {
        if (!this.anim) { return; }
        this.data = data;
        this.sprite.spriteFrame = Logic.spriteFrameRes(data.spriteFrameName);
        this.anim.playAdditive('StatusShow');
        this.stateRunning = true;
        this.label.string = `${data.duration > 0 ? data.duration : ''}`;
        this.label.node.opacity = data.duration < 0 || data.duration > 500 ? 0 : 255;
    }
    stopStatus() {
        if (!this.node) {
            return;
        }
        if (this.stateRunning) {
            this.node.destroy();
        }
    }

    public updateLogic(data: StatusData) {
        this.data = data;
        this.label.string = `${data.duration > 0 ? data.duration : ''}`;
        this.label.node.opacity = data.duration < 0 || data.duration > 500 ? 0 : 255;
        if (data.duration == 0 && this.stateRunning) {
            this.stateRunning = false;
            this.anim.play('StatusHide');
            this.scheduleOnce(() => {
                if (this.node) {
                    this.node.destroy();
                }
            }, 0.5);
        }
    }
    // update (dt) {}
}
