import { ColliderComponent } from './../ecs/component/ColliderComponent';
import CCollider from "../collider/CCollider";
import DamageData from "../data/DamageData";
import FromData from "../data/FromData";
import StatusData from "../data/StatusData";
import { MoveComponent } from "../ecs/component/MoveComponent";
import { NodeRenderComponent } from "../ecs/component/NodeRenderComponent";
import { TransformComponent } from "../ecs/component/TransformComponent";
import { ecs } from "../ecs/ECS";
import ActorEntity from "../ecs/entity/ActorEntity";
import ShadowOfSight from "../effect/ShadowOfSight";
import StateContext from "./StateContext";
import OnContactListener from '../collider/OnContactListener';
import BaseColliderComponent from './BaseColliderComponent';

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// 地图里的所有建筑生物道具都是由Actor组成的
const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Actor extends cc.Component implements OnContactListener {
    

    static readonly TARGET_PLAYER = 0;
    static readonly TARGET_MONSTER = 1;
    static readonly TARGET_BOSS = 2;
    static readonly TARGET_NONPLAYER = 3;
    static readonly TARGET_NONPLAYER_ENEMY = 4;
    abstract takeDamage(damage: DamageData, from?: FromData, actor?: Actor): boolean;
    abstract actorName(): string;
    abstract addStatus(statusType: string, from: FromData): void;
    abstract getCenterPosition(): cc.Vec3;
    abstract takeDizz(dizzDuration: number): void;
    abstract updateStatus(statusList: StatusData[], totalStatusData: StatusData): void;
    abstract hideSelf(hideDuration: number): void;
    abstract updateDream(offset: number): number;
    abstract updateLife(sanity:number,solid:number,liquid:number): void;
    invisible = false;//是否隐身
    isFaceRight = true;
    isFaceUp = true;
    lights: ShadowOfSight[] = [];//光源
    ccolliders: CCollider[];
    sc: StateContext = new StateContext();
    seed: number = 0;//随机种子，为所在房间分配的随机数生成的种子，决定再次生成该Actor的随机元素一致
    entity = ecs.createEntityWithComps<ActorEntity>(NodeRenderComponent, MoveComponent, TransformComponent, ColliderComponent);

    /**初始化碰撞 */
    public initCollider() {
        this.ccolliders = [];
        let childColliders = this.getComponentsInChildren(CCollider);
        for (let c of childColliders){
            //BaseColliderComponent碰撞由BaseColliderComponent自身处理，光源只需要形状
            if(c.tag != CCollider.TAG.LIGHT&&!c.getComponent(BaseColliderComponent)){
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
    public registerListener(actor:Actor){
        for (let ccolider of this.ccolliders) {
            ccolider.setOnContactListener(actor);
        }
    }
    /**设置碰撞目标tag */
    public setTargetTags(...tags: number[]) {
        for (let ccolider of this.ccolliders) {
            ccolider.setTargetTags(tags);
        }
    }
    /**设置碰撞忽略tag */
    public setIgnoreTags(...tags: number[]) {
        for (let ccolider of this.ccolliders) {
            ccolider.setIgnoreTags(tags);
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
