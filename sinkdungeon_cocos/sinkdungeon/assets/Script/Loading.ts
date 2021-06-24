import Logic from "./Logic";
import CutScene from "./UI/CutScene";
import LoadingManager from "./Manager/LoadingManager";
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Node)
    loadingIcon: cc.Node = null;
    @property(CutScene)
    cutScene: CutScene = null;
    @property(cc.Node)
    shipTransportScene: cc.Node = null;
    private timeDelay = 0;
    private isTransportAnimFinished = true;
    private loadingManager: LoadingManager = new LoadingManager();
    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        this.loadingManager.init();
        this.loadingIcon.active = true;
    }

    start() {
        //加载地图，装备，贴图，敌人，状态，子弹，物品资源,建筑预制
        this.loadingManager.loadWorld();
        this.loadingManager.loadEquipment();
        this.loadingManager.loadAutoSpriteFrames();
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_TEXTURES, 'ammo');
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_NPC, 'monster000anim000');
        this.loadingManager.loadMonsters();
        this.loadingManager.loadStatus();
        this.loadingManager.loadBullets();
        this.loadingManager.loadItems();
        this.loadingManager.loadTalents();
        this.loadingManager.loadProfession();
        this.loadingManager.loadNonplayer();
        this.loadingManager.loadBuildings();
        this.loadingManager.loadSuits();
        this.showLoadingLabel();
        //显示过场
        if (Logic.isFirst == 1) {
            this.cutScene.isSkip = true;
            this.cutScene.unregisterClick();
        }
    }

    showLoadingLabel() {
        if (this.loadingManager.isAllSpriteFramesLoaded()) {
            return;
        }
        this.loadingIcon.active = true;
    }

    showCut(): void {
        if (this.loadingManager.isAllSpriteFramesLoaded() && Logic.isFirst != 1) {
            Logic.isFirst = 1;
            this.cutScene.playShow();
        }
    }
    showTransport() {
        if (this.loadingManager.isAllSpriteFramesLoaded() && Logic.shipTransportScene > 0) {
            this.isTransportAnimFinished = false;
            this.shipTransportScene.active = true;
            if (Logic.shipTransportScene == 2) {
                this.shipTransportScene.scaleX = -1;
            }
            AudioPlayer.play(AudioPlayer.TRANSPORTSHIP);
            Logic.shipTransportScene = 0;
            this.scheduleOnce(() => { this.isTransportAnimFinished = true; }, 2)
        }
    }
    update(dt) {
        this.timeDelay += dt;
        this.loadingManager.isWorldLoaded = Logic.worldLoader.isloaded;
        this.showCut();
        this.showTransport();
        if (this.timeDelay > 0.02
            && this.loadingManager.isEquipmentLoaded
            && this.loadingManager.isAllSpriteFramesLoaded()
            && this.loadingManager.isMonsterLoaded
            && this.loadingManager.isNonplayerLoaded
            && this.loadingManager.isBuffsLoaded
            && this.loadingManager.isProfessionLoaded
            && this.loadingManager.isBulletsLoaded
            && this.loadingManager.isItemsLoaded
            && this.loadingManager.isSkillsLoaded
            && this.loadingManager.isWorldLoaded
            && this.loadingManager.isBuildingLoaded
            && this.loadingManager.isSuitsLoaded
            && this.cutScene.isSkip
            && this.isTransportAnimFinished) {
            this.timeDelay = 0;
            this.cutScene.unregisterClick();
            this.isTransportAnimFinished = false;
            this.loadingManager.reset();
            Logic.mapManager.loadMap();
            cc.director.loadScene('game');
        }

    }
}
