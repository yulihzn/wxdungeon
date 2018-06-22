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
    @property(cc.Label)
    label:cc.Label;
    private playerItemSprite: cc.Sprite;
    private playerWeaponSprite: cc.Sprite;
    isMoving = false;
    private sprite: cc.Node;
    private anim: cc.Animation;
    isDied = false;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDied = false;
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
    changeZIndex(){
        this.node.zIndex = 1000 + (9-this.posY)*100+2;
    }
    move(dir) {
        if (this.isMoving||this.isDied) {
            return;
        }
        this.isMoving = true;
        switch (dir) {
            case 0: if (this.posY + 1 < 9) { this.posY++; } break;
            case 1: if (this.posY - 1 >= 0) { this.posY--; } break;
            case 2: if (this.posX - 1 >= 0) { this.posX--; } break;
            case 3: if (this.posX + 1 < 9) { this.posX++; } break;
        }
        let isDown = dir == 1;
        if(isDown){
            this.changeZIndex();
        }
        let x = this.posX * 64 + 32;
        let y = this.posY * 64 + 32;
        let finish = cc.callFunc(() => {
            this.changeZIndex();
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
            ss[i].spriteFrame.getTexture().setAliasTexParameters();
        }
        this.changeZIndex();
    }
    fall(){
        if(this.isDied){
            return;
        }
        this.isDied = true;
        this.anim.play('PlayerFall');
        setTimeout(()=>{
            cc.director.loadScene('gameover');
        },1000);
    }
    killed(){
        if(this.isDied){
            return;
        }
        this.isDied = true;
        this.anim.play('PlayerDie');
        setTimeout(()=>{
            cc.director.loadScene('gameover');
        },1000);
    }



    update(dt) {
        if (!this.isMoving) {
            this.updatePlayerPos();
        }
        if(this.label){
            this.label.string = ""+this.node.zIndex;
        }
    }
}
