import BaseManager from "./BaseManager";
import ShadowOfSight from "../Effect/ShadowOfSight";
import Logic from "../Logic";
import IndexZ from "../Utils/IndexZ";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LightManager extends BaseManager {
    @property(cc.Camera)
    camera: cc.Camera = null;
    @property(cc.Camera)
    shadowCamera: cc.Camera = null;
    private static lightList: ShadowOfSight[] = [];
    @property(cc.Sprite)
    shadow: cc.Sprite = null;
    @property(cc.Graphics)
    ray: cc.Graphics = null;

    private shadowTexture: cc.RenderTexture;

    clear(): void {
        LightManager.lightList = [];
    }
    onLoad() {

    }
    private render() {
        for (let i = 0; i < LightManager.lightList.length; i++) {
            let light = LightManager.lightList[i];
            if (light) {
                light.renderSightArea(cc.v2(this.camera.node.x, this.camera.node.y));
                this.renderRay(light.lightVertsArray, light.lightRects, light.circle, i == 0, Logic.settings.showShadow && light.showShadow);
            }
        }
        //将阴影镜头下的图片赋值到主镜头结点图片
        if (!this.shadowTexture&&Logic.settings.showShadow) {
            this.shadowTexture = new cc.RenderTexture();
            this.shadowTexture.initWithSize(cc.visibleRect.width / 8, cc.visibleRect.height / 8);
            this.shadowTexture.setFilters(cc.Texture2D.Filter.NEAREST, cc.Texture2D.Filter.NEAREST);
            this.shadowCamera.targetTexture = this.shadowTexture;
            this.shadow.spriteFrame = new cc.SpriteFrame(this.shadowTexture);
        }
    }
    public static registerLight(lights: ShadowOfSight[],actorNode:cc.Node) {
        for(let light of lights){
            light.showShadow = light.node.active;
            if(light.fromSky){
                let p = light.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
                light.node.parent = actorNode.parent;
                light.node.position = light.node.parent.convertToNodeSpaceAR(p);
                light.node.zIndex = IndexZ.OVERHEAD;
            }
            LightManager.lightList.push(light);
        }
    }
    public static unRegisterLight(light: ShadowOfSight) {
        let index = LightManager.lightList.indexOf(light);
        if (-1 != index) {
            LightManager.lightList.splice(index, 1);
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
    renderRay(potArr: cc.Vec2[], lightRects: { [key: string]: cc.Rect }, circle: cc.Vec3, isFirst: boolean, showShadow: boolean) {
        let graphics: cc.Graphics = this.ray;
        if (isFirst) {
            graphics.clear(false);
        }
        if(!showShadow){
            return;
        }
        graphics.lineWidth = 10;
        graphics.fillColor.fromHEX('#ffffff');
        if (potArr && potArr.length > 0) {
            let p0 = this.ray.node.convertToNodeSpaceAR(potArr[0]);
            graphics.moveTo(p0.x, p0.y);
            for (let i = 1; i < potArr.length; i++) {
                const p = this.ray.node.convertToNodeSpaceAR(potArr[i]);
                graphics.lineTo(p.x, p.y);
            }
            graphics.close();
            graphics.fill();
        }
        for (let key in lightRects) {
            let lightRect = lightRects[key];
            let c = this.ray.node.convertToNodeSpaceAR(cc.v2(lightRect.x, lightRect.y));
            graphics.rect(c.x, c.y, lightRect.width, lightRect.height);
            graphics.fill();
        }
        if(circle&&circle.z>0){
            const center = this.ray.node.convertToNodeSpaceAR(cc.v3(circle.x, circle.y));
            graphics.circle(center.x, center.y, circle.z);
            // if (isSector) {
            //     this.ray.moveTo(center.x - circle.z / 8, center.y);
            //     this.ray.lineTo(center.x - circle.z/2, center.y - circle.z/3);
            //     this.ray.lineTo(center.x - circle.z/1.5, center.y - circle.z/2);
            //     this.ray.lineTo(center.x - circle.z/2, center.y - circle.z);
            //     this.ray.lineTo(center.x, center.y - circle.z*1.2);
            //     this.ray.lineTo(center.x + circle.z/2, center.y - circle.z);
            //     this.ray.lineTo(center.x + circle.z/1.5, center.y - circle.z/2);
            //     this.ray.lineTo(center.x + circle.z/2, center.y - circle.z/3);
            //     this.ray.lineTo(center.x + circle.z / 8, center.y);
            //     this.ray.close();
            // }else if(isCirlce){
            //     graphics.circle(center.x, center.y, circle.z);
            // }else{
            //     this.ray.rect(center.x - circle.z, center.y - circle.z, circle.z * 2, circle.z * 2);
            // }
            graphics.fill();
        }
        
    }
    fixShadowPos(){
        if (this.shadow && this.camera) {
            let p1 = this.camera.node.convertToWorldSpaceAR(cc.v2(0, 0));
            let c1 = this.ray.node.convertToNodeSpaceAR(p1);
            this.shadow.node.position = cc.v3(c1);
        }
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.05) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt: number) {
        if (this.isCheckTimeDelay(dt)) {
            this.render();
        }
        this.fixShadowPos();
    }
}
