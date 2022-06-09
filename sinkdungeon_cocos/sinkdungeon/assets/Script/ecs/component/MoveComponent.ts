import { ecs } from '../ECS'

@ecs.register('Move')
export class MoveComponent extends ecs.IComponent {
    static readonly MIN_LINEAR_VELOCITY_Z = -1000
    static readonly MIN_LINEAR_DAMPING_Z = 100
    linearVelocity: cc.Vec2 = cc.Vec2.ZERO
    linearDamping = 0
    linearVelocityZ = MoveComponent.MIN_LINEAR_VELOCITY_Z
    linearDampingZ = MoveComponent.MIN_LINEAR_DAMPING_Z
    reset(): void {
        this.linearVelocity = cc.Vec2.ZERO
        this.linearDamping = 0
        this.linearVelocityZ = MoveComponent.MIN_LINEAR_VELOCITY_Z
        this.linearDampingZ = MoveComponent.MIN_LINEAR_DAMPING_Z
    }
}
