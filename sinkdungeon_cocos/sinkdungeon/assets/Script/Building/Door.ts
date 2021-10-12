import Logic from "../logic/Logic";
import Building from "./Building";
import IndexZ from "../utils/IndexZ";
import { ColliderTag } from "../actor/ColliderTag";

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
    isHidden: boolean = false;//是否隐藏门，隐藏门有幻影
    isEmpty: boolean = false;//是否空门，空门始终打开
    isLock: boolean = false;//是否上锁
    isDecorate: boolean = false;//是否是装饰，装饰不展示门
    //0top1bottom2left3right
    dir = 0;
    sprite: cc.Sprite = null;
    roof: cc.Sprite = null;
    leftside: cc.Sprite = null;
    rightside: cc.Sprite = null;
    lockInfo: cc.Node = null;
    boxCollider: cc.PhysicsBoxCollider;
    arrow: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.roof = this.node.getChildByName('roof').getComponent(cc.Sprite);
        this.leftside = this.node.getChildByName('leftside').getComponent(cc.Sprite);
        this.rightside = this.node.getChildByName('rightside').getComponent(cc.Sprite);
        this.lockInfo = this.node.getChildByName('roof').getChildByName('info');
        this.arrow = this.node.getChildByName('doorarrow');
        this.arrow.opacity = 0;
        this.boxCollider = this.getComponent(cc.PhysicsBoxCollider);
        this.node.zIndex = IndexZ.FLOOR;

    }

    start() {
        if (this.sprite) {
            this.sprite.spriteFrame = Logic.spriteFrameRes(`door${this.dir > 1 ? 'side' : ''}0${Logic.chapterIndex}anim000`);
            this.sprite.node.width = 128;
            this.sprite.node.height = this.dir > 1 ? 384 : 128;
            if (this.isDecorate) {
                this.sprite.node.opacity = 0;
            }
        }
        if (!this.roof) {
            this.roof = this.node.getChildByName('roof').getComponent(cc.Sprite);
        }
        let roofframe = Logic.spriteFrameRes(`roof${Logic.worldLoader.getCurrentLevelData().wallRes1}anim000`);
        let sideframe = Logic.spriteFrameRes(`wall${Logic.worldLoader.getCurrentLevelData().wallRes1}anim002`);
        if (this.dir > 1) {
            roofframe = null;
            sideframe = null;
            this.node.zIndex -= 120;
        } else {
            this.node.zIndex += 4;
        }
        this.leftside.spriteFrame = sideframe;
        this.rightside.spriteFrame = sideframe;
        this.roof.spriteFrame = roofframe;
        this.roof.node.parent = this.node.parent;
        let p = this.node.convertToWorldSpaceAR(cc.v3(0, 128));
        this.roof.node.position = this.roof.node.parent.convertToNodeSpaceAR(p);
        this.roof.node.zIndex = IndexZ.OVERHEAD;
        switch (this.dir) {
            case 0: break;
            case 1: this.roof.node.angle = 180; this.lockInfo.angle = -180; break;
            case 2: break;
            case 3: this.sprite.node.scaleX = -1; break;
        }
        if (this.lockInfo && this.isLock && !Logic.mapManager.isNeighborRoomStateClear(this.dir) && !this.isDecorate) {
            this.lockInfo.opacity = 255;
        } else if (this.dir == 1) {
            this.roof.node.opacity = 128;
        }
        let collider = this.boxCollider;
        collider.offset = cc.v2(0, 7);
        collider.size = cc.size(128, 114);
        if (this.dir > 1) {
            collider.offset = cc.v2(0, -64);
            collider.size = cc.size(64, 256);
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

        if (this.lockInfo && this.isLock && !Logic.mapManager.isNeighborRoomStateClear(this.dir) && !this.isDecorate) {
            this.lockInfo.opacity = 255;
            return;
        }
        if (this.isOpen) {
            return;
        }
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        }
        if (this.lockInfo) {
            this.lockInfo.opacity = 0;
        }
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
        if (this.dir < 2 && (other.tag == ColliderTag.PLAYER || other.tag == ColliderTag.NONPLAYER)) {
            this.roof.node.opacity = 128;
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (this.dir < 2 && (other.tag == ColliderTag.PLAYER || other.tag == ColliderTag.NONPLAYER)) {
            this.roof.node.opacity = 128;
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (this.dir < 2 && (other.tag == ColliderTag.PLAYER || other.tag == ColliderTag.NONPLAYER)) {
            this.roof.node.opacity = 255;
            if (this.lockInfo && this.lockInfo.opacity < 1||this.isDecorate) {
                this.roof.node.opacity = 180;
            }
        }
    }
    checkLock() {

    }
}
