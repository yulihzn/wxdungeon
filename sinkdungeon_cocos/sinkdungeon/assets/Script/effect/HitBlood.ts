import { MoveComponent } from '../ecs/component/MoveComponent'
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from '../logic/Logic'
import Random from '../utils/Random'
import IndexZ from '../utils/IndexZ'
import { EventHelper } from '../logic/EventHelper'
import BaseNodeComponent from '../base/BaseNodeComponent'
import EffectItemManager from '../manager/EffectItemManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class HitBlood extends BaseNodeComponent {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Sprite)
    shadow: cc.Sprite = null
    static readonly SPRITES = ['paper0', 'paper1', 'paper2', 'paper3']
    spriteIndex = 0
    rotateAngle = 0
    manager: EffectItemManager
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad()
        this.init()
    }
    protected onEnable(): void {
        this.init()
    }
    init() {
        this.node.scale = 0.5 + Random.rand()
        this.spriteIndex = Logic.getRandomNum(0, HitBlood.SPRITES.length - 1)
        this.rotateAngle = 0
        let r = Logic.getRandomNum(200, 255)
        let g = Logic.getRandomNum(0, 55)
        let b = Logic.getRandomNum(0, 55)
        this.sprite.node.color = cc.color(r, g, b)
        this.sprite.node.opacity = 255
        this.updateSprite()
        this.unscheduleAllCallbacks()
        cc.tween(this.sprite.node)
            .delay(5)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.manager.destroyHitBlood(this.node)
            })
            .start()
    }
    randomColor() {}
    updateSprite() {
        if (this.spriteIndex > HitBlood.SPRITES.length - 1) {
            this.spriteIndex = 0
        }
        this.sprite.spriteFrame = Logic.spriteFrameRes(HitBlood.SPRITES[this.spriteIndex])
        this.shadow.spriteFrame = Logic.spriteFrameRes(HitBlood.SPRITES[this.spriteIndex])
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
        if (this.isCheckTimeDelay(dt)) {
            if (y > 0) {
                this.updateSprite()
            }
        }
    }
    fly(fromPos?: cc.Vec3, isReverse?: boolean) {
        this.changeZIndex()
        this.entity.NodeRender.root = this.root
        this.entity.Move.linearVelocityZ = 2
        this.entity.Move.gravity = MoveComponent.DEFAULT_GRAVITY / 10
        let speed = isReverse ? Logic.getRandomNum(5, 8) : Logic.getRandomNum(2, 5)
        let x = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed
        let y = Random.rand() * (Logic.getHalfChance() ? 1 : -1) * speed
        if (fromPos) {
            let p = isReverse ? this.node.position.sub(fromPos) : fromPos.sub(this.node.position)
            p = cc
                .v3(cc.v2(p.normalize()).rotate((Logic.getRandomNum(-45, 45) * Math.PI) / 180))
                .normalize()
                .mul(speed)
            x = p.x
            y = p.y
        }
        this.entity.Move.linearVelocity = cc.v2(x, y)
        this.entity.Move.damping = 3
    }

    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
}
