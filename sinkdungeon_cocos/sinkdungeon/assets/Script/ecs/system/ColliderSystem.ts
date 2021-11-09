import { ColliderComponent } from './../component/ColliderComponent';
import { ecs } from "../ECS";
import Quadtree from '../../collider/Quadtree';
import CCollider from '../../collider/CCollider';
import ActorEntity from '../entity/ActorEntity';
import RayCastResult from './RayCastResult';
import Logic from '../../logic/Logic';

export default class ColliderSystem extends ecs.ComblockSystem<ActorEntity>{
    private quadTree: Quadtree;
    private tempColliders: Map<number, boolean> = new Map();
    private list: CCollider[] = [];
    private graphics: cc.Graphics;
    private isDebug = false;
    private allCount = 0;
    private collisionCount = 0;
    private activeCount = 0;
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
        this.isDebug = Logic.isDebug;
        // this.isDebug = true;
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
        this.initCollider(entities);
        this.collisionCheck();
        this.updateDebug();

    }
    private updateDebug() {
        if (!this.isDebug || !this.graphics) {
            return;
        }
        this.graphics.clear();
        for (let c of this.list) {
            c.drawDebug(this.graphics);
        }
    }
    private initCollider(entities: ActorEntity[]){
        this.list = [];
        for (let e of entities) {
            let colliders = e.Collider.colliders;
            for (let collider of colliders) {
                collider.entity = e;
                if(collider.enabled&&collider.node.active){
                    collider.fixCenterAndScale();
                    this.list.push(collider);
                    this.quadTree.insert(collider);
                }
            }
        }
    }
    private collisionCheck() {
        this.tempColliders.clear();
        let allCount = 0;
        let collisionCount = 0;
        let activeCount = 0;
        for (let collider of this.list) {
            if (!collider.enabled) {
                continue;
            }
            let colliders = this.quadTree.retrieve(collider);
            for (let other of colliders) {
                allCount++;
                if (!other.enabled) {
                    continue;
                }
                if (other === collider) {
                    continue;
                }
                if (other.groupId == collider.groupId) {
                    continue;
                }
                
                if (this.tempColliders.has(collider.id*100000000+other.id) || this.tempColliders.has(other.id*100000000+collider.id)) {
                    continue;
                }
                
                if(collider.ignoreSameTag){
                    if(collider.tag == other.tag ){
                        continue;
                    }
                }
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
                activeCount++;
                if (isCollision) {
                    collider.contact(other);
                    other.contact(collider);
                    collider.disabledOnce = false;
                    other.disabledOnce = false;
                    collisionCount++;
                } else {
                    collider.exit(other);
                    other.exit(collider);
                }
                //标记当前循环已经碰撞过的物体对
                this.tempColliders.set(collider.id*100000000+other.id,true);
            }
        }
        this.quadTree.clear();
        if(this.isDebug&&this.allCount+this.collisionCount+this.activeCount != allCount+activeCount+collisionCount){
            this.allCount = allCount;
            this.activeCount = activeCount;
            this.collisionCount = collisionCount;
            cc.log(`碰撞体数量:${this.list.length},循环次数:${this.allCount},碰撞计算次数:${this.activeCount},已碰撞:${this.collisionCount},未碰撞:${this.activeCount-this.collisionCount}`)
        }
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