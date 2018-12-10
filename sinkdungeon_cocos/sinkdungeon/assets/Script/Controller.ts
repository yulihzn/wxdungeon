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
import { EventConstant } from './EventConstant';
import Logic from './Logic';

@ccclass
export default class Controller extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Node)
    mainAction: cc.Node = null;
    mainActionTouched = false;
    @property(cc.Node)
    secondAction: cc.Node = null;
    secondActionTouched = false;

    thirdActionTouched = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // let ss = this.node.getComponentsInChildren(cc.Sprite);
        // for (let i = 0; i < ss.length; i++) {
        //     ss[i].spriteFrame.getTexture().setAliasTexParameters();
        // }
        this.mainAction.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) {
            this.mainActionTouched = true;
        }, this)

        this.mainAction.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.mainActionTouched = false;
        }, this)

        this.mainAction.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.mainActionTouched = false;
        }, this)
        this.secondAction.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) {
            this.secondActionTouched = true;
        }, this)

        this.secondAction.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.secondActionTouched = false;
        }, this)

        this.secondAction.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.secondActionTouched = false;
        }, this)
        cc.director.on(EventConstant.HUD_DARK_CONTROLLER
            , (event) => { this.changeRes(event.detail.index,false) });
        cc.director.on(EventConstant.HUD_DARK_CONTROLLER
            , (event) => { this.changeRes(event.detail.index,true) });
    }

    changeRes(actionType:number,isLight:boolean){
        let resName = '';
        switch(actionType){
            case 0:resName = isLight?'uimeleelight':'uimelee';break;
            case 1:resName = isLight?'uiremotelight':'uiremote';break;
            case 2:resName = isLight?'uiswitchlight':'uiswitch';break;
        }
        this.mainAction.getComponent(cc.Button).normalSprite = Logic.spriteFrames[resName];
    }

    thirdAction() {
        if(!this.thirdActionTouched){
            this.thirdActionTouched = true;
            cc.director.emit(EventConstant.PLAYER_USEITEM);
        }
    }
    move(event, dir) {
        dir = parseInt(dir);
        cc.director.emit(EventConstant.PLAYER_MOVE, {detail:{ dir }})
    }

    timeDelay = 0;
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }
    thirdTimeDelay = 0;
    isThirdTimeDelay(dt: number): boolean {
        this.thirdTimeDelay += dt;
        if (this.thirdTimeDelay > 0.2) {
            this.thirdTimeDelay = 0;
            this.thirdActionTouched = false;
            return true;
        }
        return false;
    }
    update(dt) {
        this.isThirdTimeDelay(dt);
        if (this.isTimeDelay(dt)) {
            if (this.mainActionTouched) {
                cc.director.emit(EventConstant.PLAYER_ATTACK);
            }
            if (this.secondActionTouched) {
                cc.director.emit(EventConstant.PLAYER_REMOTEATTACK);
            }
        }
    }
}
