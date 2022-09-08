import Logic from './Logic'
import AudioPlayer from '../utils/AudioPlayer'
import NoticeDialog from '../ui/dialog/NoticeDialog'
import StartBackground from '../ui/StartBackground'
import CursorArea from '../ui/CursorArea'
import SaveSlotDialog from '../ui/dialog/SaveSlotDialog'
import LocalStorage from '../utils/LocalStorage'

const { ccclass, property } = cc._decorator

@ccclass
export default class Start extends cc.Component {
    @property(cc.Node)
    title: cc.Node = null
    @property(cc.Node)
    startButton: cc.Node = null
    @property(cc.Node)
    continueButton: cc.Node = null
    @property(cc.Node)
    cheatButton: cc.Node = null
    @property(cc.Node)
    debugButton: cc.Node = null
    @property(cc.Node)
    tourButton: cc.Node = null
    @property(cc.Node)
    achieveButton: cc.Node = null
    @property(cc.Node)
    noticeButton: cc.Node = null
    @property(NoticeDialog)
    noticeDialog: NoticeDialog = null
    @property(StartBackground)
    startBg: StartBackground = null
    @property(cc.Prefab)
    cursorAreaPrefab: cc.Prefab = null
    @property(SaveSlotDialog)
    saveSlotDialog: SaveSlotDialog = null
    cheatClickCount = 0
    debugClickCount = 0
    tourClickCount = 0
    onLoad(): void {
        CursorArea.init(this.cursorAreaPrefab)
        this.cheatButton.opacity = Logic.isCheatMode ? 255 : 0
        this.debugButton.opacity = Logic.isDebug ? 255 : 0
        this.noticeDialog.node.active = false
        this.saveSlotDialog.node.active = false
        this.saveSlotDialog.onItemSelectListener((slotIndex: number) => {
            this._startShow()
            this.scheduleOnce(() => {
                Logic.jumpSlotIndex = slotIndex
                Logic.resetData(slotIndex)
                if (Logic.profileManager.hasSaveData) {
                    this.scheduleOnce(() => {
                        cc.director.loadScene('loading')
                    }, 0.5)
                } else {
                    Logic.jumpSlotIndex = slotIndex
                    cc.director.loadScene('pickavatar')
                }
            }, 0.5)
        })
    }

    start() {
        // init logic
        if (this.continueButton) {
            Logic.jumpSlotIndex = LocalStorage.getLastSaveSlotKey()
            Logic.resetData()
            this.continueButton.active = Logic.profileManager.hasSaveData
            if (this.continueButton.active) {
                this.scheduleOnce(() => {
                    this.continueButton.getComponent(cc.Animation).play()
                }, 2)
            } else {
                this.scheduleOnce(() => {
                    this.startButton.getComponent(cc.Animation).play()
                }, 2)
            }
        }
    }
    private _startShow() {
        this.startBg.startPressed()
        cc.tween(this.title).to(0.5, { opacity: 0 }).start()
        cc.tween(this.startButton).to(0.5, { opacity: 0 }).start()
        cc.tween(this.continueButton).to(0.5, { opacity: 0 }).start()
        cc.tween(this.achieveButton).to(0.5, { opacity: 0 }).start()
        cc.tween(this.noticeButton).to(0.5, { opacity: 0 }).start()
    }
    startGame() {
        // //清除存档
        // Logic.profileManager.clearData();
        // //重置数据
        // Logic.resetData();
        // //加载资源
        AudioPlayer.play(AudioPlayer.SELECT)
        // cc.director.loadScene('loading');
        //进入选择页面
        this.saveSlotDialog.show()
    }

    chooseChapter() {
        AudioPlayer.play(AudioPlayer.SELECT)
        cc.director.loadScene('chapter')
    }
    achievementScene() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this._startShow()
        this.scheduleOnce(() => {
            cc.director.loadScene('achievement')
        }, 0.5)
    }
    continueGame() {
        Logic.jumpSlotIndex = LocalStorage.getLastSaveSlotKey()
        Logic.resetData(LocalStorage.getLastSaveSlotKey())
        Logic.isFirst = 1
        AudioPlayer.play(AudioPlayer.SELECT)
        this._startShow()
        this.scheduleOnce(() => {
            cc.director.loadScene('loading')
        }, 0.5)
    }
    cheatModeChange() {
        if (!this.cheatButton) {
            return
        }
        if (Logic.isCheatMode) {
            Logic.isCheatMode = false
            this.cheatClickCount = 0
            return
        }
        this.cheatClickCount++
        if (this.cheatClickCount > 2) {
            Logic.isCheatMode = true
        }
    }
    debugModeChange() {
        if (!this.debugButton) {
            return
        }
        if (Logic.isDebug) {
            Logic.isDebug = false
            this.debugClickCount = 0
            // cc.director.getCollisionManager().enabledDebugDraw = false;
            // cc.director.getPhysicsManager().debugDrawFlags = 0;
            return
        }
        this.debugClickCount++
        if (this.debugClickCount > 2) {
            Logic.isDebug = true
            cc.debug.setDisplayStats(true)
            // cc.director.getCollisionManager().enabledDebugDraw = true;
            // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            // cc.PhysicsManager.DrawBits.e_jointBit |
            // cc.PhysicsManager.DrawBits.e_shapeBit;
        }
    }
    protected update(dt: number): void {
        if (this.debugButton) this.debugButton.opacity = Logic.isDebug ? 255 : 0
        if (this.cheatButton) this.cheatButton.opacity = Logic.isCheatMode ? 255 : 0
        if (this.tourButton) this.tourButton.opacity = Logic.isTour ? 255 : 0
        cc.director.getScheduler().setTimeScale(1)
    }

    tourChange() {
        if (!this.tourButton) {
            return
        }
        if (Logic.isTour) {
            Logic.isTour = false
            this.tourClickCount = 0
            return
        }
        this.tourClickCount++
        if (this.tourClickCount > 2) {
            Logic.isTour = true
        }
    }

    showNotice() {
        if (this.noticeDialog) {
            this.noticeDialog.show()
        }
    }

    goTest() {
        cc.director.loadScene('test')
    }
}
