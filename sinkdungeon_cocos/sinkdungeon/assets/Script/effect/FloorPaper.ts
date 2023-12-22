import { MoveComponent } from './../ecs/component/MoveComponent'
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseColliderComponent from '../base/BaseColliderComponent'
import CCollider from '../collider/CCollider'
import Logic from '../logic/Logic'
import Random from '../utils/Random'
import IndexZ from '../utils/IndexZ'
import { EventHelper } from '../logic/EventHelper'
import TimeDelay from '../utils/TimeDelay'

const { ccclass, property } = cc._decorator

@ccclass
export default class FloorPaper extends BaseColliderComponent {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Sprite)
    shadow: cc.Sprite = null
    static readonly SPRITES = ['paper0', 'paper1', 'paper2', 'paper3']
    spriteIndex = 0
    rotateAngle = 0
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad()
        this.init()
    }
    protected onEnable(): void {
        this.init()
    }
    init() {
        this.node.scale = 1.5 + Random.rand()
        this.spriteIndex = Logic.getRandomNum(0, FloorPaper.SPRITES.length - 1)
        this.rotateAngle = 0
        let c = Logic.getRandomNum(180, 255)
        this.sprite.node.color = cc.color(c, c, c)
        this.updateSprite()
        this.unscheduleAllCallbacks()
        cc.tween(this.sprite.node)
            .delay(30)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.destroyEntityNode()
            })
            .start()
    }
    updateSprite() {
        if (this.spriteIndex > FloorPaper.SPRITES.length - 1) {
            this.spriteIndex = 0
        }
        this.sprite.spriteFrame = Logic.spriteFrameRes(FloorPaper.SPRITES[this.spriteIndex])
        this.shadow.spriteFrame = Logic.spriteFrameRes(FloorPaper.SPRITES[this.spriteIndex])
        this.spriteIndex++
    }
    rotateSprite() {
        if (this.rotateAngle > 360) {
            this.rotateAngle = 0
        }
        this.sprite.node.angle = this.rotateAngle
        this.shadow.node.angle = this.rotateAngle
        this.rotateAngle++
    }
    changeZIndex() {
        let offsetY = this.entity.Transform.base
        if (offsetY > 0) {
            offsetY += 500
        }
        this.node.zIndex = IndexZ.getActorZIndex(cc.v3(this.node.position.x, this.node.position.y - offsetY))
    }
    protected update(dt: number): void {
        let y = this.root.y - this.entity.Transform.base
        if (y < 0) {
            y = 0
        }
        let scale = 1 - y / 64
        this.shadow.node.scale = scale < 0.5 ? 0.5 : scale
        if (y > 0) {
            this.rotateSprite()
        }
        if (this.checkTimeDelay.check(dt)) {
            this.changeZIndex()
            if (y > 0) {
                this.updateSprite()
            }
        }
    }
    fly(fromPos?: cc.Vec3, isReverse?: boolean) {
        this.entity.NodeRender.root = this.root
        this.entity.Move.linearVelocityZ = 2
        this.entity.Move.gravity = MoveComponent.DEFAULT_GRAVITY / 10
        let speed = isReverse ? Logic.getRandomNum(5, 8) : Logic.getRandomNum(2, 5)
        let x = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed
        let y = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed
        if (fromPos) {
            let p = isReverse ? this.node.position.sub(fromPos) : fromPos.sub(this.node.position)
            if (!p.equals(cc.Vec3.ZERO)) {
                p = cc
                    .v3(cc.v2(p.normalize()).rotate((Logic.getRandomNum(-45, 45) * Math.PI) / 180))
                    .normalize()
                    .mul(speed)
                x = p.x
                y = p.y
            }
        }
        this.entity.Move.linearVelocity = cc.v2(x, y)
        this.entity.Move.damping = 3
    }

    onColliderEnter(other: CCollider, self: CCollider): void {
        if (!other.sensor) {
            if (!other.isStatic) {
                this.fly(other.entity.Transform.position)
            } else {
                this.entity.Move.linearVelocity = cc.Vec2.ZERO
            }
        } else {
            if (other.tag == CCollider.TAG.NONPLAYER || other.tag == CCollider.TAG.GOODNONPLAYER) {
                this.fly(other.entity.Transform.position)
            } else if (
                other.tag == CCollider.TAG.PLAYER_HIT ||
                other.tag == CCollider.TAG.AOE ||
                other.tag == CCollider.TAG.NONPLAYER_HIT ||
                other.tag == CCollider.TAG.GOODNONPLAYER_HIT
            ) {
                this.fly(this.node.parent.convertToNodeSpaceAR(cc.v3(other.w_center)), true)
            }
        }
    }
    onColliderStay(other: CCollider, self: CCollider): void {
        if (!other.sensor && other.isStatic) {
            this.entity.Move.linearVelocity = cc.Vec2.ZERO
        }
    }
    checkTimeDelay = new TimeDelay(0.2)
}
