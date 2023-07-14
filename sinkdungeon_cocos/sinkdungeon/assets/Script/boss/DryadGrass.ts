import DamageData from '../data/DamageData'
import Actor from '../base/Actor'
import StatusManager from '../manager/StatusManager'
import FromData from '../data/FromData'
import StatusData from '../data/StatusData'
import ActorUtils from '../utils/ActorUtils'
import CCollider from '../collider/CCollider'
import Building from '../building/Building'

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
export default class DryadGrass extends Building {
    // LIFE-CYCLE CALLBACKS:

    isUp = false //是否已经上升
    anim: cc.Animation
    isAuto = true //是否自动上升
    isUping = false //是否上升中

    onLoad() {
        this.initCollider()
        this.isUp = false
    }
    takeDamage() {
        return false
    }
    fall() {
        this.anim = this.getComponent(cc.Animation)
        this.anim.play()
        this.isUping = true
    }
    //anim
    TwineUp() {
        this.isUp = true
        this.scheduleOnce(() => {
            this.isUp = false
        }, 0.1)
        this.scheduleOnce(() => {
            if (this.node) {
                this.destroyEntityNode()
            }
        }, 6)
    }
    start() {}
    onColliderEnter(other: CCollider, self: CCollider) {
        let target = ActorUtils.getEnemyCollisionTarget(other)
        if (target && !this.isAuto && !this.isUping) {
            this.fall()
        }
    }
    onColliderStay(other: CCollider, self: CCollider) {
        let target = ActorUtils.getEnemyCollisionTarget(other)
        if (target) {
            if (this.isUp && this.isValid) {
                this.isUp = false
                let from = FromData.getClone(this.actorName(), 'dryadtwine03', this.node.position)
                if (target.takeDamage(new DamageData(2), from)) {
                    target.addStatus(StatusManager.TWINE, from)
                }
            }
        }
    }

    actorName() {
        return '树根缠绕'
    }
}
