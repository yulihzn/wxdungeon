import { EventHelper } from "../logic/EventHelper";
import NonPlayer from "../logic/NonPlayer";
import Player from "../logic/Player";
import DamageData from "../data/DamageData";
import Logic from "../logic/Logic";
import Boss from "../boss/Boss";
import BulletData from "../data/BulletData";
import Dungeon from "../logic/Dungeon";
import StatusManager from "../manager/StatusManager";
import AudioPlayer from "../utils/AudioPlayer";
import FromData from "../data/FromData";
import HitBuilding from "../building/HitBuilding";
import Wall from "../building/Wall";
import AreaOfEffect from "../actor/AreaOfEffect";
import AreaOfEffectData from "../data/AreaOfEffectData";
import IndexZ from "../utils/IndexZ";
import Actor from "../base/Actor";
import ExitDoor from "../building/ExitDoor";
import ActorUtils from "../utils/ActorUtils";
import Shooter from "../logic/Shooter";
import InteractBuilding from "../building/InteractBuilding";
import EnergyShield from "../building/EnergyShield";
import Utils from "../utils/Utils";
import MeleeShadowWeapon from "../logic/MeleeShadowWeapon";
import MeleeWeapon from "../logic/MeleeWeapon";
import Shield from "../logic/Shield";
import CCollider from "../collider/CCollider";
import BaseColliderComponent from "../base/BaseColliderComponent";

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
export default class Bullet extends BaseColliderComponent {

    @property(cc.Prefab)
    boom: cc.Prefab = null;
    data: BulletData = new BulletData();

    anim: cc.Animation;
    dir = 0;
    tagetPos = cc.v3(0, 0);
    hv = cc.v3(0, 0);
    isFromPlayer = false;

