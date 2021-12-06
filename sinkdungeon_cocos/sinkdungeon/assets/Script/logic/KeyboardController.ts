import { EventHelper } from "./EventHelper";
import Logic from "./Logic";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class KeyboardController extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    private stopCount = 0;//当不操作的时候是否需要停止发送移动事件
    isUp = false;
    isDown = false;
    isLeft = false;
    isRight = false;
    isA = false;
    isB = false;
    isC = false;
    isD = false;
    isE = false;

    isLongPress = false;
    touchStart = false;
    @property(cc.Node)
    mouseArea: cc.Node = null;
    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        // this.mouseArea.on(cc.Node.EventType.MOUSE_DOWN, (event: cc.Event.EventMouse) => {
        //     if (event.getButton() == cc.Event.EventMouse.BUTTON_LEFT) {
        //         this.isA = true;
        //     }
        // }, this);
        // this.mouseArea.on(cc.Node.EventType.MOUSE_UP, (event: cc.Event.EventMouse) => {
        //     if (event.getButton() == cc.Event.EventMouse.BUTTON_LEFT) {
        //         this.isA = false;
        //     }
        // }, this);
    }

    start() {

    }
    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.w: this.isUp = true; break;
            case cc.macro.KEY.s: this.isDown = true; break;
            case cc.macro.KEY.a: this.isLeft = true; break;
            case cc.macro.KEY.d: this.isRight = true; break;

            case cc.macro.KEY.i: this.openInventory(); break;
            case cc.macro.KEY.u: this.openCellphone(); break;
            case cc.macro.KEY.j: this.isA = true; break;
            case cc.macro.KEY.space: this.isB = true; break;
            case cc.macro.KEY.e: this.isC = true; this.touchStart = true; this.scheduleOnce(() => {
                if (!this.touchStart) {
                    return;
                }
                this.isLongPress = true;
                this.trigger(true);
            }, 0.3); break;
            case cc.macro.KEY.r: this.isD = true; break;
            case cc.macro.KEY.f: this.isE = true; break;
            case cc.macro.KEY.num1: this.useItem(0); break;
            case cc.macro.KEY.num2: this.useItem(1); break;
            case cc.macro.KEY.num3: this.useItem(2); break;
            case 49: this.useItem(0); break;
            case 50: this.useItem(1); break;
            case 51: this.useItem(2); break;
            case cc.macro.KEY.escape: EventHelper.emit(EventHelper.HUD_CANCEL_OR_PAUSE);; break;
        }
    }
    private trigger(isLongPress?: boolean) {
        if (!Logic.isGamePause) EventHelper.emit(EventHelper.PLAYER_TRIGGER, { isLongPress: isLongPress });
    }
    private openInventory() {
        if (!Logic.isGamePause) EventHelper.emit(EventHelper.HUD_INVENTORY_SHOW);
    }
    private openCellphone() {
        if (!Logic.isGamePause) EventHelper.emit(EventHelper.HUD_CELLPHONE_SHOW);
    }
    useItem(index: number) {
        if (!Logic.isGamePause) EventHelper.emit(EventHelper.USEITEM_KEYBOARD, { index: index });
    }
    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.w: this.isUp = false; break;
            case cc.macro.KEY.s: this.isDown = false; break;
            case cc.macro.KEY.a: this.isLeft = false; break;
            case cc.macro.KEY.d: this.isRight = false; break;

            case cc.macro.KEY.j: this.isA = false; break;
            case cc.macro.KEY.space: this.isB = false; EventHelper.emit(EventHelper.PLAYER_REMOTEATTACK_CANCEL); break;
            case cc.macro.KEY.e: this.isC = false;
                if (!this.isLongPress) { this.trigger(); }
                this.touchStart = false; this.isLongPress = false;
                break;
                case cc.macro.KEY.r: this.isD = false; break;
                case cc.macro.KEY.f: this.isE = false; break;
            }
    }
    update(dt) {
        if (this.isTimeDelay(dt)) {
            this.sendMoveMessageToPlayer(dt);
        }
    }
    sendMoveMessageToPlayer(dt: number) {
        if (Logic.isGamePause) {
            return;
        }
        let pos = cc.v3(0, 0);
        if (this.isUp) { pos.addSelf(cc.v3(0, 0.9)); }
        if (this.isDown) { pos.addSelf(cc.v3(0, -0.9)); }
        if (this.isLeft) { pos.addSelf(cc.v3(-0.9, 0)); }
        if (this.isRight) { pos.addSelf(cc.v3(0.9, 0)); }
        if (pos.mag() > 0) {
            pos.normalizeSelf();
        }
        let dir = 4;
        if (Math.abs(pos.x) < Math.abs(pos.y)) {
            if (pos.y > 0.3) {
                dir = 0;
            }
            if (pos.y < -0.3) {
                dir = 1;
            }

        }
        if (Math.abs(pos.x) > Math.abs(pos.y)) {
            if (pos.x < -0.3) {
                dir = 2;
            }
            if (pos.x > 0.3) {
                dir = 3;
            }
        }
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.stopCount = 0;
        } else {
            this.stopCount++;
        }
        if (this.stopCount < 2) {
            cc.director.emit(EventHelper.PLAYER_MOVE, { detail: { dir: dir, pos: pos, dt: dt } })
        }
        if (this.isA) {
            cc.director.emit(EventHelper.PLAYER_ATTACK);
        }
        if (this.isB) {
            cc.director.emit(EventHelper.PLAYER_REMOTEATTACK);
        }

        if (this.isD) {
            cc.director.emit(EventHelper.PLAYER_SKILL);
        }
        if (this.isE) {
            cc.director.emit(EventHelper.PLAYER_SKILL1);
        }

    }
    timeDelay = 0;
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > 0.03) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }
}
