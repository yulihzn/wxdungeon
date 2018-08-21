import Player from "../Player";
import { EventConstant } from "../EventConstant";

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
export default class FallStone extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    isFall = false;
    anim: cc.Animation;

    onLoad() {
        this.isFall = false;
        this.fall();
    }
    fall() {
        // this.anim = this.getComponent(cc.Animation);
        // this.anim.play();
    }
    //anim
    FallFinish() {
        this.isFall = true;
        setTimeout(() => { this.isFall = false; }, 100);
        setTimeout(() => { this.node.destroy()}, 2000);
        
    }
    start() {

    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let player = other.getComponent(Player);
        if (player) {
            if (this.isFall&&this.isValid) {
                this.isFall = false;
                cc.director.emit(EventConstant.PLAYER_TAKEDAMAGE, { detail: { damage: 2 } });
            }
        }
    }
    // update (dt) {}
}
