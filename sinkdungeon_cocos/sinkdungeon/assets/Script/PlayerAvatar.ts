// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from "./Logic";
import InventoryManager from "./Manager/InventoryManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerAvatar extends cc.Component {

    static readonly DIR_UP = 0;
    static readonly DIR_DOWN = 1;
    static readonly DIR_LEFT = 2;
    static readonly DIR_RIGHT = 3;
    static readonly IDLE = 0;
    static readonly WALK = 1;
    static readonly HURT = 2;
    static readonly ATTACK = 3;
    static readonly DIED = 4;
    dir = PlayerAvatar.DIR_RIGHT;
    status = PlayerAvatar.IDLE;
    anim: cc.Animation;
    cloakSprite: cc.Sprite = null;
    legLeftSprite: cc.Sprite = null;
    legRightSprite: cc.Sprite = null;
    footLeftSprite: cc.Sprite = null;
    footRightSprite: cc.Sprite = null;
    shoesLeftSprite: cc.Sprite = null;
    shoesRightSprite: cc.Sprite = null;
    gloveLeftSprite: cc.Sprite = null;
    gloveRightSprite: cc.Sprite = null;
    handLeftSprite: cc.Sprite = null;
    handRightSprite: cc.Sprite = null;
    weaponLeftSprite: cc.Sprite = null;
    weaponRightSprite: cc.Sprite = null;
    meleeLeftSprite: cc.Sprite = null;
    meleeRightSprite: cc.Sprite = null;
    headSprite: cc.Sprite = null;
    faceSprite: cc.Sprite = null;
    eyesSprite: cc.Sprite = null;
    hairSprite: cc.Sprite = null;
    helmetSprite: cc.Sprite = null;
    bodySprite: cc.Sprite = null;
    pantsSprite: cc.Sprite = null;
    clothesSprite: cc.Sprite = null;
    avatarNode: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.init();
    }
    private init() {
        this.anim = this.getComponent(cc.Animation);
        this.avatarNode = this.node.getChildByName('sprite').getChildByName('avatar');
        this.cloakSprite = this.getSpriteChildSprite(['sprite', 'cloak']);
        this.legLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft']);
        this.legRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright']);
        this.footLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft', 'foot']);
        this.footRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright', 'foot']);
        this.shoesLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft', 'foot', 'shoes']);
        this.shoesRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright', 'foot', 'shoes']);
        this.headSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head']);
        this.faceSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'face']);
        this.eyesSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'eyes']);
        this.hairSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'hair']);
        this.helmetSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'helmet']);
        this.bodySprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body']);
        this.pantsSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body', 'pants']);
        this.clothesSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body', 'clothes']);
        this.hairSprite.node.stopAllActions();
        this.changeAvatarByDir(PlayerAvatar.DIR_RIGHT);
        let index = 0;
        this.schedule(()=>{
            this.hairSprite.spriteFrame = Logic.spriteFrames[this.hairprefix + this.idlehair[index++]];
            if(index > 1){
                index = 0;
            }
        },0.2,cc.macro.REPEAT_FOREVER,0.1);
    }
    private getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node;
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node.getComponent(cc.Sprite);
    }
    playAnim(status: number, dir: number) {
        if (!this.anim) {
            this.init();
        }
        switch (status) {
            case PlayerAvatar.IDLE:
                if (this.status != status) {
                    this.playIdle(dir);
                }
                break;
            case PlayerAvatar.WALK:
                if (this.status != status || this.dir != dir) {
                    this.playWalk(dir);
                }
                break;
            case PlayerAvatar.HURT: break;
            case PlayerAvatar.ATTACK: break;
            case PlayerAvatar.DIED: break;
        }
        this.status = status;
        this.dir = dir;
    }
    changeEquipDirSpriteFrame(inventoryManager: InventoryManager, dir: number) {
        this.cloakSprite.node.zIndex = dir == 0 ? this.avatarNode.zIndex + 1 : this.avatarNode.zIndex - 1;
        if (dir == 0 && Logic.spriteFrames[inventoryManager.helmet.img + 'behind']) {
            this.helmetSprite.spriteFrame = Logic.spriteFrames[inventoryManager.helmet.img + 'behind'];
        } else if (dir == 1 && Logic.spriteFrames[inventoryManager.helmet.img + 'front']) {
            this.helmetSprite.spriteFrame = Logic.spriteFrames[inventoryManager.helmet.img + 'front'];
        } else {
            this.helmetSprite.spriteFrame = Logic.spriteFrames[inventoryManager.helmet.img];
        }
        if (dir == 0 && Logic.spriteFrames[inventoryManager.clothes.img + 'behind']) {
            this.clothesSprite.spriteFrame = Logic.spriteFrames[inventoryManager.clothes.img + 'behind'];
        } else if (dir == 1 && Logic.spriteFrames[inventoryManager.clothes.img + 'front']) {
            this.clothesSprite.spriteFrame = Logic.spriteFrames[inventoryManager.clothes.img + 'front'];
        } else {
            this.clothesSprite.spriteFrame = Logic.spriteFrames[inventoryManager.clothes.img];
        }
    }
    private playIdle(dir: number) {
        this.anim.play('AvatarIdle');
        this.changeAvatarByDir(dir);

    }
    hairprefix = 'avatarhair000anim00';
    idlehair = [0, 1];
    changeAvatarByDir(dir: number){
        let eyesprefix = 'avatareyes000anim00';
        let faceprefix = 'avatarface000anim00';
        switch (dir) {
            case PlayerAvatar.DIR_UP:
                this.idlehair = [2, 3];
                this.eyesSprite.spriteFrame = null;
                this.faceSprite.spriteFrame = null;
                break;
            case PlayerAvatar.DIR_DOWN:
                this.idlehair = [0, 1];
                this.eyesSprite.spriteFrame = Logic.spriteFrames[eyesprefix+0];
                this.faceSprite.spriteFrame = Logic.spriteFrames[faceprefix+0];
                break;
            case PlayerAvatar.DIR_LEFT:
                this.idlehair = [4, 5];
                this.eyesSprite.spriteFrame = Logic.spriteFrames[eyesprefix+1];
                this.faceSprite.spriteFrame = Logic.spriteFrames[faceprefix+1];
                break;
            case PlayerAvatar.DIR_RIGHT:
                this.idlehair = [4, 5];
                this.eyesSprite.spriteFrame = Logic.spriteFrames[eyesprefix+1];
                this.faceSprite.spriteFrame = Logic.spriteFrames[faceprefix+1];
                break;
        }
        
    }
    private playWalk(dir: number) {
        this.anim.play(dir == PlayerAvatar.DIR_UP || dir == PlayerAvatar.DIR_DOWN ? 'AvatarWalkVertical' : 'AvatarWalkHorizontal');
        this.changeAvatarByDir(dir);
    }

    start() {

    }

    // update (dt) {}
}
