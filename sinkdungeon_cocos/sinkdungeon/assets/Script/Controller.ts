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
    attackAction: cc.Node = null;
    attackActionTouched = false;
    @property(cc.Node)
    shootAction: cc.Node = null;
    shootActionTouched = false;

    interactActionTouched = false;
    skillActionTouched = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // let ss = this.node.getComponentsInChildren(cc.Sprite);
        // for (let i = 0; i < ss.length; i++) {
        //     ss[i].spriteFrame.getTexture().setAliasTexParameters();
        // }
        this.attackAction.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) {
            this.attackActionTouched = true;
        }, this)

        this.attackAction.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.attackActionTouched = false;
        }, this)

        this.attackAction.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.attackActionTouched = false;
        }, this)
        this.shootAction.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) {
            this.shootActionTouched = true;
        }, this)

        this.shootAction.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.shootActionTouched = false;
        }, this)

        this.shootAction.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.shootActionTouched = false;
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
        this.attackAction.getComponent(cc.Button).normalSprite = Logic.spriteFrames[resName];
    }
    //button
    interActAction() {
        if(!this.interactActionTouched){
            this.interactActionTouched = true;
            cc.director.emit(EventConstant.PLAYER_USEITEM);
        }
    }
    //button
    skillAction() {
        if(!this.skillActionTouched){
            this.interactActionTouched = true;
            cc.director.emit(EventConstant.PLAYER_SKILL);
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
    interactTimeDelay = 0;
    isInteractTimeDelay(dt: number): boolean {
        this.interactTimeDelay += dt;
        if (this.interactTimeDelay > 0.1) {
            this.interactTimeDelay = 0;
            this.interactActionTouched = false;
            return true;
        }
        return false;
    }
    skillTimeDelay = 0;
    isSkillTimeDelay(dt: number): boolean {
        this.skillTimeDelay += dt;
        if (this.skillTimeDelay > 0.1) {
            this.skillTimeDelay = 0;
            this.skillActionTouched = false;
            return true;
        }
        return false;
    }
    update(dt) {
        this.isInteractTimeDelay(dt);
        this.isSkillTimeDelay(dt);
        if (this.isTimeDelay(dt)) {
            if (this.attackActionTouched) {
                cc.director.emit(EventConstant.PLAYER_ATTACK);
            }
            if (this.shootActionTouched) {
                cc.director.emit(EventConstant.PLAYER_REMOTEATTACK);
            }
        }
    }
}
