// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import NonPlayerData from '../data/NonPlayerData'
import Logic from '../logic/Logic'

const { ccclass, property } = cc._decorator

@ccclass
export default class ActorIcon extends cc.Component {
    sprite: cc.Sprite = null
    isKilled = false
    isListItem = true
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite)
    }

    start() {}
    show(resName: string, isListItem: boolean) {
        this.isListItem = isListItem
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite)
        let sp = Logic.spriteFrameRes('monstericon')
        let unit = 8
        let rect = sp.getRect()
        let sf1 = sp.clone()
        let index = parseInt(resName.substring('monster'.length))
        sf1.setRect(cc.rect(rect.x + unit * index, rect.y, unit, unit))
        this.sprite.trim = true
        this.sprite.spriteFrame = sf1
        this.sprite.node.width = 32
        this.sprite.node.height = 32
    }
    hide() {
        if (!this.node || this.isKilled) {
            return
        }
        this.isKilled = true
        cc.tween(this.sprite.node)
            .to(0.3, { scale: 1.5, opacity: 0 })
            .call(() => {
                this.node.destroy()
            })
            .start()
    }

    public updateLogic(data: NonPlayerData, pos: cc.Vec2) {
        if (this.node && this.node.isValid) {
            if (data.currentHealth <= 0) {
                this.hide()
            }
        }
        if (!this.isListItem) {
            let p = this.node.parent.convertToNodeSpaceAR(pos)
            let pw = this.node.parent.width / 2
            let ph = this.node.parent.height / 2
            let w = this.node.width / 2
            let h = this.node.height / 2
            let x = p.x
            let y = p.y
            let isOut = false
            if (x > pw) {
                x = pw - w
                isOut = true
            }
            if (x < -pw) {
                x = -pw + w
                isOut = true
            }
            if (y > ph) {
                y = ph - h
                isOut = true
            }
            if (y < -ph) {
                y = -ph + h
                isOut = true
            }
            this.sprite.node.position = cc.v3(x, y)
            this.sprite.node.opacity = isOut ? 255 : 0
        }
    }
    // update (dt) {}
}
