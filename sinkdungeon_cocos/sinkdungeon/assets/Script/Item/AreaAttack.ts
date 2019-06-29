import Logic from "../Logic";
import Player from "../Player";
import DamageData from "../Data/DamageData";

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
export default class AreaAttack extends cc.Component {

    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        if(!this.node){
            return 9999;
        }
        let dis = Logic.getDistance(this.node.position, playerNode.position);
        return dis;
    }
    damagePlayer(status: string, player: Player) {
        if (this.node&&player && this.getNearPlayerDistance(player.node) < 64 * this.node.scale) {
            player.takeDamage(new DamageData(1));
            player.addStatus(status);
        }
        if(!this.node){
            return;
        }
        this.scheduleOnce(() => {
            if (this.node) {
                this.node.destroy();
            }
        }, 2);
    }
    // checkTimeDelay = 0;
    // isCheckTimeDelay(dt: number): boolean {
    //     this.checkTimeDelay += dt;
    //     if (this.checkTimeDelay > 1) {
    //         this.checkTimeDelay = 0;
    //         return true;
    //     }
    //     return false;
    // }
    // update (dt) {
    //     if (this.isCheckTimeDelay(dt)) {
    //         this.damagePlayer();
    //     }
    // }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}
