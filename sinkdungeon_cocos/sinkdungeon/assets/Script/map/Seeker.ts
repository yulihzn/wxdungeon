import { EventHelper } from "../EventHelper";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Seeker extends cc.Component {
    isMoving = false;//是否移动中
    rigidbody: cc.RigidBody;

    onLoad() {
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.node.zIndex = 1000;
        cc.director.on(EventHelper.PLAYER_MOVE, (event) => { this.move(event.detail.dir, event.detail.pos, event.detail.dt) });
    }
    move(dir: number, pos: cc.Vec3, dt: number) {
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let mul = absh > absv ? absh : absv;
        mul = mul == 0 ? 1 : mul;
        let movement = cc.v2(h, v);
        let speed = 500;
        if (speed < 0) {
            speed = 0;
        }
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt:number):boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }

    update(dt) {
        if(this.isCheckTimeDelay(dt)&&this.isMoving){
            cc.director.emit(EventHelper.CHUNK_LOAD, { detail: { pos: this.node.position.clone()}});
        }
    }
    

}