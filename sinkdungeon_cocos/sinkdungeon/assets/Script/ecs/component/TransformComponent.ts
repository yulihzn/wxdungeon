import { ecs } from "../ECS";

@ecs.register('TransformComponent')
export class TransformComponent extends ecs.IComponent {
    position: cc.Vec3 = cc.Vec3.ZERO;
    reset(): void {
        this.position = cc.Vec3.ZERO;
    }
    
}

