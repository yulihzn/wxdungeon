import Logic from "../Logic";
import Dungeon from "../Dungeon";
import TalentData from "../Data/TalentData";
import TalentShield from "../Talent/TalentShield";
import DamageData from "../Data/DamageData";
import Monster from "../Monster";
import Boss from "../Boss/Boss";
import StatusManager from "../Manager/StatusManager";
import Box from "../Building/Box";

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
export default class DashShadow extends cc.Component {
    rigidBody:cc.RigidBody;
    dungeon:Dungeon;
    hv:cc.Vec2 = cc.v2(1,0);
    private motionStreak:cc.MotionStreak;
    isFlyOut = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.rigidBody = this.getComponent(cc.RigidBody);
        this.motionStreak = this.getComponent(cc.MotionStreak);
    }
    init(){
    }
    
    changeDashPerformance(talentList: TalentData[]) {
        this.motionStreak.color = cc.Color.BLACK;
        for (let t of talentList) {
        }
    }
  
    onEnable(){
    }
    
    start () {

    }
   
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.016) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    getPlayerPosition():cc.Vec2{
        return this.dungeon.player.node.position.clone().addSelf(cc.v2(8,48));
    }
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistance(this.node.position, this.getPlayerPosition());
        return dis;
    }
    show(){
        this.node.active = true;
        this.node.parent = this.dungeon.node;
        this.node.setPosition(this.getPlayerPosition());
        let speed = 1000;
        this.rigidBody.linearDamping = 3;
        if(this.dungeon.player.talentShield.hashTalent(TalentShield.DASH_08)){
            speed = 3000;
            this.rigidBody.linearDamping = 12;
        }
        this.rigidBody.linearVelocity = this.hv.mul(speed);
        this.isFlyOut = true;
        this.node.zIndex = 4000;
        this.scheduleOnce(()=>{
            this.isFlyOut = false;
        },0.5)
    }
    hide(){
        this.node.active = false;
        this.rigidBody.linearVelocity = cc.Vec2.ZERO;
    }
    onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        this.attacking(otherCollider);
    }
    setHv(hv: cc.Vec2) {
        if(hv.equals(cc.Vec2.ZERO)){
            this.hv = cc.v2(1,0);
        }else{
            this.hv = hv;
        }
    }
    
    attacking(attackTarget: cc.PhysicsCollider) {
        if (!attackTarget || !this.node.active) {
            return;
        }
        let damage = new DamageData(1);
        
        let damageSuccess = false;
        let monster = attackTarget.node.getComponent(Monster);
        if (monster && !monster.isDied) {
            damageSuccess = monster.takeDamage(damage);
            if (damageSuccess) {
                this.beatBack(monster.node);
                this.addMonsterAllStatus(monster);
            }
        }

        let boss = attackTarget.node.getComponent(Boss);
        if (boss && !boss.isDied) {
            damageSuccess = boss.takeDamage(damage);
            if (damageSuccess) {
                this.addBossAllStatus(boss);
            }
        }

        let box = attackTarget.node.getComponent(Box);
        if (box) {
            box.breakBox();
        }

    }
    beatBack(node: cc.Node) {
        //飞出去才有击退
        if(!this.dungeon.player.talentShield.hashTalent(TalentShield.SHIELD_09)||!this.isFlyOut){
            return;
        }
        let rigidBody: cc.RigidBody = node.getComponent(cc.RigidBody);
        let pos = this.hv.clone();
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(1, 0);
        }
        let power = 1000;
        pos = pos.normalizeSelf().mul(power);
        rigidBody.applyLinearImpulse(pos, rigidBody.getLocalCenter(), true);
    }
    update (dt) { 
        if(this.isCheckTimeDelay(dt)){
            if (this.dungeon.player&&this.node.active && !this.isFlyOut) {
                let p = this.getPlayerPosition();
                p.y+=10;
                let pos = p.sub(this.node.position);
                if (!pos.equals(cc.Vec2.ZERO)) {
                    pos = pos.normalizeSelf();
                    pos = pos.mul(2000);
                    this.rigidBody.linearVelocity = pos;
                    this.rigidBody.linearDamping = 1;
                }
            }
            
        }
        if (this.dungeon&&this.dungeon.player&&this.getNearPlayerDistance(this.dungeon.player.node)<32&&this.node.active&&!this.isFlyOut) {
            this.hide();
        }
    }

    addMonsterAllStatus(monster: Monster) {
        this.addMonsterStatus(TalentShield.SHIELD_07, monster, StatusManager.FROZEN);
        this.addMonsterStatus(TalentShield.SHIELD_08, monster, StatusManager.DIZZ);
        this.addMonsterStatus(TalentShield.SHIELD_10, monster, StatusManager.BLEEDING);
    }
    addBossAllStatus(boss: Boss) {
        this.addBossStatus(TalentShield.SHIELD_07, boss, StatusManager.FROZEN);
        this.addBossStatus(TalentShield.SHIELD_08, boss, StatusManager.DIZZ);
        this.addBossStatus(TalentShield.SHIELD_10, boss, StatusManager.BLEEDING);
    }
    addMonsterStatus(talentType: number, monster: Monster, statusType) {
        if (this.dungeon.player.talentShield.hashTalent(talentType)) { monster.addStatus(statusType); }
    }
    addBossStatus(talentType: number, boss: Boss, statusType) {
        if (this.dungeon.player.talentShield.hashTalent(talentType)) { boss.addStatus(statusType); }
    }
}
