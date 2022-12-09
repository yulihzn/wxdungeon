import Logic from './Logic'
import RectDungeon from '../rect/RectDungeon'
import AudioPlayer from '../utils/AudioPlayer'
import StartBackground from '../ui/StartBackground'
// import CursorArea from '../ui/CursorArea'
import LocalStorage from '../utils/LocalStorage'

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
export default class Chapter extends cc.Component {
    @property(cc.Button)
    chapter00: cc.Button = null
    @property(cc.Button)
    chapter01: cc.Button = null
    @property(cc.Button)
    chapter02: cc.Button = null
    @property(cc.Button)
    chapter03: cc.Button = null
    @property(cc.Button)
    chapter04: cc.Button = null
    @property(cc.Prefab)
    cursorAreaPrefab: cc.Prefab = null
    // LIFE-CYCLE CALLBACKS:
    timeDelay = 0

    onLoad() {
        // CursorArea.init(this.cursorAreaPrefab)
    }

    start() {}

    clickChapter(event, chapter: string) {
        if (chapter) {
            Logic.jumpSlotIndex = LocalStorage.getLastSaveSlotKey()
            Logic.jumpChapter = parseInt(chapter)
            AudioPlayer.play(AudioPlayer.SELECT)
            let bg = this.getComponentInChildren(StartBackground)
            if (bg) {
                bg.startPressed()
            }
            this.scheduleOnce(() => {
                cc.director.loadScene('pickavatar')
            }, 1)
        }
    }
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0
            return true
        }
        return false
    }
}
