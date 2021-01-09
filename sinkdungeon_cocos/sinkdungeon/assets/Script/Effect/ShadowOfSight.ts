// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ColliderTag } from "../Actor/ColliderTag";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ShadowOfSight extends cc.Component {

    @property(cc.Node)
    player:cc.Node = null;
    @property(cc.Mask)
    mask:cc.Mask = null;
    @property(cc.Graphics)
    ray:cc.Graphics = null;
    @property(cc.Node)
    shadow:cc.Node = null;
    /** 辐射线数量 */
    private rayNum = 360;
    /** 辐射线半径 */
    private rayRadius = 1000;
    /** 视野顶点数组 */
    private lightVertsArray = new Array();

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // cc.director.getPhysicsManager().enabled = true;
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
        //     let pos = event.getLocation();
        //     this.node.convertToNodeSpaceAR(pos, pos);
        //     this.player.setPosition(pos);
        // }, this)
    }
    /** 绘制视野区域 */
    renderSightArea(): void {
        if(!this.player){
            return;
        }
        let p1 = this.player.convertToWorldSpaceAR(cc.v2(0,0));
        this.drawRayByNum(p1);
        this.renderMask();
    }
    /** 通过射线数量绘制辐射线 */
    drawRayByNum(p1): void {
        // this.ray.clear();
        let c1 = this.mask.node.convertToNodeSpaceAR(p1);
        this.shadow.position = cc.v3(c1);
        let unitRd = 2 * Math.PI / this.rayNum;
        this.lightVertsArray = new Array();
        for (let i = 0; i < this.rayNum; i++) {
            let p3 = cc.v2(Math.cos(i * unitRd) * this.rayRadius + p1.x, Math.sin(i * unitRd) * this.rayRadius + p1.y);
            let physicsManager = cc.director.getPhysicsManager();
            let result = physicsManager.rayCast(p1, p3, cc.RayCastType.Closest);
            if (result.length > 0&&(result[0].collider.tag == ColliderTag.WALL
                ||result[0].collider.tag == ColliderTag.BUILDING
                ||result[0].collider.tag == ColliderTag.MONSTER)) {
                p3 = result[0].point;
            }
            this.lightVertsArray.push(p3);
            this.ray.lineWidth = 3;
            this.ray.strokeColor = cc.color(0,0,0,80);
            // let c3 = this.node.convertToNodeSpaceAR(p3);
            // let c1 = this.node.convertToNodeSpaceAR(p1);
            // this.ray.moveTo(c1.x, c1.y);
            // this.ray.lineTo(c3.x, c3.y);
            // this.ray.stroke();
        }
    }
    /** 绘制遮罩 */
    renderMask(): void {
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
  
    update (dt) {
        this.renderSightArea();
    }
}
