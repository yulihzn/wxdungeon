// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator
import { EventHelper } from './EventHelper'
import Logic from './Logic'
import CoolDownView from '../ui/CoolDownView'
import CursorArea from '../ui/CursorArea'

@ccclass
export default class Controller extends cc.Component {
    @property(cc.Node)
    attackAction: cc.Node = null
    attackActionTouched = false
    @property(cc.Node)
    shootAction: cc.Node = null
    shootActionTouched = false
    @property(cc.Node)
    jumpAction: cc.Node = null
    jumpActionTouched = false
    @property(cc.Node)
    dashAction: cc.Node = null
    dashActionTouched = false
    @property(cc.Node)
    interactAction: cc.Node = null
    interactActionTouched = false
    @property(cc.Node)
    interactEmpty: cc.Node = null
    @property(cc.Node)
    interactKey: cc.Node = null
    @property(cc.Node)
    skillAction: cc.Node = null
    @property(cc.Node)
    skillAction1: cc.Node = null
    @property(CoolDownView)
    coolDown: CoolDownView = null
    @property(CoolDownView)
    coolDown1: CoolDownView = null
    skillActionTouched = false
    skillActionTouched1 = false
    @property(cc.Prefab)
    cursorAreaPrefab: cc.Prefab = null
    cursorBackArea: CursorArea
    static mousePos: cc.Vec2

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cursorBackArea = CursorArea.init(this.cursorAreaPrefab)
        this.cursorBackArea.node.parent = this.node
        this.coolDown.init(CoolDownView.PROFESSION)
        this.coolDown1.init(CoolDownView.ORGANIZATION)
        this.attackAction.on(
            cc.Node.EventType.TOUCH_START,
            (event: cc.Event.EventTouch) => {
                this.attackActionTouched = true
            },
            this
        )

        this.attackAction.on(
            cc.Node.EventType.TOUCH_END,
            (event: cc.Event.EventTouch) => {
                this.attackActionTouched = false
            },
            this
        )

        this.attackAction.on(
            cc.Node.EventType.TOUCH_CANCEL,
            (event: cc.Event.EventTouch) => {
                this.attackActionTouched = false
            },
            this
        )
        this.shootAction.on(
            cc.Node.EventType.TOUCH_START,
            (event: cc.Event.EventTouch) => {
                this.shootActionTouched = true
            },
            this
        )

        this.shootAction.on(
            cc.Node.EventType.TOUCH_END,
            (event: cc.Event.EventTouch) => {
                this.shootActionTouched = false
                EventHelper.emit(EventHelper.PLAYER_REMOTEATTACK_CANCEL)
            },
            this
        )

        this.shootAction.on(
            cc.Node.EventType.TOUCH_CANCEL,
            (event: cc.Event.EventTouch) => {
                this.shootActionTouched = false
                EventHelper.emit(EventHelper.PLAYER_REMOTEATTACK_CANCEL)
            },
            this
        )

        this.jumpAction.on(
            cc.Node.EventType.TOUCH_START,
            (event: cc.Event.EventTouch) => {
                this.jumpActionTouched = true
            },
            this
        )

        this.jumpAction.on(
            cc.Node.EventType.TOUCH_END,
            (event: cc.Event.EventTouch) => {
                this.jumpActionTouched = false
                EventHelper.emit(EventHelper.PLAYER_JUMP_CANCEL)
            },
            this
        )

        this.jumpAction.on(
            cc.Node.EventType.TOUCH_CANCEL,
            (event: cc.Event.EventTouch) => {
                this.jumpActionTouched = false
                EventHelper.emit(EventHelper.PLAYER_JUMP_CANCEL)
            },
            this
        )
        this.dashAction.on(
            cc.Node.EventType.TOUCH_START,
            (event: cc.Event.EventTouch) => {
                this.dashActionTouched = true
            },
            this
        )
        this.dashAction.on(
            cc.Node.EventType.TOUCH_END,
            (event: cc.Event.EventTouch) => {
                this.dashActionTouched = false
            },
            this
        )
        this.dashAction.on(
            cc.Node.EventType.TOUCH_CANCEL,
            (event: cc.Event.EventTouch) => {
                this.dashActionTouched = false
            },
            this
        )
        this.skillAction.on(
            cc.Node.EventType.TOUCH_START,
            (event: cc.Event.EventTouch) => {
                this.skillActionTouched = true
            },
            this
        )

        this.skillAction.on(
            cc.Node.EventType.TOUCH_END,
            (event: cc.Event.EventTouch) => {
                this.skillActionTouched = false
            },
            this
        )

