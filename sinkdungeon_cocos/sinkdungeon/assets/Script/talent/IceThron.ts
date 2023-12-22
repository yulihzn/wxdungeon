import Player from '../logic/Player'
import DamageData from '../data/DamageData'
import FromData from '../data/FromData'
import StatusManager from '../manager/StatusManager'
import IndexZ from '../utils/IndexZ'
import ActorUtils from '../utils/ActorUtils'
import CCollider from '../collider/CCollider'
import Actor from '../base/Actor'
import StatusData from '../data/StatusData'
import BaseColliderComponent from '../base/BaseColliderComponent'
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
export default class IceThron extends BaseColliderComponent {
    hasTargetMap: Map<number, number> = new Map()

    isAttacking = false
    // LIFE-CYCLE CALLBACKS:
    player: Player

    onLoad() {
        super.onLoad()
        if (this.entity && this.entity.Move) {
            this.entity.Move.isStatic = true
        }
    }

    start() {}
    //Anim
    AnimFinish() {
        this.isAttacking = false
        this.scheduleOnce(() => {
            if (this.node) this.destroyEntityNode()
        }, 1)
    }
    show(player: Player, angle: number, distance: number, scale: number) {
        this.player = player
        this.node.active = true
        this.node.parent = player.node.parent
        this.node.setPosition(this.getPlayerPosition(player, angle, distance))
        this.node.scale = scale
        if (angle > 90 && angle < 270) {
            this.node.scaleX = -this.node.scaleX
        }
        this.isAttacking = true
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position)
    }
    getPlayerPosition(player: Player, angleOffset: number, distance: number): cc.Vec3 {
        let hv = player.Hv.clone()
        let pos = cc.v3(cc.v2(hv).rotateSelf((angleOffset * Math.PI) / 180)).normalizeSelf()
        return player.node.position.clone().addSelf(pos.mulSelf(distance))
    }

    onColliderStay(other: CCollider, self: CCollider) {
        if (self.radius > 0 && this.isAttacking) {
            if (this.hasTargetMap.has(other.id) && this.hasTargetMap.get(other.id) > 0) {
                this.hasTargetMap.set(other.id, this.hasTargetMap.get(other.id) + 1)
            } else {
                this.hasTargetMap.set(other.id, 1)
                let target = ActorUtils.getEnemyCollisionTarget(other, true)
                if (target) {
                    this.attacking(other.node)
                }
            }
        }
    }
    attacking(attackTarget: cc.Node) {
        if (!attackTarget) {
            return
        }
        let damage = new DamageData()
        let status = StatusManager.FROZEN
        let d = 4

        damage.magicDamage = d
        let target = ActorUtils.getEnemyActorByNode(attackTarget, true)
        if (target && !target.sc.isDied) {
            let fromData = FromData.getClone('冰刺', 'bossicethron02', this.node.position)
            target.takeDamage(damage, fromData)
            target.addStatus(status, fromData)
        }
    }
    checkTimeDelay = new TimeDelay(0.5)
    update(dt) {
        if (this.checkTimeDelay.check(dt)) {
            this.hasTargetMap.clear()
        }
    }
}
