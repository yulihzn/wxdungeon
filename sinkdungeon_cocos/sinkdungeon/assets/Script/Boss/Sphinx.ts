import Boss from "./Boss";
import DamageData from "../Data/DamageData";
import Shooter from "../Shooter";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Player from "../Player";
import StatusManager from "../Manager/StatusManager";
import Skill from "../Utils/Skill";
import BossAttackCollider from "./BossAttackCollider";
import MonsterManager from "../Manager/MonsterManager";
import AudioPlayer from "../Utils/AudioPlayer";
import { EventConstant } from "../EventConstant";

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
export default class Sphinx extends Boss {

    private anim: cc.Animation;
    shooter01: Shooter;
    private timeDelay = 0;
    rigidbody: cc.RigidBody;
    isMoving = false;
    stormSkill = new Skill();
    summonSkill = new Skill();
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDied = false;
        this.isShow = false;
        this.anim = this.getComponent(cc.Animation);
        this.shooter01 = this.node.getChildByName('Shooter01').getComponent(Shooter);
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.statusManager = this.node.getChildByName("StatusManager").getComponent(StatusManager);
    }

    start() {
    }
    takeDamage(damage: DamageData): boolean {
        if (this.isDied || !this.isShow) {
            return false;
        }
        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage();
        if (this.data.currentHealth > this.data.Common.maxHealth) {
            this.data.currentHealth = this.data.Common.maxHealth;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
        this.playHit(this.node.getChildByName('sprite'));
        cc.director.emit(EventConstant.PLAY_AUDIO,{detail:{name:AudioPlayer.MONSTER_HIT}});
        return true;
    }

    killed() {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 5);
        this.getLoot();
    }
    bossAction(): void {
        if (this.isDied || !this.isShow || !this.dungeon) {
            return;
        }
        this.changeZIndex();
        this.fireStorm();
        this.summonMonster();

    }
    summonMonster() {
        if(this.dungeon.getMonsterAliveNum()>1){
            return;
        }
        this.summonSkill.next(() => {
            this.summonSkill.IsExcuting = true;
            let pos = Dungeon.getIndexInMap(this.node.position.clone());
            this.dungeon.addMonsterFromData(MonsterManager.MONSTER_SANDSTATUE, pos.x, pos.y - 1);
            this.dungeon.addMonsterFromData(MonsterManager.MONSTER_SANDSTATUE, pos.x+1, pos.y - 1);
            this.dungeon.addMonsterFromData(MonsterManager.MONSTER_SANDSTATUE, pos.x-1, pos.y - 1);
            this.dungeon.addMonsterFromData(MonsterManager.MONSTER_ANUBIS, pos.x-1, pos.y - 2);
            this.dungeon.addMonsterFromData(MonsterManager.MONSTER_ANUBIS, pos.x+1, pos.y - 2);
        }, 15, true);
    }
    fireStorm() {
        this.stormSkill.next(() => {
            this.stormSkill.IsExcuting = true;
            this.anim.play('SphinxStorm');
            this.scheduleOnce(() => {
                let pos = this.node.position.clone().add(this.shooter01.node.position);
                let hv = this.dungeon.player.getCenterPosition().sub(pos);
                if (!hv.equals(cc.Vec2.ZERO)) {
                    hv = hv.normalizeSelf();
                    this.shooter01.setHv(hv);
                    this.fireShooter(this.shooter01, "bullet023", 0, -20);
                    this.fireShooter(this.shooter01, "bullet123", 0, 0, 0);
                    this.fireShooter(this.shooter01, "bullet223", 0, 0, 20);
                }
            }, 0.3);
            this.scheduleOnce(() => { this.stormSkill.IsExcuting = false; this.anim.play('SphinxIdle'); }, 2);
        }, 8, true);
    }
    fireShooter(shooter: Shooter, bulletType: string, bulletArcExNum: number, bulletLineExNum: number, angle?: number): void {
        shooter.dungeon = this.dungeon;
        shooter.data.bulletType = bulletType;
        shooter.data.bulletArcExNum = bulletArcExNum;
        shooter.data.bulletLineExNum = bulletLineExNum;
        shooter.fireBullet(angle, cc.Vec2.ZERO);
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
        this.rigidbody.linearVelocity = cc.Vec2.ZERO;
    }
    actorName(){
        return '斯芬克斯';
    }
}
