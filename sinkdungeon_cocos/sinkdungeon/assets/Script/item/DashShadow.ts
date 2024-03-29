import Logic from '../logic/Logic'
import Dungeon from '../logic/Dungeon'
import TalentData from '../data/TalentData'
import Talent from '../talent/Talent'
import TalentDash from '../talent/TalentDash'
import Shooter from '../logic/Shooter'
import IndexZ from '../utils/IndexZ'
import CCollider from '../collider/CCollider'
import BaseColliderComponent from '../base/BaseColliderComponent'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class DashShadow extends BaseColliderComponent {
    hv: cc.Vec2 = cc.v2(1, 0)
    private motionStreak: cc.MotionStreak
    private sprite: cc.Node
    talentDash: TalentDash
    @property(Shooter)
    shooter: Shooter = null
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad()
        this.motionStreak = this.getComponent(cc.MotionStreak)
        this.sprite = this.node.getChildByName('sprite')
    }
    init(talentDash: TalentDash) {
        this.talentDash = talentDash
        this.shooter.actor = this.talentDash.player
        this.shooter.dungeon = this.talentDash.player.node.parent.getComponent(Dungeon)
    }

    changeDashPerformance(talentList: TalentData[]) {
        this.motionStreak.color = cc.Color.BLACK
        for (let t of talentList) {
        }
    }

    onEnable() {}

    start() {}

    getPlayerPosition(): cc.Vec3 {
        return this.talentDash.player.node.position.clone().addSelf(cc.v3(8, 8))
    }
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistanceNoSqrt(this.node.position, this.getPlayerPosition())
        return dis
    }
    show() {
        this.node.active = true
        this.node.parent = this.talentDash.player.node.parent
        let faceright = this.talentDash.player.isFaceRight
        this.sprite.scaleX = faceright ? 1 : -1
        this.node.setPosition(this.getPlayerPosition())
        let speed = 24
        if (this.talentDash.hashTalent(Talent.DASH_14)) {
            speed = 40
        }
        let hs = this.hv.mul(speed)
        this.entity.Move.linearVelocity = cc.v2(hs.x, hs.y)
        this.node.zIndex = IndexZ.OVERHEAD
        this.fire(this.shooter)
        this.scheduleOnce(() => {
            this.hide()
        }, 0.45)
    }
    hide() {
        this.talentDash.player.node.setPosition(Dungeon.fixOuterMap(this.node.position.clone()))
        this.node.active = false
        this.entity.Move.linearVelocity = cc.Vec2.ZERO
    }

    onColliderEnter(other: CCollider, self: CCollider) {
        if (this.talentDash && this.talentDash.hashTalent(Talent.DASH_02)) {
            this.talentDash.attacking(other, this.node)
        }
    }
    fire(shooter: Shooter) {
        shooter.data.bulletLineExNum = 5
        shooter.data.bulletLineInterval = 0.05
        if (this.talentDash.hashTalent(Talent.DASH_11)) {
            shooter.data.bulletLineExNum = 10
            shooter.data.bulletLineInterval = 0.03
        }
        let isOpenFire = false
        if (this.talentDash.hashTalent(Talent.DASH_09)) {
            isOpenFire = true
            shooter.data.bulletType = 'bullet025'
        } else if (this.talentDash.hashTalent(Talent.DASH_10)) {
            isOpenFire = true
            shooter.data.bulletType = 'bullet026'
        }
        if (isOpenFire) {
            shooter.fireBullet(0, cc.v3(0, 0))
        }
    }
    setHv(hv: cc.Vec2) {
        if (hv.equals(cc.Vec2.ZERO)) {
            this.hv = cc.v2(1, 0)
        } else {
            this.hv = hv
        }
    }
}
