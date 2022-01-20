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
    @property(cc.Graphics)
    graphicsTest:cc.Graphics = null;
    @property(cc.Camera)
    camera: cc.Camera = null;
    @property(cc.Graphics)
    ray: cc.Graphics = null;
    @property(cc.Sprite)
    shadow: cc.Sprite = null;
    @property(cc.Camera)
    shadowCamera: cc.Camera = null;
    @property(cc.Node)
    bg: cc.Node = null;
    private mat: cc.MaterialVariant;
    private mat1: cc.MaterialVariant;
    private mat2: cc.MaterialVariant;
    radius = 200;
    playerPos: cc.Vec2 = cc.v2(640, 360);
    private zoomArr = [1, 0.5];
    private index = 0;
    waveOffset: number = 0.0;

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


        // this.ray.fillColor = cc.color(0,255,0,255);
        // this.ray.rect(-500,-500,1000,1000);
        // this.ray.fill();
        // this.ray.fillColor = cc.color(255,255,255,255);
        // this.ray.rect(200,0,100,100);
        // this.ray.fill();
        // this.ray.circle(0,0,200);
        // this.ray.fill();

        this.mat2 = this.bg.getComponent(cc.Sprite).getMaterial(0);
        this.bg.on(cc.Node.EventType.TOUCH_END, (evt: cc.Event.EventTouch) => {
            let pos = this.camera.getWorldToScreenPoint(evt.getLocation());
            let canvasSize = cc.view.getCanvasSize();
            let visibleSize = cc.view.getVisibleSize();
            let visibleRatio = visibleSize.width / visibleSize.height;
            let scale = canvasSize.width / visibleSize.width;
            this.mat2.setProperty("canvas_size", cc.v2(canvasSize.width, canvasSize.height));
            this.mat2.setProperty("wh_ratio", visibleRatio);
            let center = cc.v2(pos.x / visibleSize.width, pos.y / visibleSize.height);
            let y = Math.abs(center.y - 0.5) * visibleSize.height * scale / canvasSize.height;
            this.mat2.setProperty("center", cc.v2(center.x, center.y > 0.5 ? 0.5 + y : 0.5 - y));
            this.waveOffset = 0.0;
        }, this);
        this.graphicsTest.fillColor = cc.Color.WHITE;
        this.graphicsTest.strokeColor = cc.Color.WHITE;
        this.graphicsTest.lineWidth = 200;
        this.graphicsTest.circle(0,0,200);
        this.graphicsTest.fill();
        this.graphicsTest.stroke();
        // this.graphicsTest.lineWidth = 100;
        // this.graphicsTest.moveTo(0,0);
        // this.graphicsTest.lineTo(100,100);
        // this.graphicsTest.lineTo(200,50);
        // this.graphicsTest.lineTo(300,0);
        // this.graphicsTest.lineTo(200,-50);
        // this.graphicsTest.lineTo(100,-100);
        // this.graphicsTest.close();
        // this.graphicsTest.stroke();
    }
    changeZoom() {
        if (this.camera) {
            this.camera.zoomRatio = this.zoomArr[this.index++];
            if (this.index > this.zoomArr.length - 1) {
                this.index = 0;
            }
        }
    }
    rad = 200;
    changeRayCast() {
        this.graphicsTest.clear();
        this.graphicsTest.fillColor = cc.color(255,255,255,30);
        this.graphicsTest.strokeColor = cc.color(255,255,255,30);
        this.rad-=10;
        this.graphicsTest.lineWidth = this.rad;
        // this.graphicsTest.circle(0,0,this.rad);
        this.graphicsTest.moveTo(0,0);
        this.graphicsTest.lineTo(1,0);
        // this.graphicsTest.fill();
        this.graphicsTest.stroke();
    }

    start() {
        this.mat = this.graphics.getMaterial(0);
        this.mat1 = this.ray.getMaterial(0);
        this.render(this.playerPos);
        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.visibleRect.width / 8, cc.visibleRect.height / 8);
        texture.setFilters(cc.Texture2D.Filter.NEAREST, cc.Texture2D.Filter.NEAREST);
        this.shadowCamera.targetTexture = texture;
        this.shadowCamera.render();
        this.shadow.spriteFrame = new cc.SpriteFrame(texture);
    }
    render(pos: cc.Vec2) {
        let p = this.graphics.node.convertToNodeSpaceAR(pos);
        this.graphics.clear();
        this.graphics.fillColor = cc.color(0, 255, 0);
        this.graphics.circle(p.x, p.y, this.radius);
        // this.graphics.rect(p.x-this.radius,p.y-this.radius,this.radius*2,this.radius*2);
        // this.graphics.moveTo(p.x-this.radius/4,p.y);
        // this.graphics.lineTo(p.x-this.radius,p.y-this.radius);
        // this.graphics.lineTo(p.x+this.radius,p.y-this.radius);
        // this.graphics.lineTo(p.x+this.radius/4,p.y);
        // this.graphics.close();
        this.graphics.fill();
        // this.graphics.node.width = this.radius * 2;
        // this.graphics.node.height = this.radius * 2;
    }
    private updateMat(mat: cc.MaterialVariant, pos: cc.Vec2, rayRadius: number) {
        //画布宽高
        let canvasSize = cc.view.getCanvasSize();
        //视图宽高
        let visibleSize = cc.view.getVisibleSize();
        //视图比例
        let visibleRatio = visibleSize.width / visibleSize.height;
        //半径归一化
        let r = rayRadius / visibleSize.height;
        //实际缩放比例
        let scale = canvasSize.width / visibleSize.width;
        //传入画布宽高和视图比例计算对应的半径透明度，比例是为了画布防止宽高变形
        mat.setProperty("screen", cc.v2(canvasSize.width, canvasSize.height));
        mat.setProperty("maxRadius", r * this.camera.zoomRatio);
        mat.setProperty("whRatio", visibleRatio);
        //相机为原地的坐标归一化
        let lightPos = cc.v2(pos.x / visibleSize.width, pos.y / visibleSize.height);
        //因为shader取值是-1到1，而这里换算成比例是0到1，也就是0.5,0.5对应坐标中点(0,0) ，又因为考虑到即使横屏情况下，screen高度也可能比宽度大，
        //y轴超过0.5的部分要先换算为画布下的比例，
        //再根据y是否大于0.5判断点的位置是否要减去或加上这个新的长度
        let y = Math.abs(lightPos.y - 0.5) * visibleSize.height * scale / canvasSize.height;
        mat.setProperty("lightPos", cc.v2(lightPos.x, lightPos.y > 0.5 ? 0.5 + y : 0.5 - y));
    }

    lateUpdate(dt) {
        this.render(this.playerPos);
        //传入的世界坐标减去相机的坐标得到对于相机为原点的坐标
        let pos = this.camera.getWorldToScreenPoint(this.playerPos);
        // this.updateMat(this.mat, cc.v2(this.playerPos.x - this.camera.node.x, this.playerPos.y - this.camera.node.y),this.radius);
        this.updateMat(this.mat, cc.v2(pos.x, pos.y), this.radius);
    }

    update(dt) {
        if (this.waveOffset > 2.0) return;
        this.waveOffset += dt*2;
        this.mat2.setProperty('wave_offset', this.waveOffset);
    }
}