    sprite: cc.Node;
    light: cc.Node;
    collider: CCollider;

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
    aoePrefab: cc.Prefab;
    aoeData = new AreaOfEffectData();
    shooter: Shooter;
    private currentLinearVelocity = cc.v2(0, 0);
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad();
        this.anim = this.getComponent(cc.Animation);
        this.collider = this.getComponent(CCollider);
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
        this.entity.NodeRender.node = this.node;
        this.entity.Move.linearVelocity = cc.v2(0, 0);
        this.currentLinearVelocity = cc.v2(0, 0);
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
        if (Logic.isGamePause) {
            this.entity.Move.linearVelocity = cc.v2(0, 0);
            return;
        }
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.5) {
            this.checkTraking();
            this.checkTimeDelay = 0;
        }
        if (this.data.fixedRotation == 1) {
            this.node.angle = 0;
        }
        if (this.data.isDecelerate == 1 && this.isDecelerateDelay) {
            this.timeDelay += dt;
            if (this.timeDelay > 0.016) {
                this.timeDelay = 0;
                let d = this.data.decelerateDelta > 0 ? this.data.decelerateDelta : 1;
                this.currentLinearVelocity = this.currentLinearVelocity.lerp(cc.v2(0, 0), d * dt);
            }
        }
        this.entity.Move.linearVelocity = this.currentLinearVelocity;
    }

    private checkTraking(): void {
        if (this.data.isTracking == 1 && this.data.isLaser != 1 && this.isTrackDelay && !this.isHit) {
            let pos = this.hasNearEnemy();
            if (!pos.equals(cc.Vec3.ZERO)) {
                this.rotateCollider(cc.v2(pos.x, pos.y));
                this.hv = pos;
                this.currentLinearVelocity = cc.v2(this.data.speed * this.hv.x, this.data.speed * this.hv.y);
            }
        }
    }
    changeBullet(data: BulletData) {
        this.data = data;
        this.changeRes(data.resName, data.lightName, data.lightColor);
        this.collider.type = data.isRect != 1 ? CCollider.TYPE.CIRCLE : CCollider.TYPE.RECT;
        this.light.position = data.isRect == 1 ? cc.v3(8, 0) : cc.v3(0, 0);
        this.node.scale = data.size > 0 ? data.size : 1;
        this.collider.radius = 16;
        this.collider.w = 30;
        this.collider.h = 14;
        this.collider.sensor = data.isPhysical == 0;
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

        cc.tween(this.laserLightSprite.node).repeatForever(
            cc.tween()
                .delay(0.05).call(() => { this.laserLightSprite.spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser, 'light001'); })
                .delay(0.05).call(() => { this.laserLightSprite.spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser, 'light002'); })
                .delay(0.05).call(() => { this.laserLightSprite.spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser, 'light003'); })
        ).start();
    }
    private showLaser(): void {
        if (this.data.isLaser != 1) {
            return;
        }
        //碰撞终点
        let endPos = this.node.convertToWorldSpaceAR(cc.v3(0, 0));
        let distance = Logic.getDistance(this.startPos, endPos);
        let offset = 32;
        if (distance <= 0) {
            distance = 0;
            offset = 0;
        }
        //激光的宽度是两点之间的距离加贴图的宽度,激光的起始点是减去当前距离的点
        let finalwidth = distance - offset;

        this.laserSpriteNode.width = finalwidth / this.node.scaleY;
        this.laserSpriteNode.setPosition(cc.v3(-finalwidth / this.node.scaleY, 0));
        this.laserHeadSprite.node.setPosition(cc.v3(-finalwidth / this.node.scaleY, 0));
        this.laserNode.opacity = 255;
        this.sprite.opacity = 0;
        this.laserNode.scaleX = 1;
        this.laserNode.scaleY = 1;
        this.laserLightSprite.node.setPosition(-16 * this.node.scaleY, 0);
        cc.tween(this.laserNode).to(0.1, { scale: 1 }).to(0.1, { scaleY: 0 }).delay(0.1).call(() => {
            this.shooter.addDestroyBullet(this.node);
        }).start();
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.REMOTE_LASER } });
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
    private getSpriteFrameByName(resName: string, suffix?: string, needDefaultSuffix?: boolean): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrameRes(resName + suffix);
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(needDefaultSuffix ? resName + 'anim000' : resName);
        }
        return spriteFrame;
    }

    //animation
    MeleeFinish() {
        this.shooter.addDestroyBullet(this.node);
    }
    //animation
    showBullet(hv: cc.Vec3) {
        this.hv = hv;
        this.rotateCollider(cc.v2(this.hv.x, this.hv.y));
        this.fire(this.hv.clone());
    }
    //animation
    BulletDestory() {
        this.shooter.addDestroyBullet(this.node);
    }
    fire(hv: cc.Vec3) {
        this.currentLinearVelocity = cc.v2(this.data.speed * hv.x, this.data.speed * hv.y);
        this.entity.Move.linearVelocity = this.currentLinearVelocity;
        //记录发射点
        this.startPos = this.node.convertToWorldSpaceAR(cc.v3(0, 0));
        this.sprite.stopAllActions();
        this.node.stopAllActions();
        let ss = this.sprite.getComponent(cc.Sprite);
        let idletween = cc.tween()
            .delay(0.1).call(() => { ss.spriteFrame = this.getSpriteFrameByName(this.data.resName, 'anim000', true); })
            .delay(0.1).call(() => { ss.spriteFrame = this.getSpriteFrameByName(this.data.resName, 'anim001', true); })
            .delay(0.1).call(() => { ss.spriteFrame = this.getSpriteFrameByName(this.data.resName, 'anim002', true); });
        let spawntween = cc.tween(this.sprite).parallel(idletween, cc.tween().by(0.3, { angle: this.data.rotateAngle > 0 ? this.data.rotateAngle : 15 }))

        if (this.data.isRotate > 0) {
            cc.tween(this.sprite).repeatForever(spawntween).start();
        } else {
            cc.tween(this.sprite).repeatForever(idletween).start();
        }
        this.unscheduleAllCallbacks();
        if (this.data.lifeTime > 0) {
            this.scheduleOnce(() => { this.bulletHit(); }, this.data.lifeTime);
        } else {
            this.scheduleOnce(() => { this.bulletHit(); }, 30);
        }
        this.isTrackDelay = false;
        if (this.data.isTracking == 1) {
            this.scheduleOnce(() => { this.isTrackDelay = true; }, this.data.delaytrack);
        }
        this.isDecelerateDelay = false;
        if (this.data.isDecelerate == 1) {
            this.scheduleOnce(() => { this.isDecelerateDelay = true; }, this.data.delayDecelerate);
        }

    }

    start() {

    }

    onColliderPreSolve(other:CCollider,self:CCollider){
        if (!this.isFromPlayer && (other.tag == CCollider.TAG.NONPLAYER || other.tag == CCollider.TAG.BOSS)) {
            self.disabledOnce = true;
        }
        if (this.isFromPlayer && (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.GOODNONPLAYER)) {
            self.disabledOnce = true;
        }
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        if (!other.sensor) {
            let isDestory = true;
            //子弹玩家怪物boss武器墙不销毁交给后续处理
            if (other.tag == CCollider.TAG.PLAYER
                || other.tag == CCollider.TAG.NONPLAYER
                || other.tag == CCollider.TAG.BOSS
                || other.tag == CCollider.TAG.BULLET
                || other.tag == CCollider.TAG.WARTER
                || other.sensor
                || this.data.isInvincible > 0) {
                isDestory = false;
            }
            if (isDestory) {
                this.bulletHit();
                return;
            }
        }

        let isAttack = true;
        if (!this.isFromPlayer && (other.tag == CCollider.TAG.NONPLAYER || other.tag == CCollider.TAG.BOSS)) {
            isAttack = false;
        }
        if (this.isFromPlayer && (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.GOODNONPLAYER)) {
            isAttack = false;
        }
        if (other.tag == CCollider.TAG.BULLET) {
            isAttack = false;
        }

        if (isAttack) {
            this.attacking(other.node, other.tag);
        }
    }
    private attacking(attackTarget: cc.Node, tag: number) {
        if (!attackTarget || this.isHit) {
            return;
        }
        let damage = new DamageData();
        let damageSuccess = false;
        damage.valueCopy(this.data.damage);
        damage.isRemote = true;
        let isDestory = false;
        if (this.data.isInvincible > 0) {
            isDestory = false;
        } else if (tag == CCollider.TAG.NONPLAYER || tag == CCollider.TAG.GOODNONPLAYER) {
            let monster = attackTarget.getComponent(NonPlayer);
            if (monster && !monster.sc.isDied) {
                damageSuccess = monster.takeDamage(damage);
                if (damageSuccess) { this.addTargetAllStatus(monster, new FromData()) }
                isDestory = true;
            }
        } else if (tag == CCollider.TAG.PLAYER) {
            let player = attackTarget.getComponent(Player);
            if (player && !player.sc.isDied) {
                //子弹偏转
                let isReverse = false;
                if (player.shield.Status == Shield.STATUS_PARRY && player.shield.data.isReflect == 1) {
                    isReverse = this.revserseBullet(player.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
                }
                if (!isReverse) {
                    damageSuccess = player.takeDamage(damage, this.data.from);
                    if (damageSuccess) { this.addTargetAllStatus(player, this.data.from) }
                    isDestory = true;
                }
            }
        } else if (tag == CCollider.TAG.AOE) {
            let aoe = attackTarget.getComponent(AreaOfEffect);
            if (aoe && aoe.IsAttacking && aoe.data.canBreakBullet) {
                isDestory = true;
            }
        } else if (tag == CCollider.TAG.BOSS) {
            let boss = attackTarget.getComponent(Boss);
            if (boss && !boss.sc.isDied) {
                damageSuccess = boss.takeDamage(damage);
                if (damageSuccess) { this.addTargetAllStatus(boss, new FromData()) }
                isDestory = true;
            }
        } else if (tag == CCollider.TAG.PLAYER_HIT) {
            let meleeWeapon: MeleeWeapon = attackTarget.getComponent(MeleeWeapon);
            let shadowWeapon: MeleeShadowWeapon;
            if (!meleeWeapon) {
                shadowWeapon = attackTarget.getComponent(MeleeShadowWeapon);
                if (shadowWeapon) {
                    meleeWeapon = shadowWeapon.meleeWeapon;
                }
            }
            if (meleeWeapon && meleeWeapon.IsAttacking && !this.isFromPlayer) {
                //子弹偏转
                let isReverse = false;
                if (meleeWeapon.IsReflect) {
                    let n = shadowWeapon ? shadowWeapon.meleeWeapon.node : meleeWeapon.node;
                    isReverse = this.revserseBullet(n.convertToWorldSpaceAR(cc.Vec2.ZERO));
                }
                if (!isReverse) {
                    isDestory = true;
                }
            }
        } else if (tag == CCollider.TAG.BUILDING || tag == CCollider.TAG.WALL || tag == CCollider.TAG.WALL_TOP) {
            let interactBuilding = attackTarget.getComponent(InteractBuilding);
            if (this.data.canBreakBuilding == 1 && interactBuilding) {
                damageSuccess = true;
                interactBuilding.takeDamage(damage);
            }
            if (!damageSuccess) {
                let hitBuilding = attackTarget.getComponent(HitBuilding);
                if (this.data.canBreakBuilding == 1 && hitBuilding) {
                    damageSuccess = true;
                    hitBuilding.takeDamage(damage);
                }
            }
            if (!damageSuccess) {
                let wall = attackTarget.getComponent(Wall);
                if (wall) {
                    if (wall.isTop()) {
                        isDestory = !this.skipTopwall;
                    } else {
                        isDestory = wall.isSide();
                    }
                }
                if (isDestory && attackTarget.getComponent(ExitDoor)) {
                    isDestory = false;
                }
            }

        } else if (!this.isFromPlayer && tag == CCollider.TAG.ENERGY_SHIELD) {
            let shield = attackTarget.getComponent(EnergyShield);
            if (shield && shield.isValid) {
                damageSuccess = shield.takeDamage(damage);
            }
            if (damageSuccess) {
                isDestory = true;
            }
        }

        if (isDestory) {
            this.bulletHit();
        }
    }
    //子弹偏转 不能偏转激光，追踪弹效果去除
    private revserseBullet(targetWorldPos: cc.Vec2): boolean {
        if (this.isReserved) {
            this.isReserved = true;
            return false;
        }
        if (this.data.isLaser != 1) {
            // //法线
            // let normal = this.node.convertToNodeSpaceAR(targetWorldPos).normalizeSelf().negSelf();
            // //入射
            // let pos = this.rigidBody.linearVelocity.clone().normalizeSelf();
            // //反射
            // let reflect = pos.clone().sub(normal.clone().mulSelf(pos.clone().dot(normal)).mulSelf(2));
            // this.node.angle-=cc.Vec2.angle(pos,reflect)*180/Math.PI;
            // this.rigidBody.linearVelocity = this.rigidBody.linearVelocity.rotate(cc.Vec2.angle(pos,reflect));
            let angle = -180 + Logic.getRandomNum(0, 10) - 20;
            this.node.angle += angle;
            this.currentLinearVelocity = this.currentLinearVelocity.rotate(angle * Math.PI / 180);
            this.isFromPlayer = true;
            this.data.isTracking = 0;
            return true;
        }
        return false;
    }
    private bulletHit(): void {
        if (this.isHit) {
            return;
        }
        this.isHit = true;
        if (this.anim && !this.anim.getAnimationState('Bullet001Hit').isPlaying) {
            this.currentLinearVelocity = cc.v2(0, 0);
            this.entity.Move.linearVelocity = cc.v2(0, 0);
            this.data.isLaser == 1 ? this.showLaser() : this.anim.play("Bullet001Hit");
        }
        if (this.data.isBoom > 0) {
            let boom = cc.instantiate(this.boom).getComponent(AreaOfEffect);
            if (boom) {
                boom.show(this.node.parent, this.node.position, this.hv, 0, new AreaOfEffectData().init(1, 0.2, 0, 0, IndexZ.OVERHEAD, !this.isFromPlayer
                    , true, true, false, false, new DamageData(2), FromData.getClone('爆炸', 'boom000anim004'), []));
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.BOOM } });
                cc.director.emit(EventHelper.CAMERA_SHAKE, { detail: { isHeavyShaking: true } });
            }

        }
        if (this.aoePrefab) {
            let aoe = cc.instantiate(this.aoePrefab).getComponent(AreaOfEffect);
            if (aoe) {
                aoe.show(this.node.parent, this.node.position, this.hv, 0, this.aoeData);
            }
        }
    }
    hasNearEnemy() {
        if (this.data.isTracking != 1 || this.data.isLaser == 1 || !this.dungeon) {
            return cc.Vec3.ZERO;
        }
        return ActorUtils.getDirectionFromNearestEnemy(this.node.position, !this.isFromPlayer, this.dungeon, false, 500);
    }

    rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return;
        }
        if (this.data.fixedRotation == 1) {
            return;
        }
        //设置旋转角度
        this.node.angle = Utils.getRotateAngle(direction, this.node.scaleX < 0);
    }

    addTargetAllStatus(target: Actor, from: FromData) {
        this.addTargetStatus(this.data.damage.iceRate, target, StatusManager.FROZEN, from);
        this.addTargetStatus(this.data.damage.fireRate, target, StatusManager.BURNING, from);
        this.addTargetStatus(this.data.damage.lighteningRate, target, StatusManager.DIZZ, from);
        this.addTargetStatus(this.data.damage.toxicRate, target, StatusManager.TOXICOSIS, from);
        this.addTargetStatus(this.data.damage.curseRate, target, StatusManager.CURSING, from);
        this.addTargetStatus(this.data.damage.realRate, target, StatusManager.BLEEDING, from);
        this.addTargetStatus(this.data.statusRate, target, this.data.statusType, from);
    }
    addTargetStatus(rate: number, target: Actor, statusType: string, from: FromData) {
        if (Logic.getRandomNum(0, 100) < rate) { target.addStatus(statusType, from); }
    }
}
