import { EventHelper } from "../EventHelper";
import Monster from "../Monster";
import Player from "../Player";
import MeleeWeapon from "../MeleeWeapon";
import DamageData from "../Data/DamageData";
import Logic from "../Logic";
import Boss from "../Boss/Boss";
import BulletData from "../Data/BulletData";
import Dungeon from "../Dungeon";
import StatusManager from "../Manager/StatusManager";
import AudioPlayer from "../Utils/AudioPlayer";
import FromData from "../Data/FromData";
import { ColliderTag } from "../Actor/ColliderTag";
import Decorate from "../Building/Decorate";
import HitBuilding from "../Building/HitBuilding";
import Shield from "../Shield";
import Wall from "../Building/Wall";
import AreaOfEffect from "../Actor/AreaOfEffect";
import AreaOfEffectData from "../Data/AreaOfEffectData";
import IndexZ from "../Utils/IndexZ";
import NonPlayer from "../NonPlayer";
import Actor from "../Base/Actor";

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
    tagetPos = cc.v3(0, 0);
    rigidBody: cc.RigidBody;
    hv = cc.v3(0, 0);
    isFromPlayer = false;

    sprite: cc.Node;
    light: cc.Node;
    circleCollider: cc.CircleCollider;
    boxCollider: cc.BoxCollider;
    circlePCollider: cc.PhysicsCircleCollider;
    boxPCollider: cc.PhysicsBoxCollider;

    laserSpriteNode: cc.Node;
    laserLightSprite: cc.Sprite;
    laserHeadSprite: cc.Sprite;
    laserNode: cc.Node;
    dungeon: Dungeon;

    startPos: cc.Vec3 = cc.v3(0, 0);//子弹起始位置

    isTrackDelay = false;//是否延迟追踪
    isDecelerateDelay = false;//是否延迟减速
    isHit = false;
    isReserved = false;//是否已经反弹，防止多次碰撞弹射
    skipTopwall = false;
    aoePrefab:cc.Prefab;
    aoeData = new AreaOfEffectData();

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.rigidBody = this.getComponent(cc.RigidBody);
        this.circleCollider = this.getComponent(cc.CircleCollider);
        this.boxCollider = this.getComponent(cc.BoxCollider);
        this.circlePCollider = this.getComponent(cc.PhysicsCircleCollider);
        this.boxPCollider = this.getComponent(cc.PhysicsBoxCollider);
        this.sprite = this.node.getChildByName('sprite');
        this.sprite.opacity = 255;
        this.sprite.angle = 0;
        this.light = this.node.getChildByName('light');
        this.light.opacity = 0;
        this.laserNode = this.node.getChildByName("laser");
        this.laserSpriteNode = this.laserNode.getChildByName("sprite");
        this.laserLightSprite = this.laserNode.getChildByName("light").getComponent(cc.Sprite);
        this.laserHeadSprite = this.laserNode.getChildByName("head").getComponent(cc.Sprite);

    }
    onEnable() {
        this.tagetPos = cc.v3(0, 0);
        this.rigidBody.linearVelocity = cc.v2(0, 0);
        this.sprite = this.node.getChildByName('sprite');
        this.sprite.opacity = 255;
        this.sprite.angle = 0;
        this.light = this.node.getChildByName('light');
        this.light.opacity = 0;
        this.laserNode = this.node.getChildByName("laser");
        this.laserSpriteNode = this.laserNode.getChildByName("sprite");
        this.laserLightSprite = this.laserNode.getChildByName("light").getComponent(cc.Sprite);
        this.laserHeadSprite = this.laserNode.getChildByName("head").getComponent(cc.Sprite);
        this.isTrackDelay = false;
        this.isDecelerateDelay = false;
        this.isHit = false;
        this.isReserved = false;
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
            this.node.angle = 0;
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
        if (this.data.isTracking == 1 && this.data.isLaser != 1 && this.isTrackDelay&&!this.isHit) {
            let pos = this.hasNearEnemy();
            if (!pos.equals(cc.Vec3.ZERO)) {
                this.rotateColliderManager(cc.v3(this.node.position.x + pos.x, this.node.position.y + pos.y));
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
        this.light.position = data.isRect==1 ? cc.v3(8, 0) : cc.v3(0, 0);
        this.node.scale = data.size > 0 ? data.size : 1;
        if(data.size>1){
            this.circlePCollider.radius = this.circlePCollider.radius/this.node.scale;
            this.boxPCollider.size.width = this.boxPCollider.size.width/this.node.scale;
            this.boxPCollider.size.height = this.boxPCollider.size.height/this.node.scale;
        }
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
        this.sprite.angle = 0;
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
        let endPos = this.node.convertToWorldSpaceAR(cc.v3(0, 0));
        let distance = Logic.getDistance(this.startPos, endPos);
        let offset = 32;
        if(distance <= 0){
            distance = 0;
            offset = 0;
        }
        //激光的宽度是两点之间的距离加贴图的宽度,激光的起始点是减去当前距离的点
        let finalwidth = distance - offset;
        
        this.laserSpriteNode.width = finalwidth/this.node.scaleY;
        this.laserSpriteNode.setPosition(cc.v3(-finalwidth/this.node.scaleY, 0));
        this.laserHeadSprite.node.setPosition(cc.v3(-finalwidth/this.node.scaleY, 0));
        this.laserNode.opacity = 255;
        this.sprite.opacity = 0;
        this.laserNode.scaleX = 1;
        this.laserNode.scaleY = 1;
        this.laserLightSprite.node.setPosition(-16*this.node.scaleY, 0);
        let scaleAction = cc.sequence(cc.scaleTo(0.1, 1, 1), cc.scaleTo(0.1, 1, 0));
        this.laserNode.runAction(scaleAction);
        this.scheduleOnce(() => { cc.director.emit('destorybullet', { detail: { bulletNode: this.node } }); }, 0.2);
        cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.REMOTE_LASER}});
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
    private getSpriteFrameByName(resName: string, suffix?: string,needDefaultSuffix?:boolean): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrames[resName + suffix];
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrames[needDefaultSuffix?resName+'anim000':resName];
        }
        return spriteFrame;
    }

    //animation
    MeleeFinish() {
        cc.director.emit('destorybullet', { detail: { bulletNode: this.node } });
    }
    //animation
    showBullet(hv: cc.Vec3) {
        this.hv = hv;
        this.rotateColliderManager(cc.v3(this.node.position.x + this.hv.x, this.node.position.y + this.hv.y));
        this.fire(this.hv.clone());
    }
    //animation
    BulletDestory() {
        cc.director.emit('destorybullet', { detail: { bulletNode: this.node } });
    }
    fire(hv: cc.Vec3) {
        if (!this.rigidBody) {
            this.rigidBody = this.getComponent(cc.RigidBody);
        }
        this.rigidBody.linearVelocity = cc.v2(this.data.speed * hv.x, this.data.speed * hv.y);
        //记录发射点
        this.startPos = this.node.convertToWorldSpaceAR(cc.v3(0, 0));
        this.sprite.stopAllActions();
        this.node.stopAllActions();
        let ss = this.sprite.getComponent(cc.Sprite);
        let idleAction = cc.sequence(
            cc.moveBy(0.1, 0, 0), cc.callFunc(() => { ss.spriteFrame = this.getSpriteFrameByName(this.data.resName, 'anim000',true); }),
            cc.moveBy(0.1, 0, 0), cc.callFunc(() => { ss.spriteFrame = this.getSpriteFrameByName(this.data.resName, 'anim001',true); }),
            cc.moveBy(0.1, 0, 0), cc.callFunc(() => { ss.spriteFrame = this.getSpriteFrameByName(this.data.resName, 'anim002',true); }));
        let spawn = cc.spawn(idleAction,cc.rotateBy(0.3,this.data.rotateAngle>0?this.data.rotateAngle:15));
        if(this.data.isRotate == 1){
            this.sprite.runAction(cc.repeatForever(spawn));
        }else{
            this.sprite.runAction(cc.repeatForever(idleAction));
        }

        if (this.data.lifeTime > 0) {
            this.scheduleOnce(()=>{this.bulletHit();},this.data.lifeTime);
        }else{
            this.scheduleOnce(()=>{this.bulletHit();},30);
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
        let wall = otherCollider.node.getComponent(Wall);

        //子弹玩家怪物boss武器不销毁
        if (player || monster || boss || bullet||wall) {
            isDestory = false;
        }
        //触发器不销毁
        if (otherCollider.sensor) {
            isDestory = false;
        }
        //上面的墙上半部分是否销毁
        if(this.skipTopwall){
            isDestory = false;
        }
        if(this.data.isInvincible>0){
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
        let non = other.node.getComponent(NonPlayer);
        let enemynon = non?non.isEnemy:false;
        let playernon = non?!non.isEnemy:false;
        if (!this.isFromPlayer && (monster || boss || enemynon)) {
            isAttack = false;
        }
        if (this.isFromPlayer && (player || playernon)) {
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
        if (!attackTarget||this.isHit) {
            return;
        }
        let damage = new DamageData();
        let damageSuccess = false;
        damage.valueCopy(this.data.damage);
        damage.isRemote = true;
        let isDestory = false;
        let wall = attackTarget.getComponent(Wall);
        if(wall&&!this.skipTopwall){
            isDestory = true;
        }
        
        let aoe = attackTarget.getComponent(AreaOfEffect);
        if(aoe&&aoe.IsAttacking&&aoe.data.canBreakBullet){
            isDestory = true;
        }
        let monster = attackTarget.getComponent(Monster);
        if (monster && !monster.isDied) {
            damageSuccess = monster.takeDamage(damage);
            if (damageSuccess) { this.addTargetAllStatus(monster,new FromData()) }
            isDestory = true;
        }
        let player = attackTarget.getComponent(Player);
        if (player && !player.isDied) {
            //子弹偏转
            let isReverse = false;
            if(player.shield.Status == Shield.STATUS_PARRY&&player.shield.data.isReflect==1){
                isReverse = this.revserseBullet();
            }
            if(!isReverse){
                damageSuccess = player.takeDamage(damage,this.data.from);
                if (damageSuccess) { this.addTargetAllStatus(player,this.data.from) }
                isDestory = true;
            }
        }
        let non = attackTarget.getComponent(NonPlayer);
        if (non && !non.isDied) {
            damageSuccess = non.takeDamage(damage);
            if (damageSuccess) { this.addTargetAllStatus(non,new FromData()) }
            isDestory = true;
        }
        let boss = attackTarget.getComponent(Boss);
        if (boss && !boss.isDied) {
            damageSuccess = boss.takeDamage(damage);
            if (damageSuccess) { this.addTargetAllStatus(boss,new FromData()) }
            isDestory = true;
        }

        let meleeWeapon: MeleeWeapon = attackTarget.getComponent(MeleeWeapon);
        if (meleeWeapon && meleeWeapon.IsAttacking && !this.isFromPlayer) {
            //子弹偏转
            let isReverse = false;
            if(meleeWeapon.IsReflect){
                isReverse = this.revserseBullet();
            }
            if(!isReverse){
                isDestory = true;
            }
        }
        let decorate = attackTarget.getComponent(Decorate);
        if (this.data.canBreakBuilding == 1&&decorate) {
            damageSuccess = true;
            decorate.takeDamage(damage);
        }
        let hitBuilding = attackTarget.getComponent(HitBuilding);
        if (this.data.canBreakBuilding == 1&&hitBuilding) {
            damageSuccess = true;
            hitBuilding.takeDamage(damage);
        }
        if(this.data.isInvincible>0){
            isDestory = false;
        }
        if (isDestory) {
            this.bulletHit();
        }
    }
    //子弹偏转 不能偏转激光，追踪弹效果去除
    private revserseBullet():boolean{
        if(this.isReserved){
            this.isReserved = true;
            return false;
        }
        if(this.data.isLaser != 1){
            this.node.angle+=-180;
            this.rigidBody.linearVelocity = this.rigidBody.linearVelocity.mul(-1);
            this.isFromPlayer = true;
            this.data.isTracking = 0;
            return true;
        }
        return false;
    }
    private bulletHit(): void {
        this.isHit = true;
        if (this.anim && !this.anim.getAnimationState('Bullet001Hit').isPlaying) {
            this.rigidBody.linearVelocity = cc.v2(0, 0);
            this.data.isLaser == 1 ? this.showLaser() : this.anim.play("Bullet001Hit");
        }
        if (this.data.isBoom > 0) {
            let boom = cc.instantiate(this.boom).getComponent(AreaOfEffect);
            if(boom){
                boom.show(this.node.parent,this.node.position,this.hv,0,new AreaOfEffectData().init(1,0.2,0,0,IndexZ.OVERHEAD,this.isFromPlayer
                    ,true,true,false,new DamageData(1),FromData.getClone('爆炸','boom000anim004'),[]));
                cc.director.emit(EventHelper.PLAY_AUDIO,{detail:{name:AudioPlayer.BOOM}});
            }
            
        }
        if(this.aoePrefab){
            let aoe = cc.instantiate(this.aoePrefab).getComponent(AreaOfEffect);
            if(aoe){
                aoe.show(this.node.parent,this.node.position,this.hv,0,this.aoeData);
            }
        }
    }
    hasNearEnemy() {
        if (this.data.isTracking != 1 || this.data.isLaser == 1 || !this.dungeon) {
            return cc.Vec3.ZERO;
        }
        let olddis = 1000;
        let pos = cc.v3(0, 0);
        if (this.isFromPlayer) {
            for (let monster of this.dungeon.monsterManager.monsterList) {
                let dis = Logic.getDistance(this.node.position, monster.node.position);
                if (dis < 500 && dis < olddis && !monster.isDied && !monster.isDisguising) {
                    olddis = dis;
                    let p = this.node.position.clone();
                    p.x = this.node.scaleX > 0 ? p.x : -p.x;
                    pos = monster.node.position.sub(p);
                }
            }
            if (pos.equals(cc.Vec3.ZERO)) {
                for (let boss of this.dungeon.monsterManager.bossList) {
                    let dis = Logic.getDistance(this.node.position, boss.node.position);
                    if (dis < 500 && dis < olddis && !boss.isDied) {
                        olddis = dis;
                        let p = this.node.position.clone();
                        p.x = this.node.scaleX > 0 ? p.x : -p.x;
                        pos = boss.node.position.sub(p);
                    }
                }
            }
            if (pos.equals(cc.Vec3.ZERO)) {
                for (let non of this.dungeon.nonPlayerManager.nonPlayerList) {
                    let dis = Logic.getDistance(this.node.position, non.node.position);
                    if (dis < 500 && dis < olddis && !non.isDied&&non.isEnemy) {
                        olddis = dis;
                        let p = this.node.position.clone();
                        p.x = this.node.scaleX > 0 ? p.x : -p.x;
                        pos = non.node.position.sub(p);
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
            if (pos.equals(cc.Vec3.ZERO)) {
                for (let non of this.dungeon.nonPlayerManager.nonPlayerList) {
                    let dis = Logic.getDistance(this.node.position, non.node.position);
                    if (dis < 500 && dis < olddis && !non.isDied&&!non.isEnemy) {
                        olddis = dis;
                        let p = this.node.position.clone();
                        p.x = this.node.scaleX > 0 ? p.x : -p.x;
                        pos = non.node.position.sub(p);
                    }
                }
            }

        }
        if (olddis != 1000) {
            pos = pos.normalizeSelf();
        }
        return pos;
    }

    rotateColliderManager(target: cc.Vec3) {
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
        this.node.angle = this.node.scaleX < 0 ? -angle : angle;

    }

    addTargetAllStatus(target: Actor,from:FromData) {
        this.addTargetStatus(this.data.damage.iceRate, target, StatusManager.FROZEN,from);
        this.addTargetStatus(this.data.damage.fireRate, target, StatusManager.BURNING,from);
        this.addTargetStatus(this.data.damage.lighteningRate, target, StatusManager.DIZZ,from);
        this.addTargetStatus(this.data.damage.toxicRate, target, StatusManager.TOXICOSIS,from);
        this.addTargetStatus(this.data.damage.curseRate, target, StatusManager.CURSING,from);
        this.addTargetStatus(this.data.damage.realRate, target, StatusManager.BLEEDING,from);
        this.addTargetStatus(this.data.statusRate, target, this.data.statusType,from);
    }
    addTargetStatus(rate: number, target: Actor, statusType:string ,from:FromData) {
        if (Logic.getRandomNum(0, 100) < rate) { target.addStatus(statusType,from); }
    }
}
