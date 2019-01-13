import BulletData from "../Data/BulletData";
import Logic from "../Logic";
import DamageData from "../Data/DamageData";
import Monster from "../Monster";
import Player from "../Player";
import Boss from "../Boss/Boss";
import MeleeWeapon from "../MeleeWeapon";

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
export default class Laser extends cc.Component {

    spriteNode: cc.Node;
    lightSprite: cc.Sprite;
    isFromPlayer = false;
    data: BulletData = new BulletData();

    // LIFE-CYCLE CALLBACKS:
    changeLaser(data: BulletData) {
        this.data = data;
    }
    onLoad() {
        this.spriteNode = this.node.getChildByName("sprite");
        this.lightSprite = this.node.getChildByName("light").getComponent(cc.Sprite);
        
    }
    onEnable() {
    }
    start() {
        let idleAction = cc.repeatForever(cc.sequence(
            cc.moveBy(0.05, 0, 0), cc.callFunc(() => { this.changeLightRes('laser001light001') }),
            cc.moveBy(0.05, 0, 0), cc.callFunc(() => { this.changeLightRes('laser001light002') }),
            cc.moveBy(0.05, 0, 0), cc.callFunc(() => { this.changeLightRes('laser001light003') })));
        this.lightSprite.node.runAction(idleAction);
    }
    changeLightRes(resName: string, suffix?: string) {
        if (!this.lightSprite) {
            this.lightSprite = this.node.getChildByName("light").getComponent(cc.Sprite);
        }
        let spriteFrame = this.getSpriteFrameByName(resName, suffix);
        this.lightSprite.spriteFrame = spriteFrame;
    }
    private getSpriteFrameByName(resName: string, suffix?: string): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrames[resName + suffix];
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrames[resName];
        }
        return spriteFrame;
    }
    fire(target: cc.Vec2) {
        target = this.node.convertToWorldSpaceAR(target);
        let p = this.node.convertToWorldSpaceAR(cc.v2(0,0));
        let results = cc.director.getPhysicsManager().rayCast(p,target,cc.RayCastType.All);
        let c = target.clone();
        let closestNode = null;
        let distance = Logic.getDistance(p,target);
       
        for (let result of results) {
            let d = Logic.getDistance(result.point,p);
            if(d<distance ){
               
                distance = d;
                c = result.point.clone();
            }

        }
        let d = Logic.getDistance(p, c);
        this.spriteNode.width = d;
        this.spriteNode.scaleY = 0;
        this.lightSprite.node.setPosition(d-16,0);
        let scaleAction = cc.sequence(cc.scaleTo(0.05,1),cc.scaleTo(0.05,0));
        this.spriteNode.runAction(scaleAction);
        setTimeout(() => { cc.director.emit('destorylaser', { detail: { laserNode: this.node } }); }, 100);

    }
    attacking(attackTarget:cc.Node) {
        if (!attackTarget) {
            return;
        }
        let damage = new DamageData();
        damage.valueCopy(this.data.damage);
        let monster = attackTarget.getComponent(Monster);
        if (monster && !monster.isDied &&this.isFromPlayer) {
            monster.takeDamage(damage);
        }
        let player = attackTarget.getComponent(Player);
        if (player && !player.isDied&&!this.isFromPlayer) {
            player.takeDamage(damage);
        }
        let boss = attackTarget.getComponent(Boss);
        if (boss && !boss.isDied&&this.isFromPlayer) {
            boss.takeDamage(damage);
        }
        
       
    }
    // update (dt) {}
}
