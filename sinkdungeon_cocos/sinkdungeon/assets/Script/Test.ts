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
    @property(cc.Camera)
    camera:cc.Camera = null;
    @property(cc.Graphics)
    ray:cc.Graphics = null;
    private mat: cc.MaterialVariant;
    radius = 200;
    playerPos: cc.Vec2 = cc.v2(640, 360);

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let pos = event.getLocation();
            this.playerPos = pos.clone();
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            let pos = event.getLocation();
            this.playerPos = pos.clone();
            cc.log(`playerPos:${pos.x},${pos.y}`);
        }, this)
        this.ray.fillColor = cc.color(255,0,0,255);
        this.ray.circle(0,0,200);
        this.ray.fill();
        // this.ray.fillColor = cc.color(0,255,0,255);
        // this.ray.rect(-300,-300,600,600);
        // this.ray.fill();
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
        let visibleRatio = visibleSize.width / visibleSize.height;
        let r = this.radius/visibleSize.height;
        let scale = canvasSize.width/visibleSize.width;
        this.mat.setProperty("screen", cc.v2(canvasSize.width, canvasSize.height));
        this.mat.setProperty("maxRadius", r);
        this.mat.setProperty("whRatio", visibleRatio);
        let lightPos = cc.v2((this.playerPos.x-this.camera.node.x) / visibleSize.width, (this.playerPos.y-this.camera.node.y) / visibleSize.height);
        let y = Math.abs(lightPos.y-0.5)*visibleSize.height*scale/canvasSize.height;
        this.mat.setProperty("lightPos", cc.v2(lightPos.x,lightPos.y>0.5?0.5+y:0.5-y));
    }
}
