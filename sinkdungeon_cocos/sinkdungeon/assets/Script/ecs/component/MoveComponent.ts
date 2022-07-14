import { ecs } from '../ECS'

@ecs.register('Move')
export class MoveComponent extends ecs.IComponent {
    static readonly PIXELS_PER_UNIT = 50
    static readonly DEFAULT_GRAVITY = MoveComponent.PIXELS_PER_UNIT
    static readonly MIN_LINEAR_VELOCITY_Z = -10 * MoveComponent.PIXELS_PER_UNIT * MoveComponent.DEFAULT_GRAVITY
    linearVelocity: cc.Vec2 = cc.Vec2.ZERO
    damping = 0 //阻力
    acceleration = 0 //加速度
    gravity = MoveComponent.DEFAULT_GRAVITY //重力加速度
    linearVelocityZ = 0
    moveable = true //是否可以移动，主要针对不可以移动的物体，和附属碰撞
    reset(): void {
        this.linearVelocity = cc.Vec2.ZERO
        this.damping = 0
        this.linearVelocityZ = 0
    }
}
