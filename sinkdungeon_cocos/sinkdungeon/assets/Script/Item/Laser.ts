import BulletData from "../Data/BulletData";
import Logic from "../Logic";

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
        let p = this.node.convertToWorldSpaceAR(this.node.position);
        let result = cc.director.getPhysicsManager().rayCast(p,target,cc.RayCastType.Closest);
        let c = target.clone();
        if(result.length>0){
            c = result[0].point.clone();
        }
        let d = Logic.getDistance(p, c);
        this.spriteNode.width = d;
        this.spriteNode.scaleY = 0;
        this.lightSprite.node.setPosition(d-16,0);
        let scaleAction = cc.sequence(cc.scaleTo(0.1,1),cc.scaleTo(0.1,0));
        this.spriteNode.runAction(scaleAction);
        setTimeout(() => { cc.director.emit('destorylaser', { detail: { laserNode: this.node } }); }, 200);

    }

    // update (dt) {}
}
