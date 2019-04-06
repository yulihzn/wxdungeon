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
import { EventConstant } from './EventConstant';
import Shooter from './Shooter';
import HealthBar from './HealthBar';
import Logic from './Logic';
import Dungeon from './Dungeon';
import Equipment from './Equipment/Equipment';
import EquipmentData from './Data/EquipmentData';
import MeleeWeapon from './MeleeWeapon';
import RectDungeon from './Rect/RectDungeon';
import StatusManager from './Manager/StatusManager';
import DamageData from './Data/DamageData';
import InventoryManager from './Manager/InventoryManager';
import PlayerData from './Data/PlayerData';
import FloatinglabelManager from './Manager/FloatingLabelManager';
import Tips from './UI/Tips';
import Random from './Utils/Random';
import Skill from './Utils/Skill';

@ccclass
export default class Player extends cc.Component {

    @property(cc.Vec2)
    pos: cc.Vec2 = cc.v2(0, 0);
    @property(FloatinglabelManager)
    floatinglabelManager: FloatinglabelManager = null;
    @property(cc.Prefab)
    walksmoke: cc.Prefab = null;
    private smokePool: cc.NodePool;
    @property(cc.Node)
    meleeWeaponNode: cc.Node = null;
    meleeWeapon: MeleeWeapon = null;
    @property(cc.Node)
    shooterNode: cc.Node = null;
    shooter: Shooter = null;
    @property(StatusManager)
    statusManager: StatusManager = null;
    private playerItemSprite: cc.Sprite;
    hairSprite: cc.Sprite = null;
    weaponSprite: cc.Sprite = null;
    weaponLightSprite: cc.Sprite = null;
    weaponStabSprite: cc.Sprite = null;
    weaponStabLightSprite: cc.Sprite = null;
    helmetSprite: cc.Sprite = null;
    clothesSprite: cc.Sprite = null;
    trousersSprite: cc.Sprite = null;
    glovesLeftSprite: cc.Sprite = null;
    glovesRightSprite: cc.Sprite = null;
    shoesLeftSprite: cc.Sprite = null;
    shoesRightSprite: cc.Sprite = null;
    cloakSprite: cc.Sprite = null;
    bodySprite: cc.Sprite = null;
    isMoving = false;//是否移动中
    isAttacking = false;//是否近战攻击中
    isHeavyRemotoAttacking = false;//是否是重型远程武器,比如激光
    private sprite: cc.Node;
    private anim: cc.Animation;
    isDied = false;//是否死亡
    isFall = false;//是否跌落
    isStone = false;//是否石化
    baseAttackPoint: number = 1;

    //触碰到的装备
    touchedEquipment: Equipment;
    //触碰到的提示
    touchedTips: Tips;
    inventoryManager: InventoryManager;
    data: PlayerData;
    recoveryTimeDelay = 0;

    isFaceRight = true;

    attackTarget: cc.Collider;
    rigidbody: cc.RigidBody;

