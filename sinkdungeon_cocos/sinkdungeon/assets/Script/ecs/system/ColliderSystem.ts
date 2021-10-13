import { MoveComponent } from "../component/MoveComponent";
import { TransformComponent } from "../component/TransformComponent";
import { ecs } from "../ECS";

export default class  ColliderSystem extends ecs.ComblockSystem{
    

    filter(): ecs.IMatcher {
        return ecs.allOf(MoveComponent, TransformComponent);
    }
    
    update(entities: ecs.Entity[]): void {
        for(let e of entities){
            
        }
    }
}