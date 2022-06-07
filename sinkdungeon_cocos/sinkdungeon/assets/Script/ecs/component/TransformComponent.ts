import { ecs } from '../ECS'

@ecs.register('Transform')
export class TransformComponent extends ecs.IComponent {
    position: cc.Vec3 = cc.Vec3.ZERO
    z = 0
    base = 0
    flyZ = 0
    reset(): void {
        this.position = cc.Vec3.ZERO
        this.z = 0
    }
}
