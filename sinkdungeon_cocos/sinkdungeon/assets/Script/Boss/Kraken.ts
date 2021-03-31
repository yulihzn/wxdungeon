import Shooter from "../Shooter";
import { EventHelper } from "../EventHelper";
import KrakenSwingHand from "./KrakenSwingHand";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";
import Boss from "./Boss";
import NextStep from "../Utils/NextStep";
import AudioPlayer from "../Utils/AudioPlayer";
import FromData from "../Data/FromData";
import Achievements from "../Achievement";
import IndexZ from "../Utils/IndexZ";
import Item from "../Item/Item";

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
    @property(cc.Prefab)
    swingHand:cc.Prefab = null;
    private timeDelay = 0;
    shooter: Shooter;
    remoteSkill = new NextStep();
    handSkill = new NextStep();
    anim: cc.Animation;
    hand01:KrakenSwingHand;
    hand02:KrakenSwingHand;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sc.isDied = false;
        this.sc.isShow = false;
        this.shooter = this.getComponentInChildren(Shooter);
        this.shooter.from.valueCopy(FromData.getClone(this.actorName(),'boss001'));
        this.anim = this.getComponent(cc.Animation);
        
    }
    //anim
    ShowFinish() {
        this.anim.play('KrakenHeadIdle');
        this.sc.isShow = true;
        let pos1 = Dungeon.getPosInMap(cc.v3(Dungeon.WIDTH_SIZE+2, -8));
        let pos2 = Dungeon.getPosInMap(cc.v3(-2, -8));
        this.hand01 = this.addHand(pos1,true);
        this.hand02 = this.addHand(pos2,false);
    }
    addHand(pos:cc.Vec3,isReverse:boolean){
        let hand = cc.instantiate(this.swingHand);
        this.dungeon.node.addChild(hand);
        hand.setPosition(pos);
        hand.scaleX = isReverse?-50:50;
        hand.scaleY = -50;
        hand.zIndex = IndexZ.OVERHEAD;
        let h = hand.getComponentInChildren(KrakenSwingHand);
        this.scheduleOnce(()=>{
            h.isShow = true;
        },2)
        return h;
    }
    updatePlayerPos() {
        let pos = Dungeon.getPosInMap(cc.v3(Dungeon.WIDTH_SIZE/2, Dungeon.HEIGHT_SIZE+2));
        this.node.setPosition(pos);
    }
    
    changeZIndex() {
        this.node.zIndex = IndexZ.KRAKENBODY;
    }

    start() {
        super.start();
    }

    takeDamage(damage: DamageData):boolean {
        if(this.sc.isDied||!this.sc.isShow){
            return false;
        }
        
        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage();
        if (this.data.currentHealth > this.data.Common.maxHealth) {
            this.data.currentHealth = this.data.Common.maxHealth;
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
        cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.MONSTER_HIT}});
        return true;
    }
    
    killed() {
        if (this.sc.isDied) {
            return;
        }
        Achievements.addMonsterKillAchievement(this.data.resName);
        this.sc.isDied = true;
        this.changeZIndex();
        let hands = this.getComponentsInChildren(KrakenSwingHand);
        for (let hand of hands) {
            hand.isShow = false;
        }
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 5);
        this.getLoot();
    }
    getLoot(isSteal?:boolean){
        if(this.dungeon){
            let rand4save = Logic.mapManager.getRandom4Save(this.seed);
            let p = cc.v3(Math.floor(Dungeon.WIDTH_SIZE/2),Math.floor(Dungeon.HEIGHT_SIZE/2));
            let pos = Dungeon.getPosInMap(p);
            cc.director.emit(EventHelper.DUNGEON_ADD_COIN, { detail: { pos: pos, count: 19 } });
            cc.director.emit(EventHelper.DUNGEON_ADD_OILGOLD, { detail: { pos: pos, count: rand4save.getRandomNum(1, 29) } });
            let chance = Logic.getHalfChance()&&isSteal||!isSteal;
            if(chance){
                cc.director.emit(EventHelper.DUNGEON_ADD_ITEM, { detail: { pos: this.node.position, res:Item.HEART } });
                cc.director.emit(EventHelper.DUNGEON_ADD_ITEM, { detail: { pos: this.node.position, res:Item.DREAM } });
            }
            this.dungeon.addEquipment(Logic.getRandomEquipType(rand4save), p,null,3);
        }
    }
    showBoss() {
        if(this.healthBar){
            this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
            this.healthBar.node.active = !this.sc.isDied;
        }
        if (!this.anim) {
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play('KrakenHeadShow');
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
        if(this.isActionTimeDelay(dt)){
            this.bossAction();
        }
        if (this.data.currentHealth < 1) {
            this.killed();
        }
       
        if (this.label) {
            this.label.string = "" + this.node.zIndex;
        }
        this.healthBar.node.active = !this.sc.isDied;
    }
    bossAction() {
        if (this.sc.isDied||!this.sc.isShow||!this.dungeon) {
            return;
        }
        
        if(this.hand01){
            this.hand01.node.parent.y = Logic.lerp(this.hand01.node.y,this.dungeon.player.node.y,0.1);
        }
        if(this.hand02){
            this.hand02.node.parent.y = Logic.lerp(this.hand02.node.y,this.dungeon.player.node.y,0.1);
        }
        if(this.shooter){
            this.remoteSkill.next(()=>{
                this.shooter.skipTopwall = true;
                let pos  = this.node.position.clone().add(this.shooter.node.position);
                let hv = this.dungeon.player.getCenterPosition().sub(pos);
                if(!hv.equals(cc.Vec3.ZERO)){
                    hv = hv.normalizeSelf();
                    this.shooter.setHv(hv);
                    this.shooter.dungeon = this.dungeon;
                    this.shooter.data.bulletType = "bullet004";
                    this.shooter.fireBullet();
                    this.shooter.fireBullet(30);
                    this.shooter.fireBullet(-30);
                }
                if(this.data.currentHealth<this.data.Common.maxHealth/2){
                    this.dungeon.addFallStone(this.dungeon.player.node.position,true);
                    this.shooter.fireBullet(30);
                    this.shooter.fireBullet(-30);
                    this.shooter.fireBullet(15);
                    this.shooter.fireBullet(-15);
                }
            },2);
            
        }
        this.handSkill.next(()=>{
            if(this.dungeon.player.pos.x>Dungeon.WIDTH_SIZE/2){
                if(this.hand01){
                    this.hand01.swing();
                }
            }else{
                if(this.hand02){
                    this.hand02.swing();
                }
            }
        },10)
        

    }
    actorName(){
        return '海妖';
    }
}
