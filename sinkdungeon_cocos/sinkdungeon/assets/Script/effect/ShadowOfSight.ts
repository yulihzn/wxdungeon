// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CCollider from '../collider/CCollider'
import GameWorldSystem from '../ecs/system/GameWorldSystem'
import Logic from '../logic/Logic'
import Actor from '../base/Actor'

const { ccclass, property } = cc._decorator

@ccclass
export default class ShadowOfSight extends cc.Component {
    // @property(cc.Mask)
    // mask: cc.Mask = null;
    @property(cc.Graphics)
    ray: cc.Graphics = null
    // @property(cc.Node)
    // shadow: cc.Node = null;
    /** 辐射线数量 */
    private rayNum = 180
    @property(cc.Color)
    renderColor = cc.color(255, 255, 255, 1)
    @property
    showLight = true
    @property
    showRayCast = false //是否射线
    @property
    fromSky = false
    @property
    z = 0
    @property
    zHeight = 0
    showShadow = true
    /** 视野顶点数组 */
    lightVertsArray = new Array()
    /** 本光线打亮区域 比如篝火照亮玩家 */
    lightRects: { [key: string]: cc.Rect } = {}
    /**圆 */
    circle = cc.v3(0, 0, 0)
    private mat: cc.MaterialVariant
    offset = 0
    offsetPlus = false
    private polygonCollider: cc.PolygonCollider
    private customCollider: CCollider
    private lightTargetMap = new Map<number, boolean>()
    private sensorTargetMap = new Map<number, boolean>()
    private ignoreMap = new Map<number, boolean>()

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.mat = this.ray.getMaterial(0)
        this.polygonCollider = this.getComponent(cc.PolygonCollider)
        this.customCollider = this.getComponent(CCollider)
        let aimArr = [
            CCollider.TAG.BOSS,
            CCollider.TAG.BUILDING,
            CCollider.TAG.GOODNONPLAYER,
            CCollider.TAG.NONPLAYER,
            CCollider.TAG.PLAYER,
            CCollider.TAG.WALL,
            CCollider.TAG.WALL_TOP
        ]
        for (let key of aimArr) {
            this.lightTargetMap.set(key, true)
        }
        if (this.customCollider && this.customCollider.ignoreTagList) {
            for (let key of this.customCollider.ignoreTagList) {
                if (this.lightTargetMap.has(key)) {
                    this.lightTargetMap.delete(key)
                }
            }
        }
        //三层遍历
        let success = this.initIgnoreMap(this.node.parent.getComponent(Actor))
        if (!success && this.node.parent.parent) {
            success = this.initIgnoreMap(this.node.parent.parent.getComponent(Actor))
            if (!success && this.node.parent.parent.parent) {
                success = this.initIgnoreMap(this.node.parent.parent.parent.getComponent(Actor))
            }
        }
    }
    private initIgnoreMap(actor: Actor) {
        if (!actor) {
            return false
        }
        let arr = actor.node.getComponentsInChildren(CCollider)
        if (arr && arr.length > 0) {
            for (let c of arr) {
                this.ignoreMap.set(c.id, true)
            }
        }
        return true
    }
    /** 绘制视野区域 */
    renderSightArea(camera: cc.Camera): void {
        let pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0))
        let size = 20
        let delta = 0.1
        if (this.offset > size) {
            this.offsetPlus = false
        } else if (this.offset < -size) {
            this.offsetPlus = true
        }
        this.offset = this.offsetPlus ? this.offset + delta : this.offset - delta
        this.ray.clear()
        if (this.showShadow) {
            this.lightRects = {}
            this.lightVertsArray = []
            this.circle = cc.v3(0, 0, 0)
            if (this.showRayCast) {
                this.drawRayByNum(pos, camera, this.showLight)
                // this.drawRayByNum(pos, camera, false);
            } else {
                this.drawCustom(pos, camera, this.showLight)
                // this.drawCustom(pos, camera, false);
            }
        }
    }
    updateRender(showShadow: boolean) {
        this.showShadow = showShadow
    }
    setCustomColliderStyle(isRect: boolean, w: number, h: number, r: number, offsetX: number, offsetY: number) {
        if (!this.customCollider) {
            return
        }
        this.customCollider.w = w
        this.customCollider.h = h
        this.customCollider.radius = r
        this.customCollider.offsetX = offsetX
        this.customCollider.offsetY = offsetY
        this.customCollider.type = isRect ? CCollider.TYPE.RECT : CCollider.TYPE.CIRCLE
        this.customCollider.fixCenterAndScale()
    }
    /**自定义形状 读取collider来绘制，主要用于环境光线不具备交互 */
    drawCustom(pos: cc.Vec2, camera: cc.Camera, renderLight: boolean) {
        this.ray.lineWidth = 10
        this.ray.fillColor = this.renderColor
        if (this.polygonCollider && this.polygonCollider.points.length > 2) {
            for (let i = 0; i < this.polygonCollider.points.length; i++) {
                let p = this.node.convertToWorldSpaceAR(this.polygonCollider.points[i])
                this.lightVertsArray.push(p)
                if (renderLight) {
                    if (i == 0) {
                        this.ray.moveTo(this.polygonCollider.points[i].x, this.polygonCollider.points[i].y)
                    } else {
                        this.ray.lineTo(this.polygonCollider.points[i].x, this.polygonCollider.points[i].y)
                    }
                }
            }
            if (renderLight) {
                this.ray.close()
                this.ray.fill()
                let sp = camera.getWorldToScreenPoint(pos)
                this.updateMat(this.mat, cc.v2(sp.x, sp.y), camera.zoomRatio)
            }
        }
        if (this.customCollider && this.customCollider.type == CCollider.TYPE.RECT && this.customCollider.w > 0 && this.customCollider.h > 0) {
            for (let i = 0; i < this.customCollider.points.length; i++) {
                let p = this.node.convertToNodeSpaceAR(this.customCollider.points[i])
                this.lightVertsArray.push(this.customCollider.points[i])
                if (renderLight) {
                    if (i == 0) {
                        this.ray.moveTo(p.x, p.y)
                    } else {
                        this.ray.lineTo(p.x, p.y)
                    }
                }
            }
            if (renderLight) {
                this.ray.close()
                this.ray.fill()
                let sp = camera.getWorldToScreenPoint(pos)
                this.updateMat(this.mat, cc.v2(sp.x, sp.y), camera.zoomRatio)
            }
        }
        if (this.customCollider && this.customCollider.type == CCollider.TYPE.CIRCLE && this.customCollider.radius > 0) {
            let p = this.node.convertToWorldSpaceAR(cc.v2(this.customCollider.offsetX, this.customCollider.offsetY))
            this.circle = cc.v3(p.x, p.y, this.getRadius())
            if (renderLight) {
                this.ray.lineWidth = 10
                this.ray.fillColor = this.renderColor
                let center = this.customCollider.offset
                this.ray.circle(center.x, center.y, this.getRadius())
                this.ray.fill()
                let sp = camera.getWorldToScreenPoint(pos)
                this.updateMat(this.mat, cc.v2(sp.x, sp.y), camera.zoomRatio)
            }
        }
    }
    /** 圆形辐射线 主要用于篝火 通过射线数量绘制辐射线 */
    drawRayByNum(pos: cc.Vec2, camera: cc.Camera, renderLight: boolean): void {
        if (!this.customCollider || this.customCollider.radius <= 0) {
            return
        }
        this.ray.lineWidth = 10
        this.ray.fillColor = this.renderColor
        let unitRd = (2 * Math.PI) / this.rayNum
        this.lightVertsArray = new Array()
        this.lightRects = {}
        for (let i = 0; i < this.rayNum; i++) {
            let p3 = cc.v2(Math.cos(i * unitRd) * this.getRadius() + pos.x, Math.sin(i * unitRd) * this.getRadius() + pos.y)
            // let physicsManager = cc.director.getPhysicsManager();
            // let result = physicsManager.rayCast(pos, p3, cc.RayCastType.Closest);
            let result = GameWorldSystem.colliderSystem.nearestRayCast(cc.v2(pos), cc.v2(p3), this.z, this.zHeight, this.lightTargetMap, this.sensorTargetMap, this.ignoreMap)
            if (result) {
                p3 = result.point
                let node = result.collider.node
                let bottomPos = node.convertToNodeSpaceAR(p3)
                if (bottomPos.y <= 0 && p3.y > pos.y) {
                    let np = node.convertToWorldSpaceAR(cc.v3(0, 0))
                    let offset = 10
                    let r = cc.rect(np.x - node.width * node.anchorX, np.y - node.height * node.anchorY - offset, node.width, node.height + offset)
                    this.lightRects[node.uuid] = r
                }
            }
            // if (result.length > 0 && !result[0].collider.sensor && result[0].collider.node != this.node.parent && (result[0].collider.tag == CCollider.TAG.WALL
            //     || result[0].collider.tag == CCollider.TAG.BUILDING || result[0].collider.tag == CCollider.TAG.PLAYER || result[0].collider.tag == CCollider.TAG.WALL_TOP
            //     || result[0].collider.tag == CCollider.TAG.NONPLAYER)) {
            //     p3 = result[0].point;
            //     let node = result[0].collider.node;
            //     let bottomPos = node.convertToNodeSpaceAR(p3);
            //     if (bottomPos.y <= 0 && p3.y > pos.y) {
            //         let np = node.convertToWorldSpaceAR(cc.v3(0, 0));
            //         let offset = 0;
            //         let r = cc.rect(np.x - node.width * node.anchorX, np.y - node.height * node.anchorY - offset, node.width, node.height + offset);
            //         this.lightRects[node.uuid] = r;
            //     }
            // }
            this.lightVertsArray.push(p3)
            this.ray.lineWidth = 3
            this.ray.strokeColor = cc.color(0, 0, 0, 80)
            if (renderLight) {
                if (i == 0) {
                    let p0 = this.node.convertToNodeSpaceAR(p3)
                    this.ray.moveTo(p0.x, p0.y)
                } else {
                    const p = this.node.convertToNodeSpaceAR(p3)
                    this.ray.lineTo(p.x, p.y)
                }
            }
        }
        if (renderLight) {
            this.ray.close()
            this.ray.fill()
            this.ray.fillColor.a = this.ray.fillColor.a / 2
            for (let key in this.lightRects) {
                let r = this.lightRects[key]
                let p = this.node.convertToNodeSpaceAR(cc.v3(r.x, r.y))
                this.ray.rect(p.x, p.y, r.width, r.height)
                this.ray.fill()
            }
            let sp = camera.getWorldToScreenPoint(pos)
            this.updateMat(this.mat, cc.v2(sp.x, sp.y), camera.zoomRatio)
        }
    }

    private getRadius(): number {
        return this.radius + this.offset
    }
    get radius() {
        if (this.customCollider && !this.polygonCollider) {
            return this.customCollider.radius * this.customCollider.node.scale
        } else {
            return this.node.width / 2
        }
    }
    set radius(r: number) {
        if (this.customCollider) {
            this.customCollider.radius = r
        }
    }

    private updateMat(mat: cc.MaterialVariant, pos: cc.Vec2, zoomRatio: number) {
        let canvasSize = cc.view.getCanvasSize()
        let visibleSize = cc.view.getVisibleSize()
        let visibleRatio = visibleSize.width / visibleSize.height
        let r = this.getRadius() / visibleSize.height
        let scale = canvasSize.width / visibleSize.width
        mat.setProperty('screen', cc.v2(canvasSize.width, canvasSize.height))
        mat.setProperty('maxRadius', r * zoomRatio)
        mat.setProperty('whRatio', visibleRatio)
        let lightPos = cc.v2(pos.x / visibleSize.width, pos.y / visibleSize.height)
        let y = (Math.abs(lightPos.y - 0.5) * visibleSize.height * scale) / canvasSize.height
        this.mat.setProperty('lightPos', cc.v2(lightPos.x, lightPos.y > 0.5 ? 0.5 + y : 0.5 - y))
    }
}
