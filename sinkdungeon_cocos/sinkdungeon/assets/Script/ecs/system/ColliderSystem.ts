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
            x: -width,
            y: -height,
            width: width * 2,
            height: height * 2
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
                this.graphics.circle(c.w_center.x, c.w_center.y, c.w_radius);
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
                collider.fixCenterAndScale();
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
                    if (collider.isRotate && other.isRotate) {
                        isCollision = this.polygonPolygon(collider.points, other.points);
                    } else if (collider.isRotate && !other.isRotate) {
                        isCollision = this.rectPolygon(other.Aabb, collider.points);
                    } else if (!collider.isRotate && other.isRotate) {
                        isCollision = this.rectPolygon(collider.Aabb, other.points);
                    } else {
                        isCollision = this.recHit(collider.Aabb, other.Aabb);
                    }
                } else if (collider.type == CCollider.TYPE.CIRCLE && other.type == CCollider.TYPE.CIRCLE) {
                    //圆形检测
                    isCollision = this.circleHit(collider.w_center, other.w_center, collider.w_radius, other.w_radius);
                } else if (collider.type == CCollider.TYPE.RECT && other.type == CCollider.TYPE.CIRCLE) {
                    //矩形圆形检测
                    isCollision = this.polygonCircle(collider.points, other.w_center, other.w_radius);
                } else if (collider.type == CCollider.TYPE.CIRCLE && other.type == CCollider.TYPE.RECT) {
                    //圆形矩形检测
                    isCollision = this.polygonCircle(other.points, collider.w_center, collider.w_radius);
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

    private recHit(rect1: cc.Rect, rect2: cc.Rect) {
        if (rect1.width <= 0 || rect1.height <= 0 || rect2.width <= 0 || rect2.height <= 0) {
            return false;
        }
        return cc.Intersection.rectRect(rect1, rect2);
    }
    private rectPolygon(rect: cc.Rect, points: cc.Vec2[]) {
        if (rect.width <= 0 || rect.height <= 0) {
            return false;
        }
        return cc.Intersection.rectPolygon(rect, points)
    }
    private polygonCircle(points: cc.Vec2[], v: cc.Vec2, r: number) {
        if (r <= 0) {
            return false;
        }
        return cc.Intersection.polygonCircle(points, { position: v, radius: r })
    }
    private polygonPolygon(points1: cc.Vec2[], points2: cc.Vec2[]) {
        return cc.Intersection.polygonPolygon(points1, points2);
    }
    private circleHit(v1: cc.Vec2, v2: cc.Vec2, r1: number, r2: number) {
        if (r1 <= 0 || r2 <= 0) {
            return false;
        }
        return cc.Intersection.circleCircle({ position: v1, radius: r1 }, { position: v2, radius: r2 });
    }

}