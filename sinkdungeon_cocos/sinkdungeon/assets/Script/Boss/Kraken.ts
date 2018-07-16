import HealthBar from "../HealthBar";
import MonsterData from "../Data/MonsterData";
import Shooter from "../Shooter";
import { EventConstant } from "../EventConstant";
import KrakenSwingHand from "./KrakenSwingHand";

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
export default class Kraken extends cc.Component {

    @property(cc.Vec2)
    pos: cc.Vec2 = cc.v2(0, 0);
    @property(cc.Label)
    label: cc.Label = null;
    @property(HealthBar)
    healthBar: HealthBar = null;
    private sprite: cc.Node;
    private anim: cc.Animation;
    isDied = false;
    isShow = false;
    // currentHealth: number = 3;
    // maxHealth: number = 3;
    private timeDelay = 0;
    // attackPonit = 1;
    data: MonsterData = new MonsterData();
    shooter:Shooter;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDied = false;
        this.isShow = false;
        this.data.currentHealth = 20;
        this.data.maxHealth = 20;
        this.data.attackPoint = 1;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        this.sprite.opacity = 0;
        this.shooter = this.getComponentInChildren(Shooter);
        // let shootNode = this.node.getChildByName('Shooter');
        // shootNode.parent = this.node.parent;
        // shootNode.position = cc.v2(288,460);
        // shootNode.zIndex = 9000;
        
    }
    public isBossZone(target: cc.Vec2): boolean {
        return target.y > this.pos.y && target.x > this.pos.x - 3 && target.x < this.pos.x + 3;
    }
    updatePlayerPos() {
        this.node.x = this.pos.x * 64 + 32;
        this.node.y = this.pos.y * 64 + 70;
    }
    transportPlayer(x: number, y: number) {
        // this.sprite.rotation = 0;
        // this.sprite.scale = 1;
        // this.sprite.opacity = 255;
        // this.sprite.x = 0;
        // this.sprite.y = 0;
        this.pos.x = x;
        this.pos.y = y;
        this.changeZIndex();
    }
    changeZIndex() {
        this.node.zIndex = 1000 + (9 - this.pos.y - 1) * 100 + 2;
        if(this.isShow&&!this.isDied){
            this.node.zIndex = 3000 + (9 - this.pos.y - 1) * 100 + 2;
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
            if (finish) { finish(this.data.attackPoint); }
        }), cc.moveTo(0.1, 0, 0));
        this.sprite.runAction(action);
    }

    start() {
        let ss = this.node.getComponentsInChildren(cc.Sprite);
        for (let i = 0; i < ss.length; i++) {
            if (ss[i].spriteFrame) {
                ss[i].spriteFrame.getTexture().setAliasTexParameters();
            }
        }
        this.changeZIndex();
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.maxHealth);
    }

    takeDamage(damage: number,pos:cc.Vec2) {
        this.data.currentHealth -= damage;
        if (this.data.currentHealth > this.data.maxHealth) {
            this.data.currentHealth = this.data.maxHealth;
        }
        this.anim.playAdditive('KrakenHit');
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.maxHealth);
        if (this.data.currentHealth < 1) {
            this.killed();
        }
        if(pos.x>this.pos.x){
            this.anim.playAdditive('KrakenSwingRight');
        }else if(pos.x<this.pos.x){
            this.anim.playAdditive('KrakenSwingLeft');
        }
    }
    killed() {
        if (this.isDied) {
            return;
        }
        if(this.shooter){
            this.shooter.auto = false;
        }
        this.isDied = true;
        this.changeZIndex();
        this.anim.play('KrakenDie');
    }
    //Animation
    BossShow() {
        this.isShow = true;
       let hands = this.getComponentsInChildren(KrakenSwingHand);
       for(let hand of hands){
           hand.isShow = true;
       }
        this.anim.play('KrakenIdle');
        if(this.shooter){
            this.shooter.auto = true;
        }
        this.changeZIndex();
    }
    //Animation
    BossHit(){
        
    }
    showBoss() {
        this.anim.play('KrakenShow');
    }

    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            this.updatePlayerPos();
            let ss = this.node.getComponentsInChildren(cc.Sprite);
            for (let i = 0; i < ss.length; i++) {
                if (ss[i].spriteFrame) {
                    ss[i].spriteFrame.getTexture().setAliasTexParameters();
                }
            }
        }

        if (this.label) {
            this.label.string = "" + this.node.zIndex;
        }
        this.healthBar.node.active = !this.isDied;
        if(this.shooter){
            this.shooter.auto = this.isShow&&!this.isDied;
        }
    }
    
}
