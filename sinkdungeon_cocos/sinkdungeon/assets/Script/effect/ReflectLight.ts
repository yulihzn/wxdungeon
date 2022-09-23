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
    static readonly AUDIO_TYPE_MELEE = 0
    static readonly AUDIO_TYPE_METAL = 1
    static readonly AUDIO_TYPE_WOOD = 2
    static readonly AUDIOS_MELEE = [AudioPlayer.MELEE_REFLECT, AudioPlayer.MELEE_REFLECT1]
    static readonly AUDIOS_WOOD = [AudioPlayer.MELEE_REFLECT_WOOD1, AudioPlayer.MELEE_REFLECT_WOOD2, AudioPlayer.MELEE_REFLECT_WOOD3]
    static readonly AUDIOS_METAL = [AudioPlayer.MELEE_REFLECT_WALL, AudioPlayer.MELEE_REFLECT_WALL1]
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    root: cc.Node = null
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    show(dungeon: Dungeon, position: cc.Vec3, isFar: boolean, isStab: boolean, isWall: boolean, hv: cc.Vec2, color: cc.Color, audioType: number) {
        this.node.parent = dungeon.node
        this.node.position = position.clone()
        this.node.zIndex = IndexZ.OVERHEAD
        let audios = ReflectLight.AUDIOS_MELEE
        switch (audioType) {
            case ReflectLight.AUDIO_TYPE_METAL:
                audios = ReflectLight.AUDIOS_METAL
                break
            case ReflectLight.AUDIO_TYPE_WOOD:
                audios = ReflectLight.AUDIOS_WOOD
                break
        }
        let audioIndex = Logic.getRandomNum(0, audios.length - 1)
        let fix = ''
        if (isWall) {
            fix = 'wall'
            AudioPlayer.play(audios[audioIndex])
        } else if (isFar) {
            fix = 'far'
        } else if (isStab) {
            fix = 'stab'
        }
        let direction = hv.clone()
        if (isWall) {
            direction = cc.v2(-hv.x, -hv.y)
        } else {
            AudioPlayer.play(audios[audioIndex])
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
