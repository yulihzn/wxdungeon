import Boss from "./Boss";
import DamageData from "../Data/DamageData";
import HealthBar from "../HealthBar";
import Shooter from "../Shooter";
import Player from "../Player";
import { EventConstant } from "../EventConstant";
import EquipmentManager from "../Manager/EquipmentManager";
import Logic from "../Logic";
import Dungeon from "../Dungeon";
import SlimeVenom from "./SlimeVenom";
import Monster from "../Monster";
import MonsterManager from "../Manager/MonsterManager";
import Skill from "../Utils/Skill";
import AudioPlayer from "../Utils/AudioPlayer";

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
export default class Slime extends Boss {
    static readonly DIVIDE_COUNT = 4;
    @property(cc.Prefab)
    venom: cc.Prefab = null;
    private venomPool: cc.NodePool;
    healthBar: HealthBar = null;
    private anim: cc.Animation;
    rigidbody: cc.RigidBody;
    isFaceRight = true;
    isMoving = false;
    // isAttacking = false;
    private timeDelay = 0;
    isHurt = false;
    isCrownFall = false;
    isDashing = false;//是否正在冲刺
    currentlinearVelocitySpeed: cc.Vec2 = cc.Vec2.ZERO;//当前最大速度
    private dashlight: cc.Node;
    private sprite: cc.Node;
    private crown: cc.Node;
    private decorate: cc.Node;
    scaleSize = 1;
    slimeType = 0;
    meleeSkill = new Skill();
    onLoad() {
        this.meleeSkill.IsExcuting = false;
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.updatePlayerPos();
        this.venomPool = new cc.NodePool();
        this.sprite = this.node.getChildByName('sprite');
        this.crown = this.sprite.getChildByName('crown');
        this.decorate = this.node.getChildByName('sprite').getChildByName('body').getChildByName('decorate');
        this.dashlight = this.sprite.getChildByName('dashlight');
        this.dashlight.opacity = 0;
        cc.director.on('destoryvenom', (event) => {
            this.destroyVenom(event.detail.coinNode);
        })
        this.scheduleOnce(() => { this.isShow = true; }, 1)
    }

    start() {
        super.start();
        if (this.crown && this.slimeType != 0) {
            this.crown.opacity = 0;
        }
        if (this.decorate && this.slimeType > 2) {
            this.decorate.opacity = 0;
        }
    }
    private getVenom(parentNode: cc.Node, pos: cc.Vec2) {
        if (this.scaleSize < 1 || this.isDied) {
            return;
        }
        let venomPrefab: cc.Node = null;
        if (this.venomPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            venomPrefab = this.venomPool.get();
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!venomPrefab || venomPrefab.active) {
            venomPrefab = cc.instantiate(this.venom);
        }
        venomPrefab.parent = parentNode;
        venomPrefab.position = pos;
        venomPrefab.scale = this.slimeType == 0 ? 1.5 : 1;
        venomPrefab.getComponent(SlimeVenom).player = this.dungeon.player;
        venomPrefab.zIndex = 3000;
        venomPrefab.opacity = 255;
        venomPrefab.active = true;
    }

    destroyVenom(venomNode: cc.Node) {
        if (!venomNode) {
            return;
        }
        venomNode.active = false;
        if (this.venomPool) {
            this.venomPool.put(venomNode);
        }
    }

