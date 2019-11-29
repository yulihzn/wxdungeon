import { EventConstant } from "../EventConstant";
import Player from "../Player";
import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class KrakenHead extends cc.Component {
    anim: cc.Animation;
    onLoad() {
        this.anim = this.getComponent(cc.Animation);
    }
    show() {
        if (!this.anim) {
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play('KrakenHeadShow');
    }
    //anim
    ShowFinish() {
        this.anim.play('KrakenHeadIdle');
    }
    // update (dt) {}
}
