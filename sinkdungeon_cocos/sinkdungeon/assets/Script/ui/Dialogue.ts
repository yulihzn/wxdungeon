// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import DialogueData from '../data/DialogueData'
import DialogueTextData from '../data/DialogueTextData'
import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import AudioPlayer from '../utils/AudioPlayer'

const { ccclass, property } = cc._decorator

@ccclass
export default class Dialogue extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null
    @property(cc.Node)
    next: cc.Node = null
    @property(cc.Node)
    topbg: cc.Node = null
    @property(cc.Node)
    bottombg: cc.Node = null
    @property(cc.Sprite)
    avatarSprite: cc.Sprite = null
    @property(cc.Node)
    buttonLayout: cc.Node = null
    @property(cc.Button)
    button0: cc.Button = null
    @property(cc.Button)
    button1: cc.Button = null
    @property(cc.Button)
    button2: cc.Button = null
    @property(cc.Button)
    button3: cc.Button = null
    @property(cc.Label)
    nameLabel: cc.Label = null
    anim: cc.Animation = null
    data: DialogueData = new DialogueData()
    currentTextIndex: number = 0
    isShow = false
    isAniming = false
    isTalking = false
    buttons = []
    static callbacks: Map<String, Function> = new Map()
    onLoad() {
        this.buttons = [this.button0, this.button1, this.button2, this.button3]
        EventHelper.on(EventHelper.HUD_DIALOGUE_SHOW, detail => {
            if (this.node) {
                this.show(detail.data)
            }
        })
        EventHelper.on(EventHelper.HUD_DIALOGUE_SKIP, detail => {
            if (this.node) {
                this.tap()
            }
        })
        EventHelper.on(EventHelper.HUD_DIALOGUE_BUTTON, detail => {
            if (this.node) {
                this.buttonTap(null, detail.index)
            }
        })
        this.node.active = false
        this.anim = this.getComponent(cc.Animation)
        this.addTapListener(this.node)
        let pos = this.next.position.clone()
        cc.tween(this.next)
            .repeatForever(
                cc
                    .tween(this.next)
                    .to(0.5, { y: pos.y - 10 })
                    .to(0.5, { y: pos.y })
            )
            .start()
    }
    static play(id: string, callback?: Function) {
        EventHelper.emit(EventHelper.HUD_DIALOGUE_SHOW, { data: Logic.dialogues[id] })
        if (callback) {
            Dialogue.callbacks.set(id, callback)
        }
    }
    private addTapListener(node: cc.Node) {
        node.on(
            cc.Node.EventType.TOUCH_END,
            (event: cc.Event.EventTouch) => {
                this.tap()
            },
            this
        )
    }
    private show(data: DialogueData) {
        this.anim.stop()
        this.resetUi()
        this.node.active = true
        this.data.valueCopy(data)
        this.isAniming = true
        this.isShow = true
        this.anim.play('DialogueShow')
    }
    private hide() {
        this.isShow = false
        this.isAniming = true
        this.label.node.opacity = 0
        this.anim.play('DialogueHide')
    }
    //Event
    buttonTap(event, index: string) {
        if (!this.buttons[parseInt(index)].node.active) {
            return
        }
        AudioPlayer.play(AudioPlayer.SELECT)
        this.goNext(parseInt(index))
    }
    //Anim
    ShowFinish() {
        this.isAniming = false
        this.playDialogue()
    }
    //Anim
    HideFinish() {
        this.isAniming = false
        this.node.active = false
    }
    private hasButton() {
        return this.button0.node.active || this.button1.node.active || this.button2.node.active || this.button3.node.active
    }
    private goNext(index: number) {
        let current = this.data.list[this.currentTextIndex]
        if (current.next.length > index) {
            this.currentTextIndex = current.next[index].id
        }
        if (this.currentTextIndex > this.data.list.length - 1) {
            this.hide()
            let callback = Dialogue.callbacks.get(this.data.id)
            if (callback) {
                callback()
                Dialogue.callbacks.delete(this.data.id)
            }
            return
        }
        this.updateUi()
    }
    private tap() {
        if (!this.isShow || this.isAniming || this.hasButton()) {
            return
        }
        if (this.isTalking) {
            this.isTalking = false
            this.label.node.stopAllActions()
            let current = this.data.list[this.currentTextIndex]
            this.label.string = current.text
            return
        }
        this.goNext(0)
    }
    private playDialogue() {
        //如果列表长度为0退出对话
        if (this.data.list.length > 0) {
            this.currentTextIndex = 0
            this.updateUi()
        } else {
            this.hide()
        }
    }
    private resetUi() {
        this.nameLabel.string = ''
        this.avatarSprite.spriteFrame = null
        this.label.string = ''
        this.next.opacity = 0
        for (let i = 0; i < this.buttons.length; i++) {
            this.updateButton(this.buttons[i], i)
        }
    }
    private updateUi() {
        if (this.currentTextIndex > this.data.list.length - 1) {
            return
        }
        if (this.currentTextIndex < 0) {
            this.hide()
        }
        let current = this.data.list[this.currentTextIndex]
        this.nameLabel.string = this.data.actors[current.actor].name
        this.avatarSprite.spriteFrame = Logic.spriteFrameRes(this.data.actors[current.actor].resName)

        this.next.opacity = current.next.length == 1 && (!current.next[0].text || current.next[0].text.length == 0) ? 255 : 0
        for (let i = 0; i < this.buttons.length; i++) {
            this.updateButton(this.buttons[i], i, current)
        }
        this.updateLabel(current.text, this.data.isTalk)
    }
    private updateButton(button: cc.Button, index: number, current?: DialogueTextData) {
        if (!current || current.next.length - 1 < index) {
            button.node.active = false
            return
        }
        button.node.active = current.next[index].text && current.next[index].text.length > 0
        button.getComponentInChildren(cc.Label).string = current.next[index].text
    }
    private updateLabel(text: string, isTalk: boolean) {
        if (!isTalk) {
            cc.tween(this.label.node)
                .to(0.2, { opacity: 0 })
                .call(() => {
                    this.label.string = text
                })
                .to(0.2, { opacity: 255 })
                .start()
        } else {
            this.isTalking = true
            let index = 0
            let talktween = cc
                .tween()
                .delay(0.04)
                .call(() => {
                    this.label.string = text.substring(0, ++index)
                })
            cc.tween(this.label.node)
                .to(0.2, { opacity: 0 })
                .call(() => {
                    this.label.string = ''
                })
                .to(0.2, { opacity: 255 })
                .repeat(text.length, talktween)
                .call(() => {
                    this.isTalking = false
                })
                .start()
        }
    }
}
