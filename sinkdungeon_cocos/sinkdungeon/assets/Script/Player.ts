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

@ccclass
export default class Player extends cc.Component {

    @property()
    posX: number = 4;
    @property()
    posY: number = 4;
    private playerItemSprite: cc.Sprite;
    private playerWeaponSprite: cc.Sprite;
    private isMoving = false;
    private sprite: cc.Node;
    private anim: cc.Animation;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite');
        this.playerItemSprite = this.sprite.getChildByName('righthand')
            .getChildByName('item').getComponent(cc.Sprite);

        this.playerWeaponSprite = this.sprite.getChildByName('lefthand')
            .getChildByName('weapon').getComponent(cc.Sprite);

        cc.director.on(EventConstant.PLAYER_MOVE, (event) => { this.move(event.detail.dir) });

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
        this.node.x = this.posX * 64 + 32;
        this.node.y = this.posY * 64 + 32;
    }
    transportPlayer(x: number, y: number) {
        this.posX = x;
        this.posY = y;
    }
    move(dir) {
        if (this.isMoving) {
            return;
        }
        this.isMoving = true;
        switch (dir) {
            case 0: if (this.posY + 1 < 9) { this.posY++; } break;
            case 1: if (this.posY - 1 >= 0) { this.posY--; } break;
            case 2: if (this.posX - 1 >= 0) { this.posX--; } break;
            case 3: if (this.posX + 1 < 9) { this.posX++; } break;
        }
        let x = this.posX * 64 + 32;
        let y = this.posY * 64 + 32;
        let finish = cc.callFunc(() => {
            this.sprite.y = 0;
            this.sprite.rotation = 0;
            this.anim.play('PlayerIdle');
            this.isMoving = false;
        }, this);
        let action = cc.sequence(cc.moveTo(0.2, x, y), finish);
        this.anim.play('PlayerWalk');
        this.node.runAction(action);
    }

    start() {
        let ss = this.node.getComponentsInChildren(cc.Sprite);
        for (let i = 0; i < ss.length; i++) {
            ss[i].spriteFrame.getTexture().setAliasTexParameters();
        }
    }



    update(dt) {
        if (!this.isMoving) {
            this.updatePlayerPos();
        }
        this.node.zIndex = 1000 + this.posY;
    }
}
