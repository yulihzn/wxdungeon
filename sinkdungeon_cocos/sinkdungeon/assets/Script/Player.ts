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
import HealthBar from './HealthBar';
import Logic from './Logic';
import Dungeon from './Dungeon';
import InventoryData from './Data/InventoryData';
import Equipment from './Equipment/Equipment';
import EquipmentData from './Data/EquipmentData';

@ccclass
export default class Player extends cc.Component {

    @property(cc.Vec2)
    pos: cc.Vec2 = cc.v2(0, 0);
    @property(cc.Label)
    label: cc.Label = null;
    @property(HealthBar)
    healthBar: HealthBar = null;

    private playerItemSprite: cc.Sprite;
    hairSprite: cc.Sprite = null;
    weaponSprite: cc.Sprite = null;
    helmetSprite: cc.Sprite = null;
    clothesSprite: cc.Sprite = null;
    trousersSprite: cc.Sprite = null;
    glovesSprite: cc.Sprite = null;
    shoesSprite: cc.Sprite = null;
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


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.inventoryData = Logic.inventoryData;
        this.health = this.inventoryData.getHealth(Logic.playerData.basehealth, Logic.playerData.basehealth.y);
        this.pos = cc.v2(4, 4);
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        this.playerItemSprite = this.sprite.getChildByName('righthand')
            .getChildByName('item').getComponent(cc.Sprite);
        this.hairSprite = this.sprite.getChildByName('body')
            .getChildByName('hair').getComponent(cc.Sprite);
        this.weaponSprite = this.sprite.getChildByName('lefthand')
            .getChildByName('weapon').getComponent(cc.Sprite);
        this.helmetSprite = this.sprite.getChildByName('body')
            .getChildByName('helmet').getComponent(cc.Sprite);
        this.clothesSprite = this.sprite.getChildByName('body')
            .getChildByName('clothes').getComponent(cc.Sprite);
        this.trousersSprite = this.sprite.getChildByName('body')
            .getChildByName('trousers').getComponent(cc.Sprite);
        this.glovesSprite = this.sprite.getChildByName('body')
            .getChildByName('gloves').getComponent(cc.Sprite);
        this.shoesSprite = this.sprite.getChildByName('body')
            .getChildByName('shoes').getComponent(cc.Sprite);

        cc.director.on(EventConstant.INVENTORY_CHANGEITEM
            , (event) => { this.changeItem(event.detail.spriteFrame) });
        cc.director.on(EventConstant.PLAYER_USEITEM
            , (event) => { this.UseItem() });

