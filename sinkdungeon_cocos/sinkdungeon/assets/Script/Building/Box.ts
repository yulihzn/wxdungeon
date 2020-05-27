import Dungeon from "../Dungeon";
import BoxData from "../Data/BoxData";
import Logic from "../Logic";
import Building from "./Building";

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
    data: BoxData = new BoxData();

    start() {
        let resName = 'box';
        switch(this.boxType){
            case Box.BOX:resName = 'box';break;
            case Box.PLANT:resName = 'plant';break;
            case Box.BOXBREAKABLE:resName = 'box';break;
        }
        switch(Logic.chapterIndex){
            case Logic.CHAPTER00:this.changeRes(`${resName}000`);break;
            case Logic.CHAPTER01:this.changeRes(`${resName}001`);break;
            case Logic.CHAPTER02:this.changeRes(`${resName}002`);break;
            case Logic.CHAPTER03:this.changeRes(`${resName}003`);break;
            case Logic.CHAPTER04:this.changeRes(`${resName}004`);break;
        }
    }
    changeRes(resName: string) {
        let sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        let spriteFrame = Logic.spriteFrames[resName];
        sprite.spriteFrame = spriteFrame;
    }
    setPos(pos: cc.Vec3) {
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
        this.anim.play('BoxBroken');
        this.isBreaking = true;
    }
    reset() {
        this.node.position = Dungeon.getPosInMap(this.data.defaultPos);
        this.isBreaking = false;
    }

    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.data.pos = Dungeon.getIndexInMap(this.node.position);
            this.data.position = this.node.position;
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