    defaultPos = cc.v2(0, 0);
    //冲刺
    dashSkill = new Skill();

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isAttacking = false;
        this.inventoryManager = Logic.inventoryManager;
        this.data = Logic.playerData;
        this.statusUpdate();
        this.pos = cc.v2(0, 0);
        this.isDied = false;
        this.isStone = false;
        this.anim = this.getComponent(cc.Animation);
        let walkName = "PlayerWalkShort";
        if (this.inventoryManager.trousers.trouserslong == 1) {
            walkName = "PlayerWalk";
        }
        if (this.anim) {
            this.anim.play(walkName);
        }
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.sprite = this.node.getChildByName('sprite');
        this.bodySprite = this.getSpriteChildSprite(['sprite', 'body']);
        this.playerItemSprite = this.getSpriteChildSprite(['sprite', 'righthand', 'item']);
        this.hairSprite = this.getSpriteChildSprite(['sprite', 'body', 'hair']);
        this.weaponSprite = this.getSpriteChildSprite(['MeleeWeapon', 'sprite', 'weapon']);
        this.weaponLightSprite = this.getSpriteChildSprite(['MeleeWeapon', 'sprite', 'meleelight']);
        this.weaponStabSprite = this.getSpriteChildSprite(['MeleeWeapon', 'sprite', 'stabweapon']);
        this.weaponStabLightSprite = this.getSpriteChildSprite(['MeleeWeapon', 'sprite', 'stablight']);
        this.helmetSprite = this.getSpriteChildSprite(['sprite', 'body', 'helmet']);
        this.clothesSprite = this.getSpriteChildSprite(['sprite', 'body', 'clothes']);
        this.trousersSprite = this.getSpriteChildSprite(['sprite', 'body', 'trousers']);
        this.glovesLeftSprite = this.getSpriteChildSprite(['sprite', 'body', 'glovesleft']);
        this.glovesRightSprite = this.getSpriteChildSprite(['sprite', 'body', 'glovesright']);
        this.shoesLeftSprite = this.getSpriteChildSprite(['sprite', 'body', 'shoesleft']);
        this.shoesRightSprite = this.getSpriteChildSprite(['sprite', 'body', 'shoesright']);
        this.cloakSprite = this.getSpriteChildSprite(['sprite', 'cloak']);
        cc.director.on(EventConstant.INVENTORY_CHANGEITEM
            , (event) => { this.changeItem(event.detail.spriteFrame) });
        cc.director.on(EventConstant.PLAYER_USEITEM
            , (event) => { this.UseItem() });
        cc.director.on(EventConstant.PLAYER_SKILL
            , (event) => { this.UseSkill() });
        cc.director.on(EventConstant.PLAYER_ATTACK
            , (event) => { this.meleeAttack() });
        cc.director.on(EventConstant.PLAYER_REMOTEATTACK
            , (event) => { this.remoteAttack() });
        cc.director.on(EventConstant.PLAYER_STATUSUPDATE
            , (event) => { this.statusUpdate() });
        cc.director.on(EventConstant.PLAYER_TAKEDAMAGE
            , (event) => { this.takeDamage(event.detail.damage) });
        cc.director.on(EventConstant.PLAYER_ROTATE
            , (event) => { this.rotatePlayer(event.detail.dir, event.detail.pos, event.detail.dt) });
        if (Logic.mapManager.getCurrentRoomType() == RectDungeon.BOSS_ROOM) {
            Logic.playerData.pos = cc.v2(Math.floor(Dungeon.WIDTH_SIZE / 2), 2);
        }
        this.pos = Logic.playerData.pos.clone();
        this.defaultPos = Logic.playerData.pos.clone();
        this.baseAttackPoint = Logic.playerData.getDamageMin();
        this.updatePlayerPos();
        this.meleeWeapon = this.meleeWeaponNode.getComponent(MeleeWeapon);
        this.shooter = this.shooterNode.getComponent(Shooter);
        this.shooter.player = this;
        this.smokePool = new cc.NodePool();
        cc.director.on('destorysmoke', (event) => {
            this.destroySmoke(event.detail.coinNode);
        })
    }
    /**
     * 
     * @param isStone 是否是石头
     * @param stoneLevel 石头等级：0：全身，1：身子和脚，2：脚 
     */
    private turnStone(isStone: boolean, stoneLevel?: number) {
        let n = isStone ? 1 : 0;
        this.bodySprite.setState(n);
        this.hairSprite.setState(n);
        this.helmetSprite.setState(n);
        this.clothesSprite.setState(n);
        this.trousersSprite.setState(n);
        this.glovesLeftSprite.setState(n);
        this.glovesRightSprite.setState(n);
        this.shoesLeftSprite.setState(n);
        this.shoesRightSprite.setState(n);
        if (stoneLevel == 1) {
            this.hairSprite.setState(0);
            this.helmetSprite.setState(0);
        }
        if (stoneLevel == 2) {
            this.bodySprite.setState(0);
            this.hairSprite.setState(0);
            this.helmetSprite.setState(0);
            this.clothesSprite.setState(0);
            this.glovesLeftSprite.setState(0);
            this.glovesRightSprite.setState(0);
        }
    }

    private getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node;
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node.getComponent(cc.Sprite);
    }
    private statusUpdate() {
        if (!this.inventoryManager) {
            return;
        }
        this.data.EquipmentTotalData.valueCopy(this.inventoryManager.getTotalEquipmentData());
        cc.director.emit(EventConstant.HUD_UPDATE_PLAYER_INFODIALOG, { detail: { data: this.data } });
    }
    private getWalkSmoke(parentNode: cc.Node, pos: cc.Vec2) {
        let smokePrefab: cc.Node = null;
        if (this.smokePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            smokePrefab = this.smokePool.get();
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!smokePrefab || smokePrefab.active) {
            smokePrefab = cc.instantiate(this.walksmoke);
        }
        smokePrefab.parent = parentNode;
        smokePrefab.position = pos;
        smokePrefab.zIndex = 4000;
        smokePrefab.opacity = 255;
        smokePrefab.active = true;
    }

    destroySmoke(smokeNode: cc.Node) {
        if (!smokeNode) {
            return;
        }
        smokeNode.active = false;
        if (this.smokePool) {
            this.smokePool.put(smokeNode);
        }
    }
    changeItem(spriteFrame: cc.SpriteFrame) {
        this.playerItemSprite.spriteFrame = spriteFrame;
    }

    changeEquipment(equipData: EquipmentData, spriteFrame: cc.SpriteFrame) {
        switch (equipData.equipmetType) {
            case 'weapon':
                this.meleeWeapon.isStab = equipData.stab == 1;
                this.meleeWeapon.isFar = equipData.far == 1;
                if (equipData.stab == 1) {
                    this.weaponSprite.spriteFrame = null;
                    this.weaponStabSprite.spriteFrame = spriteFrame;
                    this.weaponStabLightSprite.spriteFrame = this.meleeWeapon.isFar ? Logic.spriteFrames['stablight'] : Logic.spriteFrames['stablight1'];
                } else {
                    this.weaponSprite.spriteFrame = spriteFrame;
                    this.weaponStabSprite.spriteFrame = null;
                }
                let color1 = cc.color(255, 255, 255).fromHEX(this.inventoryManager.weapon.color);
                this.weaponSprite.node.color = color1;
                this.weaponLightSprite.node.color = color1;
                this.weaponStabSprite.node.color = color1;
                this.weaponStabLightSprite.node.color = color1;
                break;
            case 'remote': this.shooter.data = equipData.clone();
                this.shooter.changeRes(this.shooter.data.img);
                break;
            case 'helmet':
                this.hairSprite.node.opacity = spriteFrame ? 0 : 255;
                this.updateEquipMent(this.helmetSprite, this.inventoryManager.helmet.color, spriteFrame);
                break;
            case 'clothes':
                this.updateEquipMent(this.clothesSprite, this.inventoryManager.clothes.color, spriteFrame);
                break;
            case 'trousers':
                this.updateEquipMent(this.trousersSprite, this.inventoryManager.trousers.color
                    , equipData.trouserslong == 1 ? Logic.spriteFrames['idle002'] : Logic.spriteFrames['idle001']);
                break;
            case 'gloves':
                this.updateEquipMent(this.glovesLeftSprite, this.inventoryManager.gloves.color, spriteFrame);
                this.updateEquipMent(this.glovesRightSprite, this.inventoryManager.gloves.color, spriteFrame);
                break;
            case 'shoes':
                this.updateEquipMent(this.shoesLeftSprite, this.inventoryManager.shoes.color, spriteFrame);
                this.updateEquipMent(this.shoesRightSprite, this.inventoryManager.shoes.color, spriteFrame);
                break;
            case 'cloak':
                this.updateEquipMent(this.cloakSprite, this.inventoryManager.cloak.color, spriteFrame);
                break;
        }
        this.data.EquipmentTotalData.valueCopy(this.inventoryManager.getTotalEquipmentData());
        cc.director.emit(EventConstant.HUD_UPDATE_PLAYER_INFODIALOG, { detail: { data: this.data } });
        let health = this.data.getHealth();
        cc.director.emit(EventConstant.HUD_UPDATE_PLAYER_HEALTHBAR, { detail: { x: health.x, y: health.y } });
    }
    private updateEquipMent(sprite: cc.Sprite, color: string, spriteFrame: cc.SpriteFrame): void {
        sprite.spriteFrame = spriteFrame;
        let c = cc.color(255, 255, 255).fromHEX(color);
        sprite.node.color = c;
    }
    /**获取中心位置 */
    getCenterPosition(): cc.Vec2 {
        return this.node.position.clone().addSelf(cc.v2(0, 32 * this.node.scaleY));
    }
    updatePlayerPos() {
        this.node.x = this.pos.x * 64 + 32;
        this.node.y = this.pos.y * 64 + 32;
    }
    transportPlayer(pos: cc.Vec2) {
        if (!this.sprite) {
            return;
        }
        this.sprite.rotation = 0;
        this.sprite.scale = 1;
        this.sprite.opacity = 255;
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.pos = pos;
        this.changeZIndex(this.pos);
        this.updatePlayerPos();
    }
    changeZIndex(pos: cc.Vec2) {
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 10 + 2;
    }
    addStatus(statusType: string) {
        this.statusManager.addStatus(statusType);
    }
    meleeAttack() {
        if (!this.meleeWeapon || this.isAttacking) {
            return;
        }

        this.isAttacking = true;
        let pos = this.meleeWeapon.getHv().clone();
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(1, 0);
        }
        pos = pos.normalizeSelf().mul(15);
        pos.x = this.isFaceRight ? pos.x : -pos.x;
        let speed = PlayerData.DefAULT_SPEED - this.data.getAttackSpeed();
        if (speed < 1) { speed = 1 }
        if (speed > PlayerData.DefAULT_SPEED * 10) { speed = PlayerData.DefAULT_SPEED * 10; }
        let spritePos = this.sprite.position.clone();
        let action = cc.sequence(cc.moveBy(0.1, pos.x, pos.y), cc.moveBy(0.1, -pos.x, -pos.y), cc.callFunc(() => {
            this.scheduleOnce(() => {
                this.sprite.position = spritePos.clone();
                this.isAttacking = false;
            }, speed / 1000);
        }, this));
        this.sprite.runAction(action);
        let isMiss = Logic.getRandomNum(0, 100) < this.data.StatusTotalData.missRate;
        if (isMiss) {
            this.showFloatFont(this.node.parent, 0, false, true)
        }
        this.meleeWeapon.attack(this.data, isMiss);
    }
    remoteRate = 0;
    remoteAttack() {
        let canFire = false;
        if (!this.data) {
            return;
        }
        let speed = PlayerData.DefAULT_SPEED - this.data.getRemoteSpeed();
        if (speed < 10) { speed = 10 }
        if (speed > Shooter.DefAULT_SPEED * 10) { speed = Shooter.DefAULT_SPEED * 10; }
        let currentTime = Date.now();
        if (currentTime - this.remoteRate > speed) {
            this.remoteRate = currentTime;
            canFire = true;
        }
        if (!canFire) {
            return;
        }
        this.isHeavyRemotoAttacking = this.isHeavyRemoteShooter();
        this.scheduleOnce(() => { this.isHeavyRemotoAttacking = false }, 0.2);
        if (this.shooter) {
            this.shooter.fireBullet(0);
        }
    }
    isHeavyRemoteShooter(): boolean {
        return this.shooter.data.isHeavy == 1;
    }
    rotatePlayer(dir: number, pos: cc.Vec2, dt: number) {
        if (!this.node || this.isDied || this.isFall) {
            return;
        }
        // if (this.shooter && !pos.equals(cc.Vec2.ZERO)) {
        //     this.shooter.setHv(cc.v2(pos.x, pos.y));
        // }
        if (this.meleeWeapon && !pos.equals(cc.Vec2.ZERO)) {
            this.meleeWeapon.setHv(cc.v2(pos.x, pos.y));
        }
    }
    move(dir: number, pos: cc.Vec2, dt: number) {
        if (this.isDied || this.isFall) {
            return;
        }
        
        if (this.isAttacking && !pos.equals(cc.Vec2.ZERO)) {
            pos = pos.mul(0.5);
        }
        if (this.isHeavyRemotoAttacking && !pos.equals(cc.Vec2.ZERO)) {
            pos = pos.mul(0.1);
        }
        if (this.shooter && !pos.equals(cc.Vec2.ZERO)) {
            this.shooter.setHv(cc.v2(pos.x, pos.y));
            this.pos = Dungeon.getIndexInMap(this.node.position);
            //存档系统保存玩家位置
            Logic.profile.playerData.pos = this.pos.clone();
        }
        if (this.meleeWeapon && !pos.equals(cc.Vec2.ZERO)) {
            this.meleeWeapon.setHv(cc.v2(pos.x, pos.y));
        }

        let h = pos.x;
        let v = pos.y;
        let absh = Math.abs(h);
        let absv = Math.abs(v);

        let mul = absh > absv ? absh : absv;
        mul = mul == 0 ? 1 : mul;
        let movement = cc.v2(h, v);
        let speed = this.data.getMoveSpeed();
        if (speed < 0) {
            speed = 0;
        }
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;
        if (this.isMoving) {
            this.isFaceRight = h > 0;
        }
        let walkName = "PlayerWalkShort";
        let idleName = "idle001";
        if (this.inventoryManager.trousers.trouserslong == 1) {
            walkName = "PlayerWalk";
            idleName = "idle002";
        }
        if (this.isMoving && !this.isStone) {
            if (!this.anim.getAnimationState(walkName).isPlaying) {
                this.anim.playAdditive(walkName);
            }
        } else {
            if (this.anim.getAnimationState(walkName).isPlaying) {
                this.anim.play('PlayerIdle');
                this.trousersSprite.spriteFrame = Logic.spriteFrames[idleName];
            }
        }

        let isUpDown = dir == 1 || dir == 0;
        if (isUpDown) {
            this.changeZIndex(this.pos);
        }
    }

    start() {
        // let ss = this.node.getComponentsInChildren(cc.Sprite);
        // for (let i = 0; i < ss.length; i++) {
        //     if (ss[i].spriteFrame) {
        //         ss[i].spriteFrame.getTexture().setAliasTexParameters();
        //     }
        // }
        if (!this.node) {
            return;
        }
        this.changeZIndex(this.pos);
        let health = this.data.getHealth();
        cc.director.emit(EventConstant.HUD_UPDATE_PLAYER_HEALTHBAR, { detail: { x: health.x, y: health.y } });
    }
    fall() {
        if (this.isFall) {
            return;
        }
        this.isFall = true;
        this.anim.play('PlayerFall');
        this.isAttacking = false;
        this.scheduleOnce(() => {
            this.transportPlayer(this.defaultPos);
            this.anim.play('PlayerIdle');
            let dd = new DamageData();
            dd.realDamage = 1;
            this.takeDamage(dd);
            this.isFall = false;
        }, 2);
    }
    takeDamage(damageData: DamageData): boolean {
        if (!this.data) {
            return false;
        }
        let dd = this.data.getDamage(damageData);
        let dodge = this.data.getDodge();
        let isDodge = Random.rand() <= dodge && dd.getTotalDamage() > 0;
        dd = isDodge ? new DamageData() : dd;
        let health = this.data.getHealth();
        health.x -= dd.getTotalDamage();
        if (health.x > health.y) {
            health.x = health.y;
        }
        cc.director.emit(EventConstant.HUD_UPDATE_PLAYER_HEALTHBAR, { detail: { x: health.x, y: health.y } });
        Logic.playerData.currentHealth = health.x;
        this.showFloatFont(this.node.parent, dd.getTotalDamage(), isDodge, false);
        if (Logic.playerData.currentHealth <= 0) {
            this.killed();
        }
        return !isDodge && dd.getTotalDamage() > 0;
    }

    showFloatFont(dungeonNode: cc.Node, d: number, isDodge: boolean, isMiss: boolean) {
        if (!this.floatinglabelManager) {
            return;
        }
        let flabel = this.floatinglabelManager.getFloaingLabel(dungeonNode);
        if (isDodge) {
            flabel.showDoge();
        } else if (isMiss) {
            flabel.showMiss();
        } else if (d != 0) {
            flabel.showDamage(-d)
        } else {
            flabel.hideLabel();
        }
    }
    killed() {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        this.anim.play('PlayerDie');
        cc.director.emit(EventConstant.HUD_STOP_COUNTTIME);
        this.scheduleOnce(() => {
            Logic.profile.clearData();
            cc.director.loadScene('gameover');
        }, 1);
    }
    //玩家行动
    playerAction(dir: number, pos: cc.Vec2, dt: number, dungeon: Dungeon) {
        if (this.meleeWeapon && !this.meleeWeapon.dungeon) {
            this.meleeWeapon.dungeon = dungeon;
        }
        if (this.shooter && !this.shooter.dungeon) {
            this.shooter.dungeon = dungeon;
        }
        if(this.dashSkill&&!this.dashSkill.IsExcuting){
            this.move(dir, pos, dt);
        }
    }
    //30秒回复一次
    isRecoveryTimeDelay(dt: number): boolean {
        this.recoveryTimeDelay += dt;
        if (this.recoveryTimeDelay > 30) {
            this.recoveryTimeDelay = 0;
            return true;
        }
        return false;
    }
    smokeTimeDelay = 0;
    isSmokeTimeDelay(dt: number): boolean {
        this.smokeTimeDelay += dt;
        if (this.smokeTimeDelay > 0.2) {
            this.smokeTimeDelay = 0;
            return true;
        }
        return false;
    }

    update(dt) {

        if (this.isRecoveryTimeDelay(dt)) {
            let re = this.data.getLifeRecovery();
            if (re > 0) {
                let dd = new DamageData();
                dd.realDamage = -re;
                this.takeDamage(dd);
            }
        }
        if (this.isSmokeTimeDelay(dt) && this.isMoving) {
            this.getWalkSmoke(this.node.parent, this.node.position);
        }
        this.isStone = this.statusManager.hasStatus(StatusManager.STONE);
        this.turnStone(this.isStone);
        this.node.scaleX = this.isFaceRight ? 1 : -1;
    }

    UseSkill(){
        if(!this.dashSkill){
            return;
        }
        if(this.dashSkill.IsExcuting){
            return;
        }
        this.dashSkill.IsExcuting = true;
        this.dashSkill.next(()=>{
            this.schedule(()=>{this.getWalkSmoke(this.node.parent, this.node.position);},0.05,4,0);
            let idleName = "idle001";
            if (this.inventoryManager.trousers.trouserslong == 1) {
                idleName = "idle002";
            }
            this.anim.play('PlayerIdle');
            let pos = this.rigidbody.linearVelocity.clone();
            this.isMoving = false;
            if(pos.equals(cc.Vec2.ZERO)){
                pos = this.isFaceRight?cc.v2(1,0):cc.v2(-1,0);
            }else{
                pos = pos.normalizeSelf();
            }
            pos = pos.mul(1000);
            this.rigidbody.linearVelocity = pos;
            this.scheduleOnce(()=>{
                this.rigidbody.linearVelocity = cc.Vec2.ZERO;
                this.trousersSprite.spriteFrame = Logic.spriteFrames[idleName];
            },0.5)
        },0.5,true);
    }
    UseItem() {
        if (this.touchedEquipment && !this.touchedEquipment.isTaken) {
            if (this.touchedEquipment.shopTable) {
                if (Logic.coins >= this.touchedEquipment.shopTable.data.price) {
                    cc.director.emit(EventConstant.HUD_ADD_COIN, { detail: { count: -this.touchedEquipment.shopTable.data.price } });
                    this.touchedEquipment.taken();
                    this.touchedEquipment.shopTable.data.isSaled = true;
                    this.touchedEquipment = null;
                }
            } else {
                this.touchedEquipment.taken();
                this.touchedEquipment = null;
            }
        }
        if (this.touchedTips) {
            this.touchedTips.next();
        }
    }
    //anim
    AttackFinish() {
        this.isAttacking = false;

    }

    // onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
    //     let equipment = otherCollider.body.node.getComponent(Equipment);
    //     if (equipment) {
    //         this.touchedEquipment = equipment;
    //     }
    // }
    // onEndContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
    //     this.touchedEquipment = null;
    // }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        this.touchedEquipment = null;
        this.touchedTips = null;
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        this.touchedEquipment = null;
        this.touchedTips = null;
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let equipment = other.node.getComponent(Equipment);
        if (equipment) {
            this.touchedEquipment = equipment;
        }
        let tips = other.node.getComponent(Tips);
        if (tips) {
            this.touchedTips = tips;
        }
    }

}