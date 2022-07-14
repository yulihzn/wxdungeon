import Logic from '../logic/Logic'
import Building from './Building'
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
export default class MushroomChild extends BaseColliderComponent {
    isRotate = false
    isPlus = false
    onLoad(): void {
        super.onLoad()
        if (this.entity && this.entity.Move) {
            this.entity.Move.isStatic = true
        }
    }

    onColliderEnter(other: CCollider, self: CCollider) {
        if (other.tag == CCollider.TAG.PLAYER) {
            this.isRotate = true
            let ppos = other.node.convertToWorldSpaceAR(cc.Vec3.ZERO)
            let mpos = this.node.convertToWorldSpaceAR(cc.Vec3.ZERO)
            this.isPlus = ppos.x > mpos.x
        }
    }
    onColliderExit(other: CCollider, self: CCollider) {
        if (other.tag == CCollider.TAG.PLAYER) {
            this.isRotate = false
        }
    }
    update(dt) {
        if (this.isRotate) {
            this.node.angle = Logic.lerp(this.node.angle, this.isPlus ? 15 : -15, dt * 5)
        } else {
            this.node.angle = Logic.lerp(this.node.angle, 0, dt * 5)
        }
    }
}
