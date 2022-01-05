import DollJoyStick from '../DollJoyStick';
import { EventHelper } from './../../logic/EventHelper';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseDialog from "./BaseDialog";

const { ccclass, property } = cc._decorator;
/**
 * 娃娃机
 * 俯视稍倾斜视角抓娃娃，摇杆控制钩爪移动，钩爪在摇杆驱动下会出现惯性甩动
 * 娃娃默认是整齐排列在里面，钩爪下去的时候判断钩爪和娃娃的位置，如果中点距离在一个范围内就能抓起来
 * 被抓起后钩爪在移动的时候会慢慢脱力，这个脱力的速度是随机的，到临界点娃娃就会掉下去，掉下去的娃娃会有一个随机旋转然后覆盖在其他娃娃上面
 * 同时判断离它最近的一个娃娃和它的位置并往外随机移动一段距离
 */
@ccclass
export default class DollMachineDialog extends BaseDialog {
    @property(cc.Node)
    hook: cc.Node = null;
    @property(cc.Node)
    claw: cc.Node = null;
    @property(cc.Node)
    clawLeft: cc.Node = null;
    @property(cc.Node)
    clawRight: cc.Node = null;
    @property(cc.Node)
    clawCenter: cc.Node = null;
    @property(cc.Node)
    hookLine: cc.Node = null;
    @property(cc.Node)
    topLayout: cc.Node = null;
    @property(DollJoyStick)
    joyStick: DollJoyStick = null;
    @property(DollJoyStick)
    joyStickSmall: DollJoyStick = null;
    isHooking = false;
    onLoad() {
        EventHelper.on(EventHelper.KEYBOARD_MOVE, (detail) => {
            if (this.node && this.node.active) {
                this.joystickMove(detail.pos);
            }
        });
        EventHelper.on(EventHelper.KEYBOARD_INTERACT
            , (detail) => {
                if (this.node && this.node.active) {
                    this.buttonClick();
                }
            });
            
    }
    private joystickMove(pos: cc.Vec3) {
        this.joyStick.updateUi(pos);
        this.joyStickSmall.updateUi(pos);
        let movePos = this.hook.position.add(pos.mul(5));
        if(movePos.x>0){
            movePos.x = 0;
        }
        if(movePos.y>0){
            movePos.y = 0;
        }
        if(movePos.x>this.topLayout.width-this.hook.width){
            movePos.x = this.topLayout.width-this.hook.width;
        }
        if(movePos.y>this.topLayout.height-this.hook.height){
            movePos.y = this.topLayout.height-this.hook.height;
        }
        this.hook.position = movePos;
    }
    buttonClick() {
        if (this.isHooking) {
            return;
        }
        this.isHooking = true;
        this.clawLeft.angle = 60;
        this.clawRight.angle = -60;
        this.clawCenter.scaleY = 0.5;
        this.claw.y = 0;
        this.claw.angle = 0;
        //钩爪放下
        cc.tween(this.claw).to(1, { y: -100 }).call(() => {
            //钩爪松开
            cc.tween(this.clawLeft).to(0.5, { angle: 0 }).start();
            cc.tween(this.clawRight).to(0.5, { angle: 0 }).start();
            cc.tween(this.clawCenter).to(0.5, { scaleY: 1 }).delay(0.5).call(() => {
                //钩爪收缩 检查是否抓取成功
                let angle = this.checkGrab() ? 45 : 60;
                cc.tween(this.clawLeft).to(0.5, { angle: angle }).start();
                cc.tween(this.clawRight).to(0.5, { angle: -angle }).start();
            }).to(0.5, { scaleY: 0.5 }).call(() => {
                //钩爪收起并在三分之一的过程中松开钩爪，根据角度抛下玩偶
                cc.tween(this.claw).to(0.5, { y: -30 }).call(() => {
                    cc.tween(this.clawLeft).to(0.2, { angle: 0 }).to(0.1, { angle: 60 }).start();
                    cc.tween(this.clawRight).to(0.2, { angle: 0 }).to(0.1, { angle: -60 }).start();
                    cc.tween(this.clawCenter).to(0.2, { scaleY: 1 }).to(0.1, { scaleY: 0.5 }).start();
                }).to(1, { y: 0 }).call(() => {
                    this.isHooking = false;
                }).start();
                cc.tween(this.hookLine).to(2, { height: 0 }).start();
            }).start();
        }).start();
        cc.tween(this.hookLine).to(1, { height: 100 }).start();
    }
    private checkGrab(): boolean {
        return false;
    }
}

