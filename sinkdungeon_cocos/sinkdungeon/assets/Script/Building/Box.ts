import Dungeon from "../Dungeon";
import BoxData from "../Data/BoxData";
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class Box extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    anim: cc.Animation;
    private timeDelay = 0;
    onLoad() {
        this.anim = this.getComponent(cc.Animation);
    }
    data: BoxData = new BoxData();

    start() {

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
        if (!this.anim) {
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play();
    }
    reset() {
        this.node.position = Dungeon.getPosInMap(this.data.defaultPos);
    }

    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.2) {
            this.data.pos = Dungeon.getIndexInMap(this.node.position);
            let currboxes = Logic.getCurrentMapBoxes();
            if (currboxes) {
                for (let tempbox of currboxes) {
                    if (tempbox.defaultPos.equals(this.data.defaultPos)) {
                        tempbox.pos = this.data.pos;
                    }
                }
            }
            this.node.zIndex = 3000 + (Dungeon.HEIGHT_SIZE - this.data.pos.y) * 100 + 1;
        }
    }
}
