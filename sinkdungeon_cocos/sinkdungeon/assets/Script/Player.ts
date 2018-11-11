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
import InventoryData from './Data/InventoryData';
import Equipment from './Equipment/Equipment';
import EquipmentData from './Data/EquipmentData';
import Monster from './Monster';
import Kraken from './Boss/Kraken';
import MeleeWeapon from './MeleeWeapon';
import WalkSmoke from './WalkSmoke';
import RectDungeon from './Rect/RectDungeon';

@ccclass
export default class Player extends cc.Component {

    @property(cc.Vec2)
    pos: cc.Vec2 = cc.v2(4, 4);
    @property(cc.Label)
    label: cc.Label = null;
    @property(HealthBar)
    healthBar: HealthBar = null;
    @property(cc.Prefab)
    walksmoke: cc.Prefab = null;
    private smokePool: cc.NodePool;
    @property(cc.Prefab)
    swordFireLight: cc.Prefab = null;
    @property(cc.Node)
    meleeWeaponNode: cc.Node = null;
    meleeWeapon: MeleeWeapon = null;
    @property(cc.Node)
    shooterNode: cc.Node = null;
    shooter: Shooter = null;
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
    isMoving = false;
    isAttacking = false;
    private sprite: cc.Node;
    private anim: cc.Animation;
    isDied = false;
    isFall = false;
    health: cc.Vec2 = cc.v2(1, 1);
    baseAttackPoint: number = 1;

    touchedEquipment: Equipment;
    inventoryData: InventoryData;
    recoveryTimeDelay = 0;

    isFaceRight = true;

    attackTarget: cc.Collider;
    rigidbody: cc.RigidBody;

    defaultPos = cc.v2(0, 0);

    weaponStabFire:cc.ParticleSystem;
    weaponFire:cc.ParticleSystem;
    weaponFirePoint:cc.Node;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isAttacking = false;
        this.inventoryData = Logic.inventoryData;
        this.health = this.inventoryData.getHealth(Logic.playerData.basehealth, Logic.playerData.basehealth.y);
        this.pos = cc.v2(4, 4);
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        let walkName = "PlayerWalkShort";
        if(this.inventoryData.trousers.trouserslong == 1){
            walkName = "PlayerWalk";
        }
        if(this.anim){
            this.anim.play(walkName);
        }
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.sprite = this.node.getChildByName('sprite');
        this.playerItemSprite = this.sprite.getChildByName('righthand')
            .getChildByName('item').getComponent(cc.Sprite);
        this.hairSprite = this.sprite.getChildByName('body')
            .getChildByName('hair').getComponent(cc.Sprite);
        this.weaponSprite = this.node.getChildByName('MeleeWeapon').getChildByName('sprite')
            .getChildByName('weapon').getComponent(cc.Sprite);
        this.weaponFire = this.node.getChildByName('MeleeWeapon').getChildByName('sprite')
            .getChildByName('weapon').getChildByName('firesword').getComponent(cc.ParticleSystem);
        this.weaponFirePoint = this.node.getChildByName('MeleeWeapon').getChildByName('firepoint');
        this.weaponLightSprite = this.node.getChildByName('MeleeWeapon').getChildByName('sprite')
            .getChildByName('meleelight').getComponent(cc.Sprite);
        this.weaponStabSprite = this.node.getChildByName('MeleeWeapon').getChildByName('sprite')
            .getChildByName('stabweapon').getComponent(cc.Sprite);
        this.weaponStabFire = this.node.getChildByName('MeleeWeapon').getChildByName('sprite')
            .getChildByName('stabweapon').getChildByName('fire').getComponent(cc.ParticleSystem);;
        this.weaponStabLightSprite = this.node.getChildByName('MeleeWeapon').getChildByName('sprite')
            .getChildByName('stablight').getComponent(cc.Sprite);
        this.helmetSprite = this.sprite.getChildByName('body')
            .getChildByName('helmet').getComponent(cc.Sprite);
        this.clothesSprite = this.sprite.getChildByName('body')
            .getChildByName('clothes').getComponent(cc.Sprite);
        this.trousersSprite = this.sprite.getChildByName('body')
            .getChildByName('trousers').getComponent(cc.Sprite);
        this.glovesLeftSprite = this.sprite.getChildByName('body')
            .getChildByName('glovesleft').getComponent(cc.Sprite);
            this.glovesRightSprite = this.sprite.getChildByName('body')
            .getChildByName('glovesright').getComponent(cc.Sprite);
        this.shoesLeftSprite = this.sprite.getChildByName('body')
            .getChildByName('shoesleft').getComponent(cc.Sprite);
        this.shoesRightSprite = this.sprite.getChildByName('body')
            .getChildByName('shoesright').getComponent(cc.Sprite);
        this.cloakSprite = this.sprite.getChildByName('cloak').getComponent(cc.Sprite);

