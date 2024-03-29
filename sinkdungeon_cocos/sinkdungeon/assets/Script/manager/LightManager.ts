import BaseManager from './BaseManager'
import ShadowOfSight from '../effect/ShadowOfSight'
import Logic from '../logic/Logic'
import IndexZ from '../utils/IndexZ'
import TimeDelay from '../utils/TimeDelay'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator
/**
 * 光源分为环境光源和普通光源
 * 普通光源分为自然光和人造光，自然光会随着时间产生变化
 * 当房间拥有自然光会根据时间变化明暗，底色为偏蓝的黑色
 * 当房间不存在自然光时会根据场景里拥有的主要光源来确定底色
 */
@ccclass
export default class LightManager extends BaseManager {
    @property(cc.Camera)
    camera: cc.Camera = null
    @property(cc.Camera)
    shadowCamera: cc.Camera = null
    @property(cc.Camera)
    shadowCamera1: cc.Camera = null
    private static lightList: ShadowOfSight[] = []
    @property(cc.Sprite)
    shadow: cc.Sprite = null //第一次绘制阴影
    @property(cc.Sprite)
    shadow1: cc.Sprite = null //最后绘制阴影
    @property(cc.Graphics)
    shadowRay: cc.Graphics = null //阴影graphics绘制
    mat: cc.MaterialVariant
    mat1: cc.MaterialVariant
    private shadowTexture: cc.RenderTexture
    private shadowTexture1: cc.RenderTexture
    static readonly ALPHA_START = 20
    static readonly ALPHA_END = 220
    static readonly ROOM_LIGHT = 50
    private shadowAlpha = LightManager.ALPHA_START
    private hasOutSideLight = false
    private isFirstRender = true
    private isOutsideChange = 0

