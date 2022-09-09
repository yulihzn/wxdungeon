import { MoveComponent } from '../component/MoveComponent'
import { TransformComponent } from '../component/TransformComponent'
import { ecs } from '../ECS'
import ActorEntity from '../entity/ActorEntity'

export default class MoveSystem extends ecs.ComblockSystem<ActorEntity> {
    filter(): ecs.IMatcher {
        return ecs.allOf(MoveComponent, TransformComponent)
    }

    update(entities: ActorEntity[]): void {
        let dt = 0.016
        for (let e of entities) {
            let move = e.Move
            if (move.isStatic || (e.NodeRender.node && !e.NodeRender.node.active)) {
                continue
            }
            let transform = e.Transform
            if (move.damping < 0) {
                move.damping = 0
            }
            //xy
            let temp = move.linearVelocity.mul(dt * MoveComponent.PIXELS_PER_UNIT)
            let tp = cc.v3(transform.position.x + temp.x, transform.position.y + temp.y)
            transform.position = tp
            let damping = move.damping * dt
            if (move.linearVelocity.x > 0) {
                move.linearVelocity.x -= damping
                if (move.linearVelocity.x < 0) {
                    move.linearVelocity.x = 0
                }
            } else if (move.linearVelocity.x < 0) {
                move.linearVelocity.x += damping
                if (move.linearVelocity.x > 0) {
                    move.linearVelocity.x = 0
                }
            }
            if (move.linearVelocity.y > 0) {
                move.linearVelocity.y -= damping
                if (move.linearVelocity.y < 0) {
                    move.linearVelocity.y = 0
                }
            } else if (move.linearVelocity.y < 0) {
                move.linearVelocity.y += damping
                if (move.linearVelocity.y > 0) {
                    move.linearVelocity.y = 0
                }
            }
            let acceleration = move.acceleration * dt
            move.linearVelocity.x += acceleration
            move.linearVelocity.y += acceleration
            if (e.NodeRender.node) {
                e.NodeRender.node.setPosition(transform.position)
            }
            //z
            transform.z += move.linearVelocityZ * dt * MoveComponent.PIXELS_PER_UNIT
            let gravity = move.gravity * dt
            if (transform.z < transform.base) {
                transform.z = transform.base
                move.linearVelocityZ = 0
            } else if (transform.z > transform.base) {
                move.linearVelocityZ -= gravity
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
