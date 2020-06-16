import Player from "../Player";
import Monster from "../Monster";
import Boss from "../Boss/Boss";
import DamageData from "../Data/DamageData";
import AudioPlayer from "../Utils/AudioPlayer";
import FromData from "../Data/FromData";
import StatusManager from "../Manager/StatusManager";

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
export default class MagicLightening extends cc.Component {
    hasTargetMap: { [key: string]: number } = {};
    needPrepare = false;
    showArea = false;
    anim:cc.Animation;
    isTrigger = true;//是否自动下落
    isAttacked = false;//是否攻击过
    damagePoint = 5;
    onLoad () {
    }

    start() {
    }
    fall(needPrepare:boolean,showArea:boolean,damagePoint?:number) {
        if(damagePoint&&damagePoint>0){
            this.damagePoint = damagePoint;
        }
        this.needPrepare = needPrepare;
        this.isAttacked = false;
        let animName = 'LighteningFall';
        if(showArea){
            animName = 'LighteningFallArea';
        }
        if(needPrepare){
            animName = 'LighteningPrepareFall';
            this.isAttacked = true;
        }
        this.anim = this.getComponent(cc.Animation);
        this.anim.play(animName);
        AudioPlayer.play(AudioPlayer.BOOM);
    }
    //Anim
    AnimBegin(){
        this.isAttacked = false;
    }
    //Anim
    AnimFinish(){
        AudioPlayer.play(AudioPlayer.BOOM);
        this.scheduleOnce(() => {
            if(this.node){
                this.node.destroy();
            }
            }, 2);
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.getComponent(Player);
        if(player && this.isTrigger){
            this.isTrigger = false;
            this.fall(true,true);
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.CircleCollider) {
        if (self.radius > 0&&!this.isAttacked) {
            this.attacking(other.node);
        }
    }
    attacking(attackTarget: cc.Node) {
        if (!attackTarget) {
            return;
        }
        let damage = new DamageData();
        let status = StatusManager.BURNING;
        damage.lighteningDamage = this.damagePoint;
        status = StatusManager.DIZZ;
        
        let monster = attackTarget.getComponent(Monster);
        if (monster && !monster.isDied) {
            monster.takeDamage(damage);
            monster.addStatus(status,new FromData());
            this.isAttacked = true;
        }
        let boss = attackTarget.getComponent(Boss);
        if (boss && !boss.isDied) {
            boss.takeDamage(damage);
            boss.addStatus(status,new FromData());
            this.isAttacked = true;
        }
        let player = attackTarget.getComponent(Player);
        if(player && !player.isDied && this.needPrepare){
            let fd = FromData.getClone('闪电','magiclighteningdown1');
            player.takeDamage(damage,fd);
            player.addStatus(status,fd);
            this.isAttacked = true;
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
        
    }
}
