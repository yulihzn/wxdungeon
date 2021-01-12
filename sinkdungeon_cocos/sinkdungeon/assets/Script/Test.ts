// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Test extends cc.Component {

    @property(cc.Graphics)
    graphics: cc.Graphics = null;
    private mat: cc.MaterialVariant;
    radius = 100;
    playerPos: cc.Vec2 = cc.v2(640, 360);

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let pos = event.getLocation();
            this.node.convertToNodeSpaceAR(pos, pos);
            this.node.convertToWorldSpaceAR(pos, pos);
            this.playerPos = pos.clone();
            // this.graphics.node.setPosition(pos);
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            let pos = event.getLocation();
            this.node.convertToNodeSpaceAR(pos, pos);
            let canvasSize = cc.view.getCanvasSize();
            let canvasRatio = canvasSize.width / canvasSize.height;
            let visibleSize = cc.view.getVisibleSize();
            let visibleRatio = visibleSize.width / visibleSize.height;
            let height = visibleSize.width / canvasRatio;
            let lightPos = cc.v2(visibleSize.width / 2, height / 2).add(pos);
            cc.log(`pos0:${lightPos.x},${lightPos.y}`);
            this.node.convertToWorldSpaceAR(pos, pos);
            this.playerPos = pos.clone();
            // cc.log(`playerPos:${this.playerPos.x},${this.playerPos.y}`);
            let pos1 = cc.v2(this.playerPos.x, this.playerPos.y);
            // pos1.y = pos1.y / canvasRatio * visibleRatio;
            cc.log(`pos1:${pos1.x},${pos1.y}`);
        }, this)
    }

    start() {
        this.mat = this.graphics.getMaterial(0);
        this.render(this.playerPos);
    }
    render(pos: cc.Vec2) {
        let p = this.graphics.node.convertToNodeSpaceAR(pos);
        this.graphics.clear();
        this.graphics.fillColor = cc.color(0, 255, 0);
        this.graphics.circle(p.x, p.y, this.radius);
        this.graphics.fill();
        this.graphics.node.width = this.radius * 2;
        this.graphics.node.height = this.radius * 2;
    }

    update(dt) {
        this.render(this.playerPos);
        let canvasSize = cc.view.getCanvasSize();
        let visibleSize = cc.view.getVisibleSize();
        let canvasRatio = canvasSize.width / canvasSize.height;
        let visibleRatio = visibleSize.width / visibleSize.height;
        //获取canvas缩放比例
        let scale = canvasSize.width/visibleSize.width;
        //canvas预期高度
        let ch = canvasSize.width/visibleRatio;
        //canvas实际拉伸系数
        let sy = canvasSize.height/ch;
        let pos1 = cc.v2(this.playerPos.x, this.playerPos.y);
        //缩放然后拉伸y
        pos1.x = pos1.x*scale;
        pos1.y = pos1.y*scale*sy;
        let r = this.radius / canvasSize.height;
        this.mat.setProperty("screen", cc.v2(canvasSize.width, canvasSize.height));
        this.mat.setProperty("maxRadius", r);
        this.mat.setProperty("whRatio", visibleRatio);
        this.mat.setProperty("lightPos", cc.v2(pos1.x / canvasSize.width, pos1.y / canvasSize.height));
    }
}
