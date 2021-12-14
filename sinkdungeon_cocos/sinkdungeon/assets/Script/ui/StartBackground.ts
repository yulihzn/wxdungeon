// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from "../logic/Logic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartBackground extends cc.Component {

    @property(cc.Node)
    bg1: cc.Node = null;
    @property(cc.Node)
    bg2: cc.Node = null;
    @property(cc.Node)
    bg3: cc.Node = null;
    @property(cc.Node)
    bg4: cc.Node = null;
    @property(cc.Node)
    bg5: cc.Node = null;
    @property(cc.Node)
    bg6: cc.Node = null;
    @property(cc.Node)
    bg7: cc.Node = null;
    defaultArr: cc.Vec3[] = [cc.v3(0, -120), cc.v3(0, -120), cc.v3(800, -120), cc.v3(0, 0), cc.v3(0, 0), cc.v3(0, -600), cc.v3(0, 0)];
    bgArr: cc.Node[] = [];
    // LIFE-CYCLE CALLBACKS:
    isStarted = false;
    touchPos = cc.v2(0, 0);
    readonly LENGTH = 720;

    onLoad() {
        this.bgArr.push(this.bg1);
        this.bgArr.push(this.bg2);
        this.bgArr.push(this.bg3);
        this.bgArr.push(this.bg4);
        this.bgArr.push(this.bg5);
        this.bgArr.push(this.bg6);
        this.bgArr.push(this.bg7);

        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            if (!this.isStarted) {
                this.touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
            }
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if (!this.isStarted) {
                this.touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
            }
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.touchPos = cc.v2(0, 0);
        }, this)

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.touchPos = cc.v2(0, 0);
        }, this)
    }
    startPressed() {
        if (this.isStarted) {
            return;
        }
        this.isStarted = true;
        for (let i = 0; i < this.bgArr.length; i++) {
            let targetPos = this.defaultArr[i].clone();
            this.bgArr[i].position = targetPos;
        }
        this.getComponent(cc.Animation).play();
    }
    update(dt) {
        if (!this.isStarted) {
            for (let i = 0; i < this.bgArr.length; i++) {
                let targetPos = this.defaultArr[i].clone();
                let offset = this.touchPos.x / this.LENGTH * 60 * i;
                targetPos.x -= offset;
                this.bgArr[i].position = Logic.lerpPos(this.bgArr[i].position, targetPos, dt * i * 2);
            }
        }
    }
}
