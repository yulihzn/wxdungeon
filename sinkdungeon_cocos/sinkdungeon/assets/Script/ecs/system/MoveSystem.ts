import { MoveComponent } from '../component/MoveComponent'
import { TransformComponent } from '../component/TransformComponent'
import { ecs } from '../ECS'
import ActorEntity from '../entity/ActorEntity'

export default class MoveSystem extends ecs.ComblockSystem<ActorEntity> {
    filter(): ecs.IMatcher {
        return ecs.allOf(MoveComponent, TransformComponent)
    }

    update(entities: ActorEntity[]): void {
        for (let e of entities) {
            let move = e.Move
            let transform = e.Transform
            if (move.linearDamping < 0) {
                move.linearDamping = 0
            }
            let temp = move.linearVelocity.mul(this.dt)
            transform.position.x += temp.x
            transform.position.y += temp.y
            transform.z += move.linearVelocityZ * this.dt * move.ratioZ
            if (transform.z < transform.base) {
                transform.z = transform.base
            }
            if (transform.flyZ > 0 && move.linearVelocityZ < 0 && transform.z < transform.base + transform.flyZ) {
                transform.z -= move.linearVelocityZ * this.dt * move.ratioZ * 2
            }
            if (move.linearVelocity.x > 0) {
                move.linearVelocity.x -= move.linearDamping
                if (move.linearVelocity.x < 0) {
                    move.linearVelocity.x = 0
                }
            } else if (move.linearVelocity.x < 0) {
                move.linearVelocity.x += move.linearDamping
                if (move.linearVelocity.x > 0) {
                    move.linearVelocity.x = 0
                }
            }
            if (move.linearVelocity.y > 0) {
                move.linearVelocity.y -= move.linearDamping
                if (move.linearVelocity.y < 0) {
                    move.linearVelocity.y = 0
                }
            } else if (move.linearVelocity.y < 0) {
                move.linearVelocity.y += move.linearDamping
                if (move.linearVelocity.y > 0) {
                    move.linearVelocity.y = 0
                }
            }
            if (move.linearVelocityZ > MoveComponent.MIN_LINEAR_VELOCITY_Z) {
                move.linearVelocityZ -= move.linearDampingZ
            }
            if (e.NodeRender.node) {
                e.NodeRender.node.setPosition(transform.position)
            }
            if (e.NodeRender.root) {
                e.NodeRender.root.setPosition(cc.v3(0, transform.z))
            }
        }
    }
    private lerpPos(self: cc.Vec2, to: cc.Vec2, ratio: number): cc.Vec2 {
        let out = cc.v2(0, 0)
        let x = self.x
        let y = self.y
        out.x = x + (to.x - x) * ratio
        out.y = y + (to.y - y) * ratio
        return out
    }

    private lerp(a: number, b: number, r: number): number {
        return a + (b - a) * r
    }
}