        cc.director.on(EventConstant.PLAYER_TAKEDAMAGE
            , (event) => { this.takeDamage(event.detail.damage) });
    }
    changeItem(spriteFrame: cc.SpriteFrame) {
        this.playerItemSprite.spriteFrame = spriteFrame;
    }

    changeEquipment(equipType: string, spriteFrame: cc.SpriteFrame) {
        switch (equipType) {
            case 'weapon': this.weaponSprite.spriteFrame = spriteFrame;
                let color1 = cc.color(255, 255, 255).fromHEX(this.inventoryData.weapon.color);
                this.weaponSprite.node.color = color1;
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
            case 'trousers': this.trousersSprite.spriteFrame = spriteFrame;
                let color4 = cc.color(255, 255, 255).fromHEX(this.inventoryData.trousers.color);
                this.trousersSprite.node.color = color4;
                break;
            case 'gloves': this.glovesSprite.spriteFrame = spriteFrame;
                let color5 = cc.color(255, 255, 255).fromHEX(this.inventoryData.gloves.color);
                this.glovesSprite.node.color = color5;
                break;
            case 'shoes': this.shoesSprite.spriteFrame = spriteFrame;
                let color6 = cc.color(255, 255, 255).fromHEX(this.inventoryData.shoes.color);
                this.shoesSprite.node.color = color6;
                break;
        }
        this.health = this.inventoryData.getHealth(this.health, Logic.playerData.basehealth.y);
        this.healthBar.refreshHealth(this.health.x, this.health.y);
    }
    updatePlayerPos() {
        this.node.x = this.pos.x * 64 + 32;
        this.node.y = this.pos.y * 64 + 32;
    }
    transportPlayer(pos: cc.Vec2) {
        this.sprite.rotation = 0;
        this.sprite.scale = 1;
        this.sprite.opacity = 255;
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.pos = pos;
        this.changeZIndex(this.pos);
    }
    changeZIndex(pos: cc.Vec2) {
        this.node.zIndex = 3000 + (9 - pos.y) * 100 + 2;
    }
    attack(dir, finish) {
        if (this.isMoving || this.isDied || this.isAttacking) {
            return;
        }
        let x = 0;
        let y = 0;
        switch (dir) {
            case 0: y += 32; break;
            case 1: y -= 32; break;
            case 2: x -= 32; break;
            case 3: x += 32; break;
            case 4: break;
        }
        this.isAttacking = true;
        let baseSpeed = 0.2;
        let attackPoint = this.inventoryData.getAttackPoint(this.baseAttackPoint);
        let action = cc.sequence(cc.moveBy(this.inventoryData.getAttackSpeed(baseSpeed), x, y), cc.callFunc(() => {
            if (finish) { finish(this.inventoryData.getFinalAttackPoint(this.baseAttackPoint)); }
            //生命汲取
            let drain = this.inventoryData.getLifeDrain(this.baseAttackPoint);
            if (drain > 0) {
                this.takeDamage(-drain);
            }
        }), cc.moveTo(baseSpeed, 0, 0), cc.callFunc(() => {
            this.isAttacking = false;
        }));
        this.sprite.runAction(action);
    }
    move(dir: number) {
        if (this.isMoving || this.isDied || this.isFall) {
            return;
        }
        let newPos = cc.v2(this.pos.x, this.pos.y);
        switch (dir) {
            case 0: if (newPos.y + 1 < 9) { newPos.y++; } break;
            case 1: if (newPos.y - 1 >= 0) { newPos.y--; } break;
            case 2: if (newPos.x - 1 >= 0) { newPos.x--; } break;
            case 3: if (newPos.x + 1 < 9) { newPos.x++; } break;
        }
        this.isMoving = true;
        this.isAttacking = false;//取消攻击后摇
        this.pos = newPos;
        let isDown = dir == 1;
        if (isDown) {
            this.changeZIndex(this.pos);
        }
        let x = this.pos.x * 64 + 32;
        let y = this.pos.y * 64 + 32;
        let finish = cc.callFunc(() => {
            this.changeZIndex(this.pos);
            this.sprite.y = 0;
            this.isDied = false;
            this.sprite.rotation = 0;
            this.sprite.scale = 1;
            this.sprite.opacity = 255;
            this.anim.play('PlayerIdle');
            this.isMoving = false;
        }, this);
        //初始速度0.2,最大速度0.05 跨度0.15， 0.05减，最大300%
        let baseSpeed = 0.2;
        let action = cc.sequence(cc.moveTo(this.inventoryData.getMoveSpeed(baseSpeed), x, y), finish);
        this.anim.play('PlayerWalk');
        this.node.runAction(action);
    }

    start() {
        let ss = this.node.getComponentsInChildren(cc.Sprite);
        for (let i = 0; i < ss.length; i++) {
            if (ss[i].spriteFrame) {
                ss[i].spriteFrame.getTexture().setAliasTexParameters();
            }
        }
        this.changeZIndex(this.pos);
        this.health = this.inventoryData.getHealth(this.health, Logic.playerData.basehealth.y);
        this.healthBar.refreshHealth(this.health.x, this.health.y);
    }
    fall() {
        if (this.isFall) {
            return;
        }
        this.isFall = true;
        this.anim.play('PlayerFall');
        setTimeout(() => {
            this.transportPlayer(cc.v2(4, 4));
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
        let isDodge = Math.random()<=dodge;
        d = isDodge?0:d;
        this.health = this.inventoryData.getHealth(this.health, Logic.playerData.basehealth.y);
        this.health.x -= d;
        if (this.health.x > this.health.y) {
            this.health.x = this.health.y;
        }
        this.healthBar.refreshHealth(this.health.x, this.health.y);
        Logic.playerData.basehealth.x = this.health.x;
        if (this.label) {
            this.label.node.opacity = 255;
            this.label.node.color = damage > 0 ? cc.color(255, 0, 0) : cc.color(0, 255, 0);
            this.label.string = `${parseFloat((-damage).toFixed(1))}`;
            if(isDodge){
                this.label.node.color = cc.color(255,255,255);
                this.label.string = `miss`;
            }
            this.label.getComponent(cc.Animation).play('FontFloating');
        }
        if (this.health.x < 1) {
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
    playerAction(dir: number, dungeon: Dungeon) {
        let newPos = cc.v2(this.pos.x, this.pos.y);
        switch (dir) {
            case 0: if (newPos.y + 1 < 9) { newPos.y++; } break;
            case 1: if (newPos.y - 1 >= 0) { newPos.y--; } break;
            case 2: if (newPos.x - 1 >= 0) { newPos.x--; } break;
            case 3: if (newPos.x + 1 < 9) { newPos.x++; } break;
        }
        let isAttack = false;
        for (let monster of dungeon.monsters) {
            if (newPos.equals(monster.pos) && !monster.isDied) {
                isAttack = true;
                this.attack(dir, (damage: number) => {
                    monster.takeDamage(damage);
                });
            }
        }
        let isBossAttack = false;
        isBossAttack = Logic.isBossLevel(Logic.level) && dungeon.bossKraken && dungeon.bossKraken.isBossZone(newPos);
        if (isBossAttack && dungeon.bossKraken && dungeon.bossKraken.isShow && !dungeon.bossKraken.isDied) {
            this.attack(dir, (damage: number) => {
                dungeon.bossKraken.takeDamage(damage, newPos);
            });
        }
        if (!isAttack && !isBossAttack) {
            let w = dungeon.wallmap[newPos.x][newPos.y]
            if (w && w.node.active) {
                dir = 4;
            }
            this.move(dir);
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
    update(dt) {
        if (!this.isMoving) {
            this.updatePlayerPos();
        }
        if (this.isRecoveryTimeDelay(dt)) {
            let re = this.inventoryData.getRecovery();
            if (re > 0) {
                this.takeDamage(-re);
            }
        }
    }
    UseItem() {
        if (this.touchedEquipment && !this.touchedEquipment.isTaken) {
            this.touchedEquipment.taken();
            this.touchedEquipment = null;
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (other.tag == 6) {
            let e = other.getComponent(Equipment);
            if (e) {
                this.touchedEquipment = e;
            }
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (other.tag == 6) {
            this.touchedEquipment = null;
        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.tag == 6) {
            this.touchedEquipment = null;
        }
    }
}
