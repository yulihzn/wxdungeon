import ExitData from '../data/ExitData'
import Dungeon from '../logic/Dungeon'
import ShadowOfSight from '../effect/ShadowOfSight'
import Logic from '../logic/Logic'
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from '../logic/Player'
import Tips from '../ui/Tips'
import AudioPlayer from '../utils/AudioPlayer'
import Building from './Building'
import CCollider from '../collider/CCollider'
import Dialogue from '../ui/Dialogue'
import { EventHelper } from '../logic/EventHelper'

const { ccclass, property } = cc._decorator

@ccclass
export default class RoomBed extends Building {
    dungeon: Dungeon
    isFirst = true
    isDecorate = false
    tips: Tips
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.lights = this.getComponentsInChildren(ShadowOfSight)
        this.tips = this.getComponentInChildren(Tips)
        this.tips.onInteract((isLongPress: boolean, player: Player) => {
            if (this.node) {
                this.enterDream(player)
            }
        })
    }

    init(dungeon: Dungeon, isDecorate: boolean) {
        this.dungeon = dungeon
        this.isDecorate = isDecorate
        this.tips.node.active = !isDecorate
    }
    start() {
        this.node.getChildByName('sprite').getChildByName('bed').getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(
            `avatarbed00${Logic.playerData.AvatarData.organizationIndex}`
        )
        this.node.getChildByName('sprite').getChildByName('cover').getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(
            `avatarcover00${Logic.playerData.AvatarData.organizationIndex}`
        )
        for (let light of this.lights) {
            light.updateRender(!this.isDecorate)
        }
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        if (this.isDecorate || self.tag == CCollider.TAG.TIPS) {
            return
        }
        let player = other.node.getComponent(Player)
        this.enterDream(player)
    }
    enterDream(player: Player) {
        if (player && this.isFirst) {
            player.avatar.playStop()
            Dialogue.play(Dialogue.DAILY_SLEEP, (index: number) => {
                if (index == 0) {
                    return
                }
                this.isFirst = false
                EventHelper.emit(EventHelper.HUD_CAMERA_ZOOM_IN)
                player.sleep()
                this.scheduleOnce(() => {
                    if (Logic.playerData.pos.equals(this.data.defaultPos)) {
                        Logic.playerData.pos.y = this.data.defaultPos.y
                    }
                    AudioPlayer.play(AudioPlayer.EXIT)
                    //休息8小时
                    Logic.data.dreamCostTime = 60000 * 60 * 8
                    player.dungeon.isInitFinish = false
                    Logic.loadingNextLevel(ExitData.getDreamExitDataFromReal())
                }, 1)
            })
        }
    }
    // update (dt) {}
}
