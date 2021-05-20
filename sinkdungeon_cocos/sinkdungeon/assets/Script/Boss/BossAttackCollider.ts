import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";
import Actor from "../Base/Actor";
import ActorUtils from "../Utils/ActorUtils";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//boss通用攻击碰撞,类比于船长的刀
const {ccclass, property} = cc._decorator;

@ccclass
export default class BossAttackCollider extends cc.Component {
    @property
    damage = 2;
    @property(cc.Node)
    parentNode:cc.Node = null;
    from:FromData = new FromData();
    // LIFE-CYCLE CALLBACKS:
    private isShow = false;

    // onLoad () {}

    start () {
        this.isShow = false;
    }
    /**
     * 激活碰撞
     * @param coolingTime 持续时间
     * @param delayTime 延迟执行
     */
    showCollider(coolingTime:number,delayTime?:number){
        let delay = delayTime?delayTime:0;
        this.scheduleOnce(()=>{this.isShow = true;},delay);
        this.scheduleOnce(()=>{this.isShow = false;},coolingTime);
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        let target = ActorUtils.getEnemyCollisionTarget(other);
        if(target && this.isShow && this.node.active){
            this.isShow = false;
            let dd = new DamageData();
            dd.physicalDamage = this.damage;
            target.takeDamage(dd,this.from,this.parentNode.getComponent(Actor));
        }
    }
    // update (dt) {}
}
