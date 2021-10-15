import Dungeon from "../logic/Dungeon";
import Logic from "../logic/Logic";
import Building from "./Building";
import AudioPlayer from "../utils/AudioPlayer";
import IndexZ from "../utils/IndexZ";

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
export default class Box extends Building {

    static readonly BOX = 0;
    static readonly PLANT = 1;
    static readonly BOXBREAKABLE = 2;
    // LIFE-CYCLE CALLBACKS:
    anim: cc.Animation;
    private timeDelay = 0;
    private isBreaking = false;
    boxType = 0;
    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.anim.play('BoxShow');
    }

    start() {
        let resName = 'box';
        switch (this.boxType) {
            case Box.BOX: resName = 'box'; break;
            case Box.PLANT: resName = 'plant'; break;
            case Box.BOXBREAKABLE: resName = 'box'; break;
        }
        switch (Logic.chapterIndex) {
            case Logic.CHAPTER00: this.changeRes(`${resName}000`); break;
            case Logic.CHAPTER01: this.changeRes(`${resName}001`); break;
            case Logic.CHAPTER02: this.changeRes(`${resName}002`); break;
            case Logic.CHAPTER03: this.changeRes(`${resName}003`); break;
            case Logic.CHAPTER04: this.changeRes(`${resName}004`); break;
            case Logic.CHAPTER05: this.changeRes(`${resName}004`); break;
            case Logic.CHAPTER099: this.changeRes(`${resName}000`); break;
        }
    }
    changeRes(resName: string) {
        let sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        let spriteFrame = Logic.spriteFrameRes(resName);
        sprite.spriteFrame = spriteFrame;
    }
    setDefaultPos(defaultPos: cc.Vec3) {
        this.data.defaultPos = defaultPos;
        this.entity.Transform.position = Dungeon.getPosInMap(defaultPos);
        this.node.position = this.entity.Transform.position.clone();
        this.node.zIndex = IndexZ.getActorZIndex(this.entity.Transform.position);
    }
    //Animation
    BreakingFinish() {
        this.reset();
    }

    breakBox() {
        if (this.isBreaking) {
            return;
        }
        let hitNames = [AudioPlayer.MONSTER_HIT, AudioPlayer.MONSTER_HIT1, AudioPlayer.MONSTER_HIT2];
        AudioPlayer.play(hitNames[Logic.getRandomNum(0, 2)]);
        if (!this.anim) {
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play('BoxBroken');
        this.isBreaking = true;
    }
    reset() {
        this.entity.Transform.position = Dungeon.getPosInMap(this.data.defaultPos);
        this.node.position = this.entity.Transform.position.clone();
        this.isBreaking = false;
    }

    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.data.position = this.entity.Transform.position;
            let saveBox = Logic.mapManager.getCurrentMapBuilding(this.data.defaultPos);
            if (saveBox) {
                saveBox.position = this.data.position;
            }
            this.node.zIndex = IndexZ.getActorZIndex(this.entity.Transform.position);
        }
    }
}
