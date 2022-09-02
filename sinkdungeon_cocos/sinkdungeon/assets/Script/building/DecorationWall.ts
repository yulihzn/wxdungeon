import Building from './Building'
import Logic from '../logic/Logic'

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

@ccclass
export default class DecorationWall extends Building {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    mapStr: string

    init(mapStr: string) {
        this.entity.destroy()
        this.mapStr = mapStr
        let letter = mapStr[1]
        let resName = `walldecoration_0_${letter}`
        let spriteframe = Logic.spriteFrameRes(resName)
        if (spriteframe) {
            let arr = resName.split('_')
            if (arr.length > 1) {
                let scale = parseInt(arr[1])
                if (!isNaN(scale)) {
                    this.sprite.node.scale = scale > 0 ? scale : 1
                }
            }
            this.sprite.spriteFrame = spriteframe
            this.sprite.node.width = spriteframe.getRect().width
            this.sprite.node.height = spriteframe.getRect().height
        }
    }
}
