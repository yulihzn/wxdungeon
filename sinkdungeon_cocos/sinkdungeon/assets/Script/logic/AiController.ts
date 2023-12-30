import TimeDelay from '../utils/TimeDelay'
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
    ctrlPlayerMove(dir: number, pos: cc.Vec3, dt: number) {
        if (this.CanControl) {
            this.flagMove = true
            this.pos = pos
            this.dir = dir
        }
    }

    ctrlPlayerTrigger(isLongPress: boolean) {
        if (this.CanControl) {
            this.flagTriggerThings = true
            this.isLongPress = isLongPress
        }
    }

    ctrlPlayerUseItem(detail) {
        if (this.CanControl) {
            this.flagUseItem = true
            this.itemData = detail.itemData
        }
    }

    ctrlPlayerUseSkill() {
        if (this.CanControl) this.flagUseSkill = true
    }

    ctrlPlayerUseSkill1() {
        if (this.CanControl) this.flagUseSkill1 = true
    }

    ctrlPlayerMeleeAttack() {
        if (this.CanControl) this.flagMeleeAttack = true
    }

    ctrlPlayerRemoteAttackCancel() {
        if (this.CanControl) this.flagRemoteCancel = true
    }

    ctrlPlayerRemoteAttack() {
        if (this.CanControl) this.flagRemoteAttack = true
    }

    ctrlPlayerJump() {
        if (this.CanControl) this.flagJump = true
    }

    ctrlPlayerDash() {
        if (this.CanControl) this.flagDash = true
    }

    ctrlPlayerJumpCancel() {
        if (this.CanControl) this.flagJumpCancel = true
    }

    private timeCheck = new TimeDelay(1)
    updateLogic(dt: number): void {
        super.updateLogic(dt)
    }
}
