// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from '../../logic/Logic'
import AudioPlayer from '../../utils/AudioPlayer'
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
    onLoad() {
        Logic.settings
    }

    start() {
        this.attack.position = this.getButtonPos(Logic.settings.buttonPosAttack)
        this.remote.position = this.getButtonPos(Logic.settings.buttonPosRemote)
        this.dash.position = this.getButtonPos(Logic.settings.buttonPosDash)
        this.jump.position = this.getButtonPos(Logic.settings.buttonPosJump)
        this.interact.position = this.getButtonPos(Logic.settings.buttonPosInteract)
        this.skill1.position = this.getButtonPos(Logic.settings.buttonPosSkill1)
        this.skill2.position = this.getButtonPos(Logic.settings.buttonPosSkill2)
    }
    private getButtonPos(settingPos: cc.Vec2) {
        return cc.v3(this.layout.convertToNodeSpaceAR(this.actions.convertToWorldSpaceAR(settingPos)))
    }
    show() {
        super.show()
        this.layout.parent.on(cc.Node.EventType.TOUCH_START, () => {})
        this.layout.parent.on(cc.Node.EventType.TOUCH_END, () => {})
        this.layout.parent.on(cc.Node.EventType.TOUCH_CANCEL, () => {})
    }

    close() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.dismiss()
    }
    save() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.dismiss()
    }
    reset() {
        AudioPlayer.play(AudioPlayer.SELECT)
    }
}
