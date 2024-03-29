import Actor from '../base/Actor'
import DamageData from '../data/DamageData'
import FromData from '../data/FromData'
import BuildingData from '../data/BuildingData'
import StatusData from '../data/StatusData'
import Random from '../utils/Random'

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
 * 建筑规格设定
 * 建筑由默认128x128的一个或者多个格子组成，统一按第一格的中心点(64,64)为原点的自然坐标系摆放
 * 例如墙是16x32
 * 建筑的贴图由实际图片换算为128x128规格来设置，碰撞大小保持和贴图一致
 */
@ccclass
export default abstract class Building extends Actor {
    data: BuildingData = new BuildingData()
    takeDamage(damage: DamageData, from?: FromData, actor?: Actor): boolean {
        return false
    }
    addStatus(statusType: string, from: FromData) {}
    getCenterPosition(): cc.Vec3 {
        return this.entity.Transform.position.clone()
    }
    actorName() {
        return ''
    }
    updateData(): void {}
    takeDizz(dizzDuration: number): void {}

    updateStatus(statusList: StatusData[], totalStatusData: StatusData): void {}
    hideSelf(hideDuration: number): void {}
    updateDream(offset: number): number {
        return 0
    }
    setLinearVelocity(movement: cc.Vec2) {}
    updateLife(sanity: number, solid: number, liquid: number): void {}
    disappear() {
        cc.tween(this.node)
            .to(0.5 + Random.rand(), { scaleY: 0 })
            .start()
    }
    // onColliderEnter(other: CCollider, self: CCollider): void {
    // }
    // onColliderStay(other: CCollider, self: CCollider): void {
    // }
    // onColliderExit(other: CCollider, self: CCollider): void {
    // }
    // onColliderPreSolve(other: CCollider, self: CCollider): void {
    // }
}
