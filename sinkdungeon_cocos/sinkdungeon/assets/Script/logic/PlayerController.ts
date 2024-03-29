import BaseController from './BaseController'
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
import { EventHelper } from './EventHelper'
@ccclass
export default class PlayerController extends BaseController {
    onLoad() {
        EventHelper.on(EventHelper.PLAYER_MOVE, detail => {
            if (this.CanControl) {
                this.flagMove = true
                this.pos = detail.pos
                this.dir = detail.dir
            }
        })
        EventHelper.on(EventHelper.PLAYER_TRIGGER, detail => {
            if (this.CanControl) {
                this.flagTriggerThings = true
                this.isLongPress = detail && detail.isLongPress
            }
        })
        EventHelper.on(EventHelper.PLAYER_USEITEM, detail => {
            if (this.CanControl) {
                this.flagUseItem = true
                this.itemData = detail.itemData
            }
        })
        EventHelper.on(EventHelper.PLAYER_SKILL, detail => {
            if (this.CanControl) this.flagUseSkill = true
        })
        EventHelper.on(EventHelper.PLAYER_SKILL1, detail => {
            if (this.CanControl) this.flagUseSkill1 = true
        })
        EventHelper.on(EventHelper.PLAYER_ATTACK, detail => {
            if (this.CanControl) this.flagMeleeAttack = true
        })
        EventHelper.on(EventHelper.PLAYER_REMOTEATTACK_CANCEL, detail => {
            if (this.CanControl) this.flagRemoteCancel = true
        })
        EventHelper.on(EventHelper.PLAYER_REMOTEATTACK, detail => {
            if (this.CanControl) this.flagRemoteAttack = true
        })
        EventHelper.on(EventHelper.PLAYER_JUMP, detail => {
            if (this.CanControl) this.flagJump = true
        })
        EventHelper.on(EventHelper.PLAYER_DASH, detail => {
            if (this.CanControl) this.flagDash = true
        })
        EventHelper.on(EventHelper.PLAYER_JUMP_CANCEL, detail => {
            if (this.CanControl) this.flagJumpCancel = true
        })
    }
    updateLogic(dt: number) {
        super.updateLogic(dt)
    }
}
