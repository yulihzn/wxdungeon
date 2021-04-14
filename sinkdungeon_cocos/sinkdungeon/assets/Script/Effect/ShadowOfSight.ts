// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ColliderTag } from "../Actor/ColliderTag";
import Logic from "../Logic";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ShadowOfSight extends cc.Component {

    // @property(cc.Mask)
    // mask: cc.Mask = null;
    @property(cc.Graphics)
    ray: cc.Graphics = null;
    // @property(cc.Node)
    // shadow: cc.Node = null;
    /** 辐射线数量 */
    private rayNum = 180;
    /** 辐射线半径 */
    @property
    rayRadius = 600;
    @property(cc.Color)
    renderColor = cc.color(255, 255, 255, 40);
    @property
    showLight = true;
    @property
    showShadow = true;
    @property
    showRayCast = false;//是否射线
    @property
    isCircle = true;//是否圆形
    @property
    isSector = false;//是否扇形
    /** 视野顶点数组 */
    lightVertsArray = new Array();
    /** 本光线打亮区域 */
    lightRects: { [key: string]: cc.Rect } = {};
    circle = cc.v3(0, 0, 0);
    private mat: cc.MaterialVariant;
    offset = 0;
    offsetPlus = false;
    private isRendered = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.mat = this.ray.getMaterial(0);
    }
    /** 绘制视野区域 */
    renderSightArea(cameraOffset: cc.Vec2): void {
        let pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let size = 10;
        let delta = 0.1;
        if (this.offset > size) {
            this.offsetPlus = false;
        } else if (this.offset < -size) {
            this.offsetPlus = true;
        }
        this.offset = this.offsetPlus ? this.offset + delta : this.offset - delta;
        this.ray.clear();
        if (Logic.settings.showShadow && this.showShadow) {
            this.lightRects = {};
            this.lightVertsArray = [];
            this.circle = cc.v3(0, 0, 0);
            if (this.showRayCast) {
                this.drawRayByNum(pos, cameraOffset, this.showLight);
            } else {
                this.drawCircle(pos, cameraOffset, this.showLight);
            }
        }
        this.isRendered = true;
    }
    updateRender(showShadow:boolean){
        this.isRendered = false;
        this.showShadow = showShadow;
    }
    /** 通过射线数量绘制辐射线 */
    drawRayByNum(pos: cc.Vec2, cameraOffset: cc.Vec2, renderLight: boolean): void {
        if (this.rayRadius <= 0) {
            return;
        }
        this.ray.lineWidth = 10;
        this.ray.fillColor = this.renderColor;
        let unitRd = 2 * Math.PI / this.rayNum;
        this.lightVertsArray = new Array();
        this.lightRects = {};
        for (let i = 0; i < this.rayNum; i++) {
            let p3 = cc.v2(Math.cos(i * unitRd) * this.getRadius() + pos.x, Math.sin(i * unitRd) * this.getRadius() + pos.y);
            let physicsManager = cc.director.getPhysicsManager();
            let result = physicsManager.rayCast(pos, p3, cc.RayCastType.Closest);
            if (result.length > 0 && !result[0].collider.sensor && result[0].collider.node != this.node.parent && (result[0].collider.tag == ColliderTag.WALL
                || result[0].collider.tag == ColliderTag.BUILDING || result[0].collider.tag == ColliderTag.PLAYER|| result[0].collider.tag == ColliderTag.WALL_TOP
                || result[0].collider.tag == ColliderTag.NONPLAYER)) {
                p3 = result[0].point;
                let node = result[0].collider.node;
                let bottomPos = node.convertToNodeSpaceAR(p3);
                if (bottomPos.y <= 0 && p3.y > pos.y) {
                    let np = node.convertToWorldSpaceAR(cc.v3(0, 0));
                    let offset = 0;
                    let r = cc.rect(np.x - node.width * node.anchorX, np.y - node.height * node.anchorY - offset, node.width, node.height + offset);
                    this.lightRects[node.uuid] = r;
                }
            }
            this.lightVertsArray.push(p3);
            this.ray.lineWidth = 3;
            this.ray.strokeColor = cc.color(0, 0, 0, 80);
            if (renderLight) {
                if (i == 0) {
                    let p0 = this.node.convertToNodeSpaceAR(p3);
                    this.ray.moveTo(p0.x, p0.y);
                } else {
                    const p = this.node.convertToNodeSpaceAR(p3);
                    this.ray.lineTo(p.x, p.y);
                }
            }
        }
        if (renderLight) {
            this.ray.close();
            this.ray.fill();
            this.ray.fillColor.a = this.ray.fillColor.a / 2;
            for (let key in this.lightRects) {
                let r = this.lightRects[key];
                let p = this.node.convertToNodeSpaceAR(cc.v3(r.x, r.y));
                this.ray.rect(p.x, p.y, r.width, r.height);
                this.ray.fill();

            }
            this.updateMat(this.mat, cc.v2(pos.x - cameraOffset.x, pos.y - cameraOffset.y));
        }
    }
    drawCircle(pos: cc.Vec2, cameraOffset: cc.Vec2, renderLight: boolean) {
        if (this.rayRadius <= 0) {
            return;
        }
        this.circle = cc.v3(pos.x, pos.y, this.getRadius());
        this.lightVertsArray = new Array();
        this.lightRects = {};
        if (renderLight && this.rayRadius > 0) {
            this.ray.lineWidth = 10;
            this.ray.fillColor = this.renderColor;
            let center = this.node.convertToNodeSpaceAR(pos);
            // this.ray.circle(center.x, center.y, this.getRadius());
            if (this.isSector) {
                this.ray.moveTo(center.x - this.getRadius() / 8, center.y);
                this.ray.lineTo(center.x - this.getRadius()/2, center.y - this.getRadius()/3);
                this.ray.lineTo(center.x - this.getRadius()/1.5, center.y - this.getRadius()/2);
                this.ray.lineTo(center.x - this.getRadius()/2, center.y - this.getRadius());
                this.ray.lineTo(center.x, center.y - this.getRadius()*1.2);
                this.ray.lineTo(center.x + this.getRadius()/2, center.y - this.getRadius());
                this.ray.lineTo(center.x + this.getRadius()/1.5, center.y - this.getRadius()/2);
                this.ray.lineTo(center.x + this.getRadius()/2, center.y - this.getRadius()/3);
                this.ray.lineTo(center.x + this.getRadius() / 8, center.y);
                this.ray.close();
            } else {
                this.ray.rect(center.x - this.getRadius(), center.y - this.getRadius(), this.getRadius() * 2, this.getRadius() * 2);
            }
            this.ray.fill();
            this.updateMat(this.mat, cc.v2(pos.x - cameraOffset.x, pos.y - cameraOffset.y));
        }
    }
    private getRadius(): number {

        return this.rayRadius + this.offset;
    }
    // rendLight(graphics: cc.Graphics, p1: cc.Vec2) {
    //     let c1 = cc.v2(p1.x - this.camera.node.x, p1.y - this.camera.node.y);
    //     let potArr = this.lightVertsArray;
    //     graphics.clear(false);
    //     graphics.lineWidth = 10;
    //     graphics.fillColor = cc.color(0, 255, 0, 128);
    //     let p0 = this.node.convertToNodeSpaceAR(potArr[0]);
    //     graphics.moveTo(p0.x, p0.y);
    //     for (let i = 1; i < potArr.length; i++) {
    //         const p = this.node.convertToNodeSpaceAR(potArr[i]);
    //         graphics.lineTo(p.x, p.y);
    //     }
    //     graphics.close();
    //     graphics.stroke();
    //     graphics.fill();
    //     this.updateMat(this.mat, c1);

    // }
    private updateMat(mat: cc.MaterialVariant, pos: cc.Vec2) {
        let canvasSize = cc.view.getCanvasSize();
        let visibleSize = cc.view.getVisibleSize();
        let visibleRatio = visibleSize.width / visibleSize.height;
        let r = this.getRadius() / visibleSize.height;
        let scale = canvasSize.width / visibleSize.width;
        mat.setProperty("screen", cc.v2(canvasSize.width, canvasSize.height));
        mat.setProperty("maxRadius", r);
        mat.setProperty("whRatio", visibleRatio);
        mat.setProperty('isCircle', this.isCircle);
        let lightPos = cc.v2(pos.x / visibleSize.width, pos.y / visibleSize.height);
        let y = Math.abs(lightPos.y - 0.5) * visibleSize.height * scale / canvasSize.height;
        this.mat.setProperty("lightPos", cc.v2(lightPos.x, lightPos.y > 0.5 ? 0.5 + y : 0.5 - y));
    }
    /** 绘制遮罩 */
    // renderMask(): void {
    //     if(!this.mask){
    //         return;
    //     }
    //     let potArr = this.lightVertsArray;
    //     this.mask.alphaThreshold = 0.3;
    //     this.mask._updateGraphics = () => {
    //         var graphics: cc.Graphics = this.mask._graphics;
    //         graphics.clear(false);
    //         graphics.lineWidth = 10;
    //         graphics.fillColor.fromHEX('#ff0000');
    //         let p0 = this.mask.node.convertToNodeSpaceAR(potArr[0]);
    //         graphics.moveTo(p0.x, p0.y);
    //         for (let i = 1; i < potArr.length; i++) {
    //             const p = this.mask.node.convertToNodeSpaceAR(potArr[i]);
    //             graphics.lineTo(p.x, p.y);
    //         }
    //         graphics.close();
    //         graphics.stroke();
    //         graphics.fill();
    //     }
    //     this.mask._updateGraphics();
    // }
}
