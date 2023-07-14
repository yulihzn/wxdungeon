import StatusManager from '../manager/StatusManager'
import FromData from '../data/FromData'
import ActorUtils from '../utils/ActorUtils'
import CCollider from '../collider/CCollider'
import NextStep from '../utils/NextStep'
import OilGoldMetal from './OilGoldMetal'
import AudioPlayer from '../utils/AudioPlayer'
import Actor from '../base/Actor'

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
 * 翠金手掌
 */
export default class MetalHand {
    metal: OilGoldMetal
    attackStep: NextStep = new NextStep()
    private hasTargetMap: Map<number, number> = new Map()
    currentAngle = 0
    direction: cc.Vec3 = cc.Vec3.ZERO

    constructor(metal: OilGoldMetal) {
        this.metal = metal
    }

    get IsAttacking() {
        return this.attackStep.IsExcuting
    }
    public attacking(attackTarget: CCollider, self: CCollider): void {
        let target = ActorUtils.getEnemyCollisionTarget(attackTarget, true)
        if (target) {
            let from = FromData.getClone(this.metal.player.data.name, '', this.metal.node.position)
            let dd = this.metal.player.data.getFinalAttackPoint()
            this.attackStep.IsExcuting = false
            if (target.takeDamage(dd, from, this.metal.player)) {
                StatusManager.addBaseStatus(target, this.metal.player.data.FinalCommon, from)
                this.beatBack(target)
            }
        }
    }
    beatBack(actor: Actor) {
        let pos = this.direction.clone()
        if (pos.equals(cc.Vec3.ZERO)) {
            pos = cc.v3(1, 0)
        }
        let power = 4

        pos = pos.normalize().mul(power)
        actor.entity.Move.linearVelocity = cc.v2(pos.x, pos.y).mul(actor.sc.isAttacking ? 0.2 : 1)
    }

    updateLogic(dt: number) {
        if (!this.metal.player) {
            return
        }
        if (!this.IsAttacking) {
            this.metal.node.scaleX = this.metal.player.isFaceRight ? 1 : -1
        }
        ActorUtils.changeZIndex(this.metal)
        this.attackStep.next(
            () => {
                this.direction = ActorUtils.getTargetDirection(this.metal.node.position, this.metal.getNearestEnemyActor(300, true), false)
                if (!this.direction.equals(cc.Vec3.ZERO)) {
                    this.hasTargetMap.clear()
                    this.attackStep.IsExcuting = true
                    this.metal.entity.Move.linearVelocity = cc.Vec2.ZERO
                    this.playAttack()
                }
            },
            2,
            false
        )
    }

    playIdle() {
        this.metal.playAnim(OilGoldMetal.ANIM_HAND_IDLE)
    }
    private playAttack() {
        this.metal.playAnim(OilGoldMetal.ANIM_HAND_ATTACK1)
    }

    ready() {
        this.attackStep.IsExcuting = false
        this.playIdle()
    }
    dash() {
        AudioPlayer.play(AudioPlayer.DASH)
        this.metal.node.scaleX = this.direction.x >= 0 ? 1 : -1
        this.metal.entity.Move.linearVelocity = cc.v2(this.direction.mul(20))
    }
}
