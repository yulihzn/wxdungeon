import Player from '../logic/Player'
import StatusManager from '../manager/StatusManager'
import FromData from '../data/FromData'
import ActorUtils from '../utils/ActorUtils'
import CCollider from '../collider/CCollider'
import Actor from '../base/Actor'
import NextStep from '../utils/NextStep'
import Logic from '../logic/Logic'
import OilGoldMetal from './OilGoldMetal'

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
    lastLinearVelocity: cc.Vec2
    private hasTargetMap: Map<number, number> = new Map()
    isDaggerReady = false
    isAttacking = false
    currentAngle = 0
    constructor(metal: OilGoldMetal) {
        this.metal = metal
    }

    getPlayerFarPosition(player: Player, distance: number, angleOffset: number): cc.Vec3 {
        let hv = player.Hv.clone()
        let pos = cc.v3(
            cc
                .v2(hv)
                .rotateSelf((angleOffset * Math.PI) / 180)
                .mul(distance)
        )
        return player.node.position.clone().addSelf(cc.v3(8, 48).addSelf(pos))
    }

    public attacking(attackTarget: CCollider, self: CCollider): void {
        let target = ActorUtils.getEnemyCollisionTarget(attackTarget, true)
        if (target) {
            let from = FromData.getClone(this.metal.player.data.name, '')
            let dd = this.metal.player.data.getFinalAttackPoint()
            this.attackStep.IsExcuting = false
            if (target.takeDamage(dd, from, this.metal.player)) {
                StatusManager.addBaseStatus(target, this.metal.player.data.FinalCommon, from)
                this.metal.playAnim('MetalDaggerHit', true)
                this.lastLinearVelocity = this.metal.entity.Move.linearVelocity.clone()
                this.metal.entity.Move.linearVelocity = cc.Vec2.ZERO
            }
        }
    }

    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.1) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    private currentTarget: Actor
    private getNearestEnemyActor(needRefresh?: boolean) {
        if (!ActorUtils.isTargetCanTrack(this.currentTarget) || needRefresh) {
            this.currentTarget = ActorUtils.getNearestEnemyActor(this.metal.node.position, false, this.metal.player.dungeon, 1000)
        }
        return this.currentTarget
    }
    private changeDirection() {
        let direction = ActorUtils.getTargetDirection(this.metal.node.position, this.getNearestEnemyActor(), false)
        if (!direction.equals(cc.Vec3.ZERO)) {
            this.metal.entity.Move.linearVelocity = cc.v2(direction.mul(10))
            this.playAttack()
            return true
        } else {
            this.playIdle()
            this.attackStep.cutCoolDown(5)
            return false
        }
    }
    updateLogic(dt: number) {
        if (!this.metal.player) {
            return
        }
        if (!this.attackStep.IsExcuting || this.isDaggerReady) {
            this.attackStep.next(
                () => {
                    this.hasTargetMap.clear()
                    this.isDaggerReady = false
                    this.attackStep.IsExcuting = this.changeDirection()
                    this.isAttacking = this.attackStep.IsExcuting
                },
                10,
                true,
                () => {
                    if (this.attackStep.IsExcuting) {
                        this.changeDirection()
                    }
                }
            )
        }
        this.rotateCollider(this.metal.entity.Move.linearVelocity.normalize())
        this.metal.sprite.angle = Logic.lerp(this.metal.sprite.angle, this.currentAngle, dt * 5)
        this.metal.shadow.angle = Logic.lerp(this.metal.shadow.angle, this.currentAngle, dt * 5)
    }

    rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return
        }
        //设置旋转角度
        if (this.currentAngle < 0) {
            this.currentAngle += 360
        }
        if (this.currentAngle >= 0 && this.currentAngle <= 90 && this.metal.sprite.angle >= 225 && this.metal.sprite.angle <= 360) {
            this.metal.sprite.angle -= 360
            this.metal.shadow.angle -= 360
        } else if (this.metal.sprite.angle >= 0 && this.metal.sprite.angle <= 90 && this.currentAngle >= 225 && this.currentAngle <= 360) {
            this.metal.sprite.angle += 360
            this.metal.shadow.angle += 360
        }
    }

    private playIdle() {
        this.metal.playAnim(OilGoldMetal.ANIM_IDLE)
    }
    private playAttack() {
        this.metal.playAnim(OilGoldMetal.ANIM_DAGGER_IDLE)
    }
    hit() {
        this.metal.scheduleOnce(() => {
            this.isAttacking = false
            this.playIdle()
        }, 0.2)
        if (this.lastLinearVelocity) {
            this.metal.entity.Move.linearVelocity = this.lastLinearVelocity.clone()
        }
    }
}
