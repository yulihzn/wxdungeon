import Player from '../logic/Player'
import StatusManager from '../manager/StatusManager'
import FromData from '../data/FromData'
import ActorUtils from '../utils/ActorUtils'
import CCollider from '../collider/CCollider'
import Actor from '../base/Actor'
import NextStep from '../utils/NextStep'
import Logic from '../logic/Logic'
import OilGoldMetal from './OilGoldMetal'
import Utils from '../utils/Utils'
import DamageData from '../data/DamageData'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 翠金匕首
 */
export default class MetalDagger {
    metal: OilGoldMetal
    attackStep: NextStep = new NextStep()
    private hasTargetMap: Map<number, number> = new Map()
    isPositionReady = false
    isAttacking = false
    currentAngle = 0
    direction: cc.Vec2 = cc.Vec2.ZERO

    constructor(metal: OilGoldMetal) {
        this.metal = metal
    }

    public attacking(attackTarget: CCollider, self: CCollider): void {
        let target = ActorUtils.getEnemyCollisionTarget(attackTarget, true)
        if (target) {
            let from = FromData.getClone(this.metal.player.data.name, '', this.metal.node.position)
            let d = this.metal.player.data.OilGoldData.level / 2
            let dd = new DamageData(d > 0 ? d : 1)
            this.attackStep.IsExcuting = false
            if (target.takeDamage(dd, from, this.metal.player)) {
                StatusManager.addBaseStatus(target, this.metal.player.data.FinalCommon, from)
                this.metal.scheduleOnce(() => {
                    this.isAttacking = false
                    this.playIdle()
                }, 0.2)
            }
        }
    }

    private changeDirection(needRefresh: boolean) {
        if (!this.metal.node) {
            return
        }
        let direction = ActorUtils.getTargetDirection(this.metal.node.position, this.metal.getNearestEnemyActor(600, needRefresh), false)
        if (!direction.equals(cc.Vec3.ZERO)) {
            this.metal.entity.Move.linearVelocity = cc.v2(direction.mul(15))
            this.playAttack()
            return true
        } else {
            this.playIdle()
            this.attackStep.refreshCoolDown(3)
            return false
        }
    }
    updateLogic(dt: number) {
        if (!this.metal.player) {
            return
        }
        this.attackStep.next(
            () => {
                if (!this.attackStep.IsExcuting && this.isPositionReady) {
                    this.hasTargetMap.clear()
                    this.attackStep.IsExcuting = this.changeDirection(true)
                    this.isAttacking = this.attackStep.IsExcuting
                    if (this.isAttacking) {
                        this.isPositionReady = false
                    }
                }
            },
            2,
            false,
            () => {
                if (this.attackStep.IsExcuting) {
                    this.changeDirection(false)
                } else {
                    this.isAttacking = false
                }
            }
        )

        if (this.attackStep.IsExcuting) {
            if (this.direction) {
                this.direction = this.metal.entity.Move.linearVelocity
            } else {
                this.direction = Logic.lerpPos2(this.direction, this.metal.entity.Move.linearVelocity, dt * 5)
            }
        } else {
            this.direction = Logic.lerpPos2(this.direction, cc.v2(1, 0), dt * 5)
        }
        this.rotateCollider(this.direction)
    }

    rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return
        }
        //设置旋转角度
        let angle = Utils.getRotateAngle(direction, false)
        this.metal.sprite.angle = angle
        this.metal.shadow.angle = angle
    }

    private playIdle() {
        this.metal.playAnim(OilGoldMetal.ANIM_IDLE)
    }
    private playAttack() {
        this.metal.playAnim(OilGoldMetal.ANIM_DAGGER_IDLE)
    }

    ready() {
        if (!this.isPositionReady) {
            this.isPositionReady = true
            this.metal.sprite.color = cc.Color.RED
            cc.tween(this.metal.sprite).to(0.1, { color: cc.Color.YELLOW }).start()
        }
    }
}
