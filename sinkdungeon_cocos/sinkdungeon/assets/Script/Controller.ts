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
import { EventHelper } from './EventHelper';
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
    @property(cc.Node)
    skillAction1: cc.Node = null;
    @property(cc.Node)
    coolDown: cc.Node = null;
    @property(cc.Node)
    coolDown1: cc.Node = null;
    skillIcon: cc.Sprite = null;
    skillIcon1: cc.Sprite = null;
    skillActionTouched = false;
    skillActionTouched1 = false;
    graphics: cc.Graphics = null;
    graphics1: cc.Graphics = null;
    coolDownFuc: Function = null;
    coolDownFuc1: Function = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.graphics = this.coolDown.getComponent(cc.Graphics);
        this.graphics1 = this.coolDown1.getComponent(cc.Graphics);
        this.skillIcon = this.coolDown.getChildByName('mask').getChildByName('sprite').getComponent(cc.Sprite);
        this.skillIcon1 = this.coolDown1.getChildByName('mask').getChildByName('sprite').getComponent(cc.Sprite);
        this.skillIcon.spriteFrame = Logic.spriteFrameRes(Logic.playerData.AvatarData.professionData.talent);
        this.attackAction.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.attackActionTouched = true;
        }, this)

        this.attackAction.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.attackActionTouched = false;
        }, this)

        this.attackAction.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.attackActionTouched = false;
        }, this)
        this.shootAction.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.shootActionTouched = true;
        }, this)

        this.shootAction.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.shootActionTouched = false;
            cc.director.emit(EventHelper.PLAYER_REMOTEATTACK_CANCEL);
        }, this)

        this.shootAction.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.shootActionTouched = false;
            cc.director.emit(EventHelper.PLAYER_REMOTEATTACK_CANCEL);
        }, this)

        this.skillAction.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.skillActionTouched = true;
        }, this)

        this.skillAction.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.skillActionTouched = false;
        }, this)

        this.skillAction.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.skillActionTouched = false;
        }, this)
        this.skillAction1.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.skillActionTouched1 = true;
        }, this)

        this.skillAction1.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.skillActionTouched1 = false;
        }, this)

        this.skillAction1.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.skillActionTouched1 = false;
        }, this)
        let isLongPress = false;
        let touchStart = false;
        this.interactAction.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.interactActionTouched = true;
            touchStart = true;
            this.scheduleOnce(() => {
                if (!touchStart) {
                    return;
                }
                isLongPress = true;
                EventHelper.emit(EventHelper.PLAYER_TRIGGER, { isLongPress: true })
            }, 0.3);
        }, this)

        this.interactAction.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.interactActionTouched = false;
            if (!isLongPress) {
                EventHelper.emit(EventHelper.PLAYER_TRIGGER);
            }
            touchStart = false;
            isLongPress = false;
        }, this)

        this.interactAction.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.interactActionTouched = false;
            touchStart = false;
            isLongPress = false;
        }, this)

        cc.director.on(EventHelper.HUD_CHANGE_CONTROLLER_SHIELD
            , (event) => { if (this.node) this.changeRes(event.detail.isShield) });
        cc.director.on(EventHelper.HUD_CONTROLLER_COOLDOWN
            , (event) => { if (this.node) this.drawSkillCoolDown(event.detail.cooldown, this.graphics, this.coolDownFuc, this.coolDown, this.skillIcon); });
        cc.director.on(EventHelper.HUD_CONTROLLER_COOLDOWN1
            , (event) => { if (this.node) this.drawSkillCoolDown(event.detail.cooldown1, this.graphics1, this.coolDownFuc1, this.coolDown1, this.skillIcon1); });
        cc.director.on(EventHelper.HUD_CONTROLLER_UPDATE_GAMEPAD
            , (event) => { if (this.node) this.updateGamepad(); });
        this.updateGamepad();
    }
    private updateGamepad() {
        if (!cc.sys.isMobile && !Logic.settings.showGamepad) {
            this.interactAction.active = false;
            this.attackAction.active = false;
            this.shootAction.active = false;
            this.skillAction.active = false;
            this.skillAction1.active = false;
            this.coolDown.position = cc.v3(0, 180);
            this.coolDown1.position = cc.v3(-96, 180);
        } else {
            this.interactAction.active = true;
            this.attackAction.active = true;
            this.shootAction.active = true;
            this.skillAction.active = true;
            this.skillAction1.active = false;
            this.coolDown.position = this.skillAction.position.clone();
            this.coolDown1.position = this.skillAction1.position.clone();
        }
    }

    changeRes(isShield: boolean) {
        if (!this.shootAction) {
            return;
        }
        let button = this.shootAction.getComponent(cc.Button);
        if (!button) {
            return;
        }
        button.normalSprite = Logic.spriteFrameRes(isShield ? 'uishield' : 'uiremote');
        button.pressedSprite = Logic.spriteFrameRes(isShield ? 'uishieldpress' : 'uiremotepress');
        button.hoverSprite = Logic.spriteFrameRes(isShield ? 'uishieldlight' : 'uiremotelight');
        button.disabledSprite = Logic.spriteFrameRes(isShield ? 'uishieldpress' : 'uiremotepress');
    }
    // private drawSkillCoolDown1(coolDown: number) {
    //     if (coolDown < 0) {
    //         return;
    //     }
    //     if (!this.coolDown) {
    //         return;
    //     }

    //     if(this.coolDownFuc){
    //         this.unschedule(this.coolDownFuc);
    //     }
    //     if (coolDown == 0) {
    //         if (this.graphics) {
    //             this.graphics.clear();
    //         }
    //     }
    //     let p = this.coolDown.convertToWorldSpaceAR(cc.Vec3.ZERO);
    //     p = this.node.convertToNodeSpaceAR(p);
    //     let height = 64;
    //     let delta = 0.1;
    //     //0.5为误差补偿
    //     let offset = 64 / coolDown * delta;
    //     this.coolDownFuc = () => {
    //         height -= offset;
    //         if (this.graphics) {
    //             this.graphics.clear();
    //         }
    //         this.drawRect(height, p);
    //         this.skillIcon.node.opacity = 255;
    //         if (height < 0) {
    //             this.skillIcon.node.opacity = 0;
    //             if (this.graphics) {
    //                 this.graphics.clear();
    //             }
    //             this.unschedule(this.coolDownFuc);
    //         }
    //     }
    //     this.schedule(this.coolDownFuc, delta, cc.macro.REPEAT_FOREVER);
    // }
    private drawSkillCoolDown(coolDown: number, graphics: cc.Graphics, coolDownFuc: Function, coolDownNode: cc.Node, skillIcon: cc.Sprite) {
        if (coolDown < 0) {
            return;
        }
        if (!coolDownNode) {
            return;
        }

        if (coolDownFuc) {
            this.unschedule(coolDownFuc);
        }
        if (coolDown == 0) {
            if (graphics) {
                graphics.clear();
            }
        }
        let p = cc.Vec3.ZERO;
        let percent = 100;
        let delta = 0.1;
        //0.5为误差补偿
        let offset = 100 / coolDown * delta;
        coolDownFuc = () => {
            percent -= offset;
            if (graphics) {
                graphics.clear();
            }
            this.drawArc(360 * percent / 100, p, graphics);
            skillIcon.node.opacity = 200;
            if (percent < 0) {
                skillIcon.node.opacity = 0;
                if (graphics) {
                    graphics.clear();
                }
                this.unschedule(coolDownFuc);
            }
        }
        this.schedule(coolDownFuc, delta, cc.macro.REPEAT_FOREVER);
    }

    // private drawRect(height, center: cc.Vec3) {
    //     this.graphics.fillColor = cc.color(255, 255, 255, 150);
    //     this.graphics.rect(center.x - 32, center.y - 32, 64, height);
    //     this.graphics.fill();
    // }
    private drawArc(angle: number, center: cc.Vec3, graphics: cc.Graphics) {
        if (!graphics) {
            return;
        }
        graphics.clear();
        if (angle < 0) {
            return;
        }
        let r = 48;
        let endAngle = angle * 2 * Math.PI / 360;
        graphics.arc(center.x, center.y, r, 2 * Math.PI, 2 * Math.PI - endAngle);
        graphics.stroke();
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
    update(dt) {
        if (this.isTimeDelay(dt) && !Logic.isGamePause) {
            if (this.attackActionTouched) {
                cc.director.emit(EventHelper.PLAYER_ATTACK);
            }
            if (this.shootActionTouched) {
                cc.director.emit(EventHelper.PLAYER_REMOTEATTACK);
            }
            if (this.skillActionTouched) {
                cc.director.emit(EventHelper.PLAYER_SKILL);
            }
            if (this.skillActionTouched1) {
                cc.director.emit(EventHelper.PLAYER_SKILL1);
            }
        }
    }
}
