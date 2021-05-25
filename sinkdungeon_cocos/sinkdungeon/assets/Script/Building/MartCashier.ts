// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AudioPlayer from "../Utils/AudioPlayer";
import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MartCashier extends Building {
    onLoad() {
    }
    // update (dt) {}

    start(){
        AudioPlayer.play(AudioPlayer.WELCOME);
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {

    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {

    }
}