        cc.director.on(EventConstant.INVENTORY_CHANGEITEM
            , (event) => { this.changeItem(event.detail.spriteFrame) });
        cc.director.on(EventConstant.PLAYER_USEITEM
            , (event) => { this.UseItem() });

        cc.director.on(EventConstant.PLAYER_ATTACK
            , (event) => { this.meleeAttack() });
        cc.director.on(EventConstant.PLAYER_REMOTEATTACK
            , (event) => { this.remoteAttack() });

        cc.director.on(EventConstant.PLAYER_TAKEDAMAGE
            , (event) => { this.takeDamage(event.detail.damage) });
            cc.director.on(EventConstant.PLAYER_ROTATE
                , (event) => { this.rotatePlayer(event.detail.dir, event.detail.pos, event.detail.dt) });
        if(Logic.mapManger.currentRectRoom.roomType==RectDungeon.BOSS_ROOM){
            Logic.playerData.pos = cc.v2(Math.floor(Dungeon.WIDTH_SIZE/2),Math.floor(Dungeon.HEIGHT_SIZE/2));
        }
        this.pos = Logic.playerData.pos;
        this.defaultPos = Logic.playerData.pos.clone();
        this.baseAttackPoint = Logic.playerData.attackPoint;
        this.updatePlayerPos();
        this.meleeWeapon = this.meleeWeaponNode.getComponent(MeleeWeapon);
        this.shooter = this.shooterNode.getComponent(Shooter);
        this.shooter.player = this;
        this.smokePool = new cc.NodePool();
        cc.director.on('destorysmoke', (event) => {
            this.destroySmoke(event.detail.coinNode);
        })
        this.weaponStabFire.sourcePos = cc.v2(10,0);
        this.weaponStabFire.stopSystem();
        this.weaponFire.stopSystem();

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
    private getSwordFireLight(parentNode: cc.Node, p: cc.Vec2,isReverse?:boolean) {
        let firePrefab: cc.Node = null;
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!firePrefab || firePrefab.active) {
            firePrefab = cc.instantiate(this.swordFireLight);
        }
        let ps = [];
        let ps1 = [cc.v2(p.x,-p.y-60),cc.v2(p.x+40,-p.y-30),cc.v2(p.x+50,p.y),cc.v2(p.x+40,p.y+30),cc.v2(p.x,p.y+60)];
        let ps2 = [cc.v2(p.x,p.y+60),cc.v2(p.x+40,p.y+30),cc.v2(p.x+50,p.y),cc.v2(p.x+40,-p.y-30),cc.v2(p.x,-p.y-60)];
        ps = isReverse?ps1:ps2;
        for(let i = 0;i < ps.length;i++){
            let psp = ps[i];
            psp = this.meleeWeaponNode.convertToWorldSpace(psp);
            psp = this.node.parent.convertToNodeSpace(psp);
            ps[i] = psp.clone();
        }
        firePrefab.parent = parentNode;
        firePrefab.position = ps[0];
        firePrefab.zIndex = 4000;
        firePrefab.opacity = 255;
        firePrefab.active = true;
        let action = cc.sequence(cc.moveTo(0.025, ps[1]), cc.moveTo(0.05, ps[2]),cc.moveTo(0.075, ps[3]),cc.moveTo(0.1, ps[4]));
        firePrefab.runAction(action);
            
    }
    destroySmoke(smokeNode: cc.Node) {
        if(!smokeNode){
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
                    this.weaponStabLightSprite.spriteFrame = Logic.spriteFrames['stablight'];
                    this.weaponStabFire.resetSystem();
                    this.weaponFire.stopSystem();
                } else {
                    this.weaponSprite.spriteFrame = spriteFrame;
                    this.weaponStabSprite.spriteFrame = null;
                    this.weaponStabFire.stopSystem();
                    this.weaponFire.resetSystem();
                }
                let color1 = cc.color(255, 255, 255).fromHEX(this.inventoryData.weapon.color);
                this.weaponSprite.node.color = color1;
                this.weaponLightSprite.node.color = color1;
                this.weaponStabSprite.node.color = color1;
                this.weaponStabLightSprite.node.color = color1;
                break;
            case 'helmet': this.helmetSprite.spriteFrame = spriteFrame;
                this.hairSprite.node.opacity = spriteFrame ? 0 : 255;
                let color2 = cc.color(255, 255, 255).fromHEX(this.inventoryData.helmet.color);
                this.helmetSprite.node.color = color2;
                break;
            case 'clothes': this.clothesSprite.spriteFrame = spriteFrame;
                let color3 = cc.color(255, 255, 255).fromHEX(this.inventoryData.clothes.color);
                this.clothesSprite.node.color = color3;
                break;
            case 'trousers': 
                this.trousersSprite.spriteFrame = equipData.trouserslong==1?Logic.spriteFrames['idle002']:Logic.spriteFrames['idle001'];
                let color4 = cc.color(255, 255, 255).fromHEX(this.inventoryData.trousers.color);
                this.trousersSprite.node.color = color4;
                break;
            case 'gloves': 
                this.glovesLeftSprite.spriteFrame = spriteFrame;
                let color5l = cc.color(255, 255, 255).fromHEX(this.inventoryData.gloves.color);
                this.glovesLeftSprite.node.color = color5l;
                this.glovesRightSprite.spriteFrame = spriteFrame;
                let color5r = cc.color(255, 255, 255).fromHEX(this.inventoryData.gloves.color);
                this.glovesRightSprite.node.color = color5r;
                break;
            case 'shoes': 
                this.shoesLeftSprite.spriteFrame = spriteFrame;
                let color6l = cc.color(255, 255, 255).fromHEX(this.inventoryData.shoes.color);
                this.shoesLeftSprite.node.color = color6l;
                this.shoesRightSprite.spriteFrame = spriteFrame;
                let color6r = cc.color(255, 255, 255).fromHEX(this.inventoryData.shoes.color);
                this.shoesRightSprite.node.color = color6r;
                break;
            case 'cloak': this.cloakSprite.spriteFrame = spriteFrame;
                let color7 = cc.color(255, 255, 255).fromHEX(this.inventoryData.cloak.color);
                this.cloakSprite.node.color = color7;
                break;
        }
        this.health = this.inventoryData.getHealth(this.health, Logic.playerData.basehealth.y);
        if(this.healthBar){
            this.healthBar.refreshHealth(this.health.x, this.health.y);
        }
    }
    updatePlayerPos() {
        this.node.x = this.pos.x * 64 + 32;
        this.node.y = this.pos.y * 64 + 32;
    }
    transportPlayer(pos: cc.Vec2) {
        if(!this.sprite){
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
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 100 + 2;
    }

    meleeAttack() {
        if (!this.meleeWeapon||this.isAttacking) {
            return;
        }
        this.isAttacking = true;
        let pos = this.meleeWeapon.getHv().clone();
        if (pos.equals(cc.Vec2.ZERO)) {
            pos = cc.v2(1, 0);
        }
        pos = pos.normalizeSelf().mul(15);
        pos.x = this.isFaceRight?pos.x:-pos.x;
        let speed = 300 - this.inventoryData.getAttackSpeed();
        if(speed < 1){speed = 1}
        if(speed > 3000){speed = 3000}
        let spritePos = this.sprite.position.clone();
        let action = cc.sequence(cc.moveBy(0.1, pos.x, pos.y), cc.moveBy(0.1, -pos.x, -pos.y), cc.callFunc(() => {
            setTimeout(() => {
                 this.sprite.position = spritePos.clone();
                 this.isAttacking = false;
                 }, speed);
        }, this));
        this.sprite.runAction(action);
        this.meleeWeapon.attack(this.inventoryData.getAttackSpeed());
        if(!this.meleeWeapon.isStab){
            // this.weaponFirePoint.resetSystem();
            let p = this.weaponFirePoint.position.clone();
            // let ps = [cc.v2(p.x,p.y+50),cc.v2(p.x+40,p.y+30),cc.v2(p.x+50,p.y),cc.v2(p.x+40,-p.y-30),cc.v2(p.x,-p.y-60)]
            // for(let i = 0;i < ps.length;i++){
            //     let psp = ps[i];
            //     psp = this.meleeWeaponNode.convertToWorldSpace(psp);
            //     psp = this.node.parent.convertToNodeSpace(psp);
            //     this.getSwordFireLight(this.node.parent,psp);
                
            // }
          this.getSwordFireLight(this.node.parent,p,this.meleeWeapon.isReverse);
        }
        
    }
    remoteRate = 0;
    remoteAttack() {
        let currentTime = Date.now();
        if (currentTime - this.remoteRate > 400) {
            this.remoteRate = currentTime;
            if (this.shooter) {
                this.shooter.fireBullet(0);
            }
        }

    }
    rotatePlayer(dir: number, pos: cc.Vec2, dt: number){
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
        if (this.shooter && !pos.equals(cc.Vec2.ZERO)) {
            this.shooter.setHv(cc.v2(pos.x, pos.y));
            this.pos = Dungeon.getIndexInMap(this.node.position);
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
        let speed = this.inventoryData.getMoveSpeed(300);
        movement = movement.mul(speed);
        this.rigidbody.linearVelocity = movement;
        this.isMoving = h != 0 || v != 0;
        if (this.isMoving) {
            this.isFaceRight = h > 0;
        }
        let walkName = "PlayerWalkShort";
        let idleName = "idle001";
        if(this.inventoryData.trousers.trouserslong == 1){
            walkName = "PlayerWalk";
            idleName = "idle002";
        }
        if (this.isMoving) {
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
    // move(dir: number) {
    //     if (this.isMoving || this.isDied || this.isFall) {
    //         return;
    //     }
    //     let newPos = cc.v2(this.pos.x, this.pos.y);
    //     switch (dir) {
    //         case 0: if (newPos.y + 1 < 9) { newPos.y++; } break;
    //         case 1: if (newPos.y - 1 >= 0) { newPos.y--; } break;
    //         case 2: if (newPos.x - 1 >= 0) { newPos.x--; this.isFaceRight = false; } break;
    //         case 3: if (newPos.x + 1 < 9) { newPos.x++; this.isFaceRight = true; } break;
    //     }
    //     this.isMoving = true;
    //     this.isAttacking = false;//取消攻击后摇
    //     this.pos = newPos;
    //     let isDown = dir == 1;
    //     if (isDown) {
    //         this.changeZIndex(this.pos);
    //     }
    //     let x = this.pos.x * 64 + 32;
    //     let y = this.pos.y * 64 + 32;
    //     let finish = cc.callFunc(() => {
    //         this.changeZIndex(this.pos);
    //         this.sprite.y = 0;
    //         this.isDied = false;
    //         this.sprite.rotation = 0;
    //         this.sprite.scale = 1;
    //         this.sprite.opacity = 255;
    //         this.anim.play('PlayerIdle');
    //         this.isMoving = false;
    //     }, this);
    //     //初始速度0.2,最大速度0.05 跨度0.15， 0.05减，最大300%
    //     let baseSpeed = 0.2;
    //     let action = cc.sequence(cc.moveTo(this.inventoryData.getMoveSpeed(baseSpeed), x, y), finish);
    //     this.anim.play('PlayerWalk');
    //     this.node.runAction(action);
    // }

    start() {
        // let ss = this.node.getComponentsInChildren(cc.Sprite);
        // for (let i = 0; i < ss.length; i++) {
        //     if (ss[i].spriteFrame) {
        //         ss[i].spriteFrame.getTexture().setAliasTexParameters();
        //     }
        // }
        if(!this.node){
            return;
        }
        this.changeZIndex(this.pos);
        this.health = this.inventoryData.getHealth(this.health, Logic.playerData.basehealth.y);
        if(this.healthBar){
            this.healthBar.refreshHealth(this.health.x, this.health.y);
        }
    }
    fall() {
        if (this.isFall) {
            return;
        }
        this.isFall = true;
        this.anim.play('PlayerFall');
        this.isAttacking = false;
        setTimeout(() => {
            this.transportPlayer(this.defaultPos);
            this.anim.play('PlayerIdle');
            this.takeDamage(1);
            this.isFall = false;
        }, 2000);
    }
    takeDamage(damage: number) {
        if (!this.healthBar) {
            return;
        }
        let d = this.inventoryData.getDamage(damage);
        let dodge = this.inventoryData.getDodge();
        let isDodge = Math.random() <= dodge && d > 0;
        d = isDodge ? 0 : d;
        this.health = this.inventoryData.getHealth(this.health, Logic.playerData.basehealth.y);
        this.health.x -= d;
        if (this.health.x > this.health.y) {
            this.health.x = this.health.y;
        }
        this.healthBar.refreshHealth(this.health.x, this.health.y);
        Logic.playerData.basehealth.x = this.health.x;
        if (this.label) {
            this.label.node.opacity = 255;
            this.label.node.scaleX = this.node.scaleX;
            this.label.node.color = damage > 0 ? cc.color(255, 0, 0) : cc.color(0, 255, 0);
            this.label.string = `${parseFloat((-damage).toFixed(1))}`;
            if (isDodge) {
                this.label.node.color = cc.color(255, 255, 255);
                this.label.string = `miss`;
            }
            this.label.getComponent(cc.Animation).play('FontFloating');
        }

        if (this.health.x <= 0) {
            this.killed();
        }
    }
    killed() {
        if (this.isDied) {
            return;
        }
        this.isDied = true;
        this.anim.play('PlayerDie');
        setTimeout(() => {
            cc.director.loadScene('gameover');
        }, 1000);
    }
    //玩家行动
    playerAction(dir: number, pos: cc.Vec2, dt: number, dungeon: Dungeon) {
        if(this.meleeWeapon && !this.meleeWeapon.dungeon){
            this.meleeWeapon.dungeon = dungeon;
        }
        if(this.shooter && !this.shooter.dungeon){
            this.shooter.dungeon = dungeon;
        }
        this.move(dir, pos, dt);
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
            let re = this.inventoryData.getRecovery();
            if (re > 0) {
                this.takeDamage(-re);
            }
        }
        if (this.isSmokeTimeDelay(dt)&&this.isMoving) {
            this.getWalkSmoke(this.node.parent, this.node.position);
        }
        
        this.node.scaleX = this.isFaceRight ? 1 : -1;
    }
    
    UseItem() {
        if (this.touchedEquipment && !this.touchedEquipment.isTaken) {
            if (this.touchedEquipment.shopTable) {
                if (Logic.coins >= this.touchedEquipment.shopTable.data.price) {
                    cc.director.emit(EventConstant.HUD_ADD_COIN, {detail:{ count: -this.touchedEquipment.shopTable.data.price }});
                    this.touchedEquipment.taken();
                    this.touchedEquipment.shopTable.data.isSaled = true;
                    this.touchedEquipment = null;
                }
            } else {
                this.touchedEquipment.taken();
                this.touchedEquipment = null;
            }
        }
    }
    //anim
    AttackFinish() {
        this.isAttacking = false;

    }
    // Attacking() {


    //     let damage = this.inventoryData.getFinalAttackPoint(this.baseAttackPoint);
    //     //生命汲取
    //     let drain = this.inventoryData.getLifeDrain(this.baseAttackPoint);
    //     if (drain > 0) {
    //         this.takeDamage(-drain);
    //     }
    //     if (!this.attackTarget) {
    //         return;
    //     }
    //     let monster = this.attackTarget.node.getComponent(Monster);
    //     if (monster && !monster.isDied) {
    //         monster.takeDamage(damage);
    //     }
    //     let kraken = this.attackTarget.node.getComponent(Kraken);
    //     if (kraken && !kraken.isDied) {
    //         kraken.takeDamage(damage);
    //     }
    // }
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
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        this.touchedEquipment = null;
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let equipment = other.node.getComponent(Equipment);
        if (equipment) {
            this.touchedEquipment = equipment;
        }
    }

}
