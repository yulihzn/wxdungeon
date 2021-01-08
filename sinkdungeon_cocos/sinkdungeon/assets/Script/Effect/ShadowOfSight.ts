// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const {ccclass, property} = cc._decorator;

@ccclass
export default class ShadowOfSight extends cc.Component {

    @property(cc.Node)
    player:cc.Node = null;
    @property(cc.Mask)
    mask:cc.Mask = null;

    /** 辐射线数量 */
    private rayNum = 720;
    /** 辐射线半径 */
    private rayRadius = 500;
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
        let p1 = this.player.position;
        p1 = this.node.convertToWorldSpaceAR(p1);
        this.drawRayByNum(p1);
        this.renderMask();
    }
    /** 通过射线数量绘制辐射线 */
    drawRayByNum(p1): void {
        let unitRd = 2 * Math.PI / this.rayNum;
        this.lightVertsArray = new Array();
        for (let i = 0; i < this.rayNum; i++) {
            let p3 = cc.v2(Math.cos(i * unitRd) * this.rayRadius + p1.x, Math.sin(i * unitRd) * this.rayRadius + p1.y);
            let physicsManager = cc.director.getPhysicsManager();
            let result = physicsManager.rayCast(p1, p3, cc.RayCastType.Closest);
            if (result.length > 0) {
                p3 = result[0].point;
            }
            this.lightVertsArray.push(p3);
        }
    }
    /** 绘制遮罩 */
    renderMask(): void {
        let potArr = this.lightVertsArray;
        this.mask._updateGraphics = () => {
            var graphics: cc.Graphics = this.mask._graphics;
            graphics.clear(false);
            graphics.lineWidth = 10;
            graphics.fillColor.fromHEX('#ff0000');
            graphics.moveTo(potArr[0].x, potArr[0].y);
            for (let i = 1; i < potArr.length; i++) {
                const p = potArr[i];
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
