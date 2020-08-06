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
    //0top1bottom2left3right
    dir = 0;
    sprite:cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.node.zIndex = IndexZ.FLOOR;
    }

    start() {
        if(this.sprite){
            this.sprite.spriteFrame = Logic[`door0${Logic.chapterIndex}anim000`];
        }
    }
    setOpen(isOpen: boolean) {
        if (!this.isDoor) {
            return;
        }
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
        if(!this.sprite){
            this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        }
        this.isOpen = true;
        cc.tween(this.node)
        .delay(0.5).call(()=>{
            this.sprite.spriteFrame = Logic[`door0${Logic.chapterIndex}anim000`];
        })
        .delay(0.5).call(()=>{
            this.sprite.spriteFrame = Logic[`door0${Logic.chapterIndex}anim001`];
        })
        .delay(0.5).call(()=>{
            this.sprite.spriteFrame = Logic[`door0${Logic.chapterIndex}anim002`];
        })
        .delay(0.5).call(()=>{
            this.sprite.spriteFrame = Logic[`door0${Logic.chapterIndex}anim003`];
        })
        .delay(0.5).call(()=>{
            this.sprite.spriteFrame = Logic[`door0${Logic.chapterIndex}anim004`];
        })
        .call(()=>{
            this.getComponent(cc.PhysicsBoxCollider).enabled = false;
        })
        .start();
    }
    closeGate() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        cc.tween(this.sprite)
        .delay(0.5).call(()=>{
            this.sprite.spriteFrame = Logic[`door0${Logic.chapterIndex}anim004`];
        })
        .delay(0.5).call(()=>{
            this.sprite.spriteFrame = Logic[`door0${Logic.chapterIndex}anim003`];
        })
        .delay(0.5).call(()=>{
            this.sprite.spriteFrame = Logic[`door0${Logic.chapterIndex}anim002`];
        })
        .delay(0.5).call(()=>{
            this.sprite.spriteFrame = Logic[`door0${Logic.chapterIndex}anim001`];
        })
        .delay(0.5).call(()=>{
            this.sprite.spriteFrame = Logic[`door0${Logic.chapterIndex}anim000`];
        })
        .call(()=>{
            this.getComponent(cc.PhysicsBoxCollider).enabled = true;
        })
        .start();
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
