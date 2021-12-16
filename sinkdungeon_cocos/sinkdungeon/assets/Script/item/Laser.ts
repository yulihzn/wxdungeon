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
import Actor from "../base/Actor";
import Shooter from "../logic/Shooter";
import InteractBuilding from "../building/InteractBuilding";
import EnergyShield from "../building/EnergyShield";
import Utils from "../utils/Utils";
import MeleeShadowWeapon from "../logic/MeleeShadowWeapon";
import MeleeWeapon from "../logic/MeleeWeapon";
import Shield from "../logic/Shield";
import CCollider from "../collider/CCollider";
import BaseColliderComponent from "../base/BaseColliderComponent";
import GameWorldSystem from "../ecs/system/GameWorldSystem";

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
export default class Laser extends BaseColliderComponent {

    data: BulletData = new BulletData();
    dir = 0;
    tagetPos = cc.v3(0, 0);
    hv = cc.v3(0, 0);
    isFromPlayer = false;
    collider: CCollider;
    private lineNode: cc.Node;
    private lightSprite: cc.Sprite;
    private headSprite: cc.Sprite;
    private sprite: cc.Node;
    dungeon: Dungeon;
    isReserved = false;//是否已经反弹，防止多次碰撞弹射
    shooter: Shooter;
    private isStop = false;
    private targetMap = new Map<number, boolean>();
    private sensorTargetMap = new Map<number, boolean>();
    private startPos = cc.v2(0,0);
    private angleOffset = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad();
        this.collider = this.getComponent(CCollider);
        this.initSpriteNode();
        let aimArr = [CCollider.TAG.BOSS, CCollider.TAG.BUILDING, CCollider.TAG.ENERGY_SHIELD
            , CCollider.TAG.WALL, CCollider.TAG.WALL_TOP];
        for (let key of aimArr) {
            this.targetMap.set(key, true);
        }
        let sensorArr = [CCollider.TAG.ENERGY_SHIELD];
        for (let key of sensorArr) {
            this.sensorTargetMap.set(key, true);
        }
    }
    private initSpriteNode() {
        if (this.sprite) {
            return;
        }
        this.sprite = this.node.getChildByName('sprite');
        this.lineNode = this.sprite.getChildByName("line");
        this.lightSprite = this.sprite.getChildByName("light").getComponent(cc.Sprite);
        this.headSprite = this.sprite.getChildByName("head").getComponent(cc.Sprite);
    }
    onEnable() {
        this.tagetPos = cc.v3(0, 0);
        this.entity.NodeRender.node = this.node;
        this.entity.Move.linearVelocity = cc.v2(0, 0);
        this.initSpriteNode();
        this.isReserved = false;
    }
    timeDelay = 0;
    checkTimeDelay = 0;
    update(dt) {
        if (Logic.isGamePause) {
            this.entity.Move.linearVelocity = cc.v2(0, 0);
            return;
        }
        this.updatePos();
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 0.1) {
            this.updateLaser();
            this.checkTimeDelay = 0;
        }
    }

    changeBullet(data: BulletData) {
        this.data = data;
        this.node.scale = data.size > 0 ? data.size : 1;
        this.collider.h = 16;
        this.collider.w = 0;
        this.collider.offset = cc.v2(0, 0);
        this.collider.sensor = data.isPhysical == 0;
        this.node.stopAllActions();
        this.initSpriteNode();
        this.lineNode.getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser);
        this.headSprite.spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser, 'head');

    }
    fire(hv: cc.Vec3,angleOffset:number) {
        this.hv = hv;
        this.angleOffset = angleOffset;
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
        this.rotateCollider(cc.v2(this.hv.x, this.hv.y));
        this.isStop = false;
        if (this.data.lifeTime > 0) {
            this.scheduleOnce(() => { this.stopLaser(); }, this.data.lifeTime);
        } else {
            this.scheduleOnce(() => { this.stopLaser(); }, 5);
        }
        cc.tween(this.lightSprite.node).repeatForever(
            cc.tween()
                .delay(0.05).call(() => { this.lightSprite.spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser, 'light001'); })
                .delay(0.05).call(() => { this.lightSprite.spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser, 'light002'); })
                .delay(0.05).call(() => { this.lightSprite.spriteFrame = this.getSpriteFrameByName(this.data.resNameLaser, 'light003'); })
        ).start();
        cc.tween(this.sprite).repeatForever(
            cc.tween(this.sprite).to(0.1, { scaleY: 0.9 }).to(0.1, { scaleY: 1.1 })
        ).start();
        if (this.isFromPlayer) {
            if (this.targetMap.has(CCollider.TAG.PLAYER)) { this.targetMap.delete(CCollider.TAG.PLAYER); }
            if (this.targetMap.has(CCollider.TAG.GOODNONPLAYER)) { this.targetMap.delete(CCollider.TAG.GOODNONPLAYER); }
            if (this.sensorTargetMap.has(CCollider.TAG.ENERGY_SHIELD)) { this.sensorTargetMap.delete(CCollider.TAG.ENERGY_SHIELD); }
            if (this.sensorTargetMap.has(CCollider.TAG.PLAYER_HIT)) { this.sensorTargetMap.delete(CCollider.TAG.PLAYER_HIT); }
            this.targetMap.set(CCollider.TAG.NONPLAYER, true);
            this.targetMap.set(CCollider.TAG.BOSS, true);
        } else {
            if (this.targetMap.has(CCollider.TAG.NONPLAYER)) { this.targetMap.delete(CCollider.TAG.PLAYER); }
            if (this.targetMap.has(CCollider.TAG.BOSS)) { this.targetMap.delete(CCollider.TAG.BOSS); }
            this.targetMap.set(CCollider.TAG.PLAYER, true);
            this.targetMap.set(CCollider.TAG.GOODNONPLAYER, true);
            this.sensorTargetMap.set(CCollider.TAG.ENERGY_SHIELD, true);
            this.sensorTargetMap.set(CCollider.TAG.PLAYER_HIT, true);
        }
        this.updatePos();
        this.updateLaser();
    }
    private updatePos(){
        let p = this.shooter.defaultPos.clone();
        let pos = this.shooter.node.convertToWorldSpaceAR(p);
        this.startPos = cc.v2(pos.clone());
        pos = this.dungeon.node.convertToNodeSpaceAR(pos);
        this.entity.Transform.position = pos;
        this.node.position = pos;
    }
    private updateLaser() {
        if (!this.shooter||this.isStop) {
            return;
        }
        
        this.hv = cc.v3(cc.v2(this.shooter.Hv).rotateSelf(this.angleOffset * Math.PI / 180));
        this.rotateCollider(cc.v2(this.hv.x, this.hv.y));
        //碰撞终点
        let endPos = this.node.convertToWorldSpaceAR(cc.v2(this.data.laserRange > 0 ? this.data.laserRange : 3000, 0));
        let result = GameWorldSystem.colliderSystem.nearestRayCast(this.startPos, endPos, this.targetMap, this.sensorTargetMap);
        if (result) {
            endPos = result.point;
        }
        let distance = Logic.getDistance(this.startPos, endPos);
        if (distance <= 0) {
            distance = 0;
        }
        //激光的宽度是两点之间的距离加贴图的宽度,激光的起始点是减去当前距离的点
        let finalwidth = distance;
        this.lineNode.width = finalwidth / this.node.scaleY;
        this.lightSprite.node.setPosition(this.lineNode.width, 0);
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.REMOTE_LASER } });
        if(result){
            this.attacking(result.collider.node,result.collider.tag);
        }
    }

    stopLaser() {
        this.isStop = true;
        cc.tween(this.node).to(0.2, { scaleX: 0 }).to(0.1, { scaleY: 0 }).call(() => {
            this.shooter.addDestroyBullet(this.node,true);
        }).start();
    }

    private getSpriteFrameByName(resName: string, suffix?: string, needDefaultSuffix?: boolean): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrameRes(resName + suffix);
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(needDefaultSuffix ? resName + 'anim000' : resName);
        }
        return spriteFrame;
    }

    // onColliderPreSolve(other: CCollider, self: CCollider) {
    //     if (!this.isFromPlayer && (other.tag == CCollider.TAG.NONPLAYER || other.tag == CCollider.TAG.BOSS)) {
    //         self.disabledOnce = true;
    //     }
    //     if (this.isFromPlayer && (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.GOODNONPLAYER)) {
    //         self.disabledOnce = true;
    //     }
    // }
    // onColliderEnter(other: CCollider, self: CCollider) {
    //     let isAttack = true;
    //     if (!this.isFromPlayer && (other.tag == CCollider.TAG.NONPLAYER || other.tag == CCollider.TAG.BOSS)) {
    //         isAttack = false;
    //     }
    //     if (this.isFromPlayer && (other.tag == CCollider.TAG.PLAYER || other.tag == CCollider.TAG.GOODNONPLAYER)) {
    //         isAttack = false;
    //     }
    //     if (other.tag == CCollider.TAG.BULLET) {
    //         isAttack = false;
    //     }

    //     if (isAttack) {
    //         this.attacking(other.node, other.tag, other.sensor);
    //     }
    // }
    private attacking(attackTarget: cc.Node, tag: number) {
        if (!attackTarget) {
            return;
        }
        let damage = new DamageData();
        let damageSuccess = false;
        damage.valueCopy(this.data.damage);
        damage.isRemote = true;
       if (tag == CCollider.TAG.NONPLAYER || tag == CCollider.TAG.GOODNONPLAYER) {
            let monster = attackTarget.getComponent(NonPlayer);
            if (monster && !monster.sc.isDied) {
                damageSuccess = monster.takeDamage(damage);
                if (damageSuccess) { this.addTargetAllStatus(monster, new FromData()) }
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
                }
            }
        } else if (tag == CCollider.TAG.BOSS) {
            let boss = attackTarget.getComponent(Boss);
            if (boss && !boss.sc.isDied) {
                damageSuccess = boss.takeDamage(damage);
                if (damageSuccess) { this.addTargetAllStatus(boss, new FromData()) }
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
           

        } else if (!this.isFromPlayer && tag == CCollider.TAG.ENERGY_SHIELD) {
            let shield = attackTarget.getComponent(EnergyShield);
            if (shield && shield.isValid) {
                damageSuccess = shield.takeDamage(damage);
            }
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
            this.isFromPlayer = true;
            this.data.isTracking = 0;
            return true;
        }
        return false;
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
