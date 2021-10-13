import { ecs } from "../ECS";

@ecs.register('NodeRender')
export class NodeRenderComponent extends ecs.IComponent {
    node:cc.Node;
    reset(): void {
        this.node = null;
    }
    
}

