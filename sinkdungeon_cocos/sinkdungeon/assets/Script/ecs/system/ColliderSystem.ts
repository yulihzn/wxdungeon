import { ColliderComponent } from './../component/ColliderComponent';
import { ecs } from "../ECS";
import Quadtree from '../../collider/Quadtree';
import CCollider from '../../collider/CCollider';
import ActorEntity from '../entity/ActorEntity';
import RayCastResult from './RayCastResult';

export default class ColliderSystem extends ecs.ComblockSystem<ActorEntity>{
    private quadTree: Quadtree;
    private tempColliders: { [key: string]: boolean } = {};
    private list: CCollider[] = [];
    private graphics: cc.Graphics;
    private isDebug = true;
    private isInit = false;
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
        this.graphics.scheduleOnce(()=>{
            this.isInit = true;
        },1)
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
        
        this.collisionCheck(entities);
        this.updateDebug();

    }
    private updateDebug() {
        if (!this.isDebug || !this.graphics) {
            return;
        }
        for (let c of this.list) {
            c.drawDebug();
        }
        // this.graphics.clear();
        // this.graphics.strokeColor = cc.Color.WHITE;
        // this.graphics.lineWidth = 10;
        // for (let c of this.list) {
        //     if (c.type == CCollider.TYPE.CIRCLE) {
        //         let p0 = this.graphics.node.convertToNodeSpaceAR(c.w_center);
        //         this.graphics.circle(p0.x, p0.y, c.w_radius);
        //         this.graphics.stroke();
        //     } else {
        //         let p0 = this.graphics.node.convertToNodeSpaceAR(c.points[0]);
        //         this.graphics.moveTo(p0.x, p0.y);
        //         for (let i = 1; i < c.points.length - 1; i++) {
        //             let p = this.graphics.node.convertToNodeSpaceAR(c.points[i]);
        //             this.graphics.lineTo(p.x, p.y);
        //         }
        //         this.graphics.close();
        //         this.graphics.stroke();
        //     }
        // }

    }
    private collisionCheck(entities: ActorEntity[]) {
        this.list = [];
        for (let e of entities) {
            let colliders = e.Collider.colliders;
            for (let collider of colliders) {
                collider.entity = e;
                collider.fixCenterAndScale();
                this.list.push(collider);
                this.quadTree.insert(collider);
            }
        }
        if(!this.isInit){
            return;
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

    public rayCast(p1: cc.Vec2, p2: cc.Vec2): RayCastResult[] {
        if (p1.equals(p2)) {
            return [];
        }
        for (let collider of this.list) {
            let isCollision = false;
            if (collider.type == CCollider.TYPE.RECT) {
                //矩形检测
                if (collider.isRotate) {
                } else {
                }
            } else if (collider.type == CCollider.TYPE.CIRCLE) {
                //圆形检测
            }
        }
    }

}