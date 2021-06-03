import Dungeon from "../Dungeon";
import { EventHelper } from "../EventHelper";
import Player from "../Player";
import Box from "./Box";
import Building from "./Building";
import IndexZ from "../Utils/IndexZ";
import { ColliderTag } from "../Actor/ColliderTag";


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
        this.node.position = Dungeon.getPosInMap(pos);
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

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (other.tag == ColliderTag.BUILDING) {
            this.isOpen = true;
            this.hasActive = true;
        }
        if (other.tag == ColliderTag.PLAYER) {
            this.isOpen = true;
            this.hasActive = true;
        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.tag == ColliderTag.BUILDING) {
            this.isOpen = true;
            this.hasActive = true;

        }
        if (other.tag == ColliderTag.PLAYER) {
            this.isOpen = true;
            this.hasActive = true;
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (other.tag == ColliderTag.BUILDING) {
            this.isOpen = false;
        }
        if (other.tag == ColliderTag.PLAYER) {
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
