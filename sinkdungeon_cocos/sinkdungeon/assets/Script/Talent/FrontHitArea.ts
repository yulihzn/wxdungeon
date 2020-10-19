import Player from "../Player";
import Monster from "../Monster";
import Boss from "../Boss/Boss";
import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";
import Talent from "./Talent";
import StatusManager from "../Manager/StatusManager";
import IndexZ from "../Utils/IndexZ";

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

@ccclass
export default class FrontHitArea extends cc.Component {
    hasTargetMap: { [key: string]: number } = {};

    isAttacking = false;
    private damage = 1;
    private interval = 0.1;
    // LIFE-CYCLE CALLBACKS:
    player:Player;

    onLoad () {
    }

    start() {
    }
    //Anim
    AnimFinish(){
        this.isAttacking = false;
        this.scheduleOnce(() => { if (this.node) this.node.destroy(); }, 1);
    }
    show(player:Player,exangle:number,damage:number,interval:number){
        this.damage = damage;
        this.interval = interval;
        this.player = player;
        this.node.active = true;
        this.node.parent = player.node.parent;
        this.node.setPosition(this.getPlayerPosition(player));
        this.node.scale = 4;
        let direction = this.getPlayerHv(player,exangle);
        let angle = cc.v2(direction.x,direction.y).signAngle(cc.v2(1,0));
        let degree = cc.misc.radiansToDegrees(angle);
        this.node.angle = 360-degree;

        this.isAttacking = true;
        this.node.zIndex = IndexZ.OVERHEAD;
    }
    getPlayerPosition(player:Player):cc.Vec3{
        let hv = player.weaponRight.meleeWeapon.Hv.clone();
        return player.node.position.clone().addSelf(cc.v3(0,32)).addSelf(hv.mulSelf(32));
    }
    
    getPlayerHv(player:Player,angleOffset:number):cc.Vec3{
        let hv = player.weaponRight.meleeWeapon.Hv.clone();
        let pos = cc.v3(cc.v2(hv).rotateSelf(angleOffset * Math.PI / 180));
        return pos.normalizeSelf();
    }
    onCollisionStay(other: cc.Collider, self: cc.BoxCollider) {
        if (!self.size.equals(cc.Size.ZERO) && this.isAttacking) {
            if (this.hasTargetMap[other.node.uuid] && this.hasTargetMap[other.node.uuid] > 0) {
                this.hasTargetMap[other.node.uuid]++;
            } else {
                this.hasTargetMap[other.node.uuid] = 1;
                let monster = other.node.getComponent(Monster);
                let boss = other.node.getComponent(Boss);
                if (monster || boss) {
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
        let status = StatusManager.FROZEN;
        let d = this.damage;
        damage.magicDamage = d;
        let monster = attackTarget.getComponent(Monster);
        if (monster && !monster.isDied) {
            monster.takeDamage(damage);
            monster.addStatus(status,new FromData());
        }
        let boss = attackTarget.getComponent(Boss);
        if (boss && !boss.isDied) {
            boss.takeDamage(damage);
            boss.addStatus(status,new FromData());
        }
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > this.interval) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update (dt) {
        if(this.isCheckTimeDelay(dt)){
            this.hasTargetMap = {};
        }
    }
}
