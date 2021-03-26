import Player from "../Player";
import NonPlayer from "../NonPlayer";
import Boss from "../Boss/Boss";
import DamageData from "../Data/DamageData";
import IndexZ from "../Utils/IndexZ";
import Dungeon from "../Dungeon";
import HitBuilding from "../Building/HitBuilding";
import Decorate from "../Building/Decorate";
import AreaOfEffectData from "../Data/AreaOfEffectData";
import Actor from "../Base/Actor";

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

    get IsAttacking(){
        return this.isAttacking;
    }
    onLoad() {
    }

    onEnable(){
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
            if(this.destoryCallBack&&this.usePool){
                this.destoryCallBack(this.node);
            }
        }, 1);
        this.isAttacking = false;
    }

    show(parentNode: cc.Node, postion: cc.Vec3, hv: cc.Vec3, angleOffset: number, data: AreaOfEffectData, killCallBack?: Function, usePool?: boolean,destoryCallBack?:Function) {
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
        if(anim&&!anim.playOnLoad){
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
                let monster = other.node.getComponent(NonPlayer);
                let boss = other.node.getComponent(Boss);
                let player = other.node.getComponent(Player);
                let isAttack = true;
                if (!this.data.isFromEnemy && (monster.data.isEnemy<1 || player)) {
                    isAttack = false;
                }
                if (this.data.isFromEnemy && (monster.data.isEnemy>0|| boss)) {
                    isAttack = false;
                }
                if (isAttack) {
                    this.attacking(other.node);
                }
            }
        }
    }
    attacking(attackTarget: cc.Node) {
        if (!attackTarget) {
            return;
        }
        let damage = new DamageData();
        let damageSuccess = false;
        damage.valueCopy(this.data.damage);
        damage.isRemote = true;
        let target = Actor.getEnemyActorByNode(attackTarget,!this.data.isFromEnemy);
        if (target && !target.sc.isDied) {
            damageSuccess = target.takeDamage(damage);
            if (damageSuccess) {
                if (target.data.currentHealth <= 0 && this.killCallBack) {
                    this.killCallBack(target);
                }
            }
            for (let status of this.data.statusList) {
                target.addStatus(status, this.data.from);
            }
            return;
        }
        let decorate = attackTarget.getComponent(Decorate);
        if (this.data.canBreakBuilding && decorate) {
            damageSuccess = true;
            decorate.takeDamage(damage);
            return;
        }
        let hitBuilding = attackTarget.getComponent(HitBuilding);
        if (this.data.canBreakBuilding && hitBuilding) {
            damageSuccess = true;
            hitBuilding.takeDamage(damage);
            return;
        }

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
