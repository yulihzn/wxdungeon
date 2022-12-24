import { EventHelper } from './../logic/EventHelper'
import Player from '../logic/Player'
import IndexZ from '../utils/IndexZ'
import CCollider from '../collider/CCollider'
import BaseColliderComponent from '../base/BaseColliderComponent'
import Logic from '../logic/Logic'
import MetalDagger from './MetalDagger'
import MetalTalentData from '../data/MetalTalentData'
import MetalHand from './MetalHand'
import MetalShield from './MetalShield'
import Actor from '../base/Actor'
import ActorUtils from '../utils/ActorUtils'

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
    static readonly ANIM_HAND_IDLE = 'MetalHandIdle'
    static readonly ANIM_HAND_ATTACK1 = 'MetalHandAttack1'
    static readonly ANIM_SHIELD_IDLE = 'MetalShieldIdle'
    static readonly ANIM_SHIELD_HIDE = 'MetalShieldHide'
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
    hand: MetalHand
    shield: MetalShield
    data: MetalTalentData = new MetalTalentData()

    onLoad() {
        super.onLoad()
        this.dagger = new MetalDagger(this)
        this.hand = new MetalHand(this)
        this.shield = new MetalShield(this)
        EventHelper.on(EventHelper.SELECT_METAL_TALENT, detail => {
            if (this.node) {
                this.changeMode(Logic.getCurrentMetal())
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
        this.changeMode(Logic.getCurrentMetal())
    }
    changeMode(data: MetalTalentData) {
        this.data.valueCopy(data)
        if (this.data.id.indexOf(MetalTalentData.METAL_DAGGER) != -1) {
            this.mode = OilGoldMetal.MODE_DAGGER
            if (this.dagger) {
                this.dagger.ready()
            }
        } else if (this.data.id.indexOf(MetalTalentData.METAL_HAND) != -1) {
            this.mode = OilGoldMetal.MODE_HAND
            if (this.hand) {
                this.hand.ready()
            }
        } else if (this.data.id.indexOf(MetalTalentData.METAL_SHIELD) != -1) {
            this.mode = OilGoldMetal.MODE_SHIELD
            if (this.shield) {
                this.shield.ready()
            }
        } else {
            this.mode = OilGoldMetal.MODE_NONE
            this.playIdle()
        }
    }
    private playIdle() {
        this.playAnim(OilGoldMetal.ANIM_IDLE)
    }
    onColliderStay(other: CCollider, self: CCollider) {
        if (self.w > 0 && self.h > 0 && this.player) {
            if (this.mode == OilGoldMetal.MODE_DAGGER) {
                if (this.dagger && this.dagger.attackStep.IsExcuting) {
                    this.dagger.attacking(other, self)
                }
            } else if (this.mode == OilGoldMetal.MODE_HAND) {
                if (this.hand && this.hand.attackStep.IsExcuting) {
                    this.hand.attacking(other, self)
                }
            } else if (this.mode == OilGoldMetal.MODE_SHIELD) {
                if (this.shield && this.shield.attackStep.IsExcuting) {
                    this.shield.attacking(other, self)
                }
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

        if (this.mode == OilGoldMetal.MODE_DAGGER) {
            if (this.dagger) {
                this.dagger.updateLogic(dt)
            }
        } else if (this.mode == OilGoldMetal.MODE_HAND) {
            if (this.hand) {
                this.hand.updateLogic(dt)
            }
        } else if (this.mode == OilGoldMetal.MODE_SHIELD) {
            if (this.shield) {
                this.shield.updateLogic(dt)
            }
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
        return player.node.position.clone().addSelf(cc.v3(0, 48).addSelf(pos))
    }
    private followPlayer() {
        if (this.dagger.isAttacking || this.hand.IsAttacking || this.shield.isAttacking) {
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
            this.shield.ready()
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
    private currentTarget: Actor
    getNearestEnemyActor(distance: number, needRefresh?: boolean) {
        if (!ActorUtils.isTargetCanTrack(this.currentTarget) || needRefresh) {
            this.currentTarget = ActorUtils.getNearestEnemyActor(this.node.position, false, this.player.dungeon, distance)
        }
        return this.currentTarget
    }
    //Anim
    AnimHandAttackFinish() {
        if (this.hand) {
            this.hand.ready()
        }
    }
    //Anim
    DashTime() {
        if (this.hand) {
            this.hand.dash()
        }
    }
}
