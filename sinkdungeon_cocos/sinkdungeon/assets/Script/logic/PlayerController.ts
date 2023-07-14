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
import { EventHelper } from './EventHelper'
@ccclass
export default class PlayerController extends BaseController {
    onLoad() {
        EventHelper.on(EventHelper.PLAYER_MOVE, detail => {
            if (this.CanControl) this.player.ctrlMove(detail.dir, detail.pos, detail.dt, this.player.dungeon)
        })
        EventHelper.on(EventHelper.PLAYER_TRIGGER, detail => {
            if (this.CanControl) this.player.ctrlTriggerThings(detail && detail.isLongPress)
        })
        EventHelper.on(EventHelper.PLAYER_USEITEM, detail => {
            if (this.CanControl) this.player.ctrlUseItem(detail.itemData)
        })
        EventHelper.on(EventHelper.PLAYER_SKILL, detail => {
            if (this.CanControl) this.player.ctrlUseSkill()
        })
        EventHelper.on(EventHelper.PLAYER_SKILL1, detail => {
            if (this.CanControl) this.player.ctrlUseSkill1()
        })
        EventHelper.on(EventHelper.PLAYER_ATTACK, detail => {
            if (this.CanControl) this.player.ctrlMeleeAttack()
        })
        EventHelper.on(EventHelper.PLAYER_REMOTEATTACK_CANCEL, detail => {
            if (this.CanControl) this.player.ctrlRemoteCancel()
        })
        EventHelper.on(EventHelper.PLAYER_REMOTEATTACK, detail => {
            if (this.CanControl) this.player.ctrlRemoteAttack()
        })
        EventHelper.on(EventHelper.PLAYER_JUMP, detail => {
            if (this.CanControl) this.player.ctrlJump()
        })
        EventHelper.on(EventHelper.PLAYER_DASH, detail => {
            if (this.CanControl) this.player.ctrlDash()
        })
        EventHelper.on(EventHelper.PLAYER_JUMP_CANCEL, detail => {
            if (this.CanControl) this.player.ctrlJumpCancel()
        })
    }
}