    //Animation
    AnimAttacking() {
        this.meleeSkill.IsExcuting = false;
        let attackRange = 64 + 50 * this.scaleSize;
        let newdis = this.getNearPlayerDistance(this.dungeon.player.node);
        if (newdis < attackRange) { this.dungeon.player.takeDamage(this.data.getAttackPoint()); }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.getComponent(Player);
        if (player && this.isDashing && this.dungeon && !this.isHurt && !this.isDied) {
            this.isDashing = false;
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
            this.dungeon.player.takeDamage(this.data.getAttackPoint());
        }
    }
    venomTimeDelay = 0;
    isVenomTimeDelay(dt: number): boolean {
        this.venomTimeDelay += dt;
        if (this.venomTimeDelay > 0.2) {
            this.venomTimeDelay = 0;
            return true;
        }
        return false;
    }
    childSlimeTimeDelay = 0;
    isChildSlimeTimeDelay(dt: number): boolean {
        this.childSlimeTimeDelay += dt;
        if (this.childSlimeTimeDelay > 5) {
            this.childSlimeTimeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        this.healthBar.node.active = !this.isDied;
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            this.bossAction();
        }
        this.dashlight.opacity = 0;
        if (this.dungeon && this.isDashing) {
            this.dashlight.opacity = 128;
            this.rigidbody.linearVelocity = this.currentlinearVelocitySpeed.clone();
        }
        if (this.dungeon) {
            let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
            if (playerDis < 64 && !this.isHurt) {
                this.rigidbody.linearVelocity = cc.v2(0, 0);
            }
        }
        if (this.isDied) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        }
        this.healthBar.node.active = !this.isDied;
        if (this.data.currentHealth < 1) {
            this.killed();
        }
        this.node.scaleY = this.scaleSize;
        this.node.scaleX = this.isFaceRight ? this.scaleSize : -this.scaleSize;
        if (this.isVenomTimeDelay(dt) && this.isMoving && !this.meleeSkill.IsExcuting) {
            this.getVenom(this.node.parent, this.node.position);
        }
        if (this.isChildSlimeTimeDelay(dt) && !this.isDied && this.slimeType == 0 && this.dungeon) {
            let count = 0;
            for (let m of this.dungeon.monsters) {
                if (!m.isDied) {
                    count++;
                }
            }
            if (count < 10 && this.dungeon.monsters.length < 50) {
                let pos = Dungeon.getIndexInMap(this.node.position.clone());
                this.dungeon.addMonsterFromData(MonsterManager.MONSTER_SLIME, pos.x, pos.y);
            }
        }
    }
    takeDamage(damage: DamageData): boolean {
        if (this.isDied || !this.isShow) {
            return false;
        }
        this.data.currentHealth -= this.data.getDamage(damage).getTotalDamage();
        if (this.data.currentHealth > this.data.Common.maxHealth) {
            this.data.currentHealth = this.data.Common.maxHealth;
        }
        this.isHurt = true;
        this.isDashing = false;
        //100ms后修改受伤
        this.scheduleOnce(() => { if (this.node) { this.isHurt = false; } }, 0.1);
        this.anim.play('SlimeHit');
        this.meleeSkill.IsExcuting = false;
        if (this.data.currentHealth < this.data.Common.maxHealth / 2 && !this.isCrownFall && this.slimeType == 0) {
            this.isCrownFall = true;
            this.isShow = false;
            this.scheduleOnce(() => { this.isShow = true; this.crown.opacity = 0; }, 1)
            this.anim.play('SlimeCrownFall');
        }
        this.healthBar.refreshHealth(this.data.currentHealth, this.data.Common.maxHealth);
        cc.director.emit(EventConstant.PLAY_AUDIO,{detail:{name:AudioPlayer.MONSTER_HIT}});
        return true;
    }

    killed() {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        this.isDashing = false;
        this.anim.play('SlimeDie');
        let collider: cc.PhysicsCollider = this.getComponent(cc.PhysicsBoxCollider);
        collider.sensor = true;
        this.scheduleOnce(() => { if (this.node) { this.node.active = false; } }, 5);
        if (this.dungeon) {
            if (this.slimeType == 0) {
                cc.director.emit(EventConstant.DUNGEON_ADD_HEART, { detail: { pos: this.node.position } });
                cc.director.emit(EventConstant.DUNGEON_ADD_AMMO, { detail: { pos: this.node.position } });
                this.dungeon.addEquipment(Logic.getRandomEquipType(), this.pos, null, 3);
            }
            if (this.slimeType < Slime.DIVIDE_COUNT) {
                cc.director.emit(EventConstant.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: 5 } });
                cc.director.emit(EventConstant.BOSS_ADDSLIME, { detail: { posIndex: this.pos.clone(), slimeType: this.slimeType + 1 } });
                cc.director.emit(EventConstant.BOSS_ADDSLIME, { detail: { posIndex: this.pos.clone(), slimeType: this.slimeType + 1 } });
            }
        }

    }
    bossAction() {
        if (this.isDied || !this.dungeon || this.isHurt) {
            return;
        }
        let newPos = cc.v2(0, 0);
        newPos.x += Logic.getRandomNum(0, 2000) - 1000;
        newPos.y += Logic.getRandomNum(0, 2000) - 1000;
        let playerDis = this.getNearPlayerDistance(this.dungeon.player.node);
        this.node.position = Dungeon.fixOuterMap(this.node.position);
        this.pos = Dungeon.getIndexInMap(this.node.position);
        this.changeZIndex();
        let pos = newPos.clone();

        //近战
        let attackRange = 64 + 50 * this.scaleSize;
        if (playerDis < attackRange && !this.dungeon.player.isDied && !this.isDashing && this.isShow && this.scaleSize >= 1) {
            pos = this.dungeon.player.getCenterPosition().sub(this.node.position);
            if (!pos.equals(cc.Vec2.ZERO)) {
                pos = pos.normalizeSelf();
            }
            let isPlayAttack = this.anim.getAnimationState("SlimeAttack").isPlaying;
            if (!isPlayAttack) {
                this.meleeSkill.IsExcuting = true;
                this.anim.play('SlimeAttack');
            }
        }
        let speed = 300 - 50 * this.scaleSize;
        //冲刺
        let dashRange = 128 + 35 * this.scaleSize;
        if (playerDis > dashRange && !this.dungeon.player.isDied && !this.isDashing && this.isShow && Logic.getHalfChance()) {
            if (Logic.getHalfChance()) {
                pos = this.dungeon.player.getCenterPosition().sub(this.node.position);
            }
            this.move(pos, speed * 1.5);
            this.isDashing = true;
            this.scheduleOnce(() => { if (this.node) { this.isDashing = false; } }, 2);
        }
        if (Logic.getRandomNum(1,10)<3) {
            this.move(pos, speed);
        }
    }

    move(pos: cc.Vec2, speed: number) {
        if (this.isDied || this.isHurt || this.isDashing || !this.isShow || this.meleeSkill.IsExcuting) {
            return;
        }
        if (pos.equals(cc.Vec2.ZERO)) {
            return;
        }
        pos = pos.normalizeSelf();
        if (this.meleeSkill.IsExcuting && !pos.equals(cc.Vec2.ZERO)) {
            pos = pos.mul(0.5);
        }
        if (!pos.equals(cc.Vec2.ZERO)) {
            this.pos = Dungeon.getIndexInMap(this.node.position);
        }
        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);
        let movement = cc.v2(h, v);
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement.clone();
        this.currentlinearVelocitySpeed = movement.clone();
        this.isMoving = h != 0 || v != 0;
        if (this.isMoving) {
            this.isFaceRight = h > 0;
        }
        let isPlayAttack = this.anim.getAnimationState("SlimeAttack").isPlaying;
        if (!this.anim.getAnimationState('SlimeIdle').isPlaying && !isPlayAttack) {
            this.anim.play('SlimeIdle');
        }
        this.changeZIndex();
    }
    actorName(){
        return '史莱姆之王';
    }
}
