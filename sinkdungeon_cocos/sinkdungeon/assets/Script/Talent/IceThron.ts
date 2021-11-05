import Player from "../logic/Player";
import DamageData from "../data/DamageData";
import FromData from "../data/FromData";
import StatusManager from "../manager/StatusManager";
import IndexZ from "../utils/IndexZ";
import ActorUtils from "../utils/ActorUtils";
import CCollider from "../collider/CCollider";
import Actor from "../base/Actor";
import StatusData from "../data/StatusData";
import BaseColliderComponent from "../base/BaseColliderComponent";

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
export default class IceThron extends BaseColliderComponent {
    
    hasTargetMap: { [key: string]: number } = {};

    isAttacking = false;
    // LIFE-CYCLE CALLBACKS:
    player:Player;

    onLoad () {
        super.onLoad();
    }

    start() {
    }
    //Anim
    AnimFinish(){
        this.isAttacking = false;
        this.scheduleOnce(() => { if (this.node) this.node.destroy(); }, 1);
    }
    show(player:Player,angle:number,distance:number,scale:number){
        this.player = player;
        this.node.active = true;
        this.node.parent = player.node.parent;
        this.node.setPosition(this.getPlayerPosition(player,angle,distance));
        this.node.scale = scale;
        if(angle>90&&angle<270){
            this.node.scaleX = -this.node.scaleX;
        }
        this.isAttacking = true;
        this.node.zIndex = IndexZ.getActorZIndex(this.node.position);
    }
    getPlayerPosition(player:Player,angleOffset:number,distance:number):cc.Vec3{
        let hv = player.Hv.clone();
        let pos = cc.v3(cc.v2(hv).rotateSelf(angleOffset * Math.PI / 180)).normalizeSelf();
        return player.node.position.clone().addSelf(pos.mulSelf(distance));
    }
    
   
    onColliderStay(other: CCollider, self: CCollider) {
        if (self.radius>0 && this.isAttacking) {
            if (this.hasTargetMap[other.node.uuid] && this.hasTargetMap[other.node.uuid] > 0) {
                this.hasTargetMap[other.node.uuid]++;
            } else {
                this.hasTargetMap[other.node.uuid] = 1;
                let target = ActorUtils.getEnemyCollisionTarget(other,true);
                if (target) {
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
        let d = 4;
        
        damage.magicDamage = d;
        let target = ActorUtils.getEnemyActorByNode(attackTarget,true);
        if (target && !target.sc.isDied) {
            target.takeDamage(damage);
            target.addStatus(status,new FromData());
        }
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.5) {
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
