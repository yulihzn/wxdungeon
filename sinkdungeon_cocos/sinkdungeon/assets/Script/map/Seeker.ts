import { EventHelper } from '../logic/EventHelper'
import TimeDelay from '../utils/TimeDelay'

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
export default class Seeker extends cc.Component {
    isMoving = false //是否移动中
    rigidbody: cc.RigidBody

    onLoad() {
        this.rigidbody = this.getComponent(cc.RigidBody)
        this.node.zIndex = 1000
        EventHelper.on(EventHelper.PLAYER_MOVE, detail => {
            this.move(detail.dir, detail.pos, detail.dt)
        })
    }
    move(dir: number, pos: cc.Vec3, dt: number) {
        let h = pos.x
        let v = pos.y
        let absh = Math.abs(h)
        let absv = Math.abs(v)

        let mul = absh > absv ? absh : absv
        mul = mul == 0 ? 1 : mul
        let movement = cc.v2(h, v)
        let speed = 5
        if (speed < 0) {
            speed = 0
        }
        movement = movement.mul(speed)
        this.rigidbody.linearVelocity = movement
        this.isMoving = h != 0 || v != 0
    }
    checkTimeDelay = new TimeDelay(0.2)

    update(dt) {
        if (this.checkTimeDelay.check(dt) && this.isMoving) {
            EventHelper.emit(EventHelper.CHUNK_LOAD, { pos: this.node.position.clone() })
        }
    }
}
