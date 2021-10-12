import DamageData from "../data/DamageData";
import Building from "./Building";
import AudioPlayer from "../utils/AudioPlayer";
import FromData from "../data/FromData";
import NonPlayer from "../NonPlayer";
import ActorUtils from "../utils/ActorUtils";

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
export default class FallStone extends Building {


    // LIFE-CYCLE CALLBACKS:

    isFall = false;//是否已经下落
    anim: cc.Animation;
    isAuto = true;//是否自动下落
    isFalling = false;//是否下落中

    onLoad() {
        this.isFall = false;
    }
    fall(withFire?:boolean) {
        if(withFire){
            this.node.getChildByName('stone').getChildByName('fire').active = true;
            this.node.getChildByName('stone').color = cc.color(253,122,37);
        }
        this.anim = this.getComponent(cc.Animation);
        this.anim.play();
        this.isFalling = true;
    }
    //anim
    FallFinish() {
        AudioPlayer.play(AudioPlayer.BOOM);
        this.isFall = true;
        this.scheduleOnce(() => { this.isFall = false; }, 0.1);
        this.scheduleOnce(() => {
            if(this.node){
                this.node.destroy();
            }
            }, 2);
        
    }
    start() {

    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let target = ActorUtils.getEnemyCollisionTarget(other);
        if(target && !this.isAuto && !this.isFalling){
            this.fall();
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let target = ActorUtils.getEnemyCollisionTarget(other);
        if (target) {
            if (this.isFall&&this.isValid) {
                this.isFall = false;
                target.takeDamage(new DamageData(2),FromData.getClone('落石','stone'));
            }
        }
        let monster = other.getComponent(NonPlayer);
        if(monster){
            if (this.isFall&&this.isValid) {
                this.isFall = false;
                monster.takeDamage(new DamageData(2));
            }
        }
    }
    // update (dt) {}
}