        this.skillAction.on(
            cc.Node.EventType.TOUCH_CANCEL,
            (event: cc.Event.EventTouch) => {
                this.skillActionTouched = false
            },
            this
        )
        this.skillAction1.on(
            cc.Node.EventType.TOUCH_START,
            (event: cc.Event.EventTouch) => {
                this.skillActionTouched1 = true
            },
            this
        )

        this.skillAction1.on(
            cc.Node.EventType.TOUCH_END,
            (event: cc.Event.EventTouch) => {
                this.skillActionTouched1 = false
            },
            this
        )

        this.skillAction1.on(
            cc.Node.EventType.TOUCH_CANCEL,
            (event: cc.Event.EventTouch) => {
                this.skillActionTouched1 = false
            },
            this
        )
        let isLongPress = false
        let touchStart = false
        this.interactAction.on(
            cc.Node.EventType.TOUCH_START,
            (event: cc.Event.EventTouch) => {
                this.interactActionTouched = true
                touchStart = true
                this.scheduleOnce(() => {
                    if (!touchStart) {
                        return
                    }
                    isLongPress = true
                    EventHelper.emit(EventHelper.PLAYER_TRIGGER, { isLongPress: true })
                }, 0.3)
            },
            this
        )

        this.interactAction.on(
            cc.Node.EventType.TOUCH_END,
            (event: cc.Event.EventTouch) => {
                this.interactActionTouched = false
                if (!isLongPress) {
                    EventHelper.emit(EventHelper.PLAYER_TRIGGER)
                }
                touchStart = false
                isLongPress = false
            },
            this
        )

        this.interactAction.on(
            cc.Node.EventType.TOUCH_CANCEL,
            (event: cc.Event.EventTouch) => {
                this.interactActionTouched = false
                touchStart = false
                isLongPress = false
            },
            this
        )

