import Player from "../Player";
import Monster from "../Monster";
import Boss from "../Boss/Boss";
import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";
import StatusManager from "../Manager/StatusManager";
import IndexZ from "../Utils/IndexZ";
import Talent from "./Talent";

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
export default class CircleHitArea extends cc.Component {
    hasTargetMap: { [key: string]: number } = {};

    isAttacking = false;
    // LIFE-CYCLE CALLBACKS:
    player:Player;
    private damage:number = 1;
    private interval = 0.1;
    private talentType:string;

    onLoad () {
    }

    start() {
    }
    //Anim
    AnimFinish(){
        this.isAttacking = false;
        this.node.opacity = 0;
        this.scheduleOnce(() => { if (this.node) this.node.destroy(); }, 1);
    }
    show(player:Player,damage:number,interval:number,talentType:string,position:cc.Vec3){
        this.talentType = talentType;
        this.damage = damage;
        this.interval = interval;
        this.player = player;
        this.node.active = true;
        this.node.parent = player.node;
        this.isAttacking = true;
        this.node.setPosition(position);
        this.node.zIndex = IndexZ.ACTOR;
    }
    
    onCollisionStay(other: cc.Collider, self: cc.CircleCollider) {
        if (this.isAttacking) {
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
            if(monster.data.currentHealth<=0&&this.talentType==Talent.TALENT_003){
                monster.dungeon.addItem(monster.node.position.clone(), `food${monster.data.resName.replace('monster','')}`);
            }
        }
        let boss = attackTarget.getComponent(Boss);
        if (boss && !boss.isDied) {
            boss.takeDamage(damage);
            boss.addStatus(status,new FromData());
            if(boss.data.currentHealth<=0&&this.talentType==Talent.TALENT_003){
                boss.dungeon.addItem(boss.node.position.clone(), `foodboss${boss.data.resName.replace('iconboss','')}`);
            }
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
