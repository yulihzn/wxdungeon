import FromData from '../data/FromData'
import Actor from '../base/Actor'
import ActorUtils from '../utils/ActorUtils'
import Utils from '../utils/Utils'
import Dungeon from '../logic/Dungeon'
import NonPlayer from '../logic/NonPlayer'
import CCollider from '../collider/CCollider'

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
    static readonly ATTACK_NORMAL = 0
    static readonly ATTACK_STAB = 1 //位移突刺
    static readonly ATTACK_AREA = 2 //范围攻击
    static readonly ATTACK_DASH = 3 //冲刺攻击
    isEnemy = false
    attackType = 0
    collider: CCollider
    isAttacking = false
    nonPlayer: NonPlayer
    dungeon: Dungeon
    hv: cc.Vec2 = cc.v2(1, 0)
    isSpecial = false
    isLarge = false //是否放大
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.opacity = 0
        this.collider = this.getComponent(CCollider)
    }

    init(nonPlayer: NonPlayer, dungeon: Dungeon, isEnemy: boolean) {
        this.isEnemy = isEnemy
        this.nonPlayer = nonPlayer
        this.dungeon = dungeon
        if (!this.collider) {
            this.collider = this.getComponent(CCollider)
        }
        if (isEnemy) {
            this.collider.setTargetTags([CCollider.TAG.GOODNONPLAYER, CCollider.TAG.PLAYER])
        } else {
            this.collider.setTargetTags([CCollider.TAG.NONPLAYER, CCollider.TAG.BOSS])
        }
    }
    start() {}
    //展示
    show(attackType: number, isSpecial: boolean, isLarge: boolean, hv: cc.Vec2) {
        if (!this.nonPlayer) {
            return
        }
        this.isLarge = isLarge
        this.isSpecial = isSpecial
        this.attackType = attackType
        this.changeBoxSize(attackType)
        this.node.opacity = 80
        this.collider.enabled = true
        this.setHv(hv)
    }
    private changeBoxSize(attackType: number) {
        let radius = 64
        let offset = cc.v2(radius, 0)
        this.node.anchorX = 0
        this.node.width = this.isLarge ? radius * 1.5 : radius
        this.node.height = radius
        this.node.position = cc.v3(-16, 32)
        this.collider.offset = offset
        this.collider.w = this.isLarge ? radius * 1.5 : radius
        this.collider.h = radius
        switch (attackType) {
            case ActorAttackBox.ATTACK_NORMAL:
                break
            case ActorAttackBox.ATTACK_STAB:
                this.node.width = this.isSpecial ? 400 : 200
                this.collider.offset = cc.v2(0, 0)
                break
            case ActorAttackBox.ATTACK_AREA:
                this.node.anchorX = 0.5
                radius = 160
                if (this.isLarge) {
                    radius = 320
                }
                this.node.width = radius
                this.node.height = radius
                this.node.position = cc.v3(0, 32)
                this.collider.w = radius
                this.collider.h = radius
                this.collider.offset = cc.v2(0, 0)
                break
            case ActorAttackBox.ATTACK_DASH:
                this.node.anchorX = 0.5
                radius = 64
                this.node.width = radius
                this.node.height = radius
                this.node.position = cc.v3(0, 32)
                this.collider.w = radius
                this.collider.h = radius
                this.collider.offset = cc.v2(0, 0)
                break
        }
    }
    //隐藏
    hide(isMiss: boolean) {
        this.isAttacking = !isMiss
        this.node.opacity = 0
    }
    //结束
    finish() {
        this.node.opacity = 0
        this.isAttacking = false
        this.isSpecial = false
        this.collider.enabled = false
    }
    onColliderStay(other: CCollider, self: CCollider) {
        if (this.isAttacking && this.nonPlayer) {
            let a = other.getComponent(Actor)
            let m = this.nonPlayer
            let target = ActorUtils.getEnemyCollisionTarget(other, !this.isEnemy)
            if (target) {
                this.nonPlayer.sc.isDashing = false
                this.isAttacking = false
                let from = FromData.getClone(m.data.nameCn, m.data.resName + 'anim000')
                let dd = m.data.getAttackPoint()
                dd.isBackAttack = m.isFaceTargetBehind(a) && m.data.FinalCommon.DamageBack > 0
                if (dd.isBackAttack) {
                    dd.realDamage += m.data.FinalCommon.DamageBack
                }
                dd.isMelee = true
                if (this.isSpecial) {
                    dd.physicalDamage = dd.physicalDamage * 2
                }
                if (a.takeDamage(dd, from, this.nonPlayer)) {
                    m.addPlayerStatus(a, from)
                }
                this.isSpecial = false
            }
        }
    }
    setHv(hv: cc.Vec2) {
        this.hv = hv
        this.rotateCollider(this.hv)
    }
    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.02) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return
        }
        //设置旋转角度
        this.node.angle = Utils.getRotateAngle(direction, this.node.scaleX < 0)
    }
}
