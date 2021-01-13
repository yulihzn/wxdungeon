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
            this.playerPos = pos.clone();
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            let pos = event.getLocation();
            this.playerPos = pos.clone();
            cc.log(`playerPos:${pos.x},${pos.y}`);
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
        let visibleRatio = visibleSize.width / visibleSize.height;
        let r = this.radius/visibleSize.height;
        let ch = canvasSize.width/visibleRatio;
        let offset = (visibleSize.height-canvasSize.height)/2;
        let scaleH = canvasSize.height/ch;
        let scale = canvasSize.width/visibleSize.width;
        this.mat.setProperty("screen", cc.v2(canvasSize.width, canvasSize.height));
        this.mat.setProperty("maxRadius", r);
        this.mat.setProperty("whRatio", visibleRatio);
        let lightPos = cc.v2(this.playerPos.x / visibleSize.width, this.playerPos.y / visibleSize.height);
        if(lightPos.y==0.5){
            offset = 0;
        }
        let y = lightPos.y*visibleSize.height*scale/canvasSize.height;
        this.mat.setProperty("lightPos", cc.v2(lightPos.x,y));
    }
}
