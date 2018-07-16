import Bullet from "./Item/Bullet";
import Dungeon from "./Dungeon";
import Player from "./Player";
import Monster from "./Monster";
import Kraken from "./Boss/Kraken";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//发射器
const { ccclass, property } = cc._decorator;

@ccclass
export default class MeleeWeapon extends cc.Component {

    @property(cc.Node)
    playerNode: cc.Node = null;
    player: Player = null;

    private isReverse = false;
    private anim: cc.Animation;
    private isAttacking:boolean = false;
    private hv: cc.Vec2 = cc.v2(1, 0);

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.player = this.playerNode.getComponent(Player);
    }
    setHv(hv: cc.Vec2) {
        this.hv = hv;
    }

    attack() {
        if(this.isAttacking){
            return;
        }
        this.isAttacking = true;
        if (this.anim) {
            this.isReverse?this.anim.play("MeleeAttackReverse"):this.anim.play("MeleeAttack");
        }
        
    }
    //Anim
    MeleeAttackFinish(reverse:boolean){
        this.isAttacking = false;
        this.isReverse=!reverse;
    }

    start() {
    }

    getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Math.random() * (max - min));
    }

    update(dt) {

        if (this.hv.x != 0 || this.hv.y != 0) {
            this.node.position = cc.v2(21,43);
            let olderTarget = cc.v2(this.node.position.x + this.hv.x, this.node.position.y + this.hv.y);
            this.rotateColliderManager(olderTarget);
        }
    }

    rotateColliderManager(target: cc.Vec2) {
        // 鼠标坐标默认是屏幕坐标，首先要转换到世界坐标
        // 物体坐标默认就是世界坐标
        // 两者取差得到方向向量
        let direction = target.sub(this.node.position);
        // 方向向量转换为角度值
        let Rad2Deg = 360 / (Math.PI * 2);
        let angle: number = 360 - Math.atan2(direction.x, direction.y) * Rad2Deg;
        let offsetAngle = 90;
        this.node.scaleX = this.node.parent.scaleX;
        angle += offsetAngle;
        // 将当前物体的角度设置为对应角度
        this.node.rotation = this.node.scaleX == -1 ? angle : -angle;

    }
    onBeginContact(contact, selfCollider:cc.PhysicsCollider, otherCollider:cc.PhysicsCollider) {
        this.attacking(otherCollider);
    }
    attacking(attackTarget:cc.PhysicsCollider) {
        if (!attackTarget||!this.isAttacking) {
            return;
        }
        let damage = 0;
        if (this.player) {
            damage = this.player.inventoryData.getFinalAttackPoint(this.player.baseAttackPoint);
        }
        
        let monster = attackTarget.body.node.getComponent(Monster);
        if (monster && !monster.isDied) {
            monster.takeDamage(damage);
        }
        let player = attackTarget.body.node.getComponent(Player);
        if (player && !player.isDied) {
            player.takeDamage(damage);
        }
        let kraken = attackTarget.body.node.getComponent(Kraken);
        if (kraken && !kraken.isDied) {
            kraken.takeDamage(damage, cc.v2(0, 0));
        }
    }
}
