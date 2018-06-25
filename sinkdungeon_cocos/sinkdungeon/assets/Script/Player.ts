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

@ccclass
export default class Player extends cc.Component {

    @property(cc.Vec2)
    pos: cc.Vec2 = cc.v2(0,0);
    @property(cc.Label)
    label: cc.Label;
    @property(HealthBar)
    healthBar: HealthBar;
    private playerItemSprite: cc.Sprite;
    private playerWeaponSprite: cc.Sprite;
    isMoving = false;
    private sprite: cc.Node;
    private anim: cc.Animation;
    isDied = false;
    isFall = false;
    currentHealth: number = 30;
    maxHealth: number = 30;
    attackPonit:number = 1;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.currentHealth = 30;
        this.maxHealth = 30;
        this.pos = cc.v2(4,4);
        this.isDied = false;
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        this.playerItemSprite = this.sprite.getChildByName('righthand')
            .getChildByName('item').getComponent(cc.Sprite);

        this.playerWeaponSprite = this.sprite.getChildByName('lefthand')
            .getChildByName('weapon').getComponent(cc.Sprite);

        cc.director.on(EventConstant.INVENTORY_CHANGEITEM
            , (event) => { this.changeItem(event.detail.spriteFrame) });

        cc.director.on(EventConstant.INVENTORY_CHANGEITEM
            , (event) => { this.changeItem(event.detail.spriteFrame) });
    }
    changeItem(spriteFrame: cc.SpriteFrame) {
        this.playerItemSprite.spriteFrame = spriteFrame;
    }
    changeWeapon(spriteFrame: cc.SpriteFrame) {
        this.playerWeaponSprite.spriteFrame = spriteFrame;
    }
    updatePlayerPos() {
        this.node.x = this.pos.x * 64 + 32;
        this.node.y = this.pos.y * 64 + 32;
    }
    transportPlayer(pos:cc.Vec2) {
        this.sprite.rotation = 0;
        this.sprite.scale = 1;
        this.sprite.opacity = 255;
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.pos = pos;
        this.changeZIndex(this.pos);
    }
    changeZIndex(pos:cc.Vec2) {
        this.node.zIndex = 1000 + (9 - pos.y) * 100 + 2;
    }
    attack(dir,finish){
        if (this.isMoving || this.isDied) {
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
        let action = cc.sequence(cc.moveBy(0.1, x, y), cc.callFunc(() => {
            if(finish){finish(this.attackPonit);}
        }),cc.moveTo(0.1, 0, 0));
        this.sprite.runAction(action);
    }
    move(dir:number) {
        if (this.isMoving || this.isDied) {
            return;
        }
        let newPos = cc.v2(this.pos.x,this.pos.y);
        switch (dir) {
            case 0: if (newPos.y + 1 < 9) { newPos.y++; } break;
            case 1: if (newPos.y - 1 >= 0) { newPos.y--; } break;
            case 2: if (newPos.x - 1 >= 0) { newPos.x--; } break;
            case 3: if (newPos.x + 1 < 9) { newPos.x++; } break;
        }
        this.isMoving = true;
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
        let action = cc.sequence(cc.moveTo(0.1, x, y), finish);
        this.anim.play('PlayerWalk');
        this.node.runAction(action);
    }

    start() {
        let ss = this.node.getComponentsInChildren(cc.Sprite);
        for (let i = 0; i < ss.length; i++) {
            if(ss[i].spriteFrame){
                ss[i].spriteFrame.getTexture().setAliasTexParameters();
            }
        }
        this.changeZIndex(this.pos);
        this.healthBar.refreshHealth(this.currentHealth, this.maxHealth);
    }
    fall() {
        if (this.isFall) {
            return;
        }
        this.isFall = true;
        this.anim.play('PlayerFall');
        setTimeout(() => {
            this.transportPlayer(cc.v2(4,4));
            this.anim.play('PlayerIdle');
            this.takeDamage(1);
            this.isFall = false;
        }, 1000);
    }
    takeDamage(damage: number) {
        this.currentHealth -= damage;
        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
        this.healthBar.refreshHealth(this.currentHealth, this.maxHealth);
        if (this.currentHealth < 1) {
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



    update(dt) {
        if (!this.isMoving) {
            this.updatePlayerPos();
        }
        if (this.label) {
            this.label.string = "" + this.node.zIndex;
        }
    }
}
