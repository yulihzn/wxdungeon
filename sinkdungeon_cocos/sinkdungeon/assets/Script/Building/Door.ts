import Logic from "../Logic";
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
export default class Door extends Building {

    isOpen: boolean = false;
    isDoor: boolean = true;
    isHidden: boolean = false;
    isEmpty: boolean = false;
    isLock: boolean = false;
    //0top1bottom2left3right
    dir = 0;
    sprite: cc.Sprite = null;
    roof: cc.Sprite = null;
    lockInfo: cc.Node = null;
    boxCollider: cc.PhysicsBoxCollider;
    arrow:cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.roof = this.node.getChildByName('roof').getComponent(cc.Sprite);
        this.lockInfo = this.node.getChildByName('info');
        this.arrow = this.node.getChildByName('doorarrow');
        this.arrow.opacity = 0;
        this.boxCollider = this.getComponent(cc.PhysicsBoxCollider);
        this.node.zIndex = IndexZ.FLOOR;

    }

    start() {
        if (this.sprite) {
            this.sprite.spriteFrame = Logic.spriteFrameRes(`door${this.dir > 1 ? 'side' : ''}0${Logic.chapterIndex}anim000`);
            this.sprite.node.width = 128;
            this.sprite.node.height = this.dir>1?256:128;
        }
        if (!this.roof) {
            this.roof = this.node.getChildByName('roof').getComponent(cc.Sprite);
        }
        let subfix = 'anim000';
        let spriteframe = Logic.spriteFrameRes(`roof${Logic.worldLoader.getCurrentLevelData().wallRes1}${subfix}`);
        if (this.dir > 1) {
            spriteframe = null;
            this.node.zIndex -= 120;
        }
        this.roof.spriteFrame = spriteframe;
        this.roof.node.parent = this.node.parent;
        let p = this.node.convertToWorldSpaceAR(cc.v3(0, 128));
        this.roof.node.position = this.roof.node.parent.convertToNodeSpaceAR(p);
        this.roof.node.zIndex = IndexZ.OVERHEAD;
        switch (this.dir) {
            case 0: break;
            case 1: this.roof.node.angle = 180; break;
            case 2: break;
            case 3: this.sprite.node.scaleX = -1; break;
        }
        if (this.lockInfo && this.isLock && !Logic.mapManager.isNeighborRoomStateClear(this.dir)) {
            this.lockInfo.opacity = 255;
        }
        let collider = this.boxCollider;
        collider.offset = cc.v2(0, 7);
        collider.size = cc.size(128, 114);
        if (this.dir > 1) {
            collider.offset = cc.v2(0, 8);
            collider.size = cc.size(64, 128);
        }
        collider.apply();
    }

    setOpen(isOpen: boolean, immediately?: boolean) {
        if (!this.isDoor) {
            return;
        }
        if (isOpen) {
            this.openGate(immediately);
        } else {
            this.closeGate(immediately);
        }
    }
    openGate(immediately?: boolean) {
        if (!this.lockInfo) {
            this.lockInfo = this.node.getChildByName('info');
        }
        if (this.isLock && !Logic.mapManager.isNeighborRoomStateClear(this.dir)) {
            this.lockInfo.opacity = 255;
            return;
        }
        if (this.isOpen) {
            return;
        }
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        }
        this.lockInfo.opacity = 0;
        this.isOpen = true;
        let index = 0;
        this.schedule(() => {
            this.sprite.spriteFrame = Logic.spriteFrameRes(`door${this.dir > 1 ? 'side' : ''}0${Logic.chapterIndex}anim00${index++}`);
            if (index > 4) {
                this.boxCollider.sensor = true;
                this.boxCollider.apply();
            }
        }, immediately ? 0 : 0.15, 4);
    }
    closeGate(immediately?: boolean) {
        if (!this.isOpen || this.isEmpty) {
            return;
        }
        this.isOpen = false;
        let index = 4;
        this.schedule(() => {
            this.sprite.spriteFrame = Logic.spriteFrameRes(`door${this.dir > 1 ? 'side' : ''}0${Logic.chapterIndex}anim00${index--}`);
            if (index < 0) {
                this.boxCollider.sensor = false;
                this.boxCollider.apply();
            }
        }, immediately ? 0 : 0.1, 4);

    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (this.dir == 1 && (other.tag == ColliderTag.PLAYER || other.tag == ColliderTag.NONPLAYER)) {
            this.roof.node.opacity = 180;
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (this.dir == 1 && (other.tag == ColliderTag.PLAYER || other.tag == ColliderTag.NONPLAYER)) {
            this.roof.node.opacity = 180;
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (this.dir == 1 && (other.tag == ColliderTag.PLAYER || other.tag == ColliderTag.NONPLAYER)) {
            this.roof.node.opacity = 255;
        }
    }
    checkLock() {

    }
}
