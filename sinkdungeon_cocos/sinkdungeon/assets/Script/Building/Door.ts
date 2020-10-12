import Player from "../Player";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import Building from "./Building";
import IndexZ from "../Utils/IndexZ";
import AudioPlayer from "../Utils/AudioPlayer";

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
    isEmpty:boolean =false;
    //0top1bottom2left3right
    dir = 0;
    sprite: cc.Sprite = null;
    bg: cc.Sprite = null;
    bg1: cc.Sprite = null;
    bg2: cc.Sprite = null;
    boxCollider: cc.PhysicsBoxCollider;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.bg = this.node.getChildByName('bg').getComponent(cc.Sprite);
        this.bg1 = this.node.getChildByName('bg').getChildByName('bg1').getComponent(cc.Sprite);
        this.bg2 = this.node.getChildByName('bg').getChildByName('bg2').getComponent(cc.Sprite);
        this.boxCollider = this.getComponent(cc.PhysicsBoxCollider);
        this.node.zIndex = IndexZ.FLOOR;

    }

    start() {
        if (this.sprite) {
            this.sprite.spriteFrame = Logic.spriteFrames[`door0${Logic.chapterIndex}anim000`];
        }
        if (this.bg) {
            let spriteframe = Logic.spriteFrames[`walltop0${Logic.chapterIndex}anim001`];
            this.bg.spriteFrame = spriteframe;
            this.bg1.spriteFrame = spriteframe;
            this.bg2.spriteFrame = spriteframe;
            this.bg.node.parent = this.node.parent;
            this.bg.node.position = this.node.position;
            this.bg.node.angle = this.node.angle;
            this.bg.node.zIndex = IndexZ.OVERHEAD;
        }
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
        if (this.isOpen) {
            return;
        }
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        }
        this.isOpen = true;
        let index = 0;
        this.schedule(() => {
            this.sprite.spriteFrame = Logic.spriteFrames[`door0${Logic.chapterIndex}anim00${index++}`];
            if (index > 4) {
                this.boxCollider.sensor = true;
                this.boxCollider.apply();
            }
        }, immediately ? 0 : 0.15, 4);
    }
    closeGate(immediately?: boolean) {
        if (!this.isOpen||this.isEmpty) {
            return;
        }
        this.isOpen = false;
        let index = 4;
        this.schedule(() => {
            this.sprite.spriteFrame = Logic.spriteFrames[`door0${Logic.chapterIndex}anim00${index--}`];
            if (index < 0) {
                this.boxCollider.sensor = false;
                this.boxCollider.apply();
            }
        }, immediately ? 0 : 0.1, 4);

    }

    // onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    //     let player = other.node.getComponent(Player);
    //     if (player) {
    //         if (this.isOpen) {
    //             Logic.saveData();
    //             AudioPlayer.play(AudioPlayer.EXIT);
    //             cc.director.emit(EventHelper.LOADINGROOM, { detail: { dir: this.dir } });
    //         }
    //     }
    // }
}