        EventHelper.on(EventHelper.HUD_CHANGE_CONTROLLER_SHIELD, detail => {
            if (this.node) this.changeRes(detail.isShield)
        })
        EventHelper.on(EventHelper.HUD_CONTROLLER_UPDATE_GAMEPAD, detail => {
            if (this.node) this.updateGamepad()
        })
        EventHelper.on(EventHelper.HUD_CONTROLLER_INTERACT_SHOW, detail => {
            if (this.node) {
                this.interactAction.active = detail.isShow
                this.interactEmpty.active = !detail.iiShow
                this.interactKey.active = detail.isShow && Controller.isMouseMode()
            }
        })
        EventHelper.on(EventHelper.HUD_CONTROLLER_REMOTE_SHOW, detail => {
            if (this.node) {
                this.shootAction.active = detail.isShow && !Controller.isMouseMode()
            }
        })
        this.cursorBackArea.callback = (type: number, pos: cc.Vec2) => {
            if (!Controller.isMouseMode()) {
                return
            }
            switch (type) {
                case CursorArea.CLICK_LEFT_DOWN:
                    this.attackActionTouched = true
                    break
                case CursorArea.CLICK_RIGHT_DOWN:
                    this.shootActionTouched = true
                    break
                case CursorArea.CLICK_LEFT_UP:
                    this.attackActionTouched = false
                    break
                case CursorArea.CLICK_RIGHT_UP:
                    this.shootActionTouched = false
                    EventHelper.emit(EventHelper.PLAYER_REMOTEATTACK_CANCEL)
                    break
                case CursorArea.MOUSE_MOVE:
                    Controller.mousePos = pos
                    break
                case CursorArea.MOUSE_LEAVE:
                    this.attackActionTouched = false
                    this.shootActionTouched = false
                    break
            }
        }
        this.updateGamepad()
    }
    static isMouseMode() {
        return !cc.sys.isMobile && !Logic.settings.showGamepad
    }
    private updateGamepad() {
        this.attackAction.position = cc.v3(Logic.settings.buttonPosAttack)
        this.shootAction.position = cc.v3(Logic.settings.buttonPosRemote)
        this.jumpAction.position = cc.v3(Logic.settings.buttonPosJump)
        this.dashAction.position = cc.v3(Logic.settings.buttonPosDash)
        this.interactAction.position = cc.v3(Logic.settings.buttonPosInteract)
        this.interactEmpty.position = cc.v3(Logic.settings.buttonPosInteract)
        this.skillAction.position = cc.v3(Logic.settings.buttonPosSkill1)
        this.skillAction1.position = cc.v3(Logic.settings.buttonPosSkill2)
        if (Controller.isMouseMode()) {
            this.attackAction.active = false
            this.shootAction.active = false
            this.jumpAction.active = false
            this.dashAction.active = false
            this.skillAction.active = false
            this.skillAction1.active = false
            this.coolDown.node.position = cc.v3(-100, -80)
            this.coolDown1.node.position = cc.v3(60, -80)
            this.coolDown.changeKeyShow(true)
            this.coolDown1.changeKeyShow(true)
        } else {
            this.attackAction.active = true
            this.shootAction.active = true
            this.jumpAction.active = true
            this.dashAction.active = true
            this.skillAction.active = true
            this.skillAction1.active = true
            this.coolDown.node.position = this.skillAction.position.clone()
            this.coolDown1.node.position = this.skillAction1.position.clone()
            this.coolDown.changeKeyShow(false)
            this.coolDown1.changeKeyShow(false)
        }
    }

    changeRes(isShield: boolean) {
        if (!this.shootAction) {
            return
        }
        let button = this.shootAction.getComponent(cc.Button)
        if (!button) {
            return
        }
        button.normalSprite = Logic.spriteFrameRes(isShield ? 'uishield' : 'uiremote')
        button.pressedSprite = Logic.spriteFrameRes(isShield ? 'uishieldpress' : 'uiremotepress')
        button.hoverSprite = Logic.spriteFrameRes(isShield ? 'uishieldlight' : 'uiremotelight')
        button.disabledSprite = Logic.spriteFrameRes(isShield ? 'uishieldpress' : 'uiremotepress')
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
    private drawSkillCoolDown(coolDown: number, count: number, graphics: cc.Graphics, coolDownFuc: Function, coolDownNode: cc.Node, skillIcon: cc.Sprite, label: cc.Label) {
        if (label) {
            label.string = count > 0 ? `${count}` : ``
        }
        if (coolDown < 0) {
            return
        }
        if (!coolDownNode) {
            return
        }

        if (coolDownFuc) {
            this.unschedule(coolDownFuc)
        }
        if (coolDown == 0) {
            if (graphics) {
                graphics.clear()
            }
        }
        let p = cc.Vec3.ZERO
        let percent = 100
        let delta = 0.1
        //0.5为误差补偿
        let offset = (100 / coolDown) * delta
        coolDownFuc = () => {
            percent -= offset
            if (graphics) {
                graphics.clear()
            }
            this.drawArc((360 * percent) / 100, p, graphics)
            skillIcon.node.opacity = 200
            if (percent < 0) {
                skillIcon.node.opacity = 0
                if (graphics) {
                    graphics.clear()
                }
                this.unschedule(coolDownFuc)
            }
        }
        this.schedule(coolDownFuc, delta, cc.macro.REPEAT_FOREVER)
    }

    // private drawRect(height, center: cc.Vec3) {
    //     this.graphics.fillColor = cc.color(255, 255, 255, 150);
    //     this.graphics.rect(center.x - 32, center.y - 32, 64, height);
    //     this.graphics.fill();
    // }
    private drawArc(angle: number, center: cc.Vec3, graphics: cc.Graphics) {
        if (!graphics) {
            return
        }
        graphics.clear()
        if (angle < 0) {
            return
        }
        let r = 48
        let endAngle = (angle * 2 * Math.PI) / 360
        graphics.arc(center.x, center.y, r, 2 * Math.PI, 2 * Math.PI - endAngle)
        graphics.stroke()
    }
    timeDelay = 0
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt
        if (this.timeDelay > 0.03) {
            this.timeDelay = 0
            return true
        }
        return false
    }
    update(dt) {
        if (this.isTimeDelay(dt) && !Logic.isGamePause) {
            if (this.attackActionTouched) {
                EventHelper.emit(EventHelper.PLAYER_ATTACK)
            }
            if (this.shootActionTouched) {
                EventHelper.emit(EventHelper.PLAYER_REMOTEATTACK)
            }
            if (this.jumpActionTouched) {
                EventHelper.emit(EventHelper.PLAYER_JUMP)
            }
            if (this.dashActionTouched) {
                EventHelper.emit(EventHelper.PLAYER_DASH)
            }
            if (this.skillActionTouched) {
                this.skillActionTouched = false
                EventHelper.emit(EventHelper.PLAYER_SKILL)
            }
            if (this.skillActionTouched1) {
                this.skillActionTouched1 = false
                EventHelper.emit(EventHelper.PLAYER_SKILL1)
            }
        }
    }
}
