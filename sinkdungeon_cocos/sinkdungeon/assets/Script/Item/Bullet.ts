import { EventConstant } from "../EventConstant";
import Monster from "../Monster";
import Player from "../Player";
import Kraken from "../Boss/Kraken";
import MeleeWeapon from "../MeleeWeapon";
import Captain from "../Boss/Captain";
import DamageData from "../Data/DamageData";

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
export default class Bullet extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property
    realDamge:number = 0;//真实伤害
    @property
    physicalDamage: number = 0;//物理伤害
    @property
    iceDamage = 0;//冰元素伤害
    @property
    fireDamage = 0;//火元素伤害
    @property
    lighteningDamage = 0;//雷元素伤害
    @property
    toxicDamage = 0;//毒元素伤害
    @property
    curseDamage = 0;//诅咒元素伤害
    @property
    speed: number = 500;
    @property
    isMelee:boolean = false;
    damageData:DamageData = new DamageData();

    anim:cc.Animation;
    dir = 0;
    tagetPos = cc.v2(0,0);
    rigidBody:cc.RigidBody;
    hv = cc.v2(0,0);
    isFromPlayer = false;

    sprite:cc.Node;
    light:cc.Node;
    readonly KEEP_LIST = ['Monster','Kraken','Captain'];

    particleIce:cc.ParticleSystem;
    particleFire:cc.ParticleSystem;
    particleLightening:cc.ParticleSystem;
    particleToxic:cc.ParticleSystem;
    particleCurse:cc.ParticleSystem;

    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
        this.rigidBody = this.getComponent(cc.RigidBody);
        this.particleIce = this.node.getChildByName('effect').getChildByName('ice').getComponent(cc.ParticleSystem);
        this.particleFire = this.node.getChildByName('effect').getChildByName('fire').getComponent(cc.ParticleSystem);
        this.particleLightening = this.node.getChildByName('effect').getChildByName('lightening').getComponent(cc.ParticleSystem);
        this.particleToxic = this.node.getChildByName('effect').getChildByName('toxic').getComponent(cc.ParticleSystem);
        this.particleCurse = this.node.getChildByName('effect').getChildByName('curse').getComponent(cc.ParticleSystem);
        
    }
    onEnable(){
        this.tagetPos = cc.v2(0,0);
        this.rigidBody.linearVelocity = cc.v2(0,0);
        this.sprite = this.node.getChildByName('sprite');
        this.sprite.opacity = 255;
        this.light = this.node.getChildByName('light');
        this.light.opacity = 0;
        this.damageData.realDamge = this.realDamge;
        this.damageData.physicalDamage = this.physicalDamage;
        this.damageData.iceDamage = this.iceDamage;
        this.damageData.fireDamage = this.fireDamage;
        this.damageData.lighteningDamage = this.lighteningDamage;
        this.damageData.toxicDamage = this.toxicDamage;
        this.damageData.curseDamage = this.curseDamage;
        this.iceDamage>0?this.particleIce.resetSystem():this.particleIce.stopSystem();
        this.fireDamage>0?this.particleFire.resetSystem():this.particleFire.stopSystem();
        this.lighteningDamage>0?this.particleLightening.resetSystem():this.particleLightening.stopSystem();
        this.toxicDamage>0?this.particleToxic.resetSystem():this.particleToxic.stopSystem();
        this.curseDamage>0?this.particleCurse.resetSystem():this.particleCurse.stopSystem();
    }
    //animation
    MeleeFinish(){
        cc.director.emit('destorybullet',{detail:{bulletNode:this.node}});
    }
    //animation
    showBullet(hv:cc.Vec2){
        this.hv = hv;
        if(this.isMelee){
            this.anim.play(this.node.name+'Show');
        }
        this.fire(this.hv);
    }
    //animation
    BulletDestory(){
        cc.director.emit('destorybullet',{detail:{bulletNode:this.node}});
        this.particleIce.stopSystem();
        this.particleFire.stopSystem();
        this.particleLightening.stopSystem();
        this.particleToxic.stopSystem();
        this.particleCurse.stopSystem();
    }
    fire(hv){
        if(!this.rigidBody){
            this.rigidBody = this.getComponent(cc.RigidBody);
        }
        this.rigidBody.linearVelocity = cc.v2(this.speed*hv.x,this.speed*hv.y);
    }

    start () {

    }
    onBeginContact(contact, selfCollider:cc.PhysicsCollider, otherCollider:cc.PhysicsCollider) {
        let isDestory = true;
        if(selfCollider.body.node.name==otherCollider.body.node.name){
            isDestory = false;
        }
        for(let name of this.KEEP_LIST){
            if(otherCollider.body.node.name == name){
                isDestory = false;
            }
        }
        if(otherCollider.body.node.name == 'Player'){
            isDestory = false;
        }
        if(otherCollider.sensor){
            isDestory = false;
        }
        //上面的墙
        if(otherCollider.tag==2){
            isDestory = false;
        }
        if(isDestory&&this.anim){
            this.rigidBody.linearVelocity = cc.v2(0,0);
            this.anim.play("Bullet001Hit");
        }
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider) {
        let isAttack = true;
        for(let name of this.KEEP_LIST){
            if(!this.isFromPlayer && other.node.name == name){
                isAttack = false;
            }
        }
        if(this.isFromPlayer && other.node.name == 'Player'){
            isAttack = false;
        }
        if(isAttack){
            this.attacking(other.node);
        }
    }
    attacking(attackTarget:cc.Node) {
        if (!attackTarget) {
            return;
        }
        let damage = new DamageData();
        damage.valueCopy(this.damageData);
        let isDestory = false;
        let monster = attackTarget.getComponent(Monster);
        if (monster && !monster.isDied) {
            monster.takeDamage(damage);
            isDestory = true;
        }
        let player = attackTarget.getComponent(Player);
        if (player && !player.isDied) {
            player.takeDamage(damage);
            isDestory = true;
        }
        let kraken = attackTarget.getComponent(Kraken);
        if (kraken && !kraken.isDied) {
            kraken.takeDamage(damage);
            isDestory = true;
        }
        let captain = attackTarget.getComponent(Captain);
        if (captain && !captain.isDied) {
            captain.takeDamage(damage);
            isDestory = true;
        }
        let meleeWeapon:MeleeWeapon = attackTarget.getComponent(MeleeWeapon);
        if(meleeWeapon&&meleeWeapon.isAttacking){
            isDestory = true;
        }
        if(isDestory&&this.anim && !this.anim.getAnimationState('Bullet001Hit').isPlaying){
            this.rigidBody.linearVelocity = cc.v2(0,0);
            this.anim.play("Bullet001Hit");
        }
    }
  
    update (dt) {
        
    }
    
}
