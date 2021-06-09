import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";
import Kraken from "./Kraken";
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

const {ccclass, property} = cc._decorator;

@ccclass
export default class KrakenSwingHand extends cc.Component {
    @property
    damage = 2;
    // LIFE-CYCLE CALLBACKS:
    isShow = false;
    anim:cc.Animation;

    onLoad () {
        this.anim = this.node.parent.getComponent(cc.Animation);
    }
    swing(){
        this.anim.play();
    }

    start () {
        this.isShow = false;
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        let target = ActorUtils.getEnemyCollisionTarget(other);
        if(target && this.isShow && this.node.active){
            this.node.stopAllActions();
            let dd = new DamageData();
            dd.physicalDamage = this.damage;
            target.takeDamage(dd,FromData.getClone(this.actorName(),'boss001'),this.node.parent.getComponent(Kraken));
        }
    }
    actorName(){
        return '海妖';
    }
    // update (dt) {}
}
