// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from '../logic/EventHelper'

const { ccclass, property } = cc._decorator
class Message {
    msg: string
    isCenter: boolean
    isTap: boolean
    constructor(msg: string, isCenter: boolean, isTap: boolean) {
        this.msg = msg
        this.isCenter = isCenter
        this.isTap = isTap
    }
}
@ccclass
export default class Toast extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null
    messgeQueue: Message[] = []
    isShowing = false
    onLoad() {
        EventHelper.on(EventHelper.HUD_TOAST, detail => {
            if (this.node) {
                this.addToast(detail.msg, detail.isCenter, detail.isTap)
            }
        })
    }
    private addToast(msg: string, isCenter: boolean, isTap: boolean) {
        if (msg.length < 1) {
            return
        }
        let isSame = false
        if (this.messgeQueue.length > 0 && msg == this.messgeQueue[this.messgeQueue.length - 1].msg) {
            isSame = true
        }
        if (!isSame) {
            this.messgeQueue.splice(0, 0, new Message(msg, isCenter, isTap))
        }
    }
    private showToast(msg: string, isCenter: boolean, isTap: boolean) {
        if (msg.length < 1) {
            return
        }
        this.isShowing = true
        this.label.node.width = isCenter ? 400 : 400
        let node = this.node
        node.stopAllActions()
        let delay = 3
        if (isTap) {
            delay = 0.06 * msg.length
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
                },
                0.03,
                msg.length,
                0.3
            )
        } else {
            this.scheduleOnce(() => {
                this.label.string = `${msg}`
                node.width = this.label.node.width + 10
                node.height = this.label.node.height + 10
                node.opacity = 255
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
            .to(0.1, { scaleY: 0.1 })
            .to(0.1, { scaleX: 0 })
            .to(0.1, { opacity: 0 })
            .call(() => {
                this.isShowing = false
            })
            .start()
    }

    protected update(dt: number): void {
        if (!this.isShowing && this.messgeQueue.length > 0) {
            let message = this.messgeQueue.pop()
            this.showToast(message.msg, message.isCenter, message.isTap)
        }
    }
}
