import DamageData from "../Data/DamageData";
import StatusManager from "../Manager/StatusManager";
import FromData from "../Data/FromData";
import Actor from "../Base/Actor";
import ActorUtils from "../Utils/ActorUtils";


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
export default class IceDemonThron extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    isUp = false;//是否已经上升
    anim: cc.Animation;
    isAuto = true;//是否自动上升
    isUping = false;//是否上升中

    onLoad() {
        this.isUp = false;
        let mat:cc.MaterialVariant = this.node.getChildByName('thron').getComponent(cc.Sprite).getMaterial(0);
        mat.setProperty('addColor',cc.color(194,255,255));
    }
    fall() {
        this.anim = this.getComponent(cc.Animation);
        this.anim.play();
        this.isUping = true;
    }
    //anim
    ThronUp() {
        this.isUp = true;
        this.scheduleOnce(() => { this.isUp = false; }, 0.1);
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
        if(target && !this.isAuto && !this.isUping){
            this.fall();
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let target = ActorUtils.getEnemyCollisionTarget(other);
        if (target) {
            if (this.isUp&&this.isValid) {
                this.isUp = false;
                let from = FromData.getClone('冰刺','bossicethron02');
                if(target.takeDamage(new DamageData(3),from)){
                    target.addStatus(StatusManager.FROZEN,from);
                }
            }
            
        }
    }
}
