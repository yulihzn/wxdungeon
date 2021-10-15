import Logic from "../logic/Logic";
import DamageData from "../data/DamageData";
import Actor from "../base/Actor";
import FromData from "../data/FromData";
import StatusData from "../data/StatusData";

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
export default class SlimeVenom extends Actor {
    venom1: cc.Node;
    venom2: cc.Node;
    venom3: cc.Node;
    target: Actor;
    anim: cc.Animation;
    sprite: cc.Node;
    isHide = false;
    isForever = false;
    from: FromData = FromData.getClone('史莱姆毒液', 'venom');
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.venom1 = this.node.getChildByName('sprite').getChildByName('venom1');
        this.venom2 = this.node.getChildByName('sprite').getChildByName('venom2');
        this.venom3 = this.node.getChildByName('sprite').getChildByName('venom2');
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
    }

    onEnable() {
        this.isHide = false;
        this.sprite.opacity = 255;
        this.venom1.angle = Logic.getRandomNum(0, 180);
        this.venom2.angle = Logic.getRandomNum(0, 180);
        this.venom2.angle = Logic.getRandomNum(0, 180);
        this.anim.play();
        if (!this.isForever) {
            this.scheduleOnce(() => {
                if (this.anim) {
                    this.isHide = true;
                    this.anim.play('VenomHide');
                    this.scheduleOnce(() => { cc.director.emit('destoryvenom', { detail: { coinNode: this.node } }); }, 1.5);
                }
            }, 3);
        }
        this.damagePlayer(this.from);
    }
    addStatus(statusType: string, from: FromData) {
    }
    /**获取玩家距离 */
    getNearPlayerDistance(playerNode: cc.Node): number {
        let dis = Logic.getDistanceNoSqrt(this.entity.Transform.position, playerNode.position);
        return dis;
    }
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 1) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        if(Logic.isGamePause){
            return;
        }
        if (this.isCheckTimeDelay(dt)) {
            this.damagePlayer(this.from);
        }
    }
    private damagePlayer(from: FromData) {
        if (this.target && this.getNearPlayerDistance(this.target.node) < 60 * this.node.scale && this.node.active && !this.isHide) {
            let dd = new DamageData();
            dd.magicDamage = 3;
            this.target.takeDamage(dd, from);
        }
    }
    getCenterPosition(): cc.Vec3 {
        return this.entity.Transform.position.clone();
    }
    takeDamage(damge: DamageData) {
        return false;
    }
    actorName() {
        return '史莱姆毒液';
    }

    takeDizz(dizzDuration: number): void {
    }

    updateStatus(statusList:StatusData[],totalStatusData:StatusData): void {
    }
    hideSelf(hideDuration: number): void {
    }
    updateDream(offset: number): number {
        return 0;
    }
    setLinearVelocity(movement: cc.Vec2){

    }
}
