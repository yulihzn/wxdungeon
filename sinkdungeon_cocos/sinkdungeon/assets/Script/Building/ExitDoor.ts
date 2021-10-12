import Player from "../logic/Player";
import { EventHelper } from "../logic/EventHelper";
import Logic from "../logic/Logic";
import Building from "./Building";
import AudioPlayer from "../utils/AudioPlayer";
import IndexZ from "../utils/IndexZ";
import ExitData from "../data/ExitData";
import Dungeon from "../logic/Dungeon";
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
export default class ExitDoor extends Building {
    isOpen: boolean = false;
    isDoor: boolean = true;
    bgSprite: cc.Sprite = null;
    closeSprite: cc.Sprite = null;
    openSprite: cc.Sprite = null;
    spriteNode: cc.Node = null;
    roof: cc.Sprite = null;
    isBackToUpLevel = false;
    dir = 0;
    exitData: ExitData = new ExitData();

    // LIFE-CYCLE CALLBACKS:

    init(dir: number, exitData: ExitData) {
        this.dir = dir;
        this.exitData.valueCopy(exitData);
        this.isBackToUpLevel = dir == 4 || dir == 5 || dir == 6 || dir == 7;
        if (this.dir > 7) {
            this.node.opacity = 0;
            this.roof.node.opacity = 0;
            let indexPos = this.data.defaultPos.clone();
            let collider = this.node.getComponent(cc.BoxCollider);
            collider.size = cc.size(128, 128);
            collider.offset = cc.v2(0, 0);
            if (this.dir == 8) {
                indexPos.y += 1;
            }
            if (this.dir == 9) {
                indexPos.y -= 1;
            }
            if (this.dir == 10) {
                indexPos.x -= 1;
            }
            if (this.dir == 11) {
                indexPos.x += 1;
            }
            this.node.position = Dungeon.getPosInMap(indexPos);
        }
        let label = this.roof.getComponentInChildren(cc.Label);
        label.string = `-${Logic.worldLoader.getLevelData(this.exitData.toChapter, this.exitData.toLevel).name}`
    }
    onLoad() {
        this.spriteNode = this.node.getChildByName('sprite');
        this.bgSprite = this.node.getChildByName('sprite').getChildByName('exitbg').getComponent(cc.Sprite);
        this.closeSprite = this.node.getChildByName('sprite').getChildByName('exitopen').getComponent(cc.Sprite);
        this.openSprite = this.node.getChildByName('sprite').getChildByName('exitclose').getComponent(cc.Sprite);
        this.roof = this.node.getChildByName('roof').getComponent(cc.Sprite);
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
        let subfix = 'anim000';
        let spriteframe = Logic.spriteFrameRes(`roof${Logic.worldLoader.getCurrentLevelData().wallRes1}${subfix}`);
        if (this.dir % 4 > 1 || this.dir > 7) {
            spriteframe = null;
        }
        this.roof.spriteFrame = spriteframe;
        this.roof.node.parent = this.node.parent;
        let p = this.node.convertToWorldSpaceAR(cc.v3(0, 128));
        this.roof.node.position = this.roof.node.parent.convertToNodeSpaceAR(p);
        this.roof.node.zIndex = IndexZ.OVERHEAD;
        this.roof.node.opacity = 255;
        switch (this.dir % 4) {
            case 0: break;
            case 1:
                this.roof.node.angle = 180;
                this.roof.node.opacity = 128;
                this.roof.node.getChildByName('info').angle = 180;
                 break;
            case 2: break;
            case 3: break;
        }

    }

    openGate(immediately?: boolean) {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        this.getComponent(cc.PhysicsBoxCollider).sensor = true;
        this.getComponent(cc.PhysicsBoxCollider).apply();
        cc.tween(this.closeSprite.node).to(immediately ? 0 : 1, { opacity: 0 }).start();
    }
    closeGate(immediately?: boolean) {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.getComponent(cc.PhysicsBoxCollider).sensor = false;
        this.getComponent(cc.PhysicsBoxCollider).apply();
        cc.tween(this.closeSprite.node).to(immediately ? 0 : 1, { opacity: 255 }).start();
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.tag == ColliderTag.PLAYER) {
            let player = other.node.getComponent(Player);
            if (player && this.isOpen) {
                this.isOpen = false;
                cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.EXIT } });
                Logic.playerData = player.data.clone();
                Logic.loadingNextLevel(this.exitData);
            }
        }
    }
    // update (dt) {}
    changeRes(resName: string) {
        this.bgSprite.spriteFrame = Logic.spriteFrameRes(resName + 'bg');
        this.openSprite.spriteFrame = Logic.spriteFrameRes(resName + 'open');
        this.closeSprite.spriteFrame = Logic.spriteFrameRes(resName + 'close');
    }
}
