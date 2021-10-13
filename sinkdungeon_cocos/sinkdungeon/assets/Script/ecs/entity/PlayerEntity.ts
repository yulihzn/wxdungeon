import { TransformComponent } from './../component/TransformComponent';
import { MoveComponent } from './../component/MoveComponent';
import { ecs } from "../ECS"

export default class PlayerEntity extends ecs.Entity {
    moveComponent:MoveComponent;
    transformComponent:TransformComponent;
}