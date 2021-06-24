import DamageData from "../Data/DamageData";
import Player from "../Player";
import AudioPlayer from "../Utils/AudioPlayer";
import IndexZ from "../Utils/IndexZ";
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
    private player:Player;
    private collider:cc.BoxCollider;
    private mat: cc.MaterialVariant;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cover = this.node.getChildByName('sprite').getChildByName('cover');
        this.anim = this.getComponent(cc.Animation);
        this.collider = this.getComponent(cc.BoxCollider);
    }
    init(player:Player,maxHealth: number,scale:number){
        this.player = player;
        this.data.currentHealth = maxHealth;
        this.data.maxHealth = maxHealth;
        this.node.scale = scale;
        this.anim = this.getComponent(cc.Animation);
        this.node.zIndex = IndexZ.getActorZIndex(cc.v3(this.node.position.x,this.node.position.y-8*scale));
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
        let x = this.node.position.x-this.collider.size.width/2*this.node.scale;
        let y = this.node.position.y-(this.collider.size.width/2-this.collider.offset.y)*this.node.scale;
        let w = this.collider.size.width*this.node.scale;
        let h = this.collider.size.height*this.node.scale;
        let rect = cc.rect(x,y,w,h);
        return rect.contains(cc.v2(targetNode.position.x,targetNode.position.y));
    }

    takeDamage(damage: DamageData): boolean {
        if (this.isShow||this.data.currentHealth <= 0) {
            return false;
        }
        AudioPlayer.play(AudioPlayer.BOSS_ICEDEMON_DEFEND);
        this.hitLight(true);
        this.scheduleOnce(() => {
            this.hitLight(false);
        }, 0.15);
        this.data.currentHealth -= damage.getTotalDamage();
        this.changeColor();
        if (this.data.currentHealth <= 0) {
            this.data.currentHealth = 0;
            this.isShow = false;
            this.scheduleOnce(()=>{this.destroy()},1);
        }
        return true;
    }
    
    private changeColor(){
        this.cover.color = cc.color(255,255,255);
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
    update (dt) {
        if(this.isTimeDelay(dt)){
            this.changeIdle();
        }
    }
}
