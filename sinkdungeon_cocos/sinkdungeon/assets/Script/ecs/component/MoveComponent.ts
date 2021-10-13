import { ecs } from "../ECS";

@ecs.register('MoveComponent')
export class MoveComponent extends ecs.IComponent {
    direction: cc.Vec3 = cc.Vec3.ZERO;
    speed: number = 0;
    damping = 0;
    reset(): void {
        this.direction = cc.Vec3.ZERO;
        this.speed = 0;
        this.damping = 0;
    }
    
}