    clear(): void {
        LightManager.lightList = []
    }
    onLoad() {
        this.mat = this.shadow.getMaterial(0)
        this.mat1 = this.shadow1.getMaterial(0)
    }
    private render() {
        this.hasOutSideLight = false
        for (let i = 0; i < LightManager.lightList.length; i++) {
            let light = LightManager.lightList[i]
            if (light) {
                if (light.fromOutside) {
                    this.hasOutSideLight = true
                    if (this.isOutsideChange < 1) {
                        this.isOutsideChange = 1
                    }
                }
                light.renderSightArea(this.camera)
                this.renderRay(light, i == 0, this.shadowRay)
            }
        }
        //将阴影镜头下的图片赋值到主镜头结点图片
        let scale = 8
        if (!this.shadowTexture) {
            this.shadowTexture = new cc.RenderTexture()
            this.shadowTexture.initWithSize(cc.visibleRect.width / scale, cc.visibleRect.height / scale)
            this.shadowTexture.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR)
            this.shadowCamera.targetTexture = this.shadowTexture
            this.shadow.spriteFrame = new cc.SpriteFrame(this.shadowTexture)
        }
        if (!this.shadowTexture1) {
            this.shadowTexture1 = new cc.RenderTexture()
            this.shadowTexture1.initWithSize(cc.visibleRect.width / scale, cc.visibleRect.height / scale)
            this.shadowTexture1.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR)
            this.shadowCamera1.targetTexture = this.shadowTexture1
            this.shadow1.spriteFrame = new cc.SpriteFrame(this.shadowTexture1)
        }
        if (this.isFirstRender) {
            this.isFirstRender = false
            this.timeChange()
        }
    }
    public static registerLight(lights: ShadowOfSight[], actorNode: cc.Node) {
        if (!lights || lights.length < 1) {
            return
        }
        for (let light of lights) {
            light.showShadow = light.node.active
            if (light.fromSky) {
                let p = light.node.convertToWorldSpaceAR(cc.Vec3.ZERO)
                light.node.parent = actorNode.parent
                light.node.position = light.node.parent.convertToNodeSpaceAR(p)
                light.node.zIndex = IndexZ.OVERHEAD
            }
            LightManager.lightList.push(light)
        }
    }

    public static unRegisterLight(lights: ShadowOfSight[]) {
        if (!lights || lights.length < 1) {
            return
        }
        for (let light of lights) {
            let index = LightManager.lightList.indexOf(light)
            if (-1 != index) {
                LightManager.lightList.splice(index, 1)
            }
        }
    }
    // /** 绘制遮罩 */
    // renderMask(potArr: cc.Vec2[], lightRects: { [key: string]: cc.Rect }, circle: cc.Vec3, isFirst: boolean, showShadow: boolean): void {
    //     if (!this.mask) {
    //         return;
    //     }
    //     this.mask.alphaThreshold = 0.3;
    //     // this.mask.setMaterial(0,this.shadow.getComponent(cc.Sprite).getMaterial(0));
    //     //@ts-ignore
    //     this.mask._updateGraphics = () => {
    //         //@ts-ignore
    //         var graphics: cc.Graphics = this.mask._graphics;
    //         if (isFirst) {
    //             graphics.clear(false);
    //         }
    //         graphics.lineWidth = 10;
    //         graphics.fillColor.fromHEX('#ff0000');
    //         if (potArr && potArr.length > 0) {
    //             let p0 = this.mask.node.convertToNodeSpaceAR(potArr[0]);
    //             graphics.moveTo(p0.x, p0.y);
    //             for (let i = 1; i < potArr.length; i++) {
    //                 const p = this.mask.node.convertToNodeSpaceAR(potArr[i]);
    //                 graphics.lineTo(p.x, p.y);
    //             }
    //             graphics.close();
    //             graphics.fill();
    //         }
    //         for (let key in lightRects) {
    //             let lightRect = lightRects[key];
    //             let c = this.mask.node.convertToNodeSpaceAR(cc.v2(lightRect.x, lightRect.y));
    //             graphics.rect(c.x, c.y, lightRect.width, lightRect.height);
    //             graphics.fill();
    //         }
    //         if (!showShadow) {
    //             const center = this.mask.node.convertToNodeSpaceAR(cc.v3(circle.x, circle.y));
    //             graphics.circle(center.x, center.y, circle.z);
    //             graphics.fill();
    //         }
    //     }
    //     //@ts-ignore
    //     this.mask._updateGraphics();
    // }
    /**把多个对应光源的绘制的形状用graphics再绘制一遍到一个处于阴影镜头下的结点上，然后创建对应贴图赋值当前主镜头上 */
    renderRay(light: ShadowOfSight, isFirst: boolean, graphics: cc.Graphics) {
        let potArr = light.lightVertsArray
        let lightRects = light.lightRects
        let circle = light.circle
        if (isFirst) {
            graphics.clear(false)
        }
        if (!light.showShadow) {
            return
        }
        graphics.lineWidth = 10
        graphics.fillColor = light.renderColor
        if (potArr && potArr.length > 0) {
            let p0 = graphics.node.convertToNodeSpaceAR(potArr[0])
            graphics.moveTo(p0.x, p0.y)
            for (let i = 1; i < potArr.length; i++) {
                const p = graphics.node.convertToNodeSpaceAR(potArr[i])
                graphics.lineTo(p.x, p.y)
            }
            graphics.close()
            graphics.fill()
        }
        for (let key in lightRects) {
            let lightRect = lightRects[key]
            let c = graphics.node.convertToNodeSpaceAR(cc.v2(lightRect.x, lightRect.y))
            graphics.rect(c.x, c.y, lightRect.width, lightRect.height)
            graphics.fill()
        }
        if (circle && circle.z > 0) {
            this.drawCircle(graphics, circle.x, circle.y, circle.z)
        }
    }
    drawCircle(graphics: cc.Graphics, x: number, y: number, r: number) {
        const center = graphics.node.convertToNodeSpaceAR(cc.v3(x, y))
        graphics.circle(center.x, center.y, r)
        graphics.fill()
    }
    fixShadowPos() {
        if (this.camera) {
            let p1 = this.camera.node.convertToWorldSpaceAR(cc.v2(0, 0))
            if (this.shadow) {
                let c1 = this.shadowRay.node.convertToNodeSpaceAR(p1)
                this.shadow.node.position = cc.v3(c1)
                this.shadow1.node.position = cc.v3(c1)
            }
        }
    }
    checkTimeDelay = new TimeDelay(0.03)
    checkTimeChangeDelay = new TimeDelay(1)

    /**
     * 每个室内的房间都有一个固定的环境光
     */
    private timeChange() {
        let alpha = this.getShadowAlphaByTime()
        // cc.log(time);
        this.shadowAlpha = LightManager.ALPHA_START + alpha
        if (this.shadowAlpha > LightManager.ALPHA_END) {
            this.shadowAlpha = LightManager.ALPHA_END
        }
        if (this.shadowAlpha < LightManager.ALPHA_START) {
            this.shadowAlpha = LightManager.ALPHA_START
        }
        this.shadowAlpha += this.getShadowAlphaByRoom()
        if (this.shadowAlpha > 240) {
            this.shadowAlpha = 240
        }
        if (this.shadowAlpha < 0) {
            this.shadowAlpha = 0
        }
        this.mat.setProperty('lightColor', cc.color(0, 0, 20, this.shadowAlpha))
    }
    private getShadowAlphaByRoom() {
        let shadowLevel = Logic.mapManager.getCurrentRoom().shadowLevel
        if (!shadowLevel || isNaN(parseInt(shadowLevel))) {
            return 0
        } else {
            return parseInt(shadowLevel) * 25
        }
    }
    private getShadowAlphaByTime() {
        if (!this.hasOutSideLight) {
            return 0
        }
        let date = new Date(Logic.getTickTime())
        let hour = date.getHours()
        let minute = date.getMinutes()
        //将240等分为12份，先算出分钟比例的值
        let m = Math.floor((20 * minute) / 60)
        if (hour > 12) {
            let h = (hour - 12) * 20
            return h + m
        } else {
            let h = (12 - hour) * 20
            return h - m
        }
    }
    update(dt: number) {
        if (this.isOutsideChange == 1) {
            this.isOutsideChange = 2
            this.timeChange()
        }
        if (this.isFirstRender) {
            this.render()
        }
        if (this.checkTimeDelay.check(dt)) {
            this.render()
        }
        if (this.checkTimeChangeDelay.check(dt)) {
            this.timeChange()
        }
        this.fixShadowPos()
    }
}
