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
    onLoad() {
        this.isAutoShow = true
        this.anim = this.getComponent(cc.Animation)
        this.floor = this.node.getChildByName('sprite').getChildByName('floor').getComponent(cc.Sprite)
    }

    start() {
        this.changeRes(this.resName, this.w, this.h)
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
        if (this.isAnimPlaying) {
            return
        }
        this.anim.play('TileBreak')
        this.isBreakingNow = true
        this.isAnimPlaying = true
    }
    showTile() {
        if (this.isAnimPlaying || !this.anim) {
            return
        }
        this.anim.play('TileShow')
        this.isBroken = false
        this.isBreakingNow = false
        this.isAnimPlaying = true
    }

    changeRes(resName: string, width: number, height: number) {
        this.floor.spriteFrame = Logic.spriteFrameRes(resName)
        if (this.floor.spriteFrame == null) {
            this.floor.spriteFrame = Logic.spriteFrameRes(resName)
        }
        this.floor.node.width = 32 * width
        this.floor.node.height = 32 * height
    }
    disappear() {
        cc.tween(this.node)
            .to(0.5 + Random.rand(), { opacity: 0 })
            .start()
    }
}
