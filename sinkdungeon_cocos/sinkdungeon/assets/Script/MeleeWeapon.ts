import Bullet from "./Item/Bullet";
import Dungeon from "./Dungeon";
import Player from "./Player";
import Monster from "./Monster";
import Kraken from "./Boss/Kraken";
import { EventConstant } from "./EventConstant";
import Box from "./Building/Box";

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
    isAttacking: boolean = false;
    private hv: cc.Vec2 = cc.v2(1, 0);
    isStab = true;

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.player = this.playerNode.getComponent(Player);
    }
    setHv(hv: cc.Vec2) {
        this.hv = hv;
    }
    getHv(): cc.Vec2 {
        return this.hv;
    }

    attack() {
        if (this.isAttacking) {
            return;
        }
        this.isAttacking = true;
        if (this.anim) {
            if(this.isStab){
                this.anim.play("MeleeAttackStab");
            }else{
                this.isReverse ? this.anim.play("MeleeAttackReverse") : this.anim.play("MeleeAttack");
            }
        }

    }
    //Anim
    MeleeAttackFinish(reverse: boolean) {
        this.isAttacking = false;
        this.isReverse = !reverse;
    }

    start() {
    }

    getRandomNum(min, max): number {//生成一个随机数从[min,max]
        return min + Math.round(Math.random() * (max - min));
    }

    update(dt) {

        if ((this.hv.x != 0 || this.hv.y != 0)&&!this.isAttacking) {
            this.node.position = cc.v2(21, 43);
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
    onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        // this.attacking(otherCollider);
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        this.attacking(other);
    }
    beatBack(node: cc.Node) {
        let rigidBody:cc.RigidBody = node.getComponent(cc.RigidBody);
        let pos = this.getHv().clone();
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(1, 0);
        }
        pos = pos.normalizeSelf().mul(640);
        let action = cc.moveBy(0.1, pos.x, pos.y);
        // node.runAction(action);
        rigidBody.applyLinearImpulse(pos,rigidBody.getLocalCenter(),true);
        cc.director.emit(EventConstant.DUNGEON_SHAKEONCE);

    }
    attacking(attackTarget: cc.Collider) {
        if (!attackTarget || !this.isAttacking) {
            return;
        }
        let damage = 0;
        if (this.player) {
            damage = this.player.inventoryData.getFinalAttackPoint(this.player.baseAttackPoint);
        }

        let monster = attackTarget.node.getComponent(Monster);
        if (monster && !monster.isDied) {
            monster.takeDamage(damage);
            this.beatBack(monster.node);
            //生命汲取
            let drain = this.player.inventoryData.getLifeDrain(this.player.baseAttackPoint);
            if (drain > 0) {
                this.player.takeDamage(-drain);
            }
        }

        let kraken = attackTarget.node.getComponent(Kraken);
        if (kraken && !kraken.isDied) {
            kraken.takeDamage(damage);
        }
        let box = attackTarget.node.getComponent(Box);
        if(box){
            box.breakBox();
        }
    }
}
