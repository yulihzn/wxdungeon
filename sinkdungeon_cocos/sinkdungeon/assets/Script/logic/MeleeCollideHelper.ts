import Utils from '../utils/Utils'
import CCollider from '../collider/CCollider'
import BaseColliderComponent from '../base/BaseColliderComponent'
import MeleeWeapon from './MeleeWeapon'

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
export default class MeleeCollideHelper extends BaseColliderComponent {
    @property(MeleeWeapon)
    meleeWeapon: MeleeWeapon = null
    protected hv: cc.Vec2 = cc.v2(1, 0)
    protected collider: CCollider
    onLoad() {
        super.onLoad()
        this.collider = this.entity.Collider.colliders[0]
        if (this.entity && this.entity.Move) {
            this.entity.Move.moveable = false
        }
    }

    set Hv(hv: cc.Vec2) {
        this.hv = hv.normalize()
    }
    get Hv(): cc.Vec2 {
        return this.hv
    }

    public updateLogic(weaponPos: cc.Vec3) {
        if (!this.collider) {
            return
        }
        let hv = this.meleeWeapon.Hv
        let collider = this.meleeWeapon.ccolliders[0]
        this.hv = hv.clone()
        this.collider.offset = collider.offset
        this.collider.w = collider.w
        this.collider.h = collider.h
        this.collider.zHeight = collider.zHeight
        this.entity.Transform.z = this.meleeWeapon.player.entity.Transform.z
        this.rotateCollider(this.hv)
        this.node.position = weaponPos
    }

    protected rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return
        }
        this.node.angle = Utils.getRotateAngle(direction, false)
    }

    onColliderStay(other: CCollider, self: CCollider) {
        if (this.meleeWeapon) {
            this.meleeWeapon.onColliderStay(other, self)
        }
    }
}
