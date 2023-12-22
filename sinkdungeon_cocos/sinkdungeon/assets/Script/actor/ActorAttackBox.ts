import FromData from '../data/FromData'
import Actor from '../base/Actor'
import ActorUtils from '../utils/ActorUtils'
import Utils from '../utils/Utils'
import CCollider from '../collider/CCollider'
import NonPlayerData from '../data/NonPlayerData'
import StatusManager from '../manager/StatusManager'
import TimeDelay from '../utils/TimeDelay'

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
export default class ActorAttackBox extends cc.Component {
    isEnemy = false
    attackType = 0
    collider: CCollider
    isAttacking = false
    actor: Actor
    hv: cc.Vec2 = cc.v2(1, 0)
    isSpecial = false
    isLarge = false //是否放大
    sprite: cc.Node
    data: NonPlayerData = new NonPlayerData()
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite')
        if (this.sprite) {
            this.collider = this.sprite.getComponent(CCollider)
        }
    }

    init(actor: Actor, data: NonPlayerData) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite')
            this.collider = this.sprite.getComponent(CCollider)
        }
        this.sprite.opacity = 0
        this.isEnemy = data.isEnemy > 0
        this.actor = actor
        this.data = data
        if (this.isEnemy) {
            this.collider.setTargetTags([CCollider.TAG.GOODNONPLAYER, CCollider.TAG.PLAYER, CCollider.TAG.PLAYER_HIT])
        } else {
            this.collider.setTargetTags([CCollider.TAG.NONPLAYER, CCollider.TAG.BOSS])
        }
    }
    start() {}
    /**
     * 展示攻击提示
     * @param boxRect
     * @param isSpecial
     * @param dashLength
     * @param hv
     * @returns
     */
    show(boxRect: string, isSpecial: boolean, dashLength: number, hv: cc.Vec2, isHalf: boolean) {
        if (!this.actor) {
            cc.log('attackBox not init')
            return
        }
        this.setHv(hv)
        this.collider.enabled = true
        this.isSpecial = isSpecial
        this.sprite.opacity = 40
        let rectArr = boxRect.split(',')
        this.sprite.position = cc.v3(parseInt(rectArr[0]), parseInt(rectArr[1]))
        let w = parseInt(rectArr[2])
        if (isHalf) {
            w = w / 2
        }
        let h = parseInt(rectArr[3])
        let len = dashLength - w
        if (len < 0) {
            len = 0
        }
        this.sprite.stopAllActions()
        this.sprite.width = 0
        cc.tween(this.sprite)
            .to(0.1, { width: w })
            .delay(0.1)
            .to(0.1, { width: w + len })
            .start()
        this.sprite.height = h
        this.collider.offset = cc.v2(w / 2, 0)
        this.collider.w = w
        this.collider.h = h
        this.collider.zHeight = parseInt(rectArr[4])
    }
    //隐藏
    hide(isMiss: boolean) {
        this.isAttacking = !isMiss
        this.sprite.opacity = 0
    }
    //结束
    finish() {
        this.sprite.opacity = 0
        this.isAttacking = false
        this.isSpecial = false
        this.collider.enabled = false
    }
    onColliderStay(other: CCollider, self: CCollider) {
        if (this.isAttacking && this.actor) {
            if (other.tag == CCollider.TAG.PLAYER_HIT) {
                this.isAttacking = false
                return
            }
            let a = other.getComponent(Actor)
            let m = this.actor
            let target = ActorUtils.getEnemyCollisionTarget(other, !this.isEnemy)
            if (target) {
                this.actor.sc.isDashing = false
                this.isAttacking = false
                let from = FromData.getClone(this.data.nameCn, this.data.resName + 'anim000', this.node.position)
                let dd = this.data.getAttackPoint()
                dd.isBackAttack = ActorUtils.isBehindTarget(m, a) && this.data.FinalCommon.DamageBack > 0
                if (dd.isBackAttack) {
                    dd.realDamage += this.data.FinalCommon.DamageBack
                }
                dd.isMelee = true
                if (this.isSpecial) {
                    dd.physicalDamage = dd.physicalDamage * 2
                }
                if (a.takeDamage(dd, from, this.actor)) {
                    StatusManager.addBaseStatus(a, this.data.FinalCommon, from)
                }
                this.isSpecial = false
            }
        }
    }

    setHv(hv: cc.Vec2) {
        this.hv = hv
        this.rotateCollider(this.hv)
    }

    rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return
        }
        //设置旋转角度
        this.node.angle = Utils.getRotateAngle(direction)
    }
}
