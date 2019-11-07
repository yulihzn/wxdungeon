import Logic from "./Logic";
import { EventConstant } from "./EventConstant";
import AudioPlayer from "./Utils/AudioPlayer";
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
export default class GameOver extends cc.Component {

    @property(cc.Label)
    info:cc.Label = null;
    @property(cc.Sprite)
    infoIcon:cc.Sprite = null;
    @property(cc.Label)
    level: cc.Label = null;
    @property(cc.Label)
    clock: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

    start () {
        if (this.clock) {
            this.clock.string = `用时：${Logic.time}`;
        }
        if (this.level) {
            this.level.string = `${Logic.chapterName + 1}-${Logic.level}`;
        }
        let dieinfo = `死于非命`
        if(Logic.dieFrom.name.length>0){
            dieinfo = `被 ${Logic.dieFrom.name} 在${Logic.chapterName + 1}-${Logic.level}击倒`
        }
        if(this.infoIcon&&Logic.dieFrom.res.length>0){
            this.infoIcon.spriteFrame = Logic.spriteFrames[Logic.dieFrom.res];
        }
        if(this.info){
            this.info.string = dieinfo;
        }
    }
    retry(){
        Logic.resetData();
        cc.director.emit(EventConstant.PLAY_AUDIO, { detail: { name: AudioPlayer.SELECT } });
        cc.director.loadScene('loading');
    }
    home(){
        Logic.time = '00:00:00';
        cc.director.emit(EventConstant.PLAY_AUDIO, { detail: { name: AudioPlayer.SELECT } });
        cc.director.loadScene('start');
    }

    // update (dt) {}
}
