import { EventHelper } from './../logic/EventHelper'
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemData from '../data/ItemData'
import AudioPlayer from '../utils/AudioPlayer'
import Random from '../utils/Random'
import Logic from '../logic/Logic'

const { ccclass, property } = cc._decorator

@ccclass
export default class Doll extends cc.Component {
    static readonly RECT = cc.rect(0, 0, 100, 100)
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    isAniming = false
    isGrabing = false
    data: ItemData = new ItemData()
    clawNode: cc.Node
    grabed(claw: cc.Node) {
        if (this.isAniming) {
            return
        }
        this.clawNode = claw
        this.node.zIndex = 100
        this.isAniming = true
        this.isGrabing = true
    }
    init(data: ItemData) {
        if (!data) {
            return this
        }
        this.data.valueCopy(data)
        this.sprite.spriteFrame = Logic.spriteFrameRes(data.resName)
        return this
    }
    drop(hookPosY: number) {
        this.isGrabing = false
        if (Doll.RECT.contains(cc.v2(cc.v3(this.node.position.x, hookPosY)))) {
            cc.tween(this.node)
                .to(0.5, { y: hookPosY })
                .to(0.5, { y: -100 })
                .call(() => {
                    AudioPlayer.play(AudioPlayer.DOLLDOWN)
                    this.addItem()
                })
                .start()
        } else {
            cc.tween(this.node)
                .to(0.5, { y: hookPosY })
                .call(() => {
                    this.isAniming = false
                    cc.tween(this.sprite.node)
                        .to(0.3, { angle: Random.getRandomNum(-30, 30) })
                        .start()
                })
                .start()
        }
    }
    addItem() {
        AudioPlayer.play(AudioPlayer.CASHIERING)
        EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemData: this.data })
    }
    protected update(dt: number): void {
        if (this.clawNode && this.isGrabing) {
            let wp = this.clawNode.convertToWorldSpaceAR(cc.v3(0, -16))
            this.node.position = this.node.parent.convertToNodeSpaceAR(wp)
        }
    }
}
