import Logic from '../logic/Logic'
import DamageData from '../data/DamageData'
import Actor from '../base/Actor'
import FromData from '../data/FromData'
import StatusData from '../data/StatusData'
import { EventHelper } from '../logic/EventHelper'
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
export default class SlimeVenom extends Actor {
    takeDamage(damage: DamageData, from: FromData, actor?: Actor): boolean {
        return false
    }
    venom1: cc.Node
    venom2: cc.Node
    venom3: cc.Node
    target: Actor
    anim: cc.Animation
    sprite: cc.Node
    isHide = false
    isForever = false
    from: FromData = FromData.getClone('史莱姆毒液', 'venom', cc.Vec3.ZERO)
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.venom1 = this.node.getChildByName('sprite').getChildByName('venom1')
        this.venom2 = this.node.getChildByName('sprite').getChildByName('venom2')
        this.venom3 = this.node.getChildByName('sprite').getChildByName('venom2')
        this.anim = this.getComponent(cc.Animation)
        this.sprite = this.node.getChildByName('sprite')
    }

    onEnable() {
        this.isHide = false
        this.sprite.opacity = 255
        this.venom1.angle = Logic.getRandomNum(0, 180)
        this.venom2.angle = Logic.getRandomNum(0, 180)
        this.venom2.angle = Logic.getRandomNum(0, 180)
        this.anim.play()
        if (!this.isForever) {
            this.scheduleOnce(() => {
                if (this.anim) {
                    this.isHide = true
                    this.anim.play('VenomHide')
                    this.scheduleOnce(() => {
                        EventHelper.emit('destoryvenom', { coinNode: this.node })
                    }, 1.5)
                }
            }, 3)
        }
        this.damagePlayer(this.from)
    }
    updateData(): void {}
    addStatus(statusType: string, from: FromData) {}
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistanceNoSqrt(this.node.position, playerNode.position)
        return dis
    }
    checkTimeDelay = new TimeDelay(1)

    update(dt) {
        if (Logic.isGamePause) {
            return
        }
        if (this.checkTimeDelay.check(dt)) {
            this.damagePlayer(this.from)
        }
    }
    private damagePlayer(from: FromData) {
        if (this.target && this.getNearPlayerDistance(this.target.node) < 60 * this.node.scale && this.node.active && !this.isHide) {
            let dd = new DamageData()
            dd.magicDamage = 3
            this.target.takeDamage(dd, from)
        }
    }
    getCenterPosition(): cc.Vec3 {
        return this.node.position.clone()
    }

    actorName() {
        return '史莱姆毒液'
    }

    takeDizz(dizzDuration: number): void {}

    updateStatus(statusList: StatusData[], totalStatusData: StatusData): void {}
    hideSelf(hideDuration: number): void {}
    updateLife(sanity: number, solid: number, liquid: number): void {}
    updateDream(offset: number): number {
        return 0
    }
    setLinearVelocity(movement: cc.Vec2) {}
}
