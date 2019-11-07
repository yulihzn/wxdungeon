import Player from "../Player";
import Monster from "../Monster";
import Boss from "../Boss/Boss";
import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";

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
export default class Boom extends cc.Component {

    isFromPlayer = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.scheduleOnce(()=>{if(this.node)this.node.destroy();},0.5);
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let isAttack = true;
        let player = other.node.getComponent(Player);
        let monster = other.node.getComponent(Monster);
        let boss = other.node.getComponent(Boss);
        if (!this.isFromPlayer && (monster || boss)) {
            isAttack = false;
        }
        if (this.isFromPlayer && player) {
            isAttack = false;
        }
        
        if (isAttack) {
            this.attacking(other.node);
        }
    }
    attacking(attackTarget: cc.Node) {
        if (!attackTarget) {
            return;
        }
        let damage = new DamageData();
        damage.physicalDamage =3;
        let monster = attackTarget.getComponent(Monster);
        if (monster && !monster.isDied) {
            monster.takeDamage(damage);
        }
        let player = attackTarget.getComponent(Player);
        if (player && !player.isDied) {
            player.takeDamage(damage,FromData.getClone('爆炸','boom000anim001'));
        }
        let boss = attackTarget.getComponent(Boss);
        if (boss && !boss.isDied) {
            boss.takeDamage(damage);
        }
    }
    // update (dt) {}
}
