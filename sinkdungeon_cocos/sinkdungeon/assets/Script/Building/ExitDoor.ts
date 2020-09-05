import Player from "../Player";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import Building from "./Building";
import AudioPlayer from "../Utils/AudioPlayer";
import IndexZ from "../Utils/IndexZ";
import Dungeon from "../Dungeon";
import RoomType from "../Rect/RoomType";

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
export default class ExitDoor extends Building {
    isOpen: boolean = false;
    isDoor: boolean = true;
    bgSprite:cc.Sprite = null;
    closeSprite:cc.Sprite = null;
    openSprite:cc.Sprite = null;
    isBackToUpLevel = false;
    needHide = false;
    isOnlyPos = false;

    // LIFE-CYCLE CALLBACKS:

    init(indexPos:cc.Vec3,isBackToUpLevel:boolean,needHide:boolean,isOnlyPos:boolean){
        this.isOnlyPos = isOnlyPos;
        this.needHide = needHide;
        this.isBackToUpLevel = isBackToUpLevel;
        if(Logic.isFromChapter&&this.isOnlyPos){
            if(Logic.isBackToUpLevel&&!this.isBackToUpLevel){
                Logic.playerData.pos = cc.v3(indexPos.x, indexPos.y);
            }else if(!Logic.isBackToUpLevel&&this.isBackToUpLevel){
                Logic.playerData.pos = cc.v3(indexPos.x, indexPos.y);
            }
        }
        if(this.needHide){
            this.node.opacity = 0;
        }
    }
    onLoad () {
        this.bgSprite = this.node.getChildByName('sprite').getChildByName('exitbg').getComponent(cc.Sprite);
        this.closeSprite = this.node.getChildByName('sprite').getChildByName('exitopen').getComponent(cc.Sprite);
        this.openSprite = this.node.getChildByName('sprite').getChildByName('exitclose').getComponent(cc.Sprite);
        this.openSprite.node.zIndex = IndexZ.FLOOR;
        this.closeSprite.node.zIndex = IndexZ.ACTOR;
    }

    start () {
        switch(Logic.chapterIndex){
            case Logic.CHAPTER00:this.changeRes('exit000');break;
            case Logic.CHAPTER01:this.changeRes('exit001');break;
            case Logic.CHAPTER02:this.changeRes('exit002');break;
            case Logic.CHAPTER03:this.changeRes('exit003');break;
            case Logic.CHAPTER04:this.changeRes('exit004');break;
            case Logic.CHAPTER05:this.changeRes('exit004');break;
        }
    }
    
    openGate(immediately?:boolean) {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        this.getComponent(cc.PhysicsBoxCollider).enabled = false;
        this.closeSprite.node.runAction(cc.fadeOut(immediately?0:1));
    }
    closeGate(immediately?:boolean) {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.getComponent(cc.PhysicsBoxCollider).enabled = true;
        this.closeSprite.node.runAction(cc.fadeIn(immediately?0:1));
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player&&!this.isOnlyPos) {
            if (this.isOpen) {
                this.isOpen = false;
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.EXIT } });
                Logic.loadingNextLevel(this.isBackToUpLevel);
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
