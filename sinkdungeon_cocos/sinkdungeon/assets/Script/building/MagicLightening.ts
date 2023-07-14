import DamageData from '../data/DamageData'
import AudioPlayer from '../utils/AudioPlayer'
import FromData from '../data/FromData'
import StatusManager from '../manager/StatusManager'
import ActorUtils from '../utils/ActorUtils'
import CCollider from '../collider/CCollider'
import Building from './Building'
import { EventHelper } from '../logic/EventHelper'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class MagicLightening extends Building {
    hasTargetMap: Map<number, number> = new Map()
    needPrepare = false
    showArea = false
    anim: cc.Animation
    isTrigger = true //是否自动下落
    isAttacked = false //是否攻击过
    damagePoint = 5
    onLoad() {}

    start() {}
    fall(needPrepare: boolean, showArea: boolean, damagePoint?: number) {
        if (damagePoint && damagePoint > 0) {
            this.damagePoint = damagePoint
        }
        this.needPrepare = needPrepare
        this.isAttacked = false
        let animName = 'LighteningFall'
        if (showArea) {
            animName = 'LighteningFallArea'
        }
        if (needPrepare) {
            animName = 'LighteningPrepareFall'
            this.isAttacked = true
        }
        this.anim = this.getComponent(cc.Animation)
        this.anim.play(animName)
        AudioPlayer.play(AudioPlayer.BOOM)
        EventHelper.emit(EventHelper.CAMERA_SHAKE, { isHeavyShaking: false })
    }
    //Anim
    AnimBegin() {
        this.isAttacked = false
    }
    //Anim
    AnimFinish() {
        this.scheduleOnce(() => {
            if (this.node) {
                this.destroyEntityNode()
            }
        }, 2)
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        let target = ActorUtils.getEnemyCollisionTarget(other)
        if (target && this.isTrigger) {
            this.isTrigger = false
            this.fall(true, true)
        }
    }
    onColliderStay(other: CCollider, self: CCollider) {
        if (self.radius > 0 && !this.isAttacked) {
            this.attacking(other.node)
        }
    }
    attacking(attackTarget: cc.Node) {
        if (!attackTarget) {
            return
        }
        let damage = new DamageData()
        let status = StatusManager.BURNING
        damage.magicDamage = this.damagePoint
        status = StatusManager.DIZZ
        let target = ActorUtils.getEnemyActorByNode(attackTarget, !this.needPrepare)
        if (target && !target.sc.isDied) {
            let fd = FromData.getClone('闪电', 'magiclighteningdown1', this.node.position)
            target.takeDamage(damage, fd)
            target.addStatus(status, fd)
            this.isAttacked = true
        }
    }
    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.5) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    update(dt) {}
}
