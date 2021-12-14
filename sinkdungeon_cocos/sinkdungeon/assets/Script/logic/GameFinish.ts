import Logic from "./Logic";
import WxHelper from "./WxHelper";
import { EventHelper } from "./EventHelper";
import AudioPlayer from "../utils/AudioPlayer";
import StartBackground from "../ui/StartBackground";
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
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(WxHelper)
    wxhelper: WxHelper = null;
    @property(cc.Label)
    level: cc.Label = null;
    @property(cc.Label)
    clock: cc.Label = null;
    // onLoad () {}

    start() {
        if (this.clock) {
            this.clock.string = `${Logic.time}`;
        }
        if (this.level) {
            this.level.string = `Level ${Logic.chapterIndex + 1}-${Logic.level}`;
        }
    }
    retry() {
        Logic.resetData();
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.SELECT } });
        let bg = this.getComponentInChildren(StartBackground);
        if (bg) { bg.startPressed(); }
        this.scheduleOnce(() => { cc.director.loadScene('loading'); }, 1);
    }
    home() {
        if (this.wxhelper) {
            this.wxhelper.CloseDialog();
        }
        cc.director.emit(EventHelper.PLAY_AUDIO, { detail: { name: AudioPlayer.SELECT } });
        let bg = this.getComponentInChildren(StartBackground);
        if (bg) { bg.startPressed(); }
        this.scheduleOnce(() => { cc.director.loadScene('start'); }, 1);
    }

    // update (dt) {}
}
