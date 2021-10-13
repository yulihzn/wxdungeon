import { ecs } from "../ECS";

@ecs.register('Move')
export class MoveComponent extends ecs.IComponent {
    linearVelocity: cc.Vec2 = cc.Vec2.ZERO;
    linearDamping = 0;
    reset(): void {
        this.linearVelocity = cc.Vec2.ZERO;
        this.linearDamping = 0;
    }
    
}

