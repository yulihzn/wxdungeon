import Random from '../utils/Random'
import Logic from './Logic'

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
export default class Tile extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Label)
    label: cc.Label = null
    isBroken: boolean = false
    isAutoShow = true
    private anim: cc.Animation
    private isAnimPlaying: boolean = false
    //正在瓦解
    isBreakingNow = false
    floor: cc.Sprite
    tileType = '*0000'
    resName = ''
    w = 1
    h = 1
    isWater = false
    rect = cc.rect(0, 0, 128, 128)
    onLoad() {
        this.isAutoShow = true
        this.anim = this.getComponent(cc.Animation)
        this.floor = this.node.getChildByName('sprite').getChildByName('floor').getComponent(cc.Sprite)
    }

    start() {
        this.changeRes(this.resName, this.w, this.h)
        this.rect.x = this.node.position.x
        this.rect.y = this.node.position.y
        this.rect.width = this.floor.node.width * this.floor.node.scale
        this.rect.height = this.floor.node.height * this.floor.node.scale
        if (this.isWater) {
            this.waterIdle()
        }
    }

    //animation
    TileBreak() {
        // this.isBroken = true;
    }
    //animation
    TileBreakFinish() {
        this.isBroken = true
        this.isAnimPlaying = false
        if (this.isAutoShow) {
            this.scheduleOnce(() => {
                this.showTile()
            }, 2)
        }
    }
    //animation
    TileShow() {
        this.isAnimPlaying = false
    }
    breakTile() {
        if (this.isAnimPlaying || this.isWater) {
            return
        }
        this.anim.play('TileBreak')
        this.isBreakingNow = true
        this.isAnimPlaying = true
    }
    showTile() {
        if (this.isAnimPlaying || !this.anim || this.isWater) {
            return
        }
        this.anim.play('TileShow')
        this.isBroken = false
        this.isBreakingNow = false
        this.isAnimPlaying = true
    }
    containsRect(rect: cc.Rect) {
        if (this.rect.containsRect(rect)) {
            return true
        }
        let inrect = cc.rect()
        this.rect.intersection(inrect, rect)
        return inrect.width > rect.width * 0.9 || inrect.height > rect.height * 0.9
    }

    changeRes(resName: string, width: number, height: number) {
        this.floor.spriteFrame = Logic.spriteFrameRes(resName)
        if (this.floor.spriteFrame == null) {
            this.floor.spriteFrame = Logic.spriteFrameRes(resName)
        }
        this.floor.node.width = 32 * width
        this.floor.node.height = 32 * height
    }
    waterIdle() {
        let action = cc
            .tween()
            .delay(0.2)
            .call(() => {
                this.changeRes('wateridle000', this.w, this.h)
            })
            .delay(0.2)
            .call(() => {
                this.changeRes('wateridle001', this.w, this.h)
            })
            .delay(0.2)
            .call(() => {
                this.changeRes('wateridle002', this.w, this.h)
            })
            .delay(0.2)
            .call(() => {
                this.changeRes('wateridle003', this.w, this.h)
            })
        this.floor.node.stopAllActions()
        cc.tween(this.floor.node).repeatForever(action).start()
    }
    disappear() {
        cc.tween(this.node)
            .to(0.5 + Random.rand(), { opacity: 0 })
            .start()
    }
}
