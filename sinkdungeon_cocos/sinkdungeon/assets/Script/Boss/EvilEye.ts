import CaptainSword from "./CaptainSword";
import HealthBar from "../HealthBar";
import MonsterData from "../Data/MonsterData";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Player from "../Player";
import { EventHelper } from "../EventHelper";
import Shooter from "../Shooter";
import EquipmentManager from "../Manager/EquipmentManager";
import DamageData from "../Data/DamageData";
import StatusManager from "../Manager/StatusManager";
import Boss from "./Boss";
import Skill from "../Utils/Skill";
import AudioPlayer from "../Utils/AudioPlayer";
import FromData from "../Data/FromData";
import Achievements from "../Achievement";
import Actor from "../Base/Actor";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class EvilEye extends Boss {

    private graphics: cc.Graphics
    private anim: cc.Animation;
    shooter: Shooter;
    private timeDelay = 0;
    rigidbody: cc.RigidBody;
    isMoving = false;
    viceEyes: cc.Node[];//1-6个副眼
    viceShooters: Shooter[];//1-6个副炮

    viceEyesFireSkill = new Skill();
    mainEyesFireSkill = new Skill();
    dashSkill = new Skill();
    isHalfBlood = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDied = false;
        this.isShow = false;
        this.graphics = this.getComponent(cc.Graphics);
        this.anim = this.getComponent(cc.Animation);
        this.shooter = this.node.getChildByName('Shooter').getComponent(Shooter);
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.statusManager = this.node.getChildByName("StatusManager").getComponent(StatusManager);
        this.viceEyes = new Array();
        this.viceEyes.push(this.node.getChildByName('sprite').getChildByName('limb1').getChildByName('tentacle1')
            .getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye'));
        this.viceEyes.push(this.node.getChildByName('sprite').getChildByName('limb2').getChildByName('tentacle1')
            .getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye'));
        this.viceEyes.push(this.node.getChildByName('sprite').getChildByName('limb3').getChildByName('tentacle1')
            .getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye'));
        this.viceEyes.push(this.node.getChildByName('sprite').getChildByName('limb4').getChildByName('tentacle1')
            .getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye'));
        this.viceEyes.push(this.node.getChildByName('sprite').getChildByName('limb5').getChildByName('tentacle1')
            .getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye'));
        this.viceEyes.push(this.node.getChildByName('sprite').getChildByName('limb6').getChildByName('tentacle1')
            .getChildByName('tentacle2').getChildByName('tentacle3').getChildByName('eye'));
        this.viceShooters = new Array();
        this.viceShooters.push(this.node.getChildByName('Shooter1').getComponent(Shooter));
        this.viceShooters.push(this.node.getChildByName('Shooter2').getComponent(Shooter));
        this.viceShooters.push(this.node.getChildByName('Shooter3').getComponent(Shooter));
        this.viceShooters.push(this.node.getChildByName('Shooter4').getComponent(Shooter));
        this.viceShooters.push(this.node.getChildByName('Shooter5').getComponent(Shooter));
        this.viceShooters.push(this.node.getChildByName('Shooter6').getComponent(Shooter));
        let from = FromData.getClone(this.actorName(),'evileyeeye');
        this.shooter.from.valueCopy(from);
        for(let vice of this.viceShooters){
            vice.from.valueCopy(from);
        }
    }

    start() {
        super.start();
    }

    takeDamage(damage: DamageData): boolean {
        if (this.isDied || !this.isShow || this.anim.getAnimationState('EvilEyeHurt').isPlaying) {
            return false;
        }
        
        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage();
        if (this.data.currentHealth > this.data.Common.maxHealth) {
            this.data.currentHealth = this.data.Common.maxHealth;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
        let isHalf = this.data.currentHealth < this.data.Common.maxHealth / 2;
        if (isHalf && !this.isHalfBlood) {
            this.isHalfBlood = true;
            this.anim.play("EvilEyeHurt");
            this.scheduleOnce(() => { this.anim.play('EvilEyeBite') }, 2.5)
        }
        cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.MONSTER_HIT}});
        return true;
    }

    killed() {
        if (this.isDied) {
            return;
        }
        Achievements.addMonsterKillAchievement(this.data.resName);
        this.node.runAction(cc.fadeOut(3));
        this.isDied = true;
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 5);
        this.getLoot();
    }
    bossAction(): void {
        if (this.isDied || !this.isShow || !this.dungeon) {
            return;
        }
        this.node.position = Dungeon.fixOuterMap(this.node.position);
        this.pos = Dungeon.getIndexInMap(this.node.position);
        this.changeZIndex();
        let pos = this.getMovePos();
        let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
        let isHalf = this.data.currentHealth < this.data.Common.maxHealth / 2;
        if (playerDis < 100) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        }

        if (!this.mainEyesFireSkill.IsExcuting && isHalf && !this.anim.getAnimationState('EvilEyeHurt').isPlaying) {
            this.dash();
        }
        this.fireWithViceEyes(isHalf);
        if (!this.dashSkill.IsExcuting) {
            this.fireWithMainEye();
        }
        if (!pos.equals(cc.Vec3.ZERO)
            && playerDis > 100 && !this.shooter.isAiming && !this.dashSkill.IsExcuting) {
            pos = pos.normalizeSelf();
            this.move(pos, 20);
        }
    }
    getMovePos(): cc.Vec3 {
        let newPos = this.dungeon.player.pos.clone();
        // if (this.dungeon.player.pos.x > this.pos.x) {
        //     newPos = newPos.addSelf(cc.v3(1, 1));
        // } else {
        //     newPos = newPos.addSelf(cc.v3(-1, 1));
        // }
        let pos = Dungeon.getPosInMap(newPos);
        pos.y += 32;
        pos = pos.sub(this.node.position);
        let h = pos.x;
        return pos;
    }

    fireWithViceEyes(isHalf:boolean) {
        this.viceEyesFireSkill.next(() => {
            this.viceEyesFireSkill.IsExcuting = true;
            this.scheduleOnce(()=>{this.viceEyesFireSkill.IsExcuting = false;},2);
            if(isHalf){
                this.schedule(()=>{this.fireViceBullet();},0.5,2,0);
            }else{
                this.fireViceBullet();
            }
        }, 3);
    }
    fireViceBullet(){
        for (let i = 0; i < this.viceShooters.length; i++) {
            let p = this.viceEyes[i].convertToWorldSpaceAR(cc.v3(0, 0));
            p = this.node.convertToNodeSpaceAR(p);
            this.viceShooters[i].node.setPosition(p);
            let pos = this.node.position.clone().add(p);
            let hv = this.dungeon.player.getCenterPosition().sub(pos);
            if (!hv.equals(cc.Vec3.ZERO)) {
                hv = hv.normalizeSelf();
                this.viceShooters[i].setHv(hv);
                this.fireShooter(this.viceShooters[i], 'bullet001', 0, 0, 0, cc.v3(0, 0));
                
            }
        }
    }
    fireWithMainEye() {
        this.mainEyesFireSkill.next(() => {
            this.mainEyesFireSkill.IsExcuting = true;
            this.scheduleOnce(()=>{this.mainEyesFireSkill.IsExcuting = false;},3);
            let p = this.shooter.node.convertToWorldSpaceAR(cc.v3(0, 0));
            p = this.node.convertToNodeSpaceAR(p);
            this.shooter.node.setPosition(p);
            let pos = this.node.position.clone().add(p);
            let hv = this.dungeon.player.getCenterPosition().sub(pos);
            if (!hv.equals(cc.Vec3.ZERO)) {
                hv = hv.normalizeSelf();
                this.shooter.setHv(hv);
                this.shooter.data.isLineAim = 1;
                this.fireShooter(this.shooter, 'laser003', 0, 3, 0, cc.v3(0, 0));
                this.anim.playAdditive("EvilEyeStone");
            }

        }, 7);
    }
    dash() {
        this.dashSkill.next(() => {
            cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.MELEE}});
            this.dashSkill.IsExcuting = true;
            if (!this.anim) {
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.play('EvilEyeBite');
            let pos = this.getMovePos();
            if (!pos.equals(cc.Vec3.ZERO)) {
                pos = pos.normalizeSelf();
            }
            let h = pos.x;
            let v = pos.y;
            let movement = cc.v2(h, v);
            movement = movement.mul(800);
            this.rigidbody.linearVelocity = movement;
            this.scheduleOnce(() => {
                this.dashSkill.IsExcuting = false;
            }, 2);
        }, 3, true);

    }
    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number, angle?: number, defaultPos?: cc.Vec3): void {
        shooter.dungeon = this.dungeon;
        shooter.data.bulletType = bulletType;
        shooter.data.bulletArcExNum = bulletArcExNum;
        shooter.data.bulletLineExNum = bulletLineExNum;
        shooter.fireBullet(angle, defaultPos);
    }
    showBoss() {
        this.isShow = true;
        if (this.healthBar) {
            this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
            this.healthBar.node.active = !this.isDied;
        }
    }
    actionTimeDelay = 0;
    isActionTimeDelay(dt: number): boolean {
        this.actionTimeDelay += dt;
        if (this.actionTimeDelay > 0.2) {
            this.actionTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 1) {
            this.timeDelay = 0;
        }
        if (this.isActionTimeDelay(dt)) {
            this.bossAction();
        }
        if (this.data.currentHealth < 1) {
            this.killed();
        }
        this.healthBar.node.active = !this.isDied;
        if (this.isDied) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        }
    }

    move(pos: cc.Vec3, speed: number) {
        if (this.isDied) {
            return;
        }
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.node.position);
        }
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let movement = cc.v2(h, v);
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;

        this.changeZIndex();
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let target = Actor.getCollisionTarget(other);
        if (target && (this.dashSkill.IsExcuting)) {
            let d = new DamageData();
            d.physicalDamage = 5;
            let from = FromData.getClone(this.actorName(),'evileyeeye');
            if(target.takeDamage(d,from,this)){
                target.addStatus(StatusManager.BLEEDING,from);
            }
        }
    }
    actorName(){
        return '邪眼';
    }
}
