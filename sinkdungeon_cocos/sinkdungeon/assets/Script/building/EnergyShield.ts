import DamageData from "../data/DamageData";
import Player from "../logic/Player";
import AudioPlayer from "../utils/AudioPlayer";
import IndexZ from "../utils/IndexZ";
import Building from "./Building";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnergyShield extends Building {

    anim:cc.Animation;
    isShow = false;
    private cover:cc.Node;
    private element:cc.Node;
    private base:cc.Node;
    private player:Player;
    private collider:cc.BoxCollider;
    private mat: cc.MaterialVariant;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cover = this.node.getChildByName('sprite').getChildByName('cover');
        this.element = this.node.getChildByName('sprite').getChildByName('cover').getChildByName('element');
        this.anim = this.getComponent(cc.Animation);
        this.collider = this.getComponent(cc.BoxCollider);
    }
    init(player:Player,maxHealth: number,scale:number){
        this.player = player;
        this.data.currentHealth = maxHealth;
        this.data.maxHealth = maxHealth;
        this.node.scale = scale;
        this.anim = this.getComponent(cc.Animation);
        this.node.zIndex = IndexZ.getActorZIndex(cc.v3(this.entity.Transform.position.x,this.entity.Transform.position.y-8*scale));
        this.base = this.node.getChildByName('base');
        this.base.parent = this.node.parent;
        this.base.position = this.entity.Transform.position;
        cc.tween(this.base).to(1,{scale:scale,opacity:255}).start();
        this.base.zIndex = IndexZ.FLOOR;
    }
    private hitLight(isHit: boolean) {
        if (!this.mat) {
            this.mat = this.node.getChildByName('sprite').getChildByName('cover').getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT);
    }
    //anim
    ShowFinish(){
        this.isShow = true;
        this.changeIdle();
    }
    private changeIdle(){
        if(!this.isShow){
            return;
        }
        if(this.checkTargetIn(this.player.node)){
            if(!this.anim.getAnimationState('EnergyShieldIdle').isPlaying){
                this.anim.play('EnergyShieldIdle');
            }
        }else{
            if(!this.anim.getAnimationState('EnergyShieldIdle1').isPlaying){
                this.anim.play('EnergyShieldIdle1');
            }
        }
    }
    checkTargetIn(targetNode:cc.Node){
        let x = this.entity.Transform.position.x-this.collider.size.width/2*this.node.scale;
        let y = this.entity.Transform.position.y-(this.collider.size.width/2-this.collider.offset.y)*this.node.scale;
        let w = this.collider.size.width*this.node.scale;
        let h = this.collider.size.height*this.node.scale;
        let rect = cc.rect(x,y,w,h);
        return rect.contains(cc.v2(targetNode.position.x,targetNode.position.y));
    }

    takeDamage(damage: DamageData): boolean {
        if (!this.isShow||this.data.currentHealth <= 0) {
            return false;
        }
        AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_HIT);
        this.hitLight(true);
        this.scheduleOnce(() => {
            this.hitLight(false);
        }, 0.15);
        this.data.currentHealth -= damage.getTotalDamage();
        this.changeColor();
        if (this.data.currentHealth <= 0) {
            this.data.currentHealth = 0;
            this.isShow = false;
            this.node.active = false;
            this.base.active = false;
            this.scheduleOnce(()=>{this.node.destroy();this.base.destroy();},1);
        }
        return true;
    }
    
    private changeColor(){
        let progress = Math.floor(255*this.data.currentHealth/this.data.maxHealth);
        if(progress<0){
            progress = 0;
        }else if(progress>255){
            progress = 255;
        }
        this.cover.color = cc.color(255,progress,progress);
        this.element.color = cc.color(255,progress,progress);
        this.base.color = cc.color(255,progress,progress);
    }
    timeDelay = 0;
    private isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }

    recoveryTimeDelay = 0;
    private isRecoveryTimeDelay(dt: number): boolean {
        this.recoveryTimeDelay += dt;
        if (this.recoveryTimeDelay > 2) {
            this.recoveryTimeDelay = 0;
            return true;
        }
        return false;
    }

    update (dt) {
        if(this.isTimeDelay(dt)){
            this.changeIdle();
        }
        if(this.isRecoveryTimeDelay(dt)){
            if(this.checkTargetIn(this.player.node)){
                this.player.updateDream(-1);
            }
        }
    }
}
