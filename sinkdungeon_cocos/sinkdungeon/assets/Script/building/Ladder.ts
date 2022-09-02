// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Actor from '../base/Actor'
import CCollider from '../collider/CCollider'
import { MoveComponent } from '../ecs/component/MoveComponent'
import Dungeon from '../logic/Dungeon'
import Building from './Building'

const { ccclass, property } = cc._decorator
/**
 * 玩家和npc在进入梯子的范围时，向上的方向会被抹除并改为向z的速度
 */
@ccclass
export default class Ladder extends Building {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    collider: CCollider
    // LIFE-CYCLE CALLBACKS:
    protected onLoad(): void {
        this.collider = this.getComponent(CCollider)
    }

    init(mapStr: string) {
        let z = ((parseInt(mapStr[1]) + 1) * Dungeon.TILE_SIZE) / 2
        for (let collider of this.ccolliders) {
            collider.zHeight = z
        }
        this.sprite.node.height = z / 4
    }

    // update (dt) {}
    onColliderExit(other: CCollider, self: CCollider) {
        if (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.NONPLAYER || other.tag == CCollider.TAG.GOODNONPLAYER) {
            other.entity.Move.gravity = MoveComponent.DEFAULT_GRAVITY
            // other.entity.Transform.fixBase = 0
        }
    }
    onColliderStay(other: CCollider, self: CCollider) {
        if (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.NONPLAYER || other.tag == CCollider.TAG.GOODNONPLAYER) {
            let y = other.entity.Move.linearVelocity.y
            other.entity.Move.gravity = MoveComponent.DEFAULT_GRAVITY / 8
            if (y > 0) {
                // other.entity.Transform.fixBase = other.entity.Transform.z - 1
                other.entity.Move.linearVelocity.y = 0
                if (other.entity.Move.linearVelocityZ < 3) {
                    other.entity.Move.linearVelocityZ = 3
                }
            } else {
                // other.entity.Transform.fixBase = 0
            }
        }
    }
}
