import Dungeon from "../logic/Dungeon";
import Building from "./Building";
import IndexZ from "../utils/IndexZ";
import CCollider from "../collider/CCollider";


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
export default class FootBoard extends Building {

    @property(cc.SpriteFrame)
    openSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    closeSpriteFrame: cc.SpriteFrame = null;
    isOpen: boolean = false;
    hasActive: boolean = false;//是否激活过
    pos: cc.Vec3 = cc.v3(0, 0);
    private spriteNode: cc.Node;
    private timeDelay = 0;
    sprite: cc.Sprite;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.spriteNode = this.node.getChildByName('sprite');
        this.sprite = this.spriteNode.getComponent(cc.Sprite);
    }

    start() {

    }

    setPos(pos: cc.Vec3) {
        this.pos = pos;
        this.entity.Transform.position = Dungeon.getPosInMap(pos);
        this.node.position = this.entity.Transform.position.clone();
        this.node.zIndex = IndexZ.FLOOR;
    }

    openTrap() {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        // this.openSpriteFrame.getTexture().setAliasTexParameters();
        this.sprite.spriteFrame = this.isOpen ? this.openSpriteFrame : this.closeSpriteFrame;
    }
    onColliderEnter(other: CCollider, self: CCollider): void {
        if (other.tag == CCollider.TAG.BUILDING) {
            this.isOpen = true;
            this.hasActive = true;

        }
        if (other.tag == CCollider.TAG.PLAYER) {
            this.isOpen = true;
            this.hasActive = true;
        }
    }
    onColliderStay(other: CCollider, self: CCollider): void {
        if (other.tag == CCollider.TAG.BUILDING) {
            this.isOpen = true;
            this.hasActive = true;
        }
        if (other.tag == CCollider.TAG.PLAYER) {
            this.isOpen = true;
            this.hasActive = true;
        }
    }
    onColliderExit(other: CCollider, self: CCollider): void {
        if (other.tag == CCollider.TAG.BUILDING) {
            this.isOpen = false;
        }
        if (other.tag == CCollider.TAG.PLAYER) {
            this.isOpen = false;
        }
    }
    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.timeDelay = 0;
            this.sprite.spriteFrame = this.isOpen ? this.openSpriteFrame : this.closeSpriteFrame;
        }
    }
}
