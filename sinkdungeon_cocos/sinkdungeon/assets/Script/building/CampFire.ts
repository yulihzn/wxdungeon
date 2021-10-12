import { ColliderTag } from "../actor/ColliderTag";
import FromData from "../data/FromData";
import StatusManager from "../manager/StatusManager";
import Player from "../Player";
import Building from "./Building";

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
/**
 * 篝火
 */
@ccclass
export default class CampFire extends Building {

    isAddTime = true;

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (other.tag == ColliderTag.PLAYER) {
            if (this.isAddTime) {
                this.isAddTime = false;
                let player = other.getComponent(Player);
                if (player) {
                    player.addStatus(StatusManager.CAMP_FIRE, new FromData());
                }
            }
        }
    }
    timeDelay = 0;
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > 5) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt: number) {
        if (this.isTimeDelay(dt)) {
            this.isAddTime = true;
        }
    }
}
