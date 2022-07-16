import FromData from '../data/FromData'
import Actor from '../base/Actor'
import ActorUtils from '../utils/ActorUtils'
import Utils from '../utils/Utils'
import Dungeon from '../logic/Dungeon'
import NonPlayer from '../logic/NonPlayer'
import CCollider from '../collider/CCollider'
import Logic from '../logic/Logic'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class ActorBottomDir extends cc.Component {
    @property(cc.Node)
    circle: cc.Node = null
    @property(cc.Node)
    base: cc.Node = null
    @property(cc.Node)
    arrow: cc.Node = null
    actor: Actor
    private currentAngle = 0
    // LIFE-CYCLE CALLBACKS:

    onLoad() {}

    init(actor: Actor, color?: cc.Color, width?: number, height?: number, range?: number) {
        this.actor = actor
        if (width) {
            this.circle.width = width
        }
        if (height) {
            this.circle.height = height
        }
        if (range) {
            this.arrow.x = range
        }
        if (color) {
            this.circle.color = color
            this.arrow.color = color
        }
    }
    protected update(dt: number): void {
        if (this.actor) {
            this.rotateCollider(this.actor.hv)
            this.base.angle = Logic.lerp(this.base.angle, this.currentAngle, dt * 5)
        }
    }
    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.02) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return
        }
        //设置旋转角度
        this.currentAngle = Utils.getRotateAngle(direction)
        if (this.currentAngle < 0) {
            this.currentAngle += 360
        }
        if (this.currentAngle >= 0 && this.currentAngle <= 90 && this.base.angle >= 225 && this.node.angle <= 360) {
            this.base.angle -= 360
        } else if (this.base.angle >= 0 && this.base.angle <= 90 && this.currentAngle >= 225 && this.currentAngle <= 360) {
            this.base.angle += 360
        }
    }
}
