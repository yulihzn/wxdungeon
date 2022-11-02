import { ColliderComponent } from '../ecs/component/ColliderComponent'
import CCollider from '../collider/CCollider'
import { MoveComponent } from '../ecs/component/MoveComponent'
import { NodeRenderComponent } from '../ecs/component/NodeRenderComponent'
import { TransformComponent } from '../ecs/component/TransformComponent'
import { ecs } from '../ecs/ECS'
import ActorEntity from '../ecs/entity/ActorEntity'
import OnContactListener from '../collider/OnContactListener'
import NodeEntity from '../ecs/entity/NodeEntity'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// 针对不需要碰撞但是需要z轴位移的组件
const { ccclass, property } = cc._decorator

@ccclass
export default abstract class BaseNodeComponent extends cc.Component {
    entity = ecs.createEntityWithComps<NodeEntity>(NodeRenderComponent, MoveComponent, TransformComponent)

    resetEntity() {
        this.entity = ecs.createEntityWithComps<NodeEntity>(NodeRenderComponent, MoveComponent, TransformComponent)
        this.entity.NodeRender.node = this.node
    }
    onLoad() {
        this.entity.NodeRender.node = this.node
    }
    destroyEntityNode() {
        this.entity.destroy()
        this.node.destroy()
    }
}
