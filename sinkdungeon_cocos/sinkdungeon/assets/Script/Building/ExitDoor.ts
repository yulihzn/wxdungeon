import Player from "../Player";
import { EventConstant } from "../EventConstant";
import Logic from "../Logic";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ExitDoor extends cc.Component {
    isOpen: boolean = false;
    wall1: cc.Node = null;
    wall2: cc.Node = null;
    isDoor: boolean = true;
    bgSprite:cc.Sprite = null;
    closeSprite:cc.Sprite = null;
    openSprite:cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bgSprite = this.node.getChildByName('sprite').getChildByName('exitbg').getComponent(cc.Sprite);
        this.closeSprite = this.node.getChildByName('sprite').getChildByName('exitopen').getComponent(cc.Sprite);
        this.openSprite = this.node.getChildByName('sprite').getChildByName('exitclose').getComponent(cc.Sprite);
        this.openSprite.node.zIndex = 2000;
        this.closeSprite.node.zIndex = 3000;
    }

    start () {
        switch(Logic.chapterName){
            case 'chapter00':this.changeRes('exit000');break;
            case 'chapter01':this.changeRes('exit000');break;
            case 'chapter02':this.changeRes('exit002');break;
            case 'chapter03':this.changeRes('exit000');break;
            case 'chapter04':this.changeRes('exit000');break;
        }
    }
    hideWall() {
        if(this.wall1){
            this.wall1.zIndex = 1000;
            this.wall1.getComponent(cc.PhysicsBoxCollider).sensor = true;
            this.wall1.getComponent(cc.PhysicsBoxCollider).apply();
        }
        if(this.wall2){
            this.wall2.zIndex = 1000;
            this.wall2.getComponent(cc.PhysicsBoxCollider).sensor = true;
            this.wall2.getComponent(cc.PhysicsBoxCollider).apply();
        }
     
    }
    openGate() {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        this.getComponent(cc.PhysicsBoxCollider).enabled = false;
        this.closeSprite.node.runAction(cc.fadeOut(1));
    }
    closeGate() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.getComponent(cc.PhysicsBoxCollider).enabled = true;
        this.closeSprite.node.runAction(cc.fadeIn(1));
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            if (this.isOpen) {
                this.isOpen = false;
                cc.director.emit(EventConstant.LOADINGNEXTLEVEL);
            }
        }
    }
    // update (dt) {}
    changeRes(resName:string){
        this.bgSprite.spriteFrame = Logic.spriteFrames[resName+'bg'];
        this.openSprite.spriteFrame = Logic.spriteFrames[resName+'open'];
        this.closeSprite.spriteFrame = Logic.spriteFrames[resName+'close'];
    }
}
