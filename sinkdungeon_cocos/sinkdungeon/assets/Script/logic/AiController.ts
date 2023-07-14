import BaseController from './BaseController'
import Dungeon from './Dungeon'
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator
@ccclass
export default class AiController extends BaseController {
    ctrlPlayerMove(dir: number, pos: cc.Vec3, dt: number, dungeon: Dungeon) {
        if (this.CanControl) this.player.ctrlMove(dir, pos, dt, dungeon)
    }

    ctrlPlayerTrigger(isLongPress: boolean) {
        if (this.CanControl) this.player.ctrlTriggerThings(isLongPress)
    }

    ctrlPlayerUseItem(detail) {
        if (this.CanControl) this.player.ctrlUseItem(detail.itemData)
    }

    ctrlPlayerUseSkill() {
        if (this.CanControl) this.player.ctrlUseSkill()
    }

    ctrlPlayerUseSkill1() {
        if (this.CanControl) this.player.ctrlUseSkill1()
    }

    ctrlPlayerMeleeAttack() {
        if (this.CanControl) this.player.ctrlMeleeAttack()
    }

    ctrlPlayerRemoteAttackCancel() {
        if (this.CanControl) this.player.ctrlRemoteCancel()
    }

    ctrlPlayerRemoteAttack() {
        if (this.CanControl) this.player.ctrlRemoteAttack()
    }

    ctrlPlayerJump() {
        if (this.CanControl) this.player.ctrlJump()
    }

    ctrlPlayerDash() {
        if (this.CanControl) this.player.ctrlDash()
    }

    ctrlPlayerJumpCancel() {
        if (this.CanControl) this.player.ctrlJumpCancel()
    }
}
