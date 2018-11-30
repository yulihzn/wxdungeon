import HealthBar from "../HealthBar";
import MonsterData from "../Data/MonsterData";
import Shooter from "../Shooter";
import { EventConstant } from "../EventConstant";
import KrakenSwingHand from "./KrakenSwingHand";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";
import Boss from "./Boss";
import StatusManager from "../Manager/StatusManager";

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
export default class Kraken extends Boss {
    @property(cc.Label)
    label: cc.Label = null;
    @property(KrakenSwingHand)
    hand1:KrakenSwingHand = null;
    @property(KrakenSwingHand)
    hand2:KrakenSwingHand = null;
    private sprite: cc.Node;
    private anim: cc.Animation;
    private timeDelay = 0;
    shooter: Shooter;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDied = false;
        this.isShow = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        this.sprite.opacity = 0;
        this.shooter = this.getComponentInChildren(Shooter);

    }
    updatePlayerPos() {
        this.node.x = this.pos.x * 64 + 32;
        this.node.y = this.pos.y * 64 + 70;
    }
    
    changeZIndex() {
        this.node.zIndex = 1000 + (Dungeon.HEIGHT_SIZE - this.pos.y - 1) * 100 + 2;
        if (this.isShow && !this.isDied) {
            this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - this.pos.y - 1) * 100 + 2;
        }
    }
    attack(dir, finish) {
        if (this.isDied) {
            return;
        }
        let x = 0;
        let y = 0;
        switch (dir) {
            case 0: y += 32; break;
            case 1: y -= 32; break;
            case 2: x -= 32; break;
            case 3: x += 32; break;
            case 4: break;
        }
        let action = cc.sequence(cc.moveBy(0.1, x, y), cc.callFunc(() => {
            if (finish) { finish(this.data.Common.damageMin); }
        }), cc.moveTo(0.1, 0, 0));
        this.sprite.runAction(action);
    }

    start() {
        super.start();
    }

    takeDamage(damage: DamageData):boolean {
        if(this.isDied||!this.isShow){
            return false;
        }
        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage();
        if (this.data.currentHealth > this.data.Common.maxHealth) {
            this.data.currentHealth = this.data.Common.maxHealth;
        }
        this.anim.playAdditive('KrakenHit');
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
        if(this.dungeon){
            let pos = this.dungeon.player.pos;
            if (pos.x > this.pos.x && !this.anim.getAnimationState("KrakenSwingRight").isPlaying) {
                this.anim.playAdditive('KrakenSwingRight');
            } else if (pos.x < this.pos.x && !this.anim.getAnimationState("KrakenSwingLeft").isPlaying) {
                this.anim.playAdditive('KrakenSwingLeft');
            }
        }
        return true;
    }
    
    killed() {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        this.changeZIndex();
        let hands = this.getComponentsInChildren(KrakenSwingHand);
        for (let hand of hands) {
            hand.isShow = false;
        }
        this.anim.play('KrakenDie');
    }
    //Animation
    BossShow() {
        this.isShow = true;
        let hands = this.getComponentsInChildren(KrakenSwingHand);
        for (let hand of hands) {
            hand.isShow = true;
        }
        this.anim.play('KrakenIdle');
        this.changeZIndex();
    }
    //Animation
    BossHit() {

    }
    showBoss() {
        this.anim.play('KrakenShow');
        if(this.healthBar){
            this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
            this.healthBar.node.active = !this.isDied;
        }
    }
    actionTimeDelay = 0;
    isActionTimeDelay(dt: number): boolean {
        this.actionTimeDelay += dt;
        if (this.actionTimeDelay > 1) {
            this.actionTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            this.updatePlayerPos();
        }
        if(this.isActionTimeDelay(dt)){
            this.bossAction();
        }
        if (this.data.currentHealth < 1) {
            this.killed();
            this.hand1.isShow = false;
            this.hand2.isShow = false;
        }
        if (this.label) {
            this.label.string = "" + this.node.zIndex;
        }
        this.healthBar.node.active = !this.isDied;
    }
    bossAction() {
        if (this.isDied||!this.isShow) {
            return;
        }
        this.changeZIndex();
        if(this.shooter&&this.dungeon){
            let pos  = this.node.position.clone().add(this.shooter.node.position);
            let hv = this.dungeon.player.getCenterPosition().sub(pos);
            if(!hv.equals(cc.Vec2.ZERO)){
                hv = hv.normalizeSelf();
                this.shooter.setHv(hv);
                this.shooter.dungeon = this.dungeon;
                this.shooter.fireBullet();
            }
            if(this.data.currentHealth<this.data.Common.maxHealth/2){
                this.dungeon.addFallStone(this.dungeon.player.node.position,true);
                this.shooter.fireBullet(30);
                this.shooter.fireBullet(-30);
            }
        }
        

    }
}
