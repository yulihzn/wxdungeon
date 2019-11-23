import Dungeon from "../Dungeon";
import BoxData from "../Data/BoxData";
import Logic from "../Logic";
import Building from "./Building";
import { EventConstant } from "../EventConstant";
import Random from "../Utils/Random";
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
export default class Decorate extends Building {

    static readonly BOX = 0;
    static readonly PLANT = 1;
    static readonly BOXBREAKABLE = 2;
    // LIFE-CYCLE CALLBACKS:
    anim: cc.Animation;
    private timeDelay = 0;
    private isBreaking = false;
    decorateType = 0;
    onLoad() {
    }
    data: BoxData = new BoxData();

    start() {
        switch(Logic.chapterName){
            case Logic.CHAPTER00:this.changeRes(`decorate000${this.decorateType}`);break;
            case Logic.CHAPTER01:this.changeRes(`decorate010${this.decorateType}`);break;
            case Logic.CHAPTER02:this.changeRes(`decorate020${this.decorateType}`);break;
            case Logic.CHAPTER03:this.changeRes(`decorate030${this.decorateType}`);break;
            case Logic.CHAPTER04:this.changeRes(`decorate040${this.decorateType}`);break;
        }
    }
    changeRes(resName: string) {
        let sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        let spriteFrame = Logic.spriteFrames[resName];
        sprite.node.opacity = 255;
        sprite.spriteFrame = spriteFrame;
    }
    setPos(pos: cc.Vec2) {
        this.data.pos = pos;
        this.node.position = Dungeon.getPosInMap(this.data.pos);
        this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - pos.y) * 100 + 1;
    }
    //Animation
    BreakingFinish() {
        this.reset();
    }
    breakBox() {
        if(this.isBreaking){
            return;
        }
        if (!this.anim) {
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play();
        this.isBreaking = true;
        cc.director.emit(EventConstant.PLAY_AUDIO, { detail: { name: AudioPlayer.MONSTER_HIT } });
        let rand = Random.rand();
        if(rand>0.7&&rand<0.8){
            cc.director.emit(EventConstant.DUNGEON_ADD_COIN, { detail: { pos: this.node.position, count: Logic.getRandomNum(1, 3) } });
        }else if (rand >= 0.8 && rand < 0.825) {
            cc.director.emit(EventConstant.DUNGEON_ADD_HEART, { detail: { pos: this.node.position } });
        } else if (rand >= 0.825 && rand < 0.85) {
            cc.director.emit(EventConstant.DUNGEON_ADD_AMMO, { detail: { pos: this.node.position } });
        } 
    }
    reset() {
        this.node.position = Dungeon.getPosInMap(cc.v2(-10,-10));
        this.isBreaking = false;
    }

    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.data.pos = Dungeon.getIndexInMap(this.node.position);
            this.data.position = this.node.position;
            this.data.onelife = true;
            let currboxes = Logic.mapManager.getCurrentMapBoxes();
            if (currboxes) {
                for (let tempbox of currboxes) {
                    if (tempbox.defaultPos.equals(this.data.defaultPos)) {
                        tempbox.pos = this.data.pos;
                        tempbox.position = this.data.position;
                    }
                }
            }
            this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - this.data.pos.y) * 10 + 1;
        }
    }
}
