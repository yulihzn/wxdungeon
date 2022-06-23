import { EventHelper } from '../logic/EventHelper'
import Talent from './Talent'
import DashShadow from '../item/DashShadow'
import DamageData from '../data/DamageData'
import StatusManager from '../manager/StatusManager'
import AudioPlayer from '../utils/AudioPlayer'
import FromData from '../data/FromData'
import PlayerAvatar from '../logic/PlayerAvatar'
import Actor from '../base/Actor'
import ActorUtils from '../utils/ActorUtils'
import TalentData from '../data/TalentData'
import CCollider from '../collider/CCollider'

const { ccclass, property } = cc._decorator

@ccclass
export default class TalentDash extends Talent {
    @property(DashShadow)
    dashShadow: DashShadow = null

    hv: cc.Vec2

    onLoad() {}
    init(data: TalentData) {
        super.init(data)
        this.dashShadow.node.active = false
        this.node.parent = this.player.node.parent
        this.dashShadow.init(this)
    }
    protected skillCanUse() {
        return true
    }
    useSKill() {
        this.doSkill()
    }
    protected doSkill() {
        if (!this.talentSkill) {
            return
        }
        if (this.talentSkill.IsExcuting) {
            return
        }
        let cooldown = 3
        if (this.hashTalent(Talent.DASH_13)) {
            cooldown = 2
        }
        let speed = 24
        if (this.hashTalent(Talent.DASH_14)) {
            speed = 48
        }
        this.talentSkill.next(
            () => {
                this.talentSkill.IsExcuting = true
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.DASH } })
                this.schedule(
                    () => {
                        this.player.getWalkSmoke(this.node.parent, this.node.position)
                    },
                    0.05,
                    4,
                    0
                )
                let pos = this.player.entity.Move.linearVelocity.clone()
                this.player.sc.isMoving = false
                if (pos.equals(cc.Vec2.ZERO)) {
                    pos = this.player.isFaceRight ? cc.v2(1, 0) : cc.v2(-1, 0)
                } else {
                    pos = pos.normalizeSelf()
                }
                let posv2 = cc.v2(pos.x, pos.y)
                if (this.hashTalent(Talent.DASH_08)) {
                    speed = 2
                    this.showShadow(posv2)
                }
                this.hv = posv2.clone()
                pos = pos.mul(speed)
                this.player.entity.Move.linearVelocity = pos
                this.scheduleOnce(() => {
                    this.player.entity.Move.linearVelocity = cc.Vec2.ZERO
                    this.player.playerAnim(PlayerAvatar.STATE_IDLE, this.player.currentDir)
                    this.IsExcuting = false
                }, 0.5)
                // cc.director.emit(EventHelper.HUD_CONTROLLER_COOLDOWN, { detail: { cooldown: cooldown, talentType: 1,currentCooldown:0 } });
            },
            cooldown,
            true
        )
    }

    showShadow(pos: cc.Vec2) {
        if (this.dashShadow) {
            this.dashShadow.setHv(pos.clone())
            this.dashShadow.show()
        }
    }
    changePerformance() {}
    onColliderEnter(other: CCollider, self: CCollider) {
        if (this.hashTalent(Talent.DASH_02) && !this.hashTalent(Talent.DASH_08)) {
            this.attacking(other, this.node)
        }
    }
    attacking(attackTarget: CCollider, currentNode: cc.Node) {
        if (!attackTarget || !currentNode.active) {
            return
        }
        let damage = new DamageData(1)
        if (this.hashTalent(Talent.DASH_07)) {
            damage.realDamage = 5
        }

        let damageSuccess = false
        let target = ActorUtils.getEnemyActorByNode(attackTarget.node, true)
        if (target && !target.sc.isDied) {
            damageSuccess = target.takeDamage(damage)
            if (damageSuccess) {
                this.beatBack(target)
                this.addTargetAllStatus(target)
            }
        }
    }
    beatBack(node: Actor) {
        if (!this.hashTalent(Talent.DASH_04)) {
            return
        }
        let pos = this.hv.clone()
        let power = 20
        pos = pos.normalizeSelf().mul(power)
        node.entity.Move.linearVelocity = cc.v2(pos.x, pos.y)
    }

    addTargetAllStatus(actor: Actor) {
        this.addTargetStatus(Talent.DASH_05, actor, StatusManager.FROZEN)
        this.addTargetStatus(Talent.DASH_06, actor, StatusManager.DIZZ)
        this.addTargetStatus(Talent.DASH_03, actor, StatusManager.BLEEDING)
    }

    addTargetStatus(talentType: string, actor: Actor, statusType) {
        if (this.hashTalent(talentType)) {
            actor.addStatus(statusType, new FromData())
        }
    }

    takeDamage() {
        return false
    }
}
