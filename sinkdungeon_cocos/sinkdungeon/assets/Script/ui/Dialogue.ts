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
    onLoad() {
        EventHelper.on(EventHelper.HUD_DIALOGUE_SHOW, detail => {
            if (this.node) {
                this.show(detail.data)
            }
        })
        this.node.active = false
        this.anim = this.getComponent(cc.Animation)
        this.addTapListener(this.next)
        this.addTapListener(this.label.node)
    }
    static play(id: string) {
        EventHelper.emit(EventHelper.HUD_DIALOGUE_SHOW, { data: Logic.dialogues[id] })
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
        this.anim.play('DialogueHide')
    }
    //Event
    buttonTap(event, index: string) {
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
            return
        }
        this.updateUi()
    }
    private tap() {
        if (!this.isShow || this.isAniming || this.hasButton()) {
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
        this.next.active = false
        this.updateButton(this.button0, 0)
        this.updateButton(this.button1, 1)
        this.updateButton(this.button2, 2)
        this.updateButton(this.button3, 3)
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

        this.next.active = current.next.length == 1 && (!current.next[0].text || current.next[0].text.length == 0)
        this.updateButton(this.button0, 0, current)
        this.updateButton(this.button1, 1, current)
        this.updateButton(this.button2, 2, current)
        this.updateButton(this.button3, 3, current)
        cc.tween(this.label.node)
            .to(0.2, { opacity: 0 })
            .call(() => {
                this.label.string = current.text
            })
            .to(0.2, { opacity: 255 })
            .start()
    }
    private updateButton(button: cc.Button, index: number, current?: DialogueTextData) {
        if (!current || current.next.length - 1 < index) {
            button.node.active = false
            return
        }
        button.node.active = current.next[index].text && current.next[index].text.length > 0
        button.getComponentInChildren(cc.Label).string = current.next[index].text
    }
    showToast(msg: string, isCenter: boolean, isTap: boolean) {
        if (msg.length < 1) {
            return
        }
        this.label.node.width = isCenter ? 300 : 600
        let node = this.node
        node.stopAllActions()
        let delay = 3
        if (isTap) {
            delay = 0.07 * msg.length
            if (delay < 3) {
                delay = 3
            }
            let count = 0
            this.schedule(
                () => {
                    this.label.string = `${msg.substr(0, count++)}`
                    node.width = this.label.node.width + 10
                    node.height = this.label.node.height + 10
                    node.opacity = 255
                    node.active = true
                },
                0.05,
                msg.length,
                0.3
            )
        } else {
            this.scheduleOnce(() => {
                this.label.string = `${msg}`
                node.width = this.label.node.width + 10
                node.height = this.label.node.height + 10
                node.opacity = 255
                node.active = true
            }, 0.05)
        }

        let y = isCenter ? 360 : 100
        node.y = y - 100
        node.scale = 0
        cc.tween(node)
            .to(0.1, { scaleX: 1 })
            .to(0.1, { scaleY: 1 })
            .to(0.2, { y: y })
            .delay(delay)
            .call(() => {
                cc.tween(node)
                    .to(0.1, { scaleY: 0.1 })
                    .to(0.1, { scaleX: 0 })
                    .to(0.1, { opacity: 0 })
                    .call(() => {
                        node.active = false
                    })
                    .start()
            })
            .start()
    }
}
