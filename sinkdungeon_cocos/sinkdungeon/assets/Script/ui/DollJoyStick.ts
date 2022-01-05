// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from "../logic/EventHelper";
import Logic from "../logic/Logic";
import Tips from "./Tips";


const { ccclass, property } = cc._decorator;

@ccclass
export default class DollJoyStick extends cc.Component {
    @property(cc.Node)
    sprite: cc.Node = null;
    @property(cc.Node)
    head: cc.Node = null;
    @property(cc.Node)
    bar: cc.Node = null;
    startPos: cc.Vec2;
    isPressing = false;
    timeDelay = 0;
    movePos = cc.v2(0,0);
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > 0.03) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.startPos = event.getLocation();
            this.isPressing = true;
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let movePos = event.getLocation().sub(this.startPos);
            if (movePos.mag() > this.node.width / 10) {
                this.movePos = movePos.sub(this.startPos).normalize();
            }else{
                this.movePos = cc.Vec2.ZERO;
            }
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.isPressing = false;
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.isPressing = false;
        }, this)
    }
    updateUi(pos: cc.Vec3) {
        this.sprite.angle = -45 * pos.x;
        this.head.y = 16 * (1 + pos.y);
        this.bar.scaleY = 1 + pos.y;
        if(this.head.y>24){
            this.head.y = 24;
        }
        if(this.bar.scaleY>1.5){
            this.bar.scaleY = 1.5;
        }
    }
    protected update(dt: number): void {
        if (this.isTimeDelay(dt)) {
            if(!this.movePos.equals(cc.Vec2.ZERO)){
                EventHelper.emit(EventHelper.KEYBOARD_MOVE, { pos: this.movePos });
            }
            if(!this.isPressing){
                this.sprite.angle = Logic.lerp(this.sprite.angle, 0, 3 * dt);
                this.head.y = Logic.lerp(this.head.y, 16, 3 * dt);
                this.bar.scaleY = Logic.lerp(this.bar.scaleY, 1, 3 * dt);
            }
        }
    }
}
