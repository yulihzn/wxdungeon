import Player from '../logic/Player'
import DamageData from '../data/DamageData'
import StatusManager from '../manager/StatusManager'
import FromData from '../data/FromData'
import IndexZ from '../utils/IndexZ'
import ActorUtils from '../utils/ActorUtils'
import CCollider from '../collider/CCollider'
import BaseColliderComponent from '../base/BaseColliderComponent'
import Shooter from '../logic/Shooter'

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
 * 翠金体
 * 单体形态有：
 * 不稳定圆球 圆球的动画有等待、转变为匕首、转变为盾牌、转变为刺球，转变为手臂
 * 匕首 匕首动画有等待、飞行 击中 击中状态转变为飞行，飞行转变为等待
 * 盾牌 盾牌动画有等待、普通被击中转等待、普通被击中转破碎 等待转刺球，刺球被击中转等待 刺球被击中转爆炸
 * 手臂 手臂有等待 等待转砸地，砸地转砸地二连三连 等待转起跳，起跳转向上飞，向上飞转滑行
 */
@ccclass
export default class OilGoldMetal extends BaseColliderComponent {
    @property(cc.Animation)
    anim: cc.Animation = null
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Node)
    shadow: cc.Node = null
    @property(Shooter)
    shooter: Shooter = null

    flyAngle = 0
    player: Player

    onLoad() {
        super.onLoad()
    }

    start() {}
    init(player: Player) {
        this.player = player
        this.node.parent = this.player.node.parent
        this.node.setPosition(player.node.position.clone())
        this.entity.Transform.position = this.node.position.clone()
        this.entity.NodeRender.root = this.root
        this.node.zIndex = IndexZ.OVERHEAD
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
            let pos = this.getPlayerFarPosition(this.player, -50, this.flyAngle)
            this.flyAngle += 20
            if (this.flyAngle > 360) {
                this.flyAngle = 0
            }
            let offset = pos.sub(this.node.position)
            let mag = offset.mag()
            let speed = 1
            if (mag < 50) {
                speed = 1
            } else if (mag < 200) {
                speed = 4
            } else {
                speed = 8
            }
            let ps = offset.normalizeSelf().mulSelf(speed)
            this.entity.Move.linearVelocity = cc.v2(ps.x, ps.y)
            this.entity.Transform.base = this.player.entity.Transform.base
            let y = this.root.y - this.entity.Transform.base
            if (y < 0) {
                y = 0
            }
            let scale = 1 - y / 64
            this.shadow.scale = scale < 0.5 ? 0.5 : scale
            this.shadow.y = this.entity.Transform.base
        }
    }

    hasNearEnemy() {
        if (!this.player) {
            return cc.Vec3.ZERO
        }
        return ActorUtils.getDirectionFromNearestEnemy(this.player.node.position, false, this.player.dungeon, false, 400)
    }
}
