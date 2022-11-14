import Player from '../logic/Player'
import DamageData from '../data/DamageData'
import StatusManager from '../manager/StatusManager'
import FromData from '../data/FromData'
import Logic from '../logic/Logic'
import IndexZ from '../utils/IndexZ'
import ActorUtils from '../utils/ActorUtils'
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

@ccclass
export default class OilGoldMetal extends BaseColliderComponent {
    @property(cc.Animation)
    anim: cc.Animation = null

    player: Player

    onLoad() {
        super.onLoad()
    }

    start() {}
    init(player: Player) {
        this.player = player
        this.node.setPosition(player.node.position.clone())
        this.node.zIndex = IndexZ.OVERHEAD
        this.scheduleOnce(() => {
            this.node.setPosition(this.getPlayerFarPosition(this.player, 50, 0))
        }, 0.2)
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

    onColliderEnter(other: CCollider, self: CCollider) {
        if (self.radius > 0) {
            let target = ActorUtils.getEnemyCollisionTarget(other, true)
            if (target) {
                // this.attacking(other.node)
            }
        }
    }
    attacking(attackTarget: cc.Node) {
        if (!attackTarget) {
            return
        }
        let damage = new DamageData()
        let status = StatusManager.BURNING
        let d = 1
        damage.magicDamage = d
        let target = ActorUtils.getEnemyActorByNode(attackTarget, true)
        if (target && !target.sc.isDied) {
            target.takeDamage(damage)
            target.addStatus(status, new FromData())
        }
    }
    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    updateLogic(dt: number) {
        if (!this.player) {
            return
        }
        if (this.isCheckTimeDelay(dt)) {
            let pos = this.getPlayerFarPosition(this.player, 50, 0)
            let ps = pos.sub(this.node.position).normalizeSelf().mulSelf(4)
            this.entity.Move.linearVelocity = cc.v2(ps.x, ps.y)
        }
    }

    hasNearEnemy() {
        if (!this.player) {
            return cc.Vec3.ZERO
        }
        return ActorUtils.getDirectionFromNearestEnemy(this.player.node.position, false, this.player.dungeon, false, 400)
    }
}
