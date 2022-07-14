import DamageData from '../data/DamageData'
import FromData from '../data/FromData'
import Captain from './Captain'
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
export default class CaptainSword extends BaseColliderComponent {
    @property
    damage = 3
    @property(cc.Node)
    parentNode: cc.Node = null
    // LIFE-CYCLE CALLBACKS:
    isShow = false

    onLoad() {
        super.onLoad()
        if (this.entity && this.entity.Move) {
            this.entity.Move.moveable = false
        }
    }

    start() {
        this.isShow = false
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        let target = ActorUtils.getEnemyCollisionTarget(other)
        if (target && this.isShow && this.node.active) {
            this.isShow = false
            let dd = new DamageData()
            dd.physicalDamage = this.damage
            target.takeDamage(dd, FromData.getClone(this.actorName(), 'captain_head'), this.parentNode.getComponent(Captain))
        }
    }
    actorName() {
        return '邪恶船长'
    }
    // update (dt) {}
}
