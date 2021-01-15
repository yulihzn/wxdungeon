import BaseManager from "./BaseManager";
import ShadowOfSight from "../Effect/ShadowOfSight";

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
    camera:cc.Camera = null;
    @property(cc.Mask)
    mask: cc.Mask = null;
    private static lightList:ShadowOfSight[]=[];
    @property(cc.Node)
    shadow: cc.Node = null;
    clear(): void {
        LightManager.lightList = [];
    }
    onLoad(){
        
    }
    private render(){
      
        if(this.shadow&&this.camera){
            let p1 = this.camera.node.convertToWorldSpaceAR(cc.v2(0, 0));
            let c1 = this.mask.node.convertToNodeSpaceAR(p1);
            this.shadow.position = cc.v3(c1);
        }
        for(let i=0;i<LightManager.lightList.length;i++){
            let light = LightManager.lightList[i];
            if(light){
                light.renderSightArea(cc.v2(this.camera.node.x,this.camera.node.y));
                this.renderMask(light.lightVertsArray,light.lightRects,i==0);
            }
        }
    }
    public static registerLight(light:ShadowOfSight){
        LightManager.lightList.push(light);
    }
    public static unRegisterLight(light:ShadowOfSight){
        let index = LightManager.lightList.indexOf(light);
        if(-1 != index){
            LightManager.lightList.splice(index,1);
        }
    }
   /** 绘制遮罩 */
   renderMask(potArr:cc.Vec2[],lightRects: { [key: string]: cc.Rect },isFirst:boolean): void {
    if(!this.mask){
        return;
    }
    this.mask.alphaThreshold = 0.3;
    this.mask._updateGraphics = () => {
        var graphics: cc.Graphics = this.mask._graphics;
        if(isFirst){
            graphics.clear(false);
        }
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
        for(let key in lightRects){
            let lightRect = lightRects[key];
            graphics.rect(lightRect.x,lightRect.y,lightRect.width,lightRect.height);
            graphics.fill();
        }
    }
    this.mask._updateGraphics();
}

    update(dt:number){
        this.render();
    }
}
