import Logic from "./Logic";
import { EventHelper } from "./EventHelper";

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
export default class CoinCount extends cc.Component {

    anim: cc.Animation;
    @property(cc.Label)
    label: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        cc.director.on(EventHelper.HUD_ADD_COIN, (event) => {
            this.addCount(event.detail.count);
        })
    }

    start() {
    }
    addCount(value:string) {
        if (!this.anim) {
            return;
        }
        Logic.coins += parseInt(value) ;
        
    }

    update(dt) {
        if (this.label) {
            this.label.string = `${Logic.coins}`;
        }

    }
}
