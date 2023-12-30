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
import ItemData from '../data/ItemData'
import Player from './Player'
@ccclass
export default abstract class BaseController extends cc.Component {
    player: Player
    protected flagMove = false
    protected flagTriggerThings = false
    protected flagUseItem = false
    protected flagUseSkill = false
    protected flagUseSkill1 = false
    protected flagMeleeAttack = false
    protected flagRemoteCancel = false
    protected flagRemoteAttack = false
    protected flagJump = false
    protected flagDash = false
    protected flagJumpCancel = false

    protected dir = 4
    protected pos = cc.Vec3.ZERO
    protected isLongPress = false
    protected itemData: ItemData
    // LIFE-CYCLE CALLBACKS:
    protected get CanControl() {
        return this.node && this.player && this.player.dungeon && this.player.dungeon.isInitFinish && this.player.sc.isShow
    }
    updateLogic(dt: number) {
        if (this.flagMove) {
            this.flagMove = false
            if (this.CanControl) this.player.ctrlMove(this.dir, this.pos, dt)
        }
        if (this.flagTriggerThings) {
            this.flagTriggerThings = false
            this.player.ctrlTriggerThings(this.isLongPress)
        }
        if (this.flagUseItem) {
            this.flagUseItem = false
            this.player.ctrlUseItem(this.itemData)
        }
        if (this.flagUseSkill) {
            this.flagUseSkill = false
            this.player.ctrlUseSkill()
        }
        if (this.flagUseSkill1) {
            this.flagUseSkill1 = false
            this.player.ctrlUseSkill1()
        }
        if (this.flagMeleeAttack) {
            this.flagMeleeAttack = false
            this.player.ctrlMeleeAttack()
        }
        if (this.flagRemoteCancel) {
            this.flagRemoteCancel = false
            this.player.ctrlRemoteCancel()
        }
        if (this.flagRemoteAttack) {
            this.flagRemoteAttack = false
            this.player.ctrlRemoteAttack()
        }
        if (this.flagJump) {
            this.flagJump = false
            this.player.ctrlJump()
        }
        if (this.flagDash) {
            this.flagDash = false
            this.player.ctrlDash()
        }
        if (this.flagJumpCancel) {
            this.flagJumpCancel = false
            this.player.ctrlJumpCancel()
        }
        this.player.updateLogic(dt)
    }
}
