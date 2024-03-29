import Dungeon from './Dungeon'
import PlayerData from '../data/PlayerData'
import AudioPlayer from '../utils/AudioPlayer'
import MeleeWeapon from './MeleeWeapon'
import Utils from '../utils/Utils'
import CCollider from '../collider/CCollider'
import BaseColliderComponent from '../base/BaseColliderComponent'
import TriggerData from '../data/TriggerData'
import PlayActor from '../base/PlayActor'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//发射器
const { ccclass, property } = cc._decorator

@ccclass
export default class MeleeShadowWeapon extends BaseColliderComponent {
    player: PlayActor = null
    meleeWeapon: MeleeWeapon
    private anim: cc.Animation
    private isAttacking: boolean = false
    private hv: cc.Vec2 = cc.v2(1, 0)
    private comboType = 0
    private hasTargetMap: Map<number, number> = new Map()

    get IsAttacking() {
        return this.isAttacking
    }

    get IsReflect() {
        if (this.meleeWeapon) {
            return this.meleeWeapon.IsReflect
        }
        return false
    }

    init(player: PlayActor, meleeWeapon: MeleeWeapon) {
        this.anim = this.getComponent(cc.Animation)
        this.player = player
        this.meleeWeapon = meleeWeapon
        if (this.entity && this.entity.Move) {
            this.entity.Move.isStatic = true
        }
    }

    set Hv(hv: cc.Vec2) {
        this.hv = hv.normalizeSelf()
    }
    get Hv(): cc.Vec2 {
        return this.hv
    }

    attack(data: PlayerData, comboType: number, hv: cc.Vec2): boolean {
        this.updateHv(hv)
        this.comboType = comboType
        this.hasTargetMap.clear()
        this.isAttacking = true
        let animname = this.meleeWeapon.getAttackAnimName(comboType)
        this.anim.play(animname)
        this.anim.getAnimationState(animname).speed = this.meleeWeapon.getAnimSpeed(data.FinalCommon)
        return true
    }

    attackIdle(isReverse: boolean) {
        if (this.anim) {
            this.anim.play(isReverse ? 'MeleeAttackIdleReverse' : 'MeleeAttackIdle')
        }
    }
    //Anim
    MeleeAttackFinish() {
        this.isAttacking = false
    }
    //Anim
    ComboStart() {}
    ComboFinish() {}
    //Anim
    ComboTime() {}
    //Anim
    ExAttackTime() {
        this.player.exTrigger(TriggerData.GROUP_ATTACK, this.comboType, null, null)
    }
    //Anim
    AudioTime() {
        if (this.meleeWeapon) {
            this.meleeWeapon.AudioTime()
        }
    }
    /**Anim 清空攻击列表*/
    RefreshTime() {
        this.hasTargetMap.clear()
    }
    /**Anim 冲刺*/
    DashTime(speed?: number) {
        AudioPlayer.play(AudioPlayer.DASH)
    }
    //Anim
    EffectTime() {}

    updateHv(hv: cc.Vec2) {
        this.hv = hv
        this.rotateCollider(this.hv)
    }

    private rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return
        }
        //设置缩放方向
        let sx = Math.abs(this.node.scaleX)
        let sy = Math.abs(this.node.scaleY)
        this.node.scaleX = this.player.node.scaleX > 0 ? sx : -sx
        this.node.scaleY = this.node.scaleX < 0 ? -sy : sy
        //设置旋转角度
        this.node.angle = Utils.getRotateAngle(direction, this.node.scaleX < 0)
    }

    onColliderStay(other: CCollider, self: CCollider) {
        if (self.w > 0 && self.h > 0) {
            if (this.hasTargetMap.has(other.id) && this.hasTargetMap.get(other.id) > 0) {
                this.hasTargetMap.set(other.id, this.hasTargetMap.get(other.id) + 1)
                return false
            } else {
                this.hasTargetMap.set(other.id, 1)
                if (this.meleeWeapon) {
                    return this.meleeWeapon.attacking(other, self, this.anim, true)
                }
                return false
            }
        }
    }
}
