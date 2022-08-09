// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dungeon from '../logic/Dungeon'
import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import AudioPlayer from '../utils/AudioPlayer'
import IndexZ from '../utils/IndexZ'
import Utils from '../utils/Utils'

const { ccclass, property } = cc._decorator

@ccclass
export default class ReflectLight extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    root: cc.Node = null
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    show(dungeon: Dungeon, position: cc.Vec3, isFar: boolean, isStab: boolean, isWall: boolean, hv: cc.Vec2, color: cc.Color) {
        this.node.parent = dungeon.node
        this.node.position = position.clone()
        this.node.zIndex = IndexZ.OVERHEAD
        let fix = ''
        if (isWall) {
            fix = 'wall'
            AudioPlayer.play(Logic.getHalfChance() ? AudioPlayer.MELEE_REFLECT_WALL : AudioPlayer.MELEE_REFLECT_WALL1)
        } else if (isFar) {
            fix = 'far'
        } else if (isStab) {
            fix = 'stab'
        }
        let direction = hv.clone()
        if (isWall) {
            direction = cc.v2(-hv.x, -hv.y)
        } else {
            AudioPlayer.play(Logic.getHalfChance() ? AudioPlayer.MELEE_REFLECT : AudioPlayer.MELEE_REFLECT1)
        }
        this.sprite.node.color = color
        this.root.angle = Utils.getRotateAngle(direction)
        this.sprite.spriteFrame = null
        let name = `weaponreflectlight${fix}anim00`
        cc.tween(this.sprite.node)
            .call(() => {
                this.sprite.spriteFrame = Logic.spriteFrameRes(`${name}0`)
            })
            .delay(0.1)
            .call(() => {
                this.sprite.spriteFrame = Logic.spriteFrameRes(`${name}1`)
            })
            .delay(0.1)
            .call(() => {
                this.sprite.spriteFrame = Logic.spriteFrameRes(`${name}2`)
            })
            .delay(0.1)
            .call(() => {
                this.sprite.spriteFrame = Logic.spriteFrameRes(`${name}3`)
            })
            .delay(0.1)
            .call(() => {
                this.node.destroy()
            })
            .start()
    }

    // update (dt) {}
}
