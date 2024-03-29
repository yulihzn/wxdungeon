import DamageData from '../data/DamageData'
import FromData from '../data/FromData'
import Kraken from './Kraken'
import ActorUtils from '../utils/ActorUtils'
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
export default class KrakenSwingHand extends BaseColliderComponent {
    @property
    damage = 8
    // LIFE-CYCLE CALLBACKS:
    isShow = false
    anim: cc.Animation
    onLoad() {
        super.onLoad()
        this.anim = this.node.parent.getComponent(cc.Animation)
        if (this.entity && this.entity.Move) {
            this.entity.Move.isStatic = true
        }
    }
    swing() {
        this.anim.play()
    }

    start() {
        this.isShow = false
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        let target = ActorUtils.getEnemyCollisionTarget(other)
        if (target && this.isShow && this.node.active) {
            this.node.stopAllActions()
            let dd = new DamageData()
            dd.physicalDamage = this.damage
            target.takeDamage(dd, FromData.getClone(this.actorName(), 'boss001', this.node.position), this.node.parent.getComponent(Kraken))
        }
    }
    actorName() {
        return '海妖'
    }
    // update (dt) {}
}
