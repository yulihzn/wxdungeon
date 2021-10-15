import CCollider from "../../collider/CCollider";
import { ecs } from "../ECS";

@ecs.register('Collider')
export class ColliderComponent extends ecs.IComponent {
    ignoreTagMap: Map<number, boolean> = new Map();
    targetTagMap: Map<number, boolean> = new Map();
    colliders:CCollider[] = [];
    reset(): void {
        this.colliders = [];
        this.ignoreTagMap = new Map();
    }
    
}

