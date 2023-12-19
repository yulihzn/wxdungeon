import Dungeon from '../logic/Dungeon'
import Player from '../logic/Player'
import Building from './Building'
import IndexZ from '../utils/IndexZ'
import Logic from '../logic/Logic'
import ExitData from '../data/ExitData'
import AudioPlayer from '../utils/AudioPlayer'
import { EventHelper } from '../logic/EventHelper'
import CCollider from '../collider/CCollider'

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
export default class Portal extends Building {
    anim: cc.Animation
    isOpen: boolean = false
    exitData: ExitData = new ExitData()
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation)
    }

    start() {
        this.anim = this.getComponent(cc.Animation)
        this.anim.play('PortalCloseIdle')
    }

    setPos(pos: cc.Vec3) {
        this.entity.Transform.position = Dungeon.getPosInMap(pos)
        this.node.position = this.entity.Transform.position.clone()
        this.node.zIndex = IndexZ.BASE + (Logic.ROOM_HEIGHT - pos.y) * 10 + 1
    }
    AnimGateClose() {
        this.anim.play('PortalCloseIdle')
    }
    AnimGateOpen() {
        this.anim.play('PortalOpenIdle')
    }
    openGate() {
        if (this.isOpen) {
            return
        }
        this.isOpen = true
        this.scheduleOnce(() => {
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation)
            }
            this.anim.play('PortalOpen')
        }, 0.1)
    }
    closeGate() {
        if (!this.isOpen) {
            return
        }
        this.isOpen = false
        this.anim.play('PortalClose')
    }

    onColliderEnter(other: CCollider, self: CCollider) {
        let player = other.node.getComponent(Player)
        if (player) {
            if (this.isOpen) {
                this.closeGate()
                AudioPlayer.play(AudioPlayer.EXIT)
                player.dungeon.isInitFinish = false
                Logic.loadingNextLevel(this.exitData)
            }
        }
    }

    // update (dt) {}
}
