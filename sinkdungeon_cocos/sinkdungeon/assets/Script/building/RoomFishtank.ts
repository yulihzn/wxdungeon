// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dungeon from '../logic/Dungeon'
import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import Player from '../logic/Player'
import LoadingManager from '../manager/LoadingManager'
import NonPlayerManager from '../manager/NonPlayerManager'
import AudioPlayer from '../utils/AudioPlayer'
import Utils from '../utils/Utils'
import Furniture from './Furniture'

const { ccclass, property } = cc._decorator

@ccclass
export default class RoomFishtank extends cc.Component {
    @property(cc.Node)
    fish: cc.Node = null
    @property(cc.Prefab)
    food: cc.Prefab = null
    @property(cc.Node)
    layout: cc.Node = null
    isFeeding = false
    foodList: cc.Node[] = []
    fishSprite: cc.Sprite
    isFirst = true
    showAudio = false
    dungeon: Dungeon

    onLoad() {
        this.fishSprite = this.fish.getChildByName('sprite').getComponent(cc.Sprite)
        this.fishIdle()
        this.fishMove()
        LoadingManager.loadNpcSpriteAtlas(NonPlayerManager.FISH)
    }
    init(dungeon: Dungeon) {
        this.dungeon = dungeon
    }
    zoomCamera(zoomIn: boolean) {
        if (this.isFirst) {
            return
        }
        if (zoomIn) {
            this.showAudio = true
            if (this.dungeon) {
                this.dungeon.cameraTargetActor = this.node.getComponent(Furniture)
            }
        } else {
            this.showAudio = false
            if (this.dungeon) {
                this.dungeon.cameraTargetActor = this.dungeon.player
            }
        }
        EventHelper.emit(zoomIn ? EventHelper.HUD_CAMERA_ZOOM_IN : EventHelper.HUD_CAMERA_ZOOM_OUT)
    }

    feed(player: Player) {
        if (this.isFeeding) {
            return
        }
        if (this.foodList.length > 50) {
            Utils.toast('喂得太多了啊！')
            return
        }
        if (player) {
            player.sanityChange(1)
        }
        this.isFirst = false
        this.zoomCamera(true)
        for (let i = 0; i < 5; i++) {
            this.initFood()
        }
        this.isFeeding = true
        this.unscheduleAllCallbacks()
        AudioPlayer.play(AudioPlayer.FEED_FISH)
        this.scheduleOnce(() => {
            this.isFeeding = false
        }, 2)
    }
    private initFood() {
        let food = cc.instantiate(this.food)
        food.parent = this.layout
        let width = this.layout.width
        let height = this.layout.height
        let startPos = cc.v3(Logic.getRandomNum(food.width / 2, width - food.width / 2 - this.fish.width * this.fish.anchorX), Logic.getRandomNum(height, height * 1.5))
        let endPos = cc.v3(startPos.x, Logic.getRandomNum(food.height / 2 + this.fish.height * this.fish.anchorY, height / 2))
        food.position = startPos
        let duration = Logic.getRandomNum(700, 1000) / 1000
        cc.tween(food)
            .call(() => {
                this.scheduleOnce(() => {
                    this.foodList.push(food)
                }, duration / 2)
            })
            .to(duration, { position: endPos })
            .start()
    }
    private changeFishRes(resName: string, suffix?: string): void {
        let spriteFrame = Logic.spriteFrameRes(resName + suffix)
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(resName)
        }
        this.fishSprite.spriteFrame = spriteFrame
    }
    private fishIdle() {
        let action = cc
            .tween()
            .delay(0.2)
            .call(() => {
                this.changeFishRes('nonplayer102anim002')
            })
            .delay(0.2)
            .call(() => {
                this.changeFishRes('nonplayer102anim003')
            })
            .delay(0.2)
            .call(() => {
                this.changeFishRes('nonplayer102anim004')
            })
            .delay(0.2)
            .call(() => {
                this.changeFishRes('nonplayer102anim005')
            })
        this.fishSprite.node.stopAllActions()
        cc.tween(this.fishSprite.node).repeatForever(action).start()
    }
    private fishEat(index: number) {
        this.fishSprite.node.stopAllActions()
        cc.tween(this.fishSprite.node)
            .delay(0.2)
            .call(() => {
                this.changeFishRes('nonplayer102anim010')
                if (index >= 0 && index < this.foodList.length && this.foodList[index].isValid) {
                    this.foodList[index].active = false
                    this.foodList[index].destroy()
                    this.foodList.splice(index, 1)
                }
            })
            .delay(0.2)
            .call(() => {
                this.changeFishRes('nonplayer102anim009')
            })
            .delay(0.2)
            .call(() => {
                this.fishIdle()
                if (this.foodList.length > 0) {
                    this.fishSearch()
                } else {
                    this.fishMove()
                }
            })
            .start()
    }
    private fishSearch() {
        this.bubbleSort()
        let targetPos = this.foodList[0].position.clone()
        let scaleX = targetPos.x > this.fish.position.x ? 1 : -1
        let distance = Logic.getDistanceNoSqrt(this.fish.position, targetPos)
        cc.tween(this.fish)
            .to(0.2, { scaleX: scaleX })
            .to(distance / 10, { position: targetPos })
            .call(() => {
                this.fishEat(0)
            })
            .start()
    }
    private fishMove() {
        let width = this.layout.width
        let height = this.layout.height
        let randomPos = cc.v3(Logic.getRandomNum(this.fish.width / 2, width - this.fish.width / 2), Logic.getRandomNum(this.fish.height / 2, height - this.fish.height / 2))
        let scaleX = randomPos.x > this.fish.position.x ? 1 : -1
        let distance = Logic.getDistanceNoSqrt(this.fish.position, randomPos)
        cc.tween(this.fish)
            .to(0.2, { scaleX: scaleX })
            .to(distance / 5, { position: randomPos })
            .delay(0.5)
            .call(() => {
                if (this.foodList.length > 0) {
                    this.fishSearch()
                } else {
                    this.fishMove()
                }
            })
            .start()
    }

    bubbleSort() {
        var len = this.foodList.length
        for (var i = 0; i < len - 1; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
                if (Math.abs(this.foodList[j].x - this.fish.x) > Math.abs(this.foodList[j + 1].x - this.fish.x)) {
                    var temp = this.foodList[j + 1]
                    this.foodList[j + 1] = this.foodList[j]
                    this.foodList[j] = temp
                }
            }
        }
    }
    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 5) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    update(dt: number) {
        if (this.showAudio && this.isCheckTimeDelay(dt)) {
            AudioPlayer.play(AudioPlayer.FISHTANK)
        }
    }
}
