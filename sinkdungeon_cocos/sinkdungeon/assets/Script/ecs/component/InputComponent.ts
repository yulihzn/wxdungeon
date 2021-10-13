import { ecs } from "../ECS";

@ecs.register('Input')
export class InputComponent extends ecs.IComponent {
    reset(): void {
    }
    
}

