import Logic from "../Logic";
import Player from "../Player";
import DamageData from "../Data/DamageData";
import { EventHelper } from "../EventHelper";
import Actor from "../Base/Actor";
import StatusManager from "../Manager/StatusManager";
import FromData from "../Data/FromData";

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
export default class DryadGrass extends Actor {
    
    // LIFE-CYCLE CALLBACKS:

    isUp = false;//是否已经上升
    anim: cc.Animation;
    isAuto = true;//是否自动上升
    isUping = false;//是否上升中

    onLoad() {
        this.isUp = false;
    }
    takeDamage(){
        return false;
    }
    fall() {
        this.anim = this.getComponent(cc.Animation);
        this.anim.play();
        this.isUping = true;
    }
    //anim
    TwineUp() {
        this.isUp = true;
        this.scheduleOnce(() => { this.isUp = false; }, 0.1);
        this.scheduleOnce(() => {
            if(this.node){
                this.node.destroy();
            }
            }, 6);
        
    }
    start() {

    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.getComponent(Player);
        if(player && !this.isAuto && !this.isUping){
            this.fall();
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let player = other.getComponent(Player);
        if (player) {
            if (this.isUp&&this.isValid) {
                this.isUp = false;
                let from = FromData.getClone(this.actorName(),'dryadtwine03');
                if(player.takeDamage(new DamageData(2),from)){
                    player.addStatus(StatusManager.TWINE,from);
                }
            }
            
        }
    }
    addStatus(statusType: string, from: FromData) {
    }
    actorName(){
        return '树根缠绕';
    }
}
