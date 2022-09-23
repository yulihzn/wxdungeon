// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CCollider from '../collider/CCollider'
import GameWorldSystem from '../ecs/system/GameWorldSystem'
import Actor from '../base/Actor'
import Logic from '../logic/Logic'

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
    sprite: cc.Sprite = null
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
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite)
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
        let size = this.radius / 10
        let delta = 0.1
        if (this.offset > size) {
            this.offsetPlus = false
        } else if (this.offset < -size) {
            this.offsetPlus = true
        }
        this.offset = this.offsetPlus ? this.offset + delta : this.offset - delta
        this.ray.clear()
        if (this.sprite) {
            this.sprite.enabled = false
        }

        if (this.showShadow) {
            this.lightRects = {}
            this.lightVertsArray = []
            this.circle = cc.v3(0, 0, 0)
            if (this.showRayCast) {
                this.drawRayByNum(pos, camera, this.showLight)
            } else {
                this.drawCustom(pos, camera, this.showLight)
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
            if (this.customCollider.points.length < 1) {
                this.customCollider.fixCenterAndScale()
            }
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
                if (this.sprite) {
                    this.sprite.enabled = true
                    this.sprite.node.width = this.customCollider.w
                    this.sprite.node.height = this.customCollider.h
                    this.sprite.spriteFrame = Logic.spriteFrameRes('lightrect')
                    this.sprite.node.color = cc.color(this.renderColor.r, this.renderColor.g, this.renderColor.b)
                    this.sprite.node.opacity = this.renderColor.a
                    this.ray.enabled = false
                } else {
                    if (this.sprite) {
                        this.sprite.enabled = false
                    }
                    this.ray.enabled = true
                    this.ray.close()
                    this.ray.fill()
                    let sp = camera.getWorldToScreenPoint(pos)
                    this.updateMat(this.mat, cc.v2(sp.x, sp.y), camera.zoomRatio)
                }
            }
        }
        if (this.customCollider && this.customCollider.type == CCollider.TYPE.CIRCLE && this.customCollider.radius > 0) {
            let p = this.node.convertToWorldSpaceAR(cc.v2(this.customCollider.offsetX, this.customCollider.offsetY))
            this.circle = cc.v3(p.x, p.y, this.getRadius())
            if (renderLight) {
                if (this.sprite) {
                    this.sprite.enabled = true
                    let r = this.getRadius()
                    this.sprite.node.width = r * 2
                    this.sprite.node.height = r * 2
                    this.sprite.spriteFrame = Logic.spriteFrameRes('lightpoint')
                    this.sprite.node.color = cc.color(this.renderColor.r, this.renderColor.g, this.renderColor.b)
                    this.sprite.node.opacity = this.renderColor.a
                    this.ray.enabled = false
                } else {
                    this.ray.enabled = true
                    if (this.sprite) {
                        this.sprite.enabled = false
                    }
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
    }
    /** 圆形辐射线 主要用于篝火 通过射线数量绘制辐射线 */
    drawRayByNum(pos: cc.Vec2, camera: cc.Camera, renderLight: boolean): void {
        if (!this.customCollider || this.customCollider.radius <= 0) {
            return
        }
        if (this.sprite) {
            this.sprite.enabled = false
        }
        this.ray.enabled = true
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
        let canvasSize = cc.view.getCanvasSize() //返回视图中 canvas 的尺寸。 在 native 平台下，它返回全屏视图下屏幕的尺寸。 在 Web 平台下，它返回 canvas 元素尺寸
        let visibleSize = cc.view.getVisibleSize() //返回视图窗口可见区域尺寸。
        let visibleRatio = visibleSize.width / visibleSize.height //宽高比
        let r = this.getRadius() / visibleSize.height //最大半径
        let scale = canvasSize.width / visibleSize.width //实现画面大小缩放比
        mat.setProperty('screen', cc.v2(canvasSize.width, canvasSize.height)) //设置尺寸
        mat.setProperty('maxRadius', r * zoomRatio) //设置最大半径
        mat.setProperty('whRatio', visibleRatio) //设置宽高比
        let lightPos = cc.v2(pos.x / visibleSize.width, pos.y / visibleSize.height) //坐标归一
        let y = (Math.abs(lightPos.y - 0.5) * visibleSize.height * scale) / canvasSize.height //坐标y转换为shader坐标
        this.mat.setProperty('lightPos', cc.v2(lightPos.x, lightPos.y > 0.5 ? 0.5 + y : 0.5 - y)) //设置中心点
    }
}
