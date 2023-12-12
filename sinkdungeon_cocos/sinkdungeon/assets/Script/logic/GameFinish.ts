import Logic from './Logic'
import WxHelper from './WxHelper'
import AudioPlayer from '../utils/AudioPlayer'
import StartBackground from '../ui/StartBackground'
// import CursorArea from '../ui/CursorArea'
import Utils from '../utils/Utils'
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class NewClass extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    @property(WxHelper)
    wxhelper: WxHelper = null
    @property(cc.Label)
    level: cc.Label = null
    @property(cc.Label)
    clock: cc.Label = null
    @property(cc.Prefab)
    cursorAreaPrefab: cc.Prefab = null
    onLoad() {
        // CursorArea.init(this.cursorAreaPrefab)
    }

    start() {
        if (this.clock) {
            this.clock.string = `${Utils.getPlayTime(Logic.data.totalTime)}`
        }
        if (this.level) {
            this.level.string = `Level ${Logic.data.chapterIndex + 1}-${Logic.data.level}`
        }
    }
    retry() {
        Logic.resetData()
        AudioPlayer.play(AudioPlayer.SELECT)
        let bg = this.getComponentInChildren(StartBackground)
        if (bg) {
            bg.startPressed()
        }
        this.scheduleOnce(() => {
            cc.director.loadScene('loading')
        }, 1)
    }
    home() {
        if (this.wxhelper) {
            this.wxhelper.CloseDialog()
        }
        AudioPlayer.play(AudioPlayer.SELECT)
        let bg = this.getComponentInChildren(StartBackground)
        if (bg) {
            bg.startPressed()
        }
        this.scheduleOnce(() => {
            cc.director.loadScene('start')
        }, 1)
    }

    // update (dt) {}
}
