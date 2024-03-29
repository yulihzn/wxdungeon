import BaseColliderComponent from '../base/BaseColliderComponent'
import CCollider from '../collider/CCollider'
import Player from '../logic/Player'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//交互作用的提示,依托于父组件不能独立放置
const { ccclass, property } = cc._decorator

@ccclass
export default class Tips extends BaseColliderComponent {
    private interactCallback: Function
    private enterCallback: Function
    private exitCallback: Function
    private isTriggering = false
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad()
        this.node.opacity = 0
        if (this.entity && this.entity.Move) {
            this.entity.Move.isStatic = true
        }
    }

    start() {}
    next(isLongPress: boolean, player: Player): void {
        if (this.node && this.node.active && this.interactCallback) {
            if (this.isTriggering) {
                return
            }
            this.isTriggering = true
            let anim = this.getComponent(cc.Animation)
            if (anim.hasAnimationState('TipsTrigger')) {
                anim.play('TipsTrigger')
            }
            //内置0.4s交互时间
            this.scheduleOnce(() => {
                this.isTriggering = false
            }, 0.4)
            this.interactCallback(isLongPress, player)
        }
    }
    onInteract(callback: Function) {
        this.interactCallback = callback
    }
    onEnter(callback: Function) {
        this.enterCallback = callback
    }
    onExit(callback: Function) {
        this.exitCallback = callback
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        if (other.tag == CCollider.TAG.PLAYER_INTERACT) {
            this.node.opacity = 255
            if (this.enterCallback) {
                this.enterCallback(other.node)
            }
        }
    }
    onColliderExit(other: CCollider, self: CCollider) {
        if (other.tag == CCollider.TAG.PLAYER_INTERACT) {
            this.node.opacity = 0
            if (this.exitCallback) {
                this.exitCallback(other.node)
            }
        }
    }
    // update (dt) {}
}
