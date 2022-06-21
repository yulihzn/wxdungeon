import { ecs } from '../ECS'

@ecs.register('Move')
export class MoveComponent extends ecs.IComponent {
    static readonly DEFAULT_GRAVITY = 50
    static readonly PIXELS_PER_UNIT = 50
    static readonly MIN_LINEAR_VELOCITY_Z = -10 * MoveComponent.PIXELS_PER_UNIT * MoveComponent.DEFAULT_GRAVITY
    linearVelocity: cc.Vec2 = cc.Vec2.ZERO
    damping = 0 //阻力
    acceleration = 0 //加速度
    gravity = MoveComponent.DEFAULT_GRAVITY //重力加速度
    linearVelocityZ = MoveComponent.MIN_LINEAR_VELOCITY_Z
    reset(): void {
        this.linearVelocity = cc.Vec2.ZERO
        this.damping = 0
        this.linearVelocityZ = MoveComponent.MIN_LINEAR_VELOCITY_Z
    }
}
