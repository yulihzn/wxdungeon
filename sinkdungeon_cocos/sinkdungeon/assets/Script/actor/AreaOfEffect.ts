import Boss from "../boss/Boss";
import DamageData from "../data/DamageData";
import IndexZ from "../utils/IndexZ";
import Dungeon from "../logic/Dungeon";
import HitBuilding from "../building/HitBuilding";
import AreaOfEffectData from "../data/AreaOfEffectData";
import { ColliderTag } from "./ColliderTag";
import ActorUtils from "../utils/ActorUtils";
import InteractBuilding from "../building/InteractBuilding";
import Actor from "../base/Actor";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/**
 * aoe 结点需要Collider 动画事件AnimFinish 
 */
@ccclass
export default class AreaOfEffect extends cc.Component {
    hasTargetMap: { [key: string]: number } = {};
    private isAttacking = false;
    data: AreaOfEffectData = new AreaOfEffectData();
    // LIFE-CYCLE CALLBACKS:
    dugeon: Dungeon;
    killCallBack: Function;
    destoryCallBack: Function;
    usePool = false;

    get IsAttacking() {
        return this.isAttacking;
    }
    onLoad() {
    }

    onEnable() {
        this.hasTargetMap = {};
        this.isAttacking = false;
    }
    start() {
    }
    //Anim
    AnimFinish() {
        this.close();
    }
    close() {
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid && !this.usePool) {
                this.node.destroy();
            }
            if (this.destoryCallBack && this.usePool) {
                this.destoryCallBack(this.node);
            }
        }, 1);
        this.isAttacking = false;
    }

    show(parentNode: cc.Node, postion: cc.Vec3, hv: cc.Vec3, angleOffset: number, data: AreaOfEffectData, killCallBack?: Function, usePool?: boolean, destoryCallBack?: Function) {
        this.data.valueCopy(data);
        this.node.active = true;
        this.node.parent = parentNode;
        this.usePool = usePool;
        this.isAttacking = true;
        this.killCallBack = killCallBack;
        this.destoryCallBack = destoryCallBack;
        this.node.setPosition(postion);
        if (this.data.scale > 0) {
            this.node.scale = this.data.scale;
            this.node.scaleX = this.node.scaleX>0?this.data.scale:-this.data.scale;
            this.node.scaleY = this.node.scaleY>0?this.data.scale:-this.data.scale;
        }
        if (this.data.isRotate) {
            let direction = this.getHv(hv, angleOffset);
            let angle = cc.v2(direction.x, direction.y).signAngle(cc.v2(1, 0));
            let degree = cc.misc.radiansToDegrees(angle);
            this.node.angle = 360 - degree;
        }
        this.node.zIndex = this.data.zIndex ? this.data.zIndex : IndexZ.ACTOR;
        this.scheduleOnce(() => { this.isAttacking = true; }, this.data.delay);
        if (this.data.duration > 0) {
            this.scheduleOnce(() => { this.close() }, this.data.duration);
        }
        let anim = this.getComponent(cc.Animation);
        if (anim && !anim.playOnLoad) {
            anim.play();
        }
    }
    private getHv(hv: cc.Vec3, angleOffset: number): cc.Vec3 {
        let pos = cc.v3(cc.v2(hv).rotateSelf(angleOffset * Math.PI / 180));
        return pos.normalizeSelf();
    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (self.isValid && this.isAttacking) {
            if (this.hasTargetMap[other.node.uuid] && this.hasTargetMap[other.node.uuid] > 0) {
                this.hasTargetMap[other.node.uuid]++;
            } else {
                this.hasTargetMap[other.node.uuid] = 1;
                let isAttack = true;
                if (!this.data.isFromEnemy && (other.tag == ColliderTag.GOODNONPLAYER || other.tag == ColliderTag.PLAYER)) {
                    isAttack = false;
                }
                if (this.data.isFromEnemy && (other.tag == ColliderTag.NONPLAYER || other.tag == ColliderTag.BOSS)) {
                    isAttack = false;
                }
                if (isAttack) {
                    this.attacking(other.node, other.tag);
                }
            }
        }
    }
    private attacking(attackTarget: cc.Node, tag: number) {
        if (!attackTarget) {
            return;
        }
        let damage = new DamageData();
        damage.valueCopy(this.data.damage);
        damage.isRemote = true;
        if (tag == ColliderTag.PLAYER || tag == ColliderTag.NONPLAYER || tag == ColliderTag.GOODNONPLAYER || tag == ColliderTag.BOSS) {
            let normal = attackTarget.convertToWorldSpaceAR(cc.Vec3.ZERO).subSelf(this.node.convertToWorldSpaceAR(cc.Vec3.ZERO)).normalizeSelf();
            let target = ActorUtils.getEnemyActorByNode(attackTarget, !this.data.isFromEnemy);
            if (target && !target.sc.isDied) {
                let damageSuccess = target.takeDamage(damage, this.data.from);
                if (damageSuccess) {
                    if (target.data.currentHealth <= 0 && this.killCallBack) {
                        this.killCallBack(target);
                    }
                    if (this.data.canBeatBack && !target.getComponent(Boss)) {
                        this.beatBack(target, normal);
                    }
                }
                for (let status of this.data.statusList) {
                    target.addStatus(status, this.data.from);
                }
            }
        } else if (tag == ColliderTag.BUILDING) {
            let interactBuilding = attackTarget.getComponent(InteractBuilding);
            if (this.data.canBreakBuilding && interactBuilding) {
                interactBuilding.takeDamage(damage);
                return;
            }
            let hitBuilding = attackTarget.getComponent(HitBuilding);
            if (this.data.canBreakBuilding && hitBuilding) {
                hitBuilding.takeDamage(damage);
            }
        }
    }
    private beatBack(actor: Actor, hv: cc.Vec3) {
        let rigidBody: cc.RigidBody = actor.getComponent(cc.RigidBody);
        let pos = hv.clone();
        if (pos.equals(cc.Vec3.ZERO)) {
            pos = cc.v3(1, 0);
        }
        let power = 100;
        pos = pos.normalizeSelf().mul(power);
        this.scheduleOnce(() => {
            rigidBody.linearVelocity = cc.Vec2.ZERO;
            rigidBody.applyLinearImpulse(cc.v2(pos.x, pos.y), rigidBody.getLocalCenter(), true);
        }, 0.1);
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > this.data.interval) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        if (this.isCheckTimeDelay(dt)) {
            this.hasTargetMap = {};
        }
    }
}
