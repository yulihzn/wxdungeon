import Bullet from "../Item/Bullet";
import Monster from "../Monster";
import Random from "../Utils/Random";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MonsterDetector extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let bullet = other.getComponent(Bullet);
        let monster = this.node.parent.getComponent(Monster);
        if(bullet&&bullet.isFromPlayer && monster){
            let pos = this.getRoate90Point(bullet.node.position,monster.node.position,Random.getHalfChance());
            pos = pos.sub(monster.node.position);
            monster.moveTarget = pos.clone();
            monster.updateLogic();
            this.scheduleOnce(()=>{monster.moveTarget = cc.Vec3.ZERO;},0.1);
        }
    }
    /**
     * A绕B旋转90度的坐标 
     * x=x2+(x1-x2)cosb-(y1-y2)sinb 
     * y = y2+(y1-y2)cosb+(x1-x2)sinb*/
    getRoate90Point(posA:cc.Vec3,posB:cc.Vec3,reverse?:boolean):cc.Vec3{
        if(reverse){
            return cc.v3(posB.x+posA.y-posB.y,posB.y-posA.x+posB.x);
        }else {
           return cc.v3(posB.x-posA.y+posB.y,posB.y+posA.x-posB.x);
        }
    }
}
