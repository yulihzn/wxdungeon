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
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite)
    }

    start() {}
    show(resName: string) {
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

    public updateLogic(data: NonPlayerData) {
        if (this.node && this.node.isValid) {
            if (data.currentHealth <= 0) {
                this.hide()
            }
        }
    }
    // update (dt) {}
}
