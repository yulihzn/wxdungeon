import Player from '../logic/Player'
import DamageData from '../data/DamageData'
import StatusManager from '../manager/StatusManager'
import FromData from '../data/FromData'
import IndexZ from '../utils/IndexZ'
import ActorUtils from '../utils/ActorUtils'
import CCollider from '../collider/CCollider'
import BaseColliderComponent from '../base/BaseColliderComponent'
import Utils from '../utils/Utils'
import Actor from '../base/Actor'
import NextStep from '../utils/NextStep'
import Logic from '../logic/Logic'
import MetalDagger from './MetalDagger'

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
    static readonly MODE_NONE = 0
    static readonly MODE_DAGGER = 1
    static readonly MODE_ARM = 2
    static readonly MODE_SHIELD = 3
    static readonly ANIM_IDLE = 'MetalIdle'
    static readonly ANIM_DAGGER_IDLE = 'MetalDaggerIdle'
    static readonly ANIM_DAGGER_HIT = 'MetalDaggerHit'
    @property(cc.Animation)
    anim: cc.Animation = null
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Node)
    sprite: cc.Node = null
    @property(cc.Node)
    shadow: cc.Node = null
    idleAngle = 0
    player: Player
    mode = OilGoldMetal.MODE_NONE
    currentAngle = 0
    dagger: MetalDagger

    onLoad() {
        super.onLoad()
        this.dagger = new MetalDagger(this)
    }

    start() {}
    init(player: Player, mode: number) {
        this.player = player
        this.node.parent = this.player.node.parent
        this.node.setPosition(player.node.position.clone())
        this.entity.Transform.position = this.node.position.clone()
        this.entity.NodeRender.root = this.root
        this.node.zIndex = IndexZ.OVERHEAD
        this.changeMode(mode)
    }
    changeMode(mode: number) {
        this.mode = mode
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

    onColliderStay(other: CCollider, self: CCollider) {
        if (self.radius > 0) {
            if (this.dagger && this.player && this.dagger.attackStep.IsExcuting) {
                this.dagger.attacking(other, self)
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

    updateLogic(dt: number) {
        if (!this.player) {
            return
        }
        if (this.dagger) {
            this.dagger.updateLogic(dt)
        }

        if (this.isCheckTimeDelay(dt)) {
            this.followPlayer()
        }

        this.entity.Transform.base = this.player.entity.Transform.base
        let y = this.root.y - this.entity.Transform.base
        if (y < 0) {
            y = 0
        }
        let scale = 1 - y / 64
        this.shadow.scale = scale < 0.5 ? 0.5 : scale
        this.shadow.y = this.entity.Transform.base
    }
    private followPlayer() {
        if (this.dagger.isAttacking) {
            return
        }
        let pos = this.getPlayerFarPosition(this.player, -50, this.idleAngle)
        this.idleAngle += 20
        if (this.idleAngle > 360) {
            this.idleAngle = 0
        }
        let offset = pos.sub(this.node.position)
        let mag = offset.mag()
        let speed = 1
        if (mag < 50) {
            speed = 1
        } else if (mag < 100) {
            speed = 1
            if (this.dagger) {
                this.dagger.isDaggerReady = true
            }
        } else if (mag < 200) {
            speed = 4
        } else {
            speed = 8
        }
        let ps = offset.normalizeSelf().mulSelf(speed)
        this.entity.Move.linearVelocity = cc.v2(ps.x, ps.y)
    }

    rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return
        }
        //设置旋转角度
        if (this.currentAngle < 0) {
            this.currentAngle += 360
        }
        if (this.currentAngle >= 0 && this.currentAngle <= 90 && this.sprite.angle >= 225 && this.sprite.angle <= 360) {
            this.sprite.angle -= 360
            this.shadow.angle -= 360
        } else if (this.sprite.angle >= 0 && this.sprite.angle <= 90 && this.currentAngle >= 225 && this.currentAngle <= 360) {
            this.sprite.angle += 360
            this.shadow.angle += 360
        }
    }

    //Anim
    AnimDaggerHit() {
        if (this.dagger) {
            this.dagger.hit()
        }
    }

    playAnim(animName: string, immediate?: boolean) {
        if ((!immediate && !this.anim.getAnimationState(animName).isPlaying) || immediate) {
            this.anim.play(animName)
        }
    }
}
