import Logic from "./Logic";
import AudioPlayer from "../utils/AudioPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Start extends cc.Component {
    @property(cc.Node)
    startButton: cc.Node = null;
    @property(cc.Node)
    continueButton: cc.Node = null;
    @property(cc.Node)
    cheatButton: cc.Node = null;
    @property(cc.Node)
    debugButton: cc.Node = null;
    @property(cc.Node)
    tourButton: cc.Node = null;
    cheatClickCount = 0;
    debugClickCount = 0;
    tourClickCount = 0;
    onLoad(): void {
        this.cheatButton.opacity = Logic.isCheatMode ? 255 : 0;
        this.debugButton.opacity = Logic.isDebug ? 255 : 0;
    }

    start() {
        // init logic
        if (this.continueButton) {
            this.continueButton.active = Logic.profileManager.hasSaveData;
            if (this.continueButton.active) {
                this.scheduleOnce(() => {
                    this.continueButton.getComponent(cc.Animation).play();
                }, 2)
            } else {
                this.scheduleOnce(() => {
                    this.startButton.getComponent(cc.Animation).play();
                }, 2)
            }
        }
    }
    startGame() {
        // //清除存档
        // Logic.profileManager.clearData();
        // //重置数据
        // Logic.resetData();
        // //加载资源
        AudioPlayer.play(AudioPlayer.SELECT);
        // cc.director.loadScene('loading');
        //进入选择页面
        cc.director.loadScene('pickavatar');
    }
    chooseChapter() {
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.loadScene('chapter');
    }
    achievementScene() {
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.loadScene('achievement');
    }
    continueGame() {

        Logic.resetData();
        Logic.isFirst = 1;
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.loadScene('loading');
    }
    cheatModeChange() {
        if (!this.cheatButton) {
            return;
        }
        if (Logic.isCheatMode) {
            Logic.isCheatMode = false;
            this.cheatClickCount = 0;
            return;
        }
        this.cheatClickCount++;
        if (this.cheatClickCount > 2) {
            Logic.isCheatMode = true;
        }
    }
    debugModeChange() {
        if (!this.debugButton) {
            return;
        }
        if (Logic.isDebug) {
            Logic.isDebug = false;
            this.debugClickCount = 0;
            // cc.director.getCollisionManager().enabledDebugDraw = false;
            // cc.director.getPhysicsManager().debugDrawFlags = 0;
            return;
        }
        this.debugClickCount++;
        if (this.debugClickCount > 2) {
            Logic.isDebug = true;
            cc.debug.setDisplayStats(true);
            // cc.director.getCollisionManager().enabledDebugDraw = true;
            // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            // cc.PhysicsManager.DrawBits.e_jointBit |
            // cc.PhysicsManager.DrawBits.e_shapeBit;
        }
    }
    protected update(dt: number): void {
        if (this.debugButton) this.debugButton.opacity = Logic.isDebug ? 255 : 0;
        if (this.cheatButton) this.cheatButton.opacity = Logic.isCheatMode ? 255 : 0;
        if (this.tourButton) this.tourButton.opacity = Logic.isTour ? 255 : 0;
    }

    tourChange() {
        if (!this.tourButton) {
            return;
        }
        if (Logic.isTour) {
            Logic.isTour = false;
            this.tourClickCount = 0;
            return;
        }
        this.tourClickCount++;
        if (this.tourClickCount > 2) {
            Logic.isTour = true;
        }
    }

    goTest() {
        cc.director.loadScene('test');
    }

}
