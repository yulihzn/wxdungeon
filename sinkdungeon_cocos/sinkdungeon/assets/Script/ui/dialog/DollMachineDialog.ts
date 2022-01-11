import Logic from '../../logic/Logic';
import AudioPlayer from '../../utils/AudioPlayer';
import Utils from '../../utils/Utils';
import Doll from '../Doll';
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
    @property(cc.Node)
    layout: cc.Node = null;
    @property(DollJoyStick)
    joyStick: DollJoyStick = null;
    @property(DollJoyStick)
    joyStickSmall: DollJoyStick = null;
    @property(cc.Node)
    coinLayout: cc.Node = null;
    @property(cc.Label)
    countDown: cc.Label = null;
    @property(cc.Label)
    countDownSmall: cc.Label = null;
    @property(cc.Prefab)
    dollPrefab: cc.Prefab = null;
    isHooking = false;
    lastMovePos = cc.Vec3.ZERO;
    hookSwingAngle = 0;
    clawSwingAngle = 0;
    dollList: Doll[] = [];
    isCoinInserted = false;
    isCoinAniming = false;
    anim: cc.Animation;
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
        this.coinLayout.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.node) {
                this.insertCoin();
            }
        }, this)
        this.initDolls();
    }
    private initDolls() {
        this.dollList = [];
        this.layout.removeAllChildren();
        for (let data of Logic.dollNameList) {
            let doll = cc.instantiate(this.dollPrefab).getComponent(Doll).init(Logic.items[data]);
            doll.node.parent = this.layout;
            this.dollList.push(doll);
        }
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 6; i++) {
                if (i == 0 && j == 0) {
                    continue;
                }
                if (i + j < this.dollList.length + 1) {
                    this.dollList[i + j * 6 - 1].node.position = cc.v3(i * Doll.RECT.width, j * Doll.RECT.width).add(cc.v3(Doll.RECT.width / 2, Doll.RECT.width / 2));
                }
            }
        }
    }
    private insertCoin() {
        if (this.isCoinAniming) {
            return;
        }
        if (!this.anim) {
            this.anim = this.coinLayout.getComponent(cc.Animation);
        }
        this.isCoinAniming = true;
        this.anim.play('DollMachineCoinIn');
        AudioPlayer.play(AudioPlayer.COIN);
        EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: -2 });
        this.scheduleOnce(() => {
            this.coinIn();
        }, 1)
    }
    coinIn() {
        if (this.isCoinInserted) {
            AudioPlayer.play(AudioPlayer.SELECT_FAIL);
            this.anim.play('DollMachineCoinOut');
            Utils.toast('已投币，请稍后');
            this.scheduleOnce(() => { this.isCoinAniming = false;AudioPlayer.play(AudioPlayer.COIN); }, 1)
        } else {
            this.isCoinAniming = false;
            this.isCoinInserted = true;
            AudioPlayer.play(AudioPlayer.CASHIERING);
            this.unscheduleAllCallbacks();
            let count = 30;
            this.countDown.string = `${count}`;
            this.countDownSmall.string = `${count}`;
            let timer = () => {
                count--;
                if (count <= 0) {
                    //倒计时为0自动下落
                    count = 0;
                    this.buttonClick();
                } else if (count < 6) {
                    AudioPlayer.play(AudioPlayer.SELECT_FAIL);
                }
                this.countDown.string = `${count > 9 ? '' : '0'}${count}`;
                this.countDownSmall.string = `${count > 9 ? '' : '0'}${count}`;
                if(this.isHooking){
                    this.unschedule(timer);
                }
            }
            this.schedule(timer, 1, count, 1)
        }
    }

    private joystickMove(pos: cc.Vec3) {
        this.joyStick.updateUi(pos);
        this.joyStickSmall.updateUi(pos);
        if (!this.isCoinInserted||this.isHooking) {
            return;
        }
        let movePos = Utils.clampPos(this.hook.position.add(pos.mul(10))
            , cc.v3(this.topLayout.width - this.hook.width / 2, this.topLayout.height - this.hook.height / 2)
            , cc.v3(this.hook.width / 2, this.hook.height / 2));
        this.hook.position = movePos;
        if (!pos.equals(cc.Vec3.ZERO)) {
            /**往右移动且上次是往左,当前目标角度在左边，则加左边的角度,如果在中间则加右边的角度
             * 往左移动且上次是往右,当前目标角度在右边，则加右边的角度,如果在中间则加左边的角度
             * 往右移动且上次是在中间，当前目标角度在中间，则加右边的角度
             * 往左移动且上次是在中间，当前目标角度在中间，则加左边的角度
             * 如果在右边则不动
             */
            if (pos.x > 0) {
                if (this.lastMovePos.x < 0) {
                    if (this.hookSwingAngle < 0) {
                        this.hookSwingAngle -= 30;
                    } else if (this.hookSwingAngle == 0) {
                        this.hookSwingAngle += 30;
                    }
                } else if (this.lastMovePos.x == 0 && this.hookSwingAngle == 0) {
                    this.hookSwingAngle += 30;
                }


            } else if (pos.x < 0) {
                if (this.lastMovePos.x > 0) {
                    if (this.hookSwingAngle > 0) {
                        this.hookSwingAngle += 30;
                    } else if (this.hookSwingAngle == 0) {
                        this.hookSwingAngle -= 30;
                    }
                } else if (this.lastMovePos.x == 0 && this.hookSwingAngle == 0) {
                    this.hookSwingAngle -= 30;
                }

            }
            let max = 75;
            this.hookSwingAngle = Utils.clamp(this.hookSwingAngle, max, -max);
        }
        this.lastMovePos = pos.clone();
    }
    buttonClick() {
        if (!this.isCoinInserted) {
            AudioPlayer.play(AudioPlayer.SELECT_FAIL);
            Utils.toast('点击右下角投币');
            return;
        }
        if (this.isHooking) {
            AudioPlayer.play(AudioPlayer.SELECT_FAIL);
            return;
        }
        AudioPlayer.play(AudioPlayer.SELECT);
        this.isHooking = true;
        this.clawLeft.angle = 60;
        this.clawRight.angle = -60;
        this.clawCenter.scaleY = 0.5;
        this.claw.y = 0;
        this.claw.angle = 0;
        let downRange = 80;
        let leaveOffset = 30;
        let grabedDoll: Doll = null;
        let isFinish1 = false;
        let isFinish2 = false;
        //钩爪放下
        cc.tween(this.claw).to(1, { y: -downRange }).call(() => {
            //钩爪松开
            cc.tween(this.clawLeft).to(0.5, { angle: 0 }).start();
            cc.tween(this.clawRight).to(0.5, { angle: 0 }).start();
            cc.tween(this.clawCenter).to(0.5, { scaleY: 1 }).call(() => {
                //钩爪收缩 检查是否抓取成功
                let cw = this.hook.convertToWorldSpaceAR(this.claw.position);
                let hw = this.hook.convertToWorldSpaceAR(cc.v3(0, 0));
                let offsetX = cw.x - hw.x;
                grabedDoll = this.getGrabDoll(cc.v3(this.hook.x + offsetX, this.hook.y));
                let angle = grabedDoll ? 45 : 60;
                cc.tween(this.clawLeft).to(0.5, { angle: angle }).start();
                cc.tween(this.clawRight).to(0.5, { angle: -angle }).start();
            }).to(0.5, { scaleY: 0.5 }).call(() => {
                //钩爪收起并在三分之一的过程中松开钩爪，根据角度抛下玩偶
                cc.tween(this.claw).call(() => {
                    cc.tween(this.hook).to(this.hook.position.mag() / 120, { position: cc.v3(this.hook.width / 2, this.hook.height / 2) }).call(() => {
                        isFinish1 = true;
                        if (isFinish2) {
                            this.isHooking = false;
                            this.isCoinInserted = false;
                        }
                    }).start();
                }).to(0.5, { y: -downRange + leaveOffset }).call(() => {
                    cc.tween(this.clawLeft).to(0.2, { angle: 0 }).to(0.1, { angle: 60 }).start();
                    cc.tween(this.clawRight).to(0.2, { angle: 0 }).to(0.1, { angle: -60 }).start();
                    cc.tween(this.clawCenter).to(0.2, { scaleY: 1 }).to(0.1, { scaleY: 0.5 }).start();
                    if (grabedDoll) {
                        grabedDoll.drop(this.hook.position.y);
                    }
                }).to(1, { y: 0 }).call(() => {
                    isFinish2 = true;
                    if (isFinish1) {
                        this.isHooking = false;
                        this.isCoinInserted = false;
                    }
                }).start();
                cc.tween(this.hookLine).to(2, { height: 0 }).start();
            }).start();
        }).start();
        cc.tween(this.hookLine).to(1, { height: downRange }).start();
    }
    private getGrabDoll(hookPos: cc.Vec3): Doll {
        cc.log(`${hookPos.x},${hookPos.y}`);
        for (let doll of this.dollList) {
            let dis = Logic.getDistance(doll.node.position, hookPos);
            if (dis < 30) {
                doll.grabed(this.claw);
                return doll;
            }
        }
        return null;
    }
    protected update(dt: number): void {
        let value = this.getSwingAngle(this.hookSprite.angle, this.hookSwingAngle, 0.2);
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

    public show(): void {
        super.show();
        AudioPlayer.stopAllEffect();
        AudioPlayer.play(AudioPlayer.DOLLMACHINE,false,true);
    }
    public dismiss(): void {
        super.dismiss();
        AudioPlayer.stopAllEffect();
    }
}

