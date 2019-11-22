import Player from "../Player";
import Monster from "../Monster";
import Boss from "../Boss/Boss";
import DamageData from "../Data/DamageData";
import FromData from "../Data/FromData";
import Dungeon from "../Dungeon";
import Talent from "./Talent";
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
export default class MagicBall extends cc.Component {
    static readonly FIRE = 0;
    static readonly LIGHTENING = 1;
    rigidBody:cc.RigidBody;
    hasTargetMap: { [key: string]: number } = {};
    ballType = 0;
    @property(cc.ParticleSystem)
    fire:cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    lightening:cc.ParticleSystem = null;

    isAttacking = false;
    // LIFE-CYCLE CALLBACKS:
    player:Player;

    onLoad () {
        this.fire.node.active = false;
        this.lightening.node.active = false;
        this.rigidBody = this.getComponent(cc.RigidBody);
    }

    start() {
    }
    show(player:Player,ballType:number,isBig:boolean,angle:number){
        this.ballType = ballType;
        this.player = player;
        let lifeTime = 3;
        let distance = 100;
        this.node.active = true;
        this.node.parent = player.node.parent;
        this.node.setPosition(this.getPlayerPosition(player));
        let speed = 500;
        
        if(player.talentMagic.hashTalent(Talent.MAGIC_09)){
            this.node.scale = 1.5;
            lifeTime = 6;
        }
        if(player.talentMagic.hashTalent(Talent.MAGIC_15)){
            this.node.scale = 1.5;
            distance = 200;
            lifeTime = 6;
        }
        if(this.ballType == MagicBall.LIGHTENING){
            this.lightening.node.active = true;
            speed = 0;
            this.node.setPosition(this.getPlayerFarPosition(player,distance,angle));
            this.node.scale = 0.1;
            this.node.runAction(cc.sequence(cc.scaleTo(1,0.2),cc.callFunc(()=>{this.isAttacking = true;}),cc.scaleTo(1,1)));
        }else{
            this.fire.node.active = true;
            this.isAttacking = true;
        }
        this.rigidBody.linearVelocity = this.getPlayerHv(player,angle).mul(speed);
        this.node.zIndex = 4000;
        this.scheduleOnce(() => { if (this.node) this.node.destroy(); }, lifeTime);
        
        
    }
    getPlayerPosition(player:Player):cc.Vec2{
        return player.node.position.clone().addSelf(cc.v2(8,48));
    }
    getPlayerFarPosition(player:Player,distance:number,angleOffset:number):cc.Vec2{
        let hv = player.meleeWeapon.getHv().clone();
        let pos = cc.v2(hv).rotateSelf(angleOffset * Math.PI / 180).mul(distance);
        return player.node.position.clone().addSelf(cc.v2(8,48).addSelf(pos));
    }
    getPlayerHv(player:Player,angleOffset:number):cc.Vec2{
        let hv = player.meleeWeapon.getHv().clone();
        let pos = cc.v2(hv).rotateSelf(angleOffset * Math.PI / 180);
        return pos.normalizeSelf();
    }
    onCollisionStay(other: cc.Collider, self: cc.CircleCollider) {
        if (self.radius > 0 && this.isAttacking) {
            if (this.hasTargetMap[other.node.uuid] && this.hasTargetMap[other.node.uuid] > 0) {
                this.hasTargetMap[other.node.uuid]++;
            } else {
                this.hasTargetMap[other.node.uuid] = 1;
                let monster = other.node.getComponent(Monster);
                let boss = other.node.getComponent(Boss);
                if (monster || boss) {
                    this.attacking(other.node);
                    this.rigidBody.linearVelocity = cc.Vec2.ZERO;
                    this.fire.node.angle = 0;
                }
            }
        }
    }
    attacking(attackTarget: cc.Node) {
        if (!attackTarget) {
            return;
        }
        let damage = new DamageData();
        let status = StatusManager.BURNING;
        let d = 1;
        if(this.player&&this.player.talentMagic.hashTalent(Talent.MAGIC_06)){
            d = 2;
        }
        if(this.ballType == MagicBall.FIRE){
            damage.fireDamage = d;
        }else{
            damage.lighteningDamage = d;
            status = StatusManager.DIZZ;
        }
        
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
