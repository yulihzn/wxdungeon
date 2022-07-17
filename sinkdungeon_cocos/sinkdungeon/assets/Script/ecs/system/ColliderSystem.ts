import { ColliderComponent } from './../component/ColliderComponent'
import { ecs } from '../ECS'
import Quadtree from '../../collider/Quadtree'
import CCollider from '../../collider/CCollider'
import ActorEntity from '../entity/ActorEntity'
import RayCastResult from './RayCastResult'
import Logic from '../../logic/Logic'

export default class ColliderSystem extends ecs.ComblockSystem<ActorEntity> {
    private quadTree: Quadtree
    private tempColliders: Map<string, boolean> = new Map()
    private list: CCollider[] = []
    private graphics: cc.Graphics
    private isDebug = false
    private allCount = 0
    private collisionCount = 0
    private activeCount = 0
    constructor(bounds: cc.Rect, graphics: cc.Graphics) {
        super()
        let b = {
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height
        }
        this.quadTree = new Quadtree(b)
        this.graphics = graphics
    }
    init() {
        this.isDebug = Logic.isDebug
        // this.isDebug = true;
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(ColliderComponent)
    }
    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.04) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    update(entities: ActorEntity[]): void {
        this.initCollider(entities)
        this.collisionCheck()
        this.updateDebug()
    }
    private updateDebug() {
        if (!this.isDebug || !this.graphics) {
            return
        }
        this.graphics.clear()
        for (let c of this.list) {
            c.drawDebug(this.graphics)
        }
    }
    private initCollider(entities: ActorEntity[]) {
        this.list = []
        for (let e of entities) {
            let colliders = e.Collider.colliders
            for (let collider of colliders) {
                collider.entity = e
                if (collider.enabled && collider.node.active && collider.entity.NodeRender.node && collider.entity.NodeRender.node.active && !collider.isEmpty) {
                    collider.fixCenterAndScale()
                    this.list.push(collider)
                    this.quadTree.insert(collider)
                }
            }
        }
    }
    private collisionCheck() {
        this.tempColliders.clear()
        let allCount = 0
        let collisionCount = 0
        let activeCount = 0
        for (let collider of this.list) {
            if (!collider.enabled) {
                continue
            }

            let colliders = this.quadTree.retrieve(collider)
            for (let other of colliders) {
                allCount++
                if (
                    (collider.tag == CCollider.TAG.PLAYER_HIT && other.tag == CCollider.TAG.BOSS) ||
                    (other.tag == CCollider.TAG.PLAYER_HIT && collider.tag == CCollider.TAG.BOSS)
                ) {
                    collider
                }
                if (!other.enabled) {
                    continue
                }
                if (other === collider) {
                    continue
                }
                if (other.groupId == collider.groupId) {
                    continue
                }

                if (this.tempColliders.has(`${collider.id}${other.id}`) || this.tempColliders.has(`${other.id}${collider.id}`)) {
                    continue
                }

                if (collider.ignoreSameTag) {
                    if (collider.tag == other.tag) {
                        continue
                    }
                }
                if (collider.targetTags.size > 0) {
                    if (!collider.targetTags.has(other.tag)) {
                        continue
                    }
                } else if (collider.ignoreTags.has(other.tag)) {
                    continue
                }
                if (other.targetTags.size > 0) {
                    if (!other.targetTags.has(collider.tag)) {
                        continue
                    }
                } else if (other.ignoreTags.has(collider.tag)) {
                    continue
                }
                let isCollision = false
                if (collider.type == CCollider.TYPE.RECT && other.type == CCollider.TYPE.RECT) {
                    //矩形检测
                    if (collider.isRotate && other.isRotate) {
                        isCollision = this.polygonPolygon(collider.points, other.points)
                    } else if (collider.isRotate && !other.isRotate) {
                        isCollision = this.rectPolygon(other.Aabb, collider.points)
                    } else if (!collider.isRotate && other.isRotate) {
                        isCollision = this.rectPolygon(collider.Aabb, other.points)
                    } else {
                        isCollision = this.recHit(collider.Aabb, other.Aabb)
                    }
                } else if (collider.type == CCollider.TYPE.CIRCLE && other.type == CCollider.TYPE.CIRCLE) {
                    //圆形检测
                    isCollision = this.circleHit(collider.w_center, other.w_center, collider.w_radius, other.w_radius)
                } else if (collider.type == CCollider.TYPE.RECT && other.type == CCollider.TYPE.CIRCLE) {
                    //矩形圆形检测
                    isCollision = this.polygonCircle(collider.points, other.w_center, other.w_radius)
                } else if (collider.type == CCollider.TYPE.CIRCLE && other.type == CCollider.TYPE.RECT) {
                    //圆形矩形检测
                    isCollision = this.polygonCircle(other.points, collider.w_center, collider.w_radius)
                }
                activeCount++
                if (isCollision) {
                    collider.preSolve(other, this.dt)
                    other.preSolve(collider, this.dt)
                    collider.contact(other, this.dt)
                    other.contact(collider, this.dt)
                    collider.physicTest(other, this.dt)
                    other.physicTest(collider, this.dt)
                    collider.disabledOnce = false
                    other.disabledOnce = false
                } else {
                    collider.exit(other)
                    other.exit(collider)
                }
                //标记当前循环已经碰撞过的物体对
                this.tempColliders.set(`${collider.id}${other.id}`, true)
            }
            if (!collider.sensor && collider.baseChangedCount < 1) {
                collider.entity.Transform.base = 0
            }
        }
        this.quadTree.clear()
        // if(this.isDebug&&this.allCount+this.collisionCount+this.activeCount != allCount+activeCount+collisionCount){
        //     this.allCount = allCount;
        //     this.activeCount = activeCount;
        //     this.collisionCount = collisionCount;
        //     cc.log(`碰撞体数量:${this.list.length},循环次数:${this.allCount},碰撞计算次数:${this.activeCount},已碰撞:${this.collisionCount},未碰撞:${this.activeCount-this.collisionCount}`)
        // }
    }

    private recHit(rect1: cc.Rect, rect2: cc.Rect) {
        if (rect1.width <= 0 || rect1.height <= 0 || rect2.width <= 0 || rect2.height <= 0) {
            return false
        }
        return cc.Intersection.rectRect(rect1, rect2)
    }
    private rectPolygon(rect: cc.Rect, points: cc.Vec2[]) {
        if (rect.width <= 0 || rect.height <= 0) {
            return false
        }
        return cc.Intersection.rectPolygon(rect, points)
    }
    private polygonCircle(points: cc.Vec2[], v: cc.Vec2, r: number) {
        if (r <= 0) {
            return false
        }
        return cc.Intersection.polygonCircle(points, { position: v, radius: r })
    }
    private polygonPolygon(points1: cc.Vec2[], points2: cc.Vec2[]) {
        return cc.Intersection.polygonPolygon(points1, points2)
    }
    private circleHit(v1: cc.Vec2, v2: cc.Vec2, r1: number, r2: number) {
        if (r1 <= 0 || r2 <= 0) {
            return false
        }
        return cc.Intersection.circleCircle({ position: v1, radius: r1 }, { position: v2, radius: r2 })
    }

    public rayCast(p1: cc.Vec2, p2: cc.Vec2, lineZ: number, lineZHeight: number, targetTags: Map<number, boolean>): RayCastResult[] {
        if (p1.equals(p2)) {
            return []
        }
        let results: RayCastResult[] = new Array()
        for (let collider of this.list) {
            if (!targetTags.has(collider.tag)) {
                continue
            }
            let isCollision = this.rayCastCollision(collider, p1, p2, lineZ, lineZHeight)
            if (isCollision) {
                let result = new RayCastResult(collider, collider.w_center)
                results.push(result)
            }
        }
        return results
    }
    private rayCastCollision(collider: CCollider, p1: cc.Vec2, p2: cc.Vec2, lineZ: number, lineZHeight: number): boolean {
        let isCollision = false
        if (this.isLineHeightNotCollid(lineZ, lineZHeight, collider)) {
            //高度检测
        } else if (collider.type == CCollider.TYPE.RECT) {
            //矩形检测
            isCollision = cc.Intersection.linePolygon(p1, p2, collider.points)
        } else if (collider.type == CCollider.TYPE.CIRCLE) {
            //圆形检测
            isCollision = cc.Intersection.lineRect(p1, p2, collider.Aabb)
        }
        return isCollision
    }

    /**
     * 射线检测
     * @param p1 开始点
     * @param p2 结束点
     * @param lineZ 射线z轴
     * @param lineZHeight 射线高度
     * @param targetTags 目标tag
     * @param sensorTags sensortag
     * @param ignoreMap 忽略tag
     * @returns
     */
    public nearestRayCast(
        p1: cc.Vec2,
        p2: cc.Vec2,
        lineZ: number,
        lineZHeight: number,
        targetTags: Map<number, boolean>,
        sensorTags: Map<number, boolean>,
        ignoreMap: Map<number, boolean>
    ): RayCastResult {
        if (p1.equals(p2)) {
            return null
        }
        let result: RayCastResult
        let distance = -1
        for (let collider of this.list) {
            if (!targetTags.has(collider.tag)) {
                continue
            }
            if (!sensorTags.has(collider.tag) && collider.sensor) {
                continue
            }
            if (ignoreMap.has(collider.id)) {
                continue
            }
            let isCollision = this.rayCastCollision(collider, p1, p2, lineZ, lineZHeight)
            if (isCollision) {
                let d = collider.w_center.sub(p1).magSqr()
                if (distance < 0 || distance > d) {
                    distance = d
                    result = new RayCastResult(collider, collider.w_center)
                }
            }
        }
        if (result) {
            let length = result.collider.points.length
            for (let i = 0; i < length; ++i) {
                let b1 = result.collider.points[i]
                let b2 = result.collider.points[(i + 1) % length]
                let ponit = this.getLineLinePoint(p1, p2, b1, b2)
                if (ponit) {
                    result.point = ponit
                    break
                }
            }
        }
        return result
    }
    private getLineLinePoint(a: cc.Vec2, b: cc.Vec2, c: cc.Vec2, d: cc.Vec2) {
        // 三角形abc 面积的2倍
        let area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x)

        // 三角形abd 面积的2倍
        let area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x)

        // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
        if (area_abc * area_abd >= 0) {
            return null
        }
        // 三角形cda 面积的2倍
        let area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x)
        // 三角形cdb 面积的2倍
        // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
        let area_cdb = area_cda + area_abc - area_abd
        if (area_cda * area_cdb >= 0) {
            return null
        }
        //计算交点坐标
        let t = area_cda / (area_abd - area_abc)
        let dx = t * (b.x - a.x),
            dy = t * (b.y - a.y)
        return cc.v2(a.x + dx, a.y + dy)
    }

    isLineHeightNotCollid(lineZ: number, lineZHeight: number, collider: CCollider) {
        return lineZ + lineZHeight < collider.z || lineZ > collider.z + collider.zHeight
    }
}
