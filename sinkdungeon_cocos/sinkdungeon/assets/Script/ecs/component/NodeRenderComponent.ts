import { ecs } from "../ECS";

@ecs.register('NodeRenderComponent')
export class NodeRenderComponent extends ecs.IComponent {
    node:Node;
    reset(): void {
        this.node = null;
    }
    
}

