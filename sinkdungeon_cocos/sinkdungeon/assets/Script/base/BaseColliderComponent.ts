import { ColliderComponent } from '../ecs/component/ColliderComponent';
import CCollider from "../collider/CCollider";
import { MoveComponent } from "../ecs/component/MoveComponent";
import { NodeRenderComponent } from "../ecs/component/NodeRenderComponent";
import { TransformComponent } from "../ecs/component/TransformComponent";
import { ecs } from "../ecs/ECS";
import ActorEntity from "../ecs/entity/ActorEntity";
import OnContactListener from '../collider/OnContactListener';

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// 针对不是Actor但是需要碰撞的组件
const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class BaseColliderComponent extends cc.Component implements OnContactListener {
    

    ccolliders: CCollider[];
    entity = ecs.createEntityWithComps<ActorEntity>(NodeRenderComponent, MoveComponent, TransformComponent, ColliderComponent);

    onLoad(){
        this.initCollider();
    }
    /**初始化碰撞 */
    public initCollider() {
        this.ccolliders = [];
        let childColliders = this.getComponentsInChildren(CCollider);
        for (let c of childColliders){
            if(c.tag != CCollider.TAG.LIGHT){
                this.ccolliders.push(c);
            }
        }
        if (this.ccolliders && this.ccolliders.length > 0) {
            this.entity.Collider.colliders = this.ccolliders;
            let groupId = CCollider.genNonDuplicateID();
            for (let ccolider of this.ccolliders) {
                ccolider.groupId = groupId;
                ccolider.setOnContactListener(this);
            }
        } else {
            this.entity.remove(ColliderComponent);
        }

    }
    /**设置碰撞目标tag */
    public setTargetTags(...tags: number[]) {
        for (let ccolider of this.ccolliders) {
            for (let tag of tags) {
                ccolider.addTargetTags(tag);
            }
        }
    }
    /**设置碰撞忽略tag */
    public setIgnoreTags(...tags: number[]) {
        for (let ccolider of this.ccolliders) {
            for (let tag of tags) {
                ccolider.addIgnoreTags(tag);
            }
        }
    }
    destroyEntityNode(){
        this.entity.destroy();
        this.node.destroy();
    }
    
    onColliderEnter(other: CCollider, self: CCollider): void {
    }
    onColliderStay(other: CCollider, self: CCollider): void {
    }
    onColliderExit(other: CCollider, self: CCollider): void {
    }
    onColliderPreSolve(other: CCollider, self: CCollider): void {
    }

}
