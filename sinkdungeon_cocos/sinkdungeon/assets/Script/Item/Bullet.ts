import { EventConstant } from "../EventConstant";
import Monster from "../Monster";
import Player from "../Player";
import MeleeWeapon from "../MeleeWeapon";
import DamageData from "../Data/DamageData";
import Logic from "../Logic";
import Boss from "../Boss/Boss";
import BulletData from "../Data/BulletData";
import Dungeon from "../Dungeon";
import StatusManager from "../Manager/StatusManager";
import Boom from "./Boom";

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

    @property(cc.Prefab)
    boom: cc.Prefab = null;
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
    dungeon: Dungeon;

    startPos: cc.Vec2 = cc.v2(0, 0);//子弹起始位置

    isTrackDelay = false;//是否延迟追踪
    isDecelerateDelay = false;//是否延迟减速

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
        this.sprite.rotation = 0;
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
        this.sprite.rotation = 0;
        this.light = this.node.getChildByName('light');
        this.light.opacity = 0;
        this.laserNode = this.node.getChildByName("laser");
        this.laserSpriteNode = this.laserNode.getChildByName("sprite");
        this.laserLightSprite = this.laserNode.getChildByName("light").getComponent(cc.Sprite);
        this.laserHeadSprite = this.laserNode.getChildByName("head").getComponent(cc.Sprite);
        this.isTrackDelay = false;
        this.isDecelerateDelay = false;

    }
    timeDelay = 0;
    checkTimeDelay = 0;
    update(dt) {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.5) {
            this.checkTraking();
            this.checkTimeDelay = 0;
        }
        if(this.data.fixedRotation == 1){
            this.node.rotation = 0;
        }
        if(this.data.isDecelerate == 1 && this.isDecelerateDelay){
            this.timeDelay += dt;
            if (this.timeDelay > 0.016) {
                this.timeDelay = 0;
                let d = this.data.decelerateDelta>0?this.data.decelerateDelta:1;
                this.rigidBody.linearVelocity = this.rigidBody.linearVelocity.lerp(cc.v2(0,0),d*dt);
            }
        }
    }
   
    private checkTraking(): void {
        if (this.data.isTracking == 1 && this.data.isLaser != 1 && this.isTrackDelay) {
            let pos = this.hasNearEnemy();
            if (!pos.equals(cc.Vec2.ZERO)) {
                this.rotateColliderManager(cc.v2(this.node.position.x + pos.x, this.node.position.y + pos.y));
                this.hv = pos;
                this.rigidBody.linearVelocity = cc.v2(this.data.speed * this.hv.x, this.data.speed * this.hv.y);
            }
        }
    }
    changeBullet(data: BulletData) {
        this.data = data;
        this.changeRes(data.resName, data.lightName, data.lightColor);
        this.circleCollider.enabled = data.isRect != 1;
        this.boxCollider.enabled = data.isRect == 1;
        this.circlePCollider.enabled = data.isRect != 1;
        this.boxPCollider.enabled = data.isRect == 1;
        this.light.position = data.isRect==1 ? cc.v2(8, 0) : cc.v2(0, 0);
        this.node.scale = data.size > 0 ? data.size : 1;
        if (this.circlePCollider.enabled) {
            this.circlePCollider.sensor = data.isPhysical == 0;
            this.circlePCollider.apply();
        }
        if (this.boxPCollider.enabled) {
            this.boxPCollider.sensor = data.isPhysical == 0;
            this.boxPCollider.apply();
        }
        
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
        this.sprite.getComponent(cc.Sprite).spriteFrame = null;
        this.sprite.rotation = 0;
        this.laserNode.opacity = 0;
        this.laserSpriteNode.getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser);
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
        //碰撞终点
        let endPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let distance = Logic.getDistance(this.startPos, endPos);
        let offset = 32;
        //激光的宽度是两点之间的距离加贴图的宽度,激光的起始点是减去当前距离的点
        let finalwidth = distance - offset;
        this.laserSpriteNode.width = finalwidth/this.node.scaleY;
        this.laserSpriteNode.setPosition(cc.v2(-finalwidth/this.node.scaleY, 0));
        this.laserHeadSprite.node.setPosition(cc.v2(-finalwidth/this.node.scaleY, 0));
        this.laserNode.opacity = 255;
        this.sprite.opacity = 0;
        this.laserNode.scaleX = 1;
        this.laserNode.scaleY = 1;
        this.laserLightSprite.node.setPosition(-16*this.node.scaleY, 0);
        let scaleAction = cc.sequence(cc.scaleTo(0.1, 1, 1), cc.scaleTo(0.1, 1, 0));
        this.laserNode.runAction(scaleAction);
        this.scheduleOnce(() => { cc.director.emit('destorybullet', { detail: { bulletNode: this.node } }); }, 0.2);
    }

    private changeRes(resName: string, lightName: string, lightColor: string, suffix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite');
        }
        if (!this.sprite || resName.length < 1) {
            return;
        }
        let s1 = this.getSpriteFrameByName(resName, suffix);
        let s2 = this.getSpriteFrameByName(lightName, suffix);

        if (s1) {
            this.sprite.getComponent(cc.Sprite).spriteFrame = s1;
        }
        if (s2) {
            this.light.getComponent(cc.Sprite).spriteFrame = s2;
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
        this.rotateColliderManager(cc.v2(this.node.position.x + this.hv.x, this.node.position.y + this.hv.y));
        this.fire(this.hv.clone());
    }
    //animation
    BulletDestory() {
        cc.director.emit('destorybullet', { detail: { bulletNode: this.node } });
    }
    fire(hv: cc.Vec2) {
        if (!this.rigidBody) {
            this.rigidBody = this.getComponent(cc.RigidBody);
        }
        this.rigidBody.linearVelocity = cc.v2(this.data.speed * hv.x, this.data.speed * hv.y);
        //记录发射点
        this.startPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        this.sprite.stopAllActions();
        this.node.stopAllActions();
        let ss = this.sprite.getComponent(cc.Sprite);
        let idleAction = cc.sequence(
            cc.moveBy(0.1, 0, 0), cc.callFunc(() => { ss.spriteFrame = this.getSpriteFrameByName(this.data.resName); }),
            cc.moveBy(0.1, 0, 0), cc.callFunc(() => { ss.spriteFrame = this.getSpriteFrameByName(this.data.resName, 'anim001'); }),
            cc.moveBy(0.1, 0, 0), cc.callFunc(() => { ss.spriteFrame = this.getSpriteFrameByName(this.data.resName, 'anim002'); }));
        let spawn = cc.spawn(idleAction,cc.rotateBy(0.3,this.data.rotateAngle>0?this.data.rotateAngle:15));
        if(this.data.isRotate == 1){
            this.sprite.runAction(cc.repeatForever(spawn));
        }else{
            this.sprite.runAction(cc.repeatForever(idleAction));
        }

        if (this.data.lifeTime > 0) {
            this.scheduleOnce(()=>{this.bulletHit();},this.data.lifeTime);
        }
        this.isTrackDelay = false;
        if(this.data.isTracking == 1){
            this.scheduleOnce(()=>{this.isTrackDelay = true;},this.data.delaytrack);
        }
        this.isDecelerateDelay = false;
        if(this.data.isDecelerate == 1){
            this.scheduleOnce(()=>{this.isDecelerateDelay = true;},this.data.delayDecelerate);
        }
        
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
        if (isDestory) {
            this.bulletHit();

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
        let damageSuccess = false;
        damage.valueCopy(this.data.damage);
        let isDestory = false;
        let monster = attackTarget.getComponent(Monster);
        if (monster && !monster.isDied) {
            damageSuccess = monster.takeDamage(damage);
            if (damageSuccess) { this.addMonsterAllStatus(monster) }
            isDestory = true;
        }
        let player = attackTarget.getComponent(Player);
        if (player && !player.isDied) {
            damageSuccess = player.takeDamage(damage);
            if (damageSuccess) { this.addPlayerAllStatus(player) }
            isDestory = true;
        }
        let boss = attackTarget.getComponent(Boss);
        if (boss && !boss.isDied) {
            damageSuccess = boss.takeDamage(damage);
            if (damageSuccess) { this.addBossAllStatus(boss) }
            isDestory = true;
        }

        let meleeWeapon: MeleeWeapon = attackTarget.getComponent(MeleeWeapon);
        if (meleeWeapon && meleeWeapon.isAttacking) {
            isDestory = true;
        }
        if (isDestory) {
            this.bulletHit();
        }
    }
    private bulletHit(): void {
        if (this.anim && !this.anim.getAnimationState('Bullet001Hit').isPlaying) {
            this.rigidBody.linearVelocity = cc.v2(0, 0);
            this.data.isLaser == 1 ? this.showLaser() : this.anim.play("Bullet001Hit");
        }
        if (this.data.isBoom == 1) {
            let boom = cc.instantiate(this.boom);
            boom.getComponent(Boom).isFromPlayer = this.isFromPlayer;
            boom.parent = this.node.parent;
            boom.setPosition(this.node.position);
            boom.zIndex = 4100;

        }
    }
    hasNearEnemy() {
        if (this.data.isTracking != 1 || this.data.isLaser == 1 || !this.dungeon) {
            return cc.Vec2.ZERO;
        }
        let olddis = 1000;
        let pos = cc.v2(0, 0);
        if (this.isFromPlayer) {
            for (let monster of this.dungeon.monsters) {
                let dis = Logic.getDistance(this.node.position, monster.node.position);
                if (dis < 500 && dis < olddis && !monster.isDied && !monster.isDisguising) {
                    olddis = dis;
                    let p = this.node.position.clone();
                    p.x = this.node.scaleX > 0 ? p.x : -p.x;
                    pos = monster.node.position.sub(p);
                }
            }
            if (pos.equals(cc.Vec2.ZERO)) {
                for (let boss of this.dungeon.bosses) {
                    let dis = Logic.getDistance(this.node.position, boss.node.position);
                    if (dis < 500 && dis < olddis && !boss.isDied) {
                        olddis = dis;
                        let p = this.node.position.clone();
                        p.x = this.node.scaleX > 0 ? p.x : -p.x;
                        pos = boss.node.position.sub(p);
                    }
                }

            }
        } else {
            let dis = Logic.getDistance(this.node.position, this.dungeon.player.node.position);
            if (dis < 500 && dis < olddis && !this.dungeon.player.isDied && !this.dungeon.player.isFall) {
                olddis = dis;
                let p = this.node.position.clone();
                p.x = this.node.scaleX > 0 ? p.x : -p.x;
                pos = this.dungeon.player.node.position.sub(p);
            }

        }
        if (olddis != 1000) {
            pos = pos.normalizeSelf();
        }
        return pos;
    }

    rotateColliderManager(target: cc.Vec2) {
        if(this.data.fixedRotation == 1){
            return;
        }

        // 鼠标坐标默认是屏幕坐标，首先要转换到世界坐标
        // 物体坐标默认就是世界坐标
        // 两者取差得到方向向量
        let direction = target.sub(this.node.position);
        // 方向向量转换为角度值
        let Rad2Deg = 360 / (Math.PI * 2);
        let angle: number = 360 - Math.atan2(direction.x, direction.y) * Rad2Deg;
        let offsetAngle = 90;
        angle += offsetAngle;
        // 将当前物体的角度设置为对应角度
        this.node.rotation = this.node.scaleX < 0 ? angle : -angle;

    }

    addMonsterAllStatus(monster: Monster) {
        this.addMonsterStatus(this.data.damage.iceRate, monster, StatusManager.FROZEN);
        this.addMonsterStatus(this.data.damage.fireRate, monster, StatusManager.BURNING);
        this.addMonsterStatus(this.data.damage.lighteningRate, monster, StatusManager.DIZZ);
        this.addMonsterStatus(this.data.damage.toxicRate, monster, StatusManager.TOXICOSIS);
        this.addMonsterStatus(this.data.damage.curseRate, monster, StatusManager.CURSING);
        this.addMonsterStatus(this.data.damage.realRate, monster, StatusManager.BLEEDING);
    }
    addBossAllStatus(boss: Boss) {
        this.addBossStatus(this.data.damage.iceRate, boss, StatusManager.FROZEN);
        this.addBossStatus(this.data.damage.fireRate, boss, StatusManager.BURNING);
        this.addBossStatus(this.data.damage.lighteningRate, boss, StatusManager.DIZZ);
        this.addBossStatus(this.data.damage.toxicRate, boss, StatusManager.TOXICOSIS);
        this.addBossStatus(this.data.damage.curseRate, boss, StatusManager.CURSING);
        this.addBossStatus(this.data.damage.realRate, boss, StatusManager.BLEEDING);
    }
    addPlayerAllStatus(player: Player) {
        this.addPlayerStatus(this.data.damage.iceRate, player, StatusManager.FROZEN);
        this.addPlayerStatus(this.data.damage.fireRate, player, StatusManager.BURNING);
        this.addPlayerStatus(this.data.damage.lighteningRate, player, StatusManager.DIZZ);
        this.addPlayerStatus(this.data.damage.toxicRate, player, StatusManager.TOXICOSIS);
        this.addPlayerStatus(this.data.damage.curseRate, player, StatusManager.CURSING);
        this.addPlayerStatus(this.data.damage.realRate, player, StatusManager.BLEEDING);
        this.addPlayerStatus(this.data.damage.stoneRate, player, StatusManager.STONE);
    }
    addMonsterStatus(rate: number, monster: Monster, statusType) {
        if (Logic.getRandomNum(0, 100) < rate) { monster.addStatus(statusType); }
    }
    addBossStatus(rate: number, boss: Boss, statusType) {
        if (Logic.getRandomNum(0, 100) < rate) { boss.addStatus(statusType); }
    }
    addPlayerStatus(rate: number, player: Player, statusType) {
        if (Logic.getRandomNum(0, 100) < rate) { player.addStatus(statusType); }
    }
}
