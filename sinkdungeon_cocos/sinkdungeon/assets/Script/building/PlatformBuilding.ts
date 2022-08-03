// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Building from './Building'
import PlatformData from '../data/PlatformData'
import Logic from '../logic/Logic'
import CCollider from '../collider/CCollider'

const { ccclass, property } = cc._decorator

@ccclass
export default class PlatformBuilding extends Building {
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    shadow: cc.Node = null
    private platformData: PlatformData = new PlatformData()
    // LIFE-CYCLE CALLBACKS:

    init(mapDataStr: string) {
        let resName = `platform${mapDataStr.substring(1)}`
        this.platformData.valueCopy(Logic.platforms[resName])
        if (!this.platformData.custom) {
            let pcollider = this.getComponent(CCollider)
            if (this.platformData.collider.length > 0) {
                let arr = this.platformData.collider.split(',')
                pcollider.offset = cc.v2(parseInt(arr[0]), parseInt(arr[1]))
                pcollider.setSize(cc.size(parseInt(arr[2]), parseInt(arr[3])), parseInt(arr[4]))
                this.shadow.width = pcollider.w
                this.shadow.height = pcollider.h
                this.shadow.x = pcollider.offsetX
                this.shadow.y = pcollider.offsetY
            }
            if (this.platformData.spritePos.length > 0) {
                let arr = this.platformData.spritePos.split(',')
                this.sprite.node.x = parseInt(arr[0])
                this.sprite.node.y = parseInt(arr[1])
            }
            let spriteFrame = Logic.spriteFrameRes(resName)
            this.sprite.spriteFrame = spriteFrame
            this.sprite.node.width = spriteFrame.getOriginalSize().width
            this.sprite.node.height = spriteFrame.getOriginalSize().height
            this.sprite.node.scale = this.platformData.scale

            if (this.platformData.z != 0) {
                this.root.y = this.platformData.z
                this.entity.Transform.z = this.platformData.z - pcollider.offsetY
            } else {
                this.root.y = 0
                this.entity.Transform.z = 0
            }
            this.entity.Move.gravity = 0
        }
    }

    // update (dt) {}
}
