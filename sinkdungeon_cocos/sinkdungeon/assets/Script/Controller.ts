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
    @property(cc.Node)
    interactAction: cc.Node = null;
    interactActionTouched = false;
    @property(cc.Node)
    skillAction: cc.Node = null;
    skillActionTouched = false;
    graphics:cc.Graphics = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        this.attackAction.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch)=> {
            this.attackActionTouched = true;
        }, this)

        this.attackAction.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch)=>  {
            this.attackActionTouched = false;
        }, this)

        this.attackAction.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch)=> {
            this.attackActionTouched = false;
        }, this)
        this.shootAction.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch)=> {
            this.shootActionTouched = true;
        }, this)

        this.shootAction.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch)=> {
            this.shootActionTouched = false;
        }, this)

        this.shootAction.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch)=> {
            this.shootActionTouched = false;
        }, this)
        this.interactAction.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch)=> {
            this.interactActionTouched = true;
        }, this)

        this.interactAction.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch)=> {
            this.interactActionTouched = false;
        }, this)

        this.interactAction.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch)=> {
            this.interactActionTouched = false;
        }, this)
        this.skillAction.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch)=> {
            this.skillActionTouched = true;
        }, this)

        this.skillAction.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch)=> {
            this.skillActionTouched = false;
        }, this)

        this.skillAction.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch)=> {
            this.skillActionTouched = false;
        }, this)
        cc.director.on(EventConstant.HUD_DARK_CONTROLLER
            , (event) => { this.changeRes(event.detail.index,false) });
        cc.director.on(EventConstant.HUD_DARK_CONTROLLER
            , (event) => { this.changeRes(event.detail.index,true) });
            cc.director.on(EventConstant.HUD_CONTROLLER_COOLDOWN
                , (event) => { this.drawSkillCoolDown(event.detail.cooldown); });
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

    private drawSkillCoolDown(coolDown:number){
        if(coolDown <= 0){
            return;
        }
        let p = this.skillAction.convertToWorldSpaceAR(cc.Vec2.ZERO);
        p = this.node.convertToNodeSpaceAR(p);
        let angle = 360;
        let delta = 0.016;
        //0.5为误差补偿
        let offset = 360/(coolDown-0.5)*delta;
        let func = ()=>{
            angle-=offset;
            this.drawArc(angle,p);
            if(angle<0){
                if(this.graphics){
                    this.graphics.clear();
                }
                this.unschedule(func);
            }
        }
        this.schedule(func,delta,cc.macro.REPEAT_FOREVER);
    }
    private drawArc(angle:number,center:cc.Vec2){
        if(!this.graphics){
            return;
        }
        this.graphics.clear();
        if(angle<0){
            return;
        }
        let r = 48;
        let startAngle = 0;
        let endAngle = angle*2*Math.PI/360;
        this.graphics.arc(center.x,center.y,r,2*Math.PI,2*Math.PI-endAngle);
        this.graphics.stroke();
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
            //防止反复拾取
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
            if (this.interactActionTouched) {
                cc.director.emit(EventConstant.PLAYER_USEITEM);
            }
            if (this.skillActionTouched) {
                cc.director.emit(EventConstant.PLAYER_SKILL);
            }
        }
    }
}
