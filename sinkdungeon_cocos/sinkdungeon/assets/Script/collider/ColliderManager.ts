import BaseManager from "../manager/BaseManager";
import CCollider from "./CCollider";
import Quadtree from "./Quadtree";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ColliderManager extends BaseManager {
    //参与碰撞检测的分组
    private static list: CCollider[] = [];
    //不参与碰撞检测的分组
    private static otherList: CCollider[] = [];
    private quadTree: Quadtree;
    private isInit = false;

    clear(): void {
        ColliderManager.list = [];
    }
    init(width: number, height: number) {
        let bounds = {
            x: 0,
            y: 0,
            width: width,
            height: height
        }
        this.quadTree = new Quadtree(bounds);
        this.isInit = true;
    }
    onLoad() {

    }

    public static registerCollider(colliders: CCollider[]) {
        for (let collider of colliders) {
            ColliderManager.list.push(collider);
        }
    }
    public static unRegisterCollider(collider: CCollider) {
        let index = ColliderManager.list.indexOf(collider);
        if (-1 != index) {
            ColliderManager.list.splice(index, 1);
        }
    }
    collisionCheck() {
        for (let collider of ColliderManager.list) {
            this.quadTree.insert(collider);
        }
        for (let collider of ColliderManager.list) {
            let colliders = this.quadTree.retrieve(collider);
            for (let other of colliders) {
                if (other === collider) {
                    continue;
                }
                let isCollision = false;
                if (collider.type == CCollider.TYPE.RECT && other.type == CCollider.TYPE.RECT) {
                    //矩形检测
                    isCollision = collider.Aabb.intersects(other.Aabb);
                } else if (collider.type == CCollider.TYPE.CIRCLE && other.type == CCollider.TYPE.CIRCLE) {
                    //圆形检测
                    isCollision = this.circleHit(collider.pos, other.pos, collider.radius, other.radius);
                } else if (collider.type == CCollider.TYPE.RECT && other.type == CCollider.TYPE.CIRCLE) {
                    //矩形圆形检测
                } else if (collider.type == CCollider.TYPE.CIRCLE && other.type == CCollider.TYPE.RECT) {
                    //圆形矩形检测
                }
                if (isCollision) {
                    collider.contact(other);
                    other.contact(collider);
                } else {
                    collider.exit(other);
                    other.exit(collider);
                }
            }
        }
        this.quadTree.clear();
    }

    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.05) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt: number) {
        if (this.isInit && this.isCheckTimeDelay(dt)) {
            this.collisionCheck();
        }
    }

    private circleHit(v1: cc.Vec3, v2: cc.Vec3, r1: number, r2: number) {
        if (r1 <= 0 || r2 <= 0) {
            return false;
        }
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;
        return x * x + y * y <= r1 * r2;
    }
}
