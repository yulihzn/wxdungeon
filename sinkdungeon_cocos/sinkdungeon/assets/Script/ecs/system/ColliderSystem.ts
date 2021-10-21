import { ColliderComponent } from './../component/ColliderComponent';
import { ecs } from "../ECS";
import Quadtree from '../../collider/Quadtree';
import CCollider from '../../collider/CCollider';
import ActorEntity from '../entity/ActorEntity';

export default class ColliderSystem extends ecs.ComblockSystem<ActorEntity>{
    private quadTree: Quadtree;
    private tempColliders: { [key: string]: boolean } = {};
    private list: CCollider[] = [];
    private graphics: cc.Graphics;
    private isDebug = true;
    constructor(width: number, height: number, graphics: cc.Graphics) {
        super();
        let bounds = {
            x: 0,
            y: 0,
            width: width,
            height: height
        }
        this.quadTree = new Quadtree(bounds);
        this.graphics = graphics;
    }
    init() {

    }
    initList() {

    }

    filter(): ecs.IMatcher {
        return ecs.allOf(ColliderComponent);
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.04) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(entities: ActorEntity[]): void {
        if (this.list.length < 1) {
            for (let e of entities) {
                let colliders = e.Collider.colliders;
                for (let collider of colliders) {
                    collider.entity = e;
                    this.list.push(collider);
                }
            }
        }
        this.updateDebug();
        this.collisionCheck(entities);

    }
    private updateDebug() {
        if (!this.isDebug || !this.graphics) {
            return;
        }
        this.graphics.clear();
        this.graphics.strokeColor = cc.Color.WHITE;
        for (let c of this.list) {
            if (c.type == CCollider.TYPE.CIRCLE) {
                this.graphics.circle(c.Center.x, c.Center.y, c.Radius);
            } else {
                let aabb = c.Aabb;
                this.graphics.rect(aabb.x, aabb.y, aabb.width, aabb.height);
            }
            this.graphics.stroke();
        }

    }
    private collisionCheck(entities: ActorEntity[]) {
        for (let e of entities) {
            let colliders = e.Collider.colliders;
            for (let collider of colliders) {
                collider.entity = e;
                this.quadTree.insert(collider);
            }
        }
        this.tempColliders = {};
        for (let collider of this.list) {
            if (!collider.enabled) {
                continue;
            }
            let colliders = this.quadTree.retrieve(collider);
            for (let other of colliders) {
                if (collider.targetTags.size > 0) {
                    if (!collider.targetTags.has(other.tag)) {
                        continue;
                    }
                } else if (collider.ignoreTags.has(other.tag)) {
                    continue;
                }
                if (other.targetTags.size > 0) {
                    if (!other.targetTags.has(collider.tag)) {
                        continue;
                    }
                } else if (other.ignoreTags.has(collider.tag)) {
                    continue;
                }
                if (!other.enabled) {
                    continue;
                }
                if (other === collider) {
                    continue;
                }
                //同一个物体不同的碰撞不校验
                if (other.groupId == collider.groupId) {
                    continue;
                }
                //如果当前两个物体已经交互过则跳过
                if (this.tempColliders[`${collider.id},${other.id}`] || this.tempColliders[`${other.id},${collider.id}`]) {
                    continue;
                }
                let isCollision = false;
                if (collider.type == CCollider.TYPE.RECT && other.type == CCollider.TYPE.RECT) {
                    //矩形检测
                    isCollision = this.recHit(collider.Aabb,other.Aabb);
                } else if (collider.type == CCollider.TYPE.CIRCLE && other.type == CCollider.TYPE.CIRCLE) {
                    //圆形检测
                    isCollision = this.circleHit(collider.Center, other.Center, collider.Radius, other.Radius);
                } else if (collider.type == CCollider.TYPE.RECT && other.type == CCollider.TYPE.CIRCLE) {
                    //矩形圆形检测
                    isCollision = this.circleRectHit(other.Center, other.Radius, collider.Aabb);
                } else if (collider.type == CCollider.TYPE.CIRCLE && other.type == CCollider.TYPE.RECT) {
                    //圆形矩形检测
                    isCollision = this.circleRectHit(collider.Center, collider.Radius, other.Aabb);
                }
                if (isCollision) {
                    collider.contact(other);
                    other.contact(collider);
                } else {
                    collider.exit(other);
                    other.exit(collider);
                }
                //标记当前循环已经碰撞过的物体对
                this.tempColliders[`${collider.id},${other.id}`] = true;
            }
        }
        this.quadTree.clear();
    }

    private recHit(rect1:cc.Rect,rect2:cc.Rect){
        if(rect1.width<=0||rect1.height<=0||rect2.width<=0||rect2.height<=0){
            return false;
        }
        return rect1.intersects(rect2);
    }
    private circleHit(v1: cc.Vec3, v2: cc.Vec3, r1: number, r2: number) {
        if (r1 <= 0 || r2 <= 0) {
            return false;
        }
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) <= r1 + r2;
    }

    private circleRectHit(center: cc.Vec3, radius: number, rect: cc.Rect) {
        if(rect.width<=0||rect.height<=0||radius<=0){
            return false;
        }
        let x = center.x - rect.x - rect.width / 2;
        let y = center.y - rect.y - rect.height / 2;
        let minX = Math.min(x, rect.width / 2);
        let maxX = Math.max(minX, -rect.width / 2);
        let minY = Math.min(y, rect.height / 2);
        let maxY = Math.max(minY, -rect.height / 2);

        if ((maxX - x) * (maxX - x) + (maxY - y) * (maxY - y) <= radius * radius) {
            return true;
        }
        else {
            return false;
        }
    }

}