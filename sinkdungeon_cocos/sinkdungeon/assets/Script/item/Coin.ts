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
export default class Coin extends BaseNodeComponent {
    static readonly FACE_VALUE = 10
    anim: cc.Animation
    value: number = 0
    valueRes = ['gem01', 'gem02', 'gem03', 'gem04']
    isReady = false
    player: Player
    isReal = false
    private soundPlaying = false
    shadow: cc.Node
    zSpeed = 15

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad()
        this.init()
    }
    onEnable() {
        this.init()
    }
    init() {
        this.anim = this.getComponent(cc.Animation)
        let speed = Logic.getRandomNum(5, 10)
        let x = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed
        let y = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed
        this.zSpeed = 15
        this.entity.Move.linearVelocity = cc.v2(x, y)
        this.entity.Move.damping = 3
        this.entity.Move.linearVelocityZ = this.zSpeed
        this.isReady = false
        this.entity.NodeRender.root = this.node.getChildByName('root')
        this.shadow = this.node.getChildByName('shadow')
        this.entity.Transform.position = this.node.position.clone()
        this.scheduleOnce(() => {
            this.isReady = true
        }, 2)
    }
    changeValue(value: number) {
        //目前只有1和10
        this.value = value
        let index = 1
        if (this.value == Coin.FACE_VALUE) {
            index = 3
            this.node.scale = 1.2
        } else {
            index = 1
            this.node.scale = 1
        }
        let sprite = this.node.getChildByName('root').getChildByName('sprite').getComponent(cc.Sprite)
        sprite.spriteFrame = Logic.spriteFrameRes(this.valueRes[index])
        if (this.isReal) {
            sprite.spriteFrame = Logic.spriteFrameRes('realcoin')
        }
    }

    start() {}

    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistanceNoSqrt(this.node.position, playerNode.position.clone().addSelf(cc.v3(0, 32)))
        return dis
    }
    private checkTimeDelay = new TimeDelay(0.2)
    update(dt) {
        let y = this.entity.NodeRender.root.y - this.entity.Transform.base
        if (y < 0) {
            y = 0
        }
        let scale = 1 - y / 64
        this.shadow.scale = scale < 0.5 ? 0.5 : scale
        if (y == 0) {
            this.zSpeed -= 3
            if (this.zSpeed < 0) {
                this.zSpeed = 0
            } else {
                this.playSound()
            }
            this.entity.Move.linearVelocityZ = this.zSpeed
        }
        if (this.checkTimeDelay.check(dt)) {
            this.soundPlaying = false
            if (this.player && this.getNearPlayerDistance(this.player.node) < 1600 && this.node.active && this.isReady) {
                let p = this.player.node.position.clone()
                p.y += 10
                let pos = p.sub(this.node.position)
                if (!pos.equals(cc.Vec3.ZERO)) {
                    this.entity.Move.linearVelocity = cc.v2(pos.x, pos.y).normalize().mul(16)
                    this.entity.Move.damping = 1
                }
            }
        }
        if (this.player && this.getNearPlayerDistance(this.player.node) < 64 && this.node.active && this.isReady) {
            this.isReady = false
            this.playSound()
            EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: this.value, isReal: this.isReal })
            EventHelper.emit('destorycoin', { coinNode: this.node })
        }
    }
    private playSound() {
        if (!this.soundPlaying) {
            this.soundPlaying = true
            let arr = [AudioPlayer.COIN, AudioPlayer.COIN1, AudioPlayer.COIN2]
            AudioPlayer.play(arr[Logic.getRandomNum(0, arr.length - 1)])
        }
    }
}
