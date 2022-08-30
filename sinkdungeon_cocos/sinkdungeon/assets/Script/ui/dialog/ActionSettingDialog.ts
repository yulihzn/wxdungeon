// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SettingsData from '../../data/SettingsData'
import { EventHelper } from '../../logic/EventHelper'
import Logic from '../../logic/Logic'
import AudioPlayer from '../../utils/AudioPlayer'
import LocalStorage from '../../utils/LocalStorage'
import BaseDialog from './BaseDialog'

const { ccclass, property } = cc._decorator

@ccclass
export default class ActionSettingDialog extends BaseDialog {
    static readonly BUTTON_ATTACK = 0
    static readonly BUTTON_REMOTE = 1
    static readonly BUTTON_JUMP = 2
    static readonly BUTTON_DASH = 3
    static readonly BUTTON_INTERACT = 4
    static readonly BUTTON_SKILL1 = 5
    static readonly BUTTON_SKILL2 = 6
    @property(cc.Node)
    attack: cc.Node = null
    @property(cc.Node)
    remote: cc.Node = null
    @property(cc.Node)
    dash: cc.Node = null
    @property(cc.Node)
    jump: cc.Node = null
    @property(cc.Node)
    interact: cc.Node = null
    @property(cc.Node)
    skill1: cc.Node = null
    @property(cc.Node)
    skill2: cc.Node = null
    @property(cc.Node)
    actions: cc.Node = null
    @property(cc.Node)
    layout: cc.Node = null
    @property(cc.Node)
    equipment: cc.Node = null
    isPressed = false
    pressedIndex = -1
    buttonArr: cc.Node[] = []
    startPos = cc.Vec2.ZERO
    layoutrect: cc.Rect = cc.rect()
    equipmentrect: cc.Rect = cc.rect()
    onLoad() {
        this.setAllPos()
        this.buttonArr.push(this.attack)
        this.buttonArr.push(this.remote)
        this.buttonArr.push(this.dash)
        this.buttonArr.push(this.jump)
        this.buttonArr.push(this.interact)
        this.buttonArr.push(this.skill1)
        this.buttonArr.push(this.skill2)
        this.layoutrect = cc.rect(-this.layout.width / 2, -this.layout.height / 2, this.layout.width, this.layout.height)
        this.equipmentrect = cc.rect(this.equipment.x - this.equipment.width / 2, this.equipment.y - this.equipment.height, this.equipment.width, this.equipment.height)
        this.layout.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.startPos = this.layout.convertToNodeSpaceAR(event.getLocation())
            this.pressedIndex = -1
            for (let i = 0; i < this.buttonArr.length; i++) {
                let btn = this.buttonArr[i]
                let rect = cc.rect(btn.x - btn.width / 2, btn.y - btn.height / 2, btn.width, btn.height)
                if (rect.contains(this.startPos)) {
                    this.pressedIndex = i
                    break
                }
            }
        })
        this.layout.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if (this.pressedIndex > -1 && this.pressedIndex < this.buttonArr.length) {
                let pos = this.layout.convertToNodeSpaceAR(event.getLocation())
                let btn = this.buttonArr[this.pressedIndex]
                let setSuccess = this.checkButtonInRectAndSet(btn, pos)
                if (!setSuccess) {
                    setSuccess = this.checkButtonInRectAndSet(btn, cc.v2(pos.x, btn.y))
                    if (!setSuccess) {
                        setSuccess = this.checkButtonInRectAndSet(btn, cc.v2(btn.x, pos.y))
                    }
                }
            }
        })
    }
    private checkButtonInRectAndSet(btn: cc.Node, pos: cc.Vec2) {
        let rect = cc.rect(pos.x - btn.width / 2, pos.y - btn.height / 2, btn.width, btn.height)
        let setSuccess = this.layoutrect.containsRect(rect) && !this.equipmentrect.intersects(rect) && !this.equipmentrect.containsRect(rect)
        if (setSuccess) {
            btn.position = cc.v3(pos)
        }
        return setSuccess
    }

    start() {}
    private getSettingsButtonPos(settingPos: cc.Vec2) {
        return cc.v3(this.layout.convertToNodeSpaceAR(this.actions.convertToWorldSpaceAR(settingPos)))
    }
    private getSaveButtonPos(buttonPos: cc.Vec3) {
        return cc.v2(this.actions.convertToNodeSpaceAR(this.layout.convertToWorldSpaceAR(buttonPos)))
    }

    show() {
        super.show()
        this.setAllPos()
    }
    private setAllPos() {
        this.attack.position = this.getSettingsButtonPos(Logic.settings.buttonPosAttack)
        this.remote.position = this.getSettingsButtonPos(Logic.settings.buttonPosRemote)
        this.dash.position = this.getSettingsButtonPos(Logic.settings.buttonPosDash)
        this.jump.position = this.getSettingsButtonPos(Logic.settings.buttonPosJump)
        this.interact.position = this.getSettingsButtonPos(Logic.settings.buttonPosInteract)
        this.skill1.position = this.getSettingsButtonPos(Logic.settings.buttonPosSkill1)
        this.skill2.position = this.getSettingsButtonPos(Logic.settings.buttonPosSkill2)
    }

    close() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.dismiss()
    }
    save() {
        AudioPlayer.play(AudioPlayer.SELECT)
        Logic.settings.buttonPosAttack = this.getSaveButtonPos(this.attack.position)
        Logic.settings.buttonPosRemote = this.getSaveButtonPos(this.remote.position)
        Logic.settings.buttonPosJump = this.getSaveButtonPos(this.jump.position)
        Logic.settings.buttonPosDash = this.getSaveButtonPos(this.dash.position)
        Logic.settings.buttonPosInteract = this.getSaveButtonPos(this.interact.position)
        Logic.settings.buttonPosSkill1 = this.getSaveButtonPos(this.skill1.position)
        Logic.settings.buttonPosSkill2 = this.getSaveButtonPos(this.skill2.position)
        LocalStorage.saveSystemSettings(Logic.settings)
        EventHelper.emit(EventHelper.HUD_CONTROLLER_UPDATE_GAMEPAD)
        this.dismiss()
    }
    reset() {
        this.attack.position = this.getSettingsButtonPos(SettingsData.BPA)
        this.remote.position = this.getSettingsButtonPos(SettingsData.BPR)
        this.dash.position = this.getSettingsButtonPos(SettingsData.BPD)
        this.jump.position = this.getSettingsButtonPos(SettingsData.BPJ)
        this.interact.position = this.getSettingsButtonPos(SettingsData.BPI)
        this.skill1.position = this.getSettingsButtonPos(SettingsData.BPS1)
        this.skill2.position = this.getSettingsButtonPos(SettingsData.BPS2)
        AudioPlayer.play(AudioPlayer.SELECT)
    }
}
