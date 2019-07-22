import Logic from "./Logic";
import RectDungeon from "./Rect/RectDungeon";

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
export default class Chapter extends cc.Component {
    @property(cc.Button)
    chapter00: cc.Button = null;
    @property(cc.Button)
    chapter01: cc.Button = null;
    @property(cc.Button)
    chapter02: cc.Button = null;
    @property(cc.Button)
    chapter03: cc.Button = null;
    @property(cc.Button)
    chapter04: cc.Button = null;
    // LIFE-CYCLE CALLBACKS:
    timeDelay = 0;

    // onLoad () {}

    start() {
        cc.view.enableAntiAlias(false);
    }

    clickChapter(event, chapter:string) {
        if (chapter) {
            Logic.profileManager.clearData();
            Logic.resetData(parseInt(chapter));
            cc.director.loadScene('loading');
        }
    }
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            return true;
        }
        return false;
    }
    update(dt) {
        if (this.isTimeDelay(dt)) {
            // Logic.setAlias(this.chapter00.node);
            // Logic.setAlias(this.chapter01.node);
        }
    }
}
