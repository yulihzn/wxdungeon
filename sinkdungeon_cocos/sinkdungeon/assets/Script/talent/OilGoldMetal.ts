import { EventHelper } from './../logic/EventHelper'
import Player from '../logic/Player'
import IndexZ from '../utils/IndexZ'
import CCollider from '../collider/CCollider'
import BaseColliderComponent from '../base/BaseColliderComponent'
import Logic from '../logic/Logic'
import MetalDagger from './MetalDagger'
import MetalTalentData from '../data/MetalTalentData'

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
    static readonly MODE_HAND = 2
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
    dagger: MetalDagger
    data: MetalTalentData = new MetalTalentData()

    onLoad() {
        super.onLoad()
        this.dagger = new MetalDagger(this)
        EventHelper.on(EventHelper.SELECT_METAL_TALENT, detail => {
            if (this.node) {
                this.changeMode(Logic.playerMetals[Logic.metalId])
            }
        })
    }

    start() {}
    init(player: Player) {
        this.player = player
        this.node.parent = this.player.node.parent
        this.node.setPosition(player.node.position.clone())
        this.entity.Transform.position = this.node.position.clone()
        this.entity.NodeRender.root = this.root
        this.node.zIndex = IndexZ.OVERHEAD
        this.changeMode(Logic.playerMetals[Logic.metalId])
    }
    changeMode(data: MetalTalentData) {
        this.data.valueCopy(data)
        if (this.data.id.indexOf(MetalTalentData.METAL_DAGGER) != -1) {
            this.mode = OilGoldMetal.MODE_DAGGER
        } else if (this.data.id.indexOf(MetalTalentData.METAL_HAND) != -1) {
            this.mode = OilGoldMetal.MODE_HAND
        } else if (this.data.id.indexOf(MetalTalentData.METAL_SHIELD) != -1) {
            this.mode = OilGoldMetal.MODE_SHIELD
        } else {
            this.mode = OilGoldMetal.MODE_NONE
        }
    }

    onColliderStay(other: CCollider, self: CCollider) {
        if (self.w > 0 && self.h > 0) {
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
    getPlayerFarPosition(player: Player, distance: number, angleOffset: number): cc.Vec3 {
        let hv = player.Hv.clone()
        let pos = cc.v3(
            cc
                .v2(hv)
                .rotateSelf((angleOffset * Math.PI) / 180)
                .mul(distance)
        )
        return player.node.position.clone().addSelf(pos)
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
            this.dagger.ready()
        } else if (mag < 100) {
            speed = 2
        } else if (mag < 200) {
            speed = 4
        } else {
            speed = 8
        }
        let ps = offset.normalizeSelf().mulSelf(speed)
        this.entity.Move.linearVelocity = cc.v2(ps.x, ps.y)
    }

    playAnim(animName: string, immediate?: boolean) {
        if ((!immediate && !this.anim.getAnimationState(animName).isPlaying) || immediate) {
            this.anim.play(animName)
        }
    }
}
