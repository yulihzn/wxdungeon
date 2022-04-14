import { ecs } from "../ECS";

@ecs.register('NodeRender')
export class NodeRenderComponent extends ecs.IComponent {
    node:cc.Node;
    root:cc.Node;
    reset(): void {
        this.node = null;
        this.root = null;
    }
    
}

