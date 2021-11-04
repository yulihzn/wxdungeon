// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CCollider from "../collider/CCollider";
import AudioPlayer from "../utils/AudioPlayer";
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
    onColliderEnter(other: CCollider, self: CCollider) {

    }
    onColliderExit(other: CCollider, self: CCollider) {

    }
}
