import CCollider from "../../collider/CCollider";
import { ecs } from "../ECS";

@ecs.register('Collider')
export class ColliderComponent extends ecs.IComponent {
    colliders:CCollider[];
    reset(): void {
        this.colliders = [];
    }
    
}

