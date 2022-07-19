import Boss from '../boss/Boss'
import DamageData from '../data/DamageData'
import IndexZ from '../utils/IndexZ'
import Dungeon from '../logic/Dungeon'
import HitBuilding from '../building/HitBuilding'
import AreaOfEffectData from '../data/AreaOfEffectData'
import ActorUtils from '../utils/ActorUtils'
import InteractBuilding from '../building/InteractBuilding'
import Actor from '../base/Actor'
import CCollider from '../collider/CCollider'
import BaseColliderComponent from '../base/BaseColliderComponent'

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
/**
 * aoe 结点需要Collider 动画事件AnimFinish
 */
@ccclass
export default class AreaOfEffect extends BaseColliderComponent {
    hasTargetMap: Map<number, number> = new Map()
    private isAttacking = false
    data: AreaOfEffectData = new AreaOfEffectData()
    // LIFE-CYCLE CALLBACKS:
    dugeon: Dungeon
    killCallBack: Function
    destoryCallBack: Function
    usePool = false

    get IsAttacking() {
        return this.isAttacking
    }
    onLoad() {
        super.onLoad()
    }

    onEnable() {
        this.hasTargetMap.clear()
        this.isAttacking = false
    }
    start() {}
    //Anim
    AnimFinish() {
        this.close()
    }
    close() {
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid && !this.usePool) {
                this.destroyEntityNode()
            }
            if (this.destoryCallBack && this.usePool) {
                this.destoryCallBack(this.node)
            }
        }, 1)
        this.isAttacking = false
    }

    show(parentNode: cc.Node, postion: cc.Vec3, hv: cc.Vec2, angleOffset: number, data: AreaOfEffectData, killCallBack?: Function, usePool?: boolean, destoryCallBack?: Function) {
        this.data.valueCopy(data)
        this.node.active = true
        this.node.parent = parentNode
        this.usePool = usePool
        this.isAttacking = true
        this.killCallBack = killCallBack
        this.destoryCallBack = destoryCallBack
        this.node.setPosition(postion)
        this.entity.Transform.position = postion
        if (this.data.scale > 0) {
            this.node.scaleX = this.node.scaleX > 0 ? this.data.scale : -this.data.scale
            this.node.scaleY = this.node.scaleY > 0 ? this.data.scale : -this.data.scale
        }
        if (this.data.isRotate) {
            let direction = this.getHv(hv, angleOffset)
            let angle = cc.v2(direction.x, direction.y).signAngle(cc.v2(1, 0))
            let degree = cc.misc.radiansToDegrees(angle)
            this.node.angle = 360 - degree
        }
        this.node.zIndex = this.data.zIndex ? this.data.zIndex : IndexZ.ACTOR
        this.scheduleOnce(() => {
            this.isAttacking = true
        }, this.data.delay)
        if (this.data.duration > 0) {
            this.scheduleOnce(() => {
                this.close()
            }, this.data.duration)
        }
        let anim = this.getComponent(cc.Animation)
        if (anim && !anim.playOnLoad) {
            anim.play()
        }
    }
    private getHv(hv: cc.Vec2, angleOffset: number): cc.Vec2 {
        let pos = cc.v2(hv.clone().rotateSelf((angleOffset * Math.PI) / 180))
        return pos.normalizeSelf()
    }

    onColliderStay(other: CCollider, self: CCollider) {
        if (self.isValid && this.isAttacking) {
            if (this.hasTargetMap.has(other.id) && this.hasTargetMap.get(other.id) > 0) {
                this.hasTargetMap.set(other.id, this.hasTargetMap.get(other.id) + 1)
            } else {
                this.hasTargetMap.set(other.id, 1)
                let isAttack = true
                if (!this.data.isFromEnemy && (other.tag == CCollider.TAG.GOODNONPLAYER || other.tag == CCollider.TAG.PLAYER)) {
                    isAttack = false
                }
                if (this.data.isFromEnemy && (other.tag == CCollider.TAG.NONPLAYER || other.tag == CCollider.TAG.BOSS)) {
                    isAttack = false
                }
                if (isAttack) {
                    this.attacking(other.node, other.tag)
                }
            }
        }
    }
    private attacking(attackTarget: cc.Node, tag: number) {
        if (!attackTarget) {
            return
        }
        let damage = new DamageData()
        damage.valueCopy(this.data.damage)
        damage.isRemote = true
        if (tag == CCollider.TAG.PLAYER || tag == CCollider.TAG.NONPLAYER || tag == CCollider.TAG.GOODNONPLAYER || tag == CCollider.TAG.BOSS) {
            let normal = attackTarget.convertToWorldSpaceAR(cc.Vec2.ZERO).subSelf(this.node.convertToWorldSpaceAR(cc.Vec2.ZERO)).normalizeSelf()
            let target = ActorUtils.getEnemyActorByNode(attackTarget, !this.data.isFromEnemy)
            if (target && !target.sc.isDied) {
                let damageSuccess = target.takeDamage(damage, this.data.from)
                if (damageSuccess) {
                    if (target.data.currentHealth <= 0 && this.killCallBack) {
                        this.killCallBack(target)
                    }
                    if (this.data.canBeatBack && !target.getComponent(Boss)) {
                        this.beatBack(target, normal)
                    }
                }
                for (let status of this.data.statusList) {
                    target.addStatus(status, this.data.from)
                }
            }
        } else if (tag == CCollider.TAG.BUILDING) {
            let interactBuilding = attackTarget.getComponent(InteractBuilding)
            if (this.data.canBreakBuilding && interactBuilding) {
                interactBuilding.takeDamage(damage)
                return
            }
            let hitBuilding = attackTarget.getComponent(HitBuilding)
            if (this.data.canBreakBuilding && hitBuilding) {
                hitBuilding.takeDamage(damage)
            }
        }
    }
    private beatBack(actor: Actor, hv: cc.Vec2) {
        let pos = hv.clone()
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(1, 0)
        }
        let power = 20
        pos = pos.normalizeSelf().mul(power)
        this.scheduleOnce(() => {
            actor.entity.Move.linearVelocity = cc.v2(pos.x, pos.y)
        }, 0.1)
    }
    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > this.data.interval) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    update(dt) {
        if (this.isCheckTimeDelay(dt)) {
            this.hasTargetMap.clear()
        }
    }
}
