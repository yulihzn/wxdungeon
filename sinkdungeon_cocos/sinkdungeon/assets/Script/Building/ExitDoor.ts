import Player from "../Player";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import Building from "./Building";
import AudioPlayer from "../Utils/AudioPlayer";
import IndexZ from "../Utils/IndexZ";
import ExitData from "../Data/ExitData";
import Dungeon from "../Dungeon";

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
export default class ExitDoor extends Building {
    isOpen: boolean = false;
    isDoor: boolean = true;
    bgSprite: cc.Sprite = null;
    closeSprite: cc.Sprite = null;
    openSprite: cc.Sprite = null;
    bg: cc.Sprite = null;
    isBackToUpLevel = false;
    dir = 0;
    exitData:ExitData = new ExitData();

    // LIFE-CYCLE CALLBACKS:

    init(dir: number,exitData:ExitData) {
        this.dir = dir;
        this.exitData.valueCopy(exitData);
        this.isBackToUpLevel = dir == 4 || dir == 5 || dir == 6 || dir == 7;
        if (this.dir > 7) {
            this.node.opacity = 0;
            this.bg.node.opacity = 0;
            let indexPos = this.data.defaultPos.clone();
            if(this.dir==8){
                indexPos.y+=1;
            }
            if(this.dir==9){
                indexPos.y-=1;
            }
            this.node.position = Dungeon.getPosInMap(indexPos);
        }
        switch (this.dir % 4) {
            case 0: break;
            case 1: this.node.angle = 180;break;
            case 2: this.node.angle = 90;break;
            case 3: this.node.angle = -90;break;
        }
        this.bg.getComponentInChildren(cc.Label).string = `-${Logic.worldLoader.getLevelData(this.exitData.toChapter,this.exitData.toLevel).name}`
    }
    onLoad() {
        this.bgSprite = this.node.getChildByName('sprite').getChildByName('exitbg').getComponent(cc.Sprite);
        this.closeSprite = this.node.getChildByName('sprite').getChildByName('exitopen').getComponent(cc.Sprite);
        this.openSprite = this.node.getChildByName('sprite').getChildByName('exitclose').getComponent(cc.Sprite);
        this.bg = this.node.getChildByName('bg').getComponent(cc.Sprite);
        this.openSprite.node.zIndex = IndexZ.FLOOR;
        this.closeSprite.node.zIndex = IndexZ.ACTOR;
    }

    start() {
        switch (Logic.chapterIndex) {
            case Logic.CHAPTER00: this.changeRes('exit000'); break;
            case Logic.CHAPTER01: this.changeRes('exit001'); break;
            case Logic.CHAPTER02: this.changeRes('exit002'); break;
            case Logic.CHAPTER03: this.changeRes('exit003'); break;
            case Logic.CHAPTER04: this.changeRes('exit004'); break;
            case Logic.CHAPTER05: this.changeRes('exit004'); break;
            case Logic.CHAPTER099: this.changeRes('exit000'); break;
        }
        if (this.bg) {
            let spriteframe = Logic.spriteFrames[`${Logic.worldLoader.getCurrentLevelData().wallRes1}anim001`];
            this.bg.spriteFrame = spriteframe;
            this.bg.node.parent = this.node.parent;
            this.bg.node.position = this.node.position;
            this.bg.node.angle = this.node.angle;
            this.bg.node.zIndex = IndexZ.OVERHEAD;
        }
    }

    openGate(immediately?: boolean) {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        this.getComponent(cc.PhysicsBoxCollider).sensor = true;
        this.getComponent(cc.PhysicsBoxCollider).apply();
        this.closeSprite.node.runAction(cc.fadeOut(immediately ? 0 : 1));
    }
    closeGate(immediately?: boolean) {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.getComponent(cc.PhysicsBoxCollider).enabled = true;
        this.closeSprite.node.runAction(cc.fadeIn(immediately ? 0 : 1));
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            if (this.isOpen) {
                this.isOpen = false;
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.EXIT } });
                Logic.playerData = player.data.clone();
                Logic.loadingNextLevel(this.exitData,true);
            }
        }
    }
    // update (dt) {}
    changeRes(resName: string) {
        this.bgSprite.spriteFrame = Logic.spriteFrames[resName + 'bg'];
        this.openSprite.spriteFrame = Logic.spriteFrames[resName + 'open'];
        this.closeSprite.spriteFrame = Logic.spriteFrames[resName + 'close'];
    }
}
