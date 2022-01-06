import Logic from '../../logic/Logic';
import Utils from '../../utils/Utils';
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
    hookSprite: cc.Node = null;
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
    lastMovePos = cc.Vec3.ZERO;
    hookSwingAngle = 0;
    clawSwingAngle = 0;
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
        if (movePos.x < 0) {
            movePos.x = 0;
        }
        if (movePos.y < 0) {
            movePos.y = 0;
        }
        if (movePos.x > this.topLayout.width - this.hook.width) {
            movePos.x = this.topLayout.width - this.hook.width;
        }
        if (movePos.y > this.topLayout.height - this.hook.height) {
            movePos.y = this.topLayout.height - this.hook.height;
        }
        if(!this.isHooking){
            this.hook.position = movePos;
        }
        if (!pos.equals(cc.Vec3.ZERO)) {
            /**往右移动且上次是往左,当前目标角度在左边，则加左边的角度,如果在中间则加右边的角度
             * 往左移动且上次是往右,当前目标角度在右边，则加右边的角度,如果在中间则加左边的角度
             * 往右移动且上次是在中间，当前目标角度在中间，则加右边的角度
             * 往左移动且上次是在中间，当前目标角度在中间，则加左边的角度
             * 如果在右边则不动
             */
            if (pos.x > 0) {
                if(this.lastMovePos.x < 0){
                    if (this.hookSwingAngle < 0) {
                        this.hookSwingAngle -= 30;
                    } else if (this.hookSwingAngle == 0) {
                        this.hookSwingAngle += 30;
                    }
                }else if(this.lastMovePos.x == 0 && this.hookSwingAngle == 0){
                    this.hookSwingAngle += 30;
                }
                // if(this.lastMovePos.x < 0){
                //     if (this.clawSwingAngle < 0) {
                //         this.clawSwingAngle -= 15;
                //     } else if (this.clawSwingAngle == 0) {
                //         this.clawSwingAngle += 15;
                //     }
                // }else if(this.lastMovePos.x == 0 && this.clawSwingAngle == 0){
                //     this.clawSwingAngle += 15;
                // }
                
            } else if (pos.x < 0) {
                if(this.lastMovePos.x > 0){
                    if (this.hookSwingAngle > 0) {
                        this.hookSwingAngle += 30;
                    } else if (this.hookSwingAngle == 0) {
                        this.hookSwingAngle -= 30;
                    }
                }else if(this.lastMovePos.x == 0 && this.hookSwingAngle == 0){
                    this.hookSwingAngle -= 30;
                }
                // if(this.lastMovePos.x > 0){
                //     if (this.clawSwingAngle > 0) {
                //         this.clawSwingAngle += 15;
                //     } else if (this.hookSwingAngle == 0) {
                //         this.clawSwingAngle -= 15;
                //     }
                // }else if(this.lastMovePos.x == 0 && this.clawSwingAngle == 0){
                //     this.clawSwingAngle -= 15;
                // }
                

            }
            let max = 75;
            this.hookSwingAngle = Utils.clamp(this.hookSwingAngle, max, -max);
            // this.clawSwingAngle = Utils.clamp(this.hookSwingAngle, max, -max);
        }
        this.lastMovePos = pos.clone();
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
        cc.tween(this.claw).to(1, { y: -80 }).call(() => {
            //钩爪松开
            cc.tween(this.clawLeft).to(0.5, { angle: 0 }).start();
            cc.tween(this.clawRight).to(0.5, { angle: 0 }).start();
            cc.tween(this.clawCenter).to(0.5, { scaleY: 1 }).call(() => {
                //钩爪收缩 检查是否抓取成功
                let angle = this.checkGrab() ? 45 : 60;
                cc.tween(this.clawLeft).to(0.5, { angle: angle }).start();
                cc.tween(this.clawRight).to(0.5, { angle: -angle }).start();
            }).to(0.5, { scaleY: 0.5 }).call(() => {
                //钩爪收起并在三分之一的过程中松开钩爪，根据角度抛下玩偶
                cc.tween(this.claw).to(0.5, { y: -60 }).call(() => {
                    cc.tween(this.clawLeft).to(0.2, { angle: 0 }).to(0.1, { angle: 60 }).start();
                    cc.tween(this.clawRight).to(0.2, { angle: 0 }).to(0.1, { angle: -60 }).start();
                    cc.tween(this.clawCenter).to(0.2, { scaleY: 1 }).to(0.1, { scaleY: 0.5 }).start();
                }).to(1, { y: 0 }).call(() => {
                    this.isHooking = false;
                }).start();
                cc.tween(this.hookLine).to(2, { height: 0 }).start();
            }).start();
        }).start();
        cc.tween(this.hookLine).to(1, { height: 80 }).start();
    }
    private checkGrab(): boolean {
        return false;
    }
    protected update(dt: number): void {
        let value = this.getSwingAngle(this.hookSprite.angle, this.hookSwingAngle, 0.4);
        this.hookSprite.angle = value.x;
        this.hookSwingAngle = value.y;
        // let value1 = this.getSwingAngle(this.claw.angle, this.clawSwingAngle, 0.5);
        // this.claw.angle = value1.x;
        // this.clawSwingAngle = value1.y;
    }
    private getSwingAngle(current: number, target: number, reducePercent: number) {
        let angle = 0;
        let offset = 1;
        let modifyTarget = target;
        if (target > 0) {
            angle = current + offset;
            if (angle > target) {
                angle = target;
                modifyTarget *= reducePercent - offset;
            }
        } else if (target < 0) {
            angle = current - offset;
            if (angle < target) {
                angle = target;
                modifyTarget *= reducePercent - offset;
            }
        } else if (current > 0) {
            angle = current - offset;
        } else if (current < 0) {
            angle = current + offset;
        }
        if (modifyTarget > 0) {
            modifyTarget = Math.floor(modifyTarget);
        } else {
            modifyTarget = Math.ceil(modifyTarget);
        }
        return cc.v2(angle, modifyTarget);
    }
}

