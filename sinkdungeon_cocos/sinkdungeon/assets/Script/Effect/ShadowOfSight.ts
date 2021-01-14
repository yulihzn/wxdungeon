// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ColliderTag } from "../Actor/ColliderTag";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ShadowOfSight extends cc.Component {

    player: cc.Node = null;
    @property(cc.Mask)
    mask: cc.Mask = null;
    @property(cc.Graphics)
    ray: cc.Graphics = null;
    @property(cc.Node)
    shadow: cc.Node = null;
    @property(cc.Camera)
    camera: cc.Camera = null;
    /** 辐射线数量 */
    private rayNum = 360;
    /** 辐射线半径 */
    rayRadius = 600;
    renderColor = cc.color(255, 255, 255, 40);
    showLight = true;
    /** 视野顶点数组 */
    private lightVertsArray = new Array();

    private mat: cc.MaterialVariant;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.mat = this.ray.getMaterial(0);
    }
    /** 绘制视野区域 */
    renderSightArea(): void {
        if (!this.player) {
            return;
        }
        let p1 = this.player.convertToWorldSpaceAR(cc.v2(0, 0));
        this.drawRayByNum(p1,this.showLight);
        this.renderMask();
    }
    /** 通过射线数量绘制辐射线 */
    drawRayByNum(pos: cc.Vec2, renderLight: boolean): void {
        this.ray.clear(false);
        this.ray.lineWidth = 10;
        this.ray.fillColor = this.renderColor;
        let c1 = this.mask.node.convertToNodeSpaceAR(pos);
        if(this.shadow){
            this.shadow.position = cc.v3(c1);
        }
        let unitRd = 2 * Math.PI / this.rayNum;
        this.lightVertsArray = new Array();
        for (let i = 0; i < this.rayNum; i++) {
            let p3 = cc.v2(Math.cos(i * unitRd) * this.rayRadius + pos.x, Math.sin(i * unitRd) * this.rayRadius + pos.y);
            let physicsManager = cc.director.getPhysicsManager();
            let result = physicsManager.rayCast(pos, p3, cc.RayCastType.Closest);
            if (result.length > 0 && (result[0].collider.tag == ColliderTag.WALL
                || result[0].collider.tag == ColliderTag.BUILDING)) {
                p3 = result[0].point;
            }
            this.lightVertsArray.push(p3);
            this.ray.lineWidth = 3;
            this.ray.strokeColor = cc.color(0, 0, 0, 80);
            if (renderLight&&this.camera) {
                if (i == 0) {
                    let p0 = this.node.convertToNodeSpaceAR(p3);
                    this.ray.moveTo(p0.x, p0.y);
                } else {
                    const p = this.node.convertToNodeSpaceAR(p3);
                    this.ray.lineTo(p.x, p.y);
                }
            }
        }
        if (renderLight&&this.camera) {
            this.ray.close();
            this.ray.stroke();
            this.ray.fill();
            this.updateMat(this.mat, cc.v2(pos.x - this.camera.node.x, pos.y - this.camera.node.y));
        }
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
        let r = this.rayRadius / visibleSize.height;
        let scale = canvasSize.width / visibleSize.width;
        mat.setProperty("screen", cc.v2(canvasSize.width, canvasSize.height));
        mat.setProperty("maxRadius", r);
        mat.setProperty("whRatio", visibleRatio);
        let lightPos = cc.v2(pos.x / visibleSize.width, pos.y / visibleSize.height);
        let y = Math.abs(lightPos.y - 0.5) * visibleSize.height * scale / canvasSize.height;
        this.mat.setProperty("lightPos", cc.v2(lightPos.x, lightPos.y > 0.5 ? 0.5 + y : 0.5 - y));
    }
    /** 绘制遮罩 */
    renderMask(): void {
        if(!this.mask){
            return;
        }
        let potArr = this.lightVertsArray;
        this.mask.alphaThreshold = 0.3;
        this.mask._updateGraphics = () => {
            var graphics: cc.Graphics = this.mask._graphics;
            graphics.clear(false);
            graphics.lineWidth = 10;
            graphics.fillColor.fromHEX('#ff0000');
            let p0 = this.mask.node.convertToNodeSpaceAR(potArr[0]);
            graphics.moveTo(p0.x, p0.y);
            for (let i = 1; i < potArr.length; i++) {
                const p = this.mask.node.convertToNodeSpaceAR(potArr[i]);
                graphics.lineTo(p.x, p.y);
            }
            graphics.close();
            graphics.stroke();
            graphics.fill();
        }
        this.mask._updateGraphics();
    }

    update(dt) {
        this.renderSightArea();
    }
}
