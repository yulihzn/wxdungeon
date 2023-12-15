// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Building from './Building'
import Logic from '../logic/Logic'
import CCollider from '../collider/CCollider'
import Dungeon from '../logic/Dungeon'
import IndexZ from '../utils/IndexZ'
import { EventHelper } from '../logic/EventHelper'

const { ccclass, property } = cc._decorator

@ccclass
export default class Vehicle extends Building {
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Sprite)
    shadow: cc.Sprite = null
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    dungeon: Dungeon
    resName = ''
    needStop = false
    isMoving = false
    isAniming = false
    startPos: cc.Vec3
    endPos: cc.Vec3
    isRepeat = true
    isPlayerIn = false

    onLoad() {}

    init(dungeon: Dungeon, resName: string) {
        this.dungeon = dungeon
        this.resName = resName

        this.root.y = 0
        this.entity.Transform.z = 0

        this.changeRes(0)

        if (this.data.indexZ) {
            this.node.zIndex = IndexZ.getActorZIndex(this.node.position.add(cc.v3(0, this.data.indexZ)))
        }
        this.isMoving = true

        this.startPos = Dungeon.getPosInMap(this.data.defaultPos)
        this.endPos = Dungeon.getPosInMap(cc.v3(Logic.ROOM_WIDTH, this.data.defaultPos.y))
        this.entity.Transform.position = this.startPos.clone()
        this.entity.NodeRender.root = this.root
        this.scheduleOnce(() => {
            if (this.dungeon && this.dungeon.player) {
                this.isRepeat = false
                this.dungeon.player.drive()
                this.dungeon.changeCameraTarget(this, cc.v3(500, 0))
                EventHelper.emit(EventHelper.HUD_CAMERA_ZOOM_IN_LOCK)
                this.isPlayerIn = true
            }
        })
    }

    private changeRes(index: number) {
        let spriteFrame = Logic.spriteFrameRes(`${this.resName}anim${index < 0 ? 0 : index}`)
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(`${this.resName}`)
        }
        if (spriteFrame) {
            this.sprite.spriteFrame = spriteFrame
            this.sprite.node.width = spriteFrame.getOriginalSize().width
            this.sprite.node.height = spriteFrame.getOriginalSize().height
            this.shadow.spriteFrame = spriteFrame
            this.shadow.node.width = spriteFrame.getOriginalSize().width
            this.shadow.node.height = spriteFrame.getOriginalSize().height
        }
    }
    onColliderStay(other: CCollider, self: CCollider): void {
        if (self.sensor && other.tag == CCollider.TAG.PLAYER) {
            this.isMoving = false
        }
    }
    playMove() {
        if (this.isAniming) {
            return
        }
        this.isAniming = true
        let time = 0.1
        let action = cc
            .tween()
            .delay(time)
            .call(() => {
                this.changeRes(1)
            })
            .delay(time)
            .call(() => {
                this.changeRes(2)
            })
            .delay(time)
            .call(() => {
                this.changeRes(3)
            })
            .delay(time)
            .call(() => {
                this.changeRes(0)
            })
        this.node.stopAllActions()
        cc.tween(this.node).repeatForever(action).start()
        this.entity.Move.linearVelocity = cc.v2(15, 0)
        this.entity.Move.damping = 0
    }
    playStop() {
        if (!this.isAniming) {
            return
        }
        this.isAniming = false
        this.node.stopAllActions()
        this.entity.Move.damping = 10
    }

    update(dt) {
        if (this.isMoving) {
            this.playMove()
        } else {
            this.playStop()
        }
        this.isMoving = true
        if (Logic.data.chapterIndex == Logic.CHAPTER099 && Logic.data.chapterIndex == 6) {
        }
        if (this.endPos && this.endPos.x < this.node.position.x) {
            if (this.isRepeat) {
                this.entity.Transform.position = this.startPos.clone()
            } else {
                this.isMoving = false
            }
        }
    }
}
