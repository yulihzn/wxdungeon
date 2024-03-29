import { NodeRenderComponent } from '../component/NodeRenderComponent'
import { TransformComponent } from '../component/TransformComponent'
import { MoveComponent } from '../component/MoveComponent'
import { ecs } from '../ECS'

export default class NodeEntity extends ecs.Entity {
    Move: MoveComponent
    Transform: TransformComponent
    NodeRender: NodeRenderComponent
}
