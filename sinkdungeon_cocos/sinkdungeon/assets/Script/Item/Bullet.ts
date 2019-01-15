import { EventConstant } from "../EventConstant";
import Monster from "../Monster";
import Player from "../Player";
import MeleeWeapon from "../MeleeWeapon";
import DamageData from "../Data/DamageData";
import Logic from "../Logic";
import Boss from "../Boss/Boss";
import BulletData from "../Data/BulletData";

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
export default class Bullet extends cc.Component {

    data: BulletData = new BulletData();

    anim: cc.Animation;
    dir = 0;
    tagetPos = cc.v2(0, 0);
    rigidBody: cc.RigidBody;
    hv = cc.v2(0, 0);
    isFromPlayer = false;

    sprite: cc.Node;
    light: cc.Node;
    circleCollider: cc.CircleCollider;
    boxCollider: cc.BoxCollider;
    circlePCollider: cc.PhysicsCircleCollider;
    boxPCollider: cc.PhysicsBoxCollider;

    effect: cc.Node;

    laserSpriteNode: cc.Node;
    laserLightSprite: cc.Sprite;
    laserHeadSprite: cc.Sprite;
    laserNode: cc.Node;

    startPos:cc.Vec2 = cc.v2(0,0);//子弹起始位置



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.rigidBody = this.getComponent(cc.RigidBody);
        this.effect = this.node.getChildByName('effect');
        this.circleCollider = this.getComponent(cc.CircleCollider);
        this.boxCollider = this.getComponent(cc.BoxCollider);
        this.circlePCollider = this.getComponent(cc.PhysicsCircleCollider);
        this.boxPCollider = this.getComponent(cc.PhysicsBoxCollider);
        this.sprite = this.node.getChildByName('sprite');
        this.sprite.opacity = 255;
        this.light = this.node.getChildByName('light');
        this.light.opacity = 0;
        this.laserNode = this.node.getChildByName("laser");
        this.laserSpriteNode = this.laserNode.getChildByName("sprite");
        this.laserLightSprite = this.laserNode.getChildByName("light").getComponent(cc.Sprite);
        this.laserHeadSprite = this.laserNode.getChildByName("head").getComponent(cc.Sprite);

    }
    onEnable() {
        this.tagetPos = cc.v2(0, 0);
        this.rigidBody.linearVelocity = cc.v2(0, 0);
        this.sprite = this.node.getChildByName('sprite');
        this.sprite.opacity = 255;
        this.light = this.node.getChildByName('light');
        this.light.opacity = 0;
        this.laserNode = this.node.getChildByName("laser");
        this.laserSpriteNode = this.laserNode.getChildByName("sprite");
        this.laserLightSprite = this.laserNode.getChildByName("light").getComponent(cc.Sprite);
        this.laserHeadSprite = this.laserNode.getChildByName("head").getComponent(cc.Sprite);

    }
    changeBullet(data: BulletData) {
        this.data = data;
        this.changeRes(data.resName, data.lightName, data.lightColor, data.size);
        this.circleCollider.enabled = data.isRect == 0;
        this.boxCollider.enabled = data.isRect == 1;
        this.circlePCollider.enabled = data.isRect == 0;
        this.boxPCollider.enabled = data.isRect == 1;
        this.light.position = data.isRect ? cc.v2(8, 0) : cc.v2(0, 0);
        this.node.scale = data.size > 0 ? data.size : 1;
        this.initLaser();

    }
    private initLaser(): void {
        this.laserNode.active = this.data.isLaser == 1;
        if (this.data.isLaser != 1) {
            return;
        }
        if (!this.laserNode) {
            this.laserNode = this.node.getChildByName("laser");
        }
        this.sprite.opacity = 0;
        this.laserNode.opacity = 0;
        this.laserHeadSprite.spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser, 'head');
        this.laserNode.stopAllActions();

        let idleAction = cc.repeatForever(cc.sequence(
            cc.moveBy(0.05, 0, 0), cc.callFunc(() => { this.laserLightSprite.spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser, 'light001'); }),
            cc.moveBy(0.05, 0, 0), cc.callFunc(() => { this.laserLightSprite.spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser, 'light002'); }),
            cc.moveBy(0.05, 0, 0), cc.callFunc(() => { this.laserLightSprite.spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser, 'light003'); })));
        
        this.laserLightSprite.node.runAction(idleAction);
    }
    private showLaser(): void {
        if (this.data.isLaser != 1) {
            return;
        }
        let endPos = this.node.convertToWorldSpaceAR(cc.v2(0,0));
        let distance = Logic.getDistance(this.startPos,endPos);
        let offset = 32;
        this.laserSpriteNode.width = distance-offset;
        this.laserSpriteNode.setPosition(cc.v2(-distance+offset,0));
        this.laserHeadSprite.node.setPosition(cc.v2(-distance+offset,0));
        this.laserNode.opacity = 255;
        this.laserNode.scaleX = 1;
        this.laserNode.scaleY = 1;
        this.laserLightSprite.node.setPosition(-16,0);
        let scaleAction = cc.sequence(cc.scaleTo(0.1,1,1),cc.scaleTo(0.1,1,0));
        this.laserNode.runAction(scaleAction);
        setTimeout(() => { cc.director.emit('destorybullet', { detail: { bulletNode: this.node } }); }, 200);
    }

    private changeRes(resName: string, lightName: string, lightColor: string, size: number, suffix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
        }
        if (!this.sprite || resName.length < 1) {
            return;
        }
        let s1 = this.getSpriteFrameByName(resName, suffix);
        let s2 = this.getSpriteFrameByName(lightName, suffix);
        
        if(s1){
            this.sprite.getComponent(cc.Sprite).spriteFrame = s1;
            this.sprite.width = s1.getRect().width * size;
            this.sprite.height = s1.getRect().height * size;
        }
        if(s2){
            this.light.getComponent(cc.Sprite).spriteFrame = s2;
            this.light.width = s2.getRect().width * size;
            this.light.height = s2.getRect().height * size;
            let color = cc.color(255, 255, 255).fromHEX(lightColor);
            this.light.color = color;
        }
        
    }
    private getSpriteFrameByName(resName: string, suffix?: string): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrames[resName + suffix];
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrames[resName];
        }
        return spriteFrame;
    }

    //animation
    MeleeFinish() {
        cc.director.emit('destorybullet', { detail: { bulletNode: this.node } });
    }
    //animation
    showBullet(hv: cc.Vec2) {
        this.hv = hv;
        this.fire(this.hv);
    }
    //animation
    BulletDestory() {
        cc.director.emit('destorybullet', { detail: { bulletNode: this.node } });
    }
    fire(hv:cc.Vec2) {
        if (!this.rigidBody) {
            this.rigidBody = this.getComponent(cc.RigidBody);
        }
        this.rigidBody.linearVelocity = cc.v2(this.data.speed * hv.x, this.data.speed * hv.y);
        this.startPos = this.node.convertToWorldSpaceAR(cc.v2(0,0));
    }

    start() {

    }
    onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        let isDestory = true;
        let player = otherCollider.node.getComponent(Player);
        let monster = otherCollider.node.getComponent(Monster);
        let boss = otherCollider.node.getComponent(Boss);
        let bullet = otherCollider.node.getComponent(Bullet);

        //子弹玩家怪物boss不销毁
        if (player || monster || boss || bullet) {
            isDestory = false;
        }
        //触发器不销毁
        if (otherCollider.sensor) {
            isDestory = false;
        }
        //上面的墙不销毁
        if (otherCollider.tag == 2) {
            isDestory = false;
        }
        if (isDestory && this.anim) {
            this.rigidBody.linearVelocity = cc.v2(0, 0);
            this.data.isLaser==1?this.showLaser():this.anim.play("Bullet001Hit");

        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let isAttack = true;
        let bullet = other.node.getComponent(Bullet);
        let player = other.node.getComponent(Player);
        let monster = other.node.getComponent(Monster);
        let boss = other.node.getComponent(Boss);
        if (!this.isFromPlayer && (monster || boss)) {
            isAttack = false;
        }
        if (this.isFromPlayer && player) {
            isAttack = false;
        }
        if (bullet) {
            isAttack = false;
        }
        if (isAttack) {
            this.attacking(other.node);
        }
    }
    attacking(attackTarget: cc.Node) {
        if (!attackTarget) {
            return;
        }
        let damage = new DamageData();
        damage.valueCopy(this.data.damage);
        let isDestory = false;
        let monster = attackTarget.getComponent(Monster);
        if (monster && !monster.isDied) {
            monster.takeDamage(damage);
            isDestory = true;
        }
        let player = attackTarget.getComponent(Player);
        if (player && !player.isDied) {
            player.takeDamage(damage);
            isDestory = true;
        }
        let boss = attackTarget.getComponent(Boss);
        if (boss && !boss.isDied) {
            boss.takeDamage(damage);
            isDestory = true;
        }

        let meleeWeapon: MeleeWeapon = attackTarget.getComponent(MeleeWeapon);
        if (meleeWeapon && meleeWeapon.isAttacking) {
            isDestory = true;
        }
        if (isDestory && this.anim && !this.anim.getAnimationState('Bullet001Hit').isPlaying) {
            this.rigidBody.linearVelocity = cc.v2(0, 0);
            this.data.isLaser==1?this.showLaser():this.anim.play("Bullet001Hit");
        }
    }

    update(dt) {

    }

}
