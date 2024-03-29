import Player from '../logic/Player'
import Logic from '../logic/Logic'
import { EventHelper } from '../logic/EventHelper'
import Random from '../utils/Random'
import AudioPlayer from '../utils/AudioPlayer'
import BaseNodeComponent from '../base/BaseNodeComponent'
import TimeDelay from '../utils/TimeDelay'

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
export default class OilGold extends BaseNodeComponent {
    static readonly FACE_VALUE = 100
    value: number = 0
    isReady = false
    player: Player
    isReal = false

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad()
    }
    onEnable() {
        let speed = 6
        let x = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed
        let y = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed
        this.entity.Move.linearVelocity = cc.v2(x, y)
        this.entity.Move.damping = Logic.getRandomNum(2, 6)
        this.isReady = false
        this.scheduleOnce(() => {
            this.isReady = true
            this.entity.Transform.position = this.node.position.clone()
            this.entity.NodeRender.node = this.node
        }, 1)
    }
    changeValue(value: number) {
        //目前只有1和10
        this.value = value
        if (this.value >= OilGold.FACE_VALUE) {
            this.node.scale = 2
        } else {
            this.node.scale = 1
        }
    }
    private getFinalValue() {
        let value = this.value
        switch (Logic.data.chapterIndex) {
            case Logic.CHAPTER00:
                break
            case Logic.CHAPTER01:
                value = value * 10
                break
            case Logic.CHAPTER02:
                value = value * 100
                break
            case Logic.CHAPTER03:
                value = value * 1000
                break
            case Logic.CHAPTER04:
                value = value * 10000
                break
            case Logic.CHAPTER05:
                value = value * 10000
                break
            default:
                break
        }
        return value
    }
    start() {}

    private checkTimeDelay = new TimeDelay(0.2)

    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistanceNoSqrt(this.node.position, playerNode.position.clone().addSelf(cc.v3(0, 32)))
        return dis
    }
    update(dt) {
        if (this.checkTimeDelay.check(dt)) {
            if (this.player && this.getNearPlayerDistance(this.player.node) < 1600 && this.node.active && this.isReady) {
                let p = this.player.node.position.clone()
                p.y += 10
                let pos = p.sub(this.node.position)
                if (!pos.equals(cc.Vec3.ZERO)) {
                    pos = pos.normalizeSelf()
                    this.entity.Move.linearVelocity = cc.v2(pos.x, pos.y).normalize().mul(16)
                    this.entity.Move.damping = 1
                }
            }
        }
        if (this.player && this.getNearPlayerDistance(this.player.node) < 64 && this.node.active && this.isReady) {
            this.isReady = false
            AudioPlayer.play(AudioPlayer.OILGOLD)
            EventHelper.emit(EventHelper.HUD_ADD_OILGOLD, { count: this.getFinalValue() })
            EventHelper.emit('destoryoilgold', { oilGoldNode: this.node })
        }
    }
}
