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

    anim: cc.Animation;
    isOpen: boolean = false;
    isDoor: boolean = true;
    isHidden: boolean = false;
    //0top1bottom2left3right
    dir = 0;
    wall: cc.Node = null;
    sideWall:cc.Node = null;
    private bg:cc.Node = null;
    private sprite:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.bg = this.node.getChildByName('bg');
        this.bg.zIndex = IndexZ.BASE;
        this.sprite = this.node.getChildByName('sprite');
        this.sprite.zIndex = IndexZ.FLOOR;
        this.anim = this.getComponent(cc.Animation);
    }

    start() {
        this.anim = this.getComponent(cc.Animation);
    }
    setOpen(isOpen: boolean) {
        if (!this.isDoor) {
            this.wall.zIndex = this.dir==1?IndexZ.DOORWALL:IndexZ.ACTOR;
            this.wall.getComponent(cc.PhysicsBoxCollider).sensor = false;
            this.wall.getComponent(cc.PhysicsBoxCollider).apply();
            if(this.sideWall){
                this.sideWall.opacity = 0;
            }
            return;
        }
        this.wall.zIndex = IndexZ.DOORWALLBEHIND;
        this.wall.getComponent(cc.PhysicsBoxCollider).sensor = true;
        this.wall.getComponent(cc.PhysicsBoxCollider).apply();
        // this.wall.active=false;
        if (isOpen) {
            this.openGate();
        } else {
            this.closeGate();
        }
    }

    openGate() {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        if (!this.anim) {
            this.anim = this.getComponent(cc.Animation);
        }
        this.getComponent('cc.PhysicsBoxCollider').enabled = false;
        this.anim.play('DoorOpen');
    }
    closeGate() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        if (!this.anim) {
            this.anim = this.getComponent(cc.Animation);
        }
        this.getComponent('cc.PhysicsBoxCollider').enabled = true;
        this.anim.play('DoorClose');
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            if (this.isOpen) {
                Logic.saveData();
                AudioPlayer.play(AudioPlayer.EXIT);
                cc.director.emit(EventHelper.LOADINGROOM, { detail: { dir: this.dir } });
            }
        }
    }
}
