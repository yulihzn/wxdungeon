import Logic from './Logic'
import CutScene from '../ui/CutScene'
import LoadingManager from '../manager/LoadingManager'
import AudioPlayer from '../utils/AudioPlayer'
import LoadingIcon from '../ui/LoadingIcon'
import CursorArea from '../ui/CursorArea'

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
export default class Loading extends cc.Component {
    loadingIcon: LoadingIcon = null
    @property(CutScene)
    cutScene: CutScene = null
    @property(cc.Node)
    shipTransportScene: cc.Node = null
    @property(cc.Node)
    elevatorScene: cc.Node = null
    @property(cc.Prefab)
    loadingIconPrefab: cc.Prefab = null
    @property(cc.Prefab)
    cursorAreaPrefab: cc.Prefab = null
    private timeDelay = 0
    private isTransportAnimFinished = true
    private isElevatorAnimFinished = true
    private loadingManager: LoadingManager = new LoadingManager()
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        CursorArea.init(this.cursorAreaPrefab)
        this.loadingManager.init()
        this.loadingIcon = cc.instantiate(this.loadingIconPrefab).getComponent(LoadingIcon)
        this.loadingIcon.node.parent = this.node
        this.loadingIcon.init([
            LoadingIcon.TYPE_TEXTURE_AUTO,
            LoadingIcon.TYPE_TEXTURE,
            LoadingIcon.TYPE_ITEM,
            LoadingIcon.TYPE_EQUIP,
            LoadingIcon.TYPE_NPC,
            LoadingIcon.TYPE_MAP,
            LoadingIcon.TYPE_AUDIO
        ])
    }

    start() {
        //加载地图，装备，贴图，敌人，状态，子弹，物品资源,建筑预制
        LoadingManager.loadAllBundle(LoadingManager.ALL_BUNDLES, () => {
            this.loadingManager.loadWorld()
            this.loadingManager.loadEquipment()
            this.loadingManager.loadAutoSpriteFrames()
            this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_TEXTURES, 'singleColor')
            this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_NPC, 'npcshadow')
            this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_EQUIPMENT, 'emptyequipment')
            this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_ITEM, 'ammo')
            this.loadingManager.loadMonsters()
            this.loadingManager.loadStatus()
            this.loadingManager.loadBullets()
            this.loadingManager.loadItems()
            this.loadingManager.loadTalents()
            this.loadingManager.loadProfession()
            this.loadingManager.loadNonplayer()
            this.loadingManager.loadSound()
            this.loadingManager.loadBgm()
            this.loadingManager.loadSuits()
            this.loadingManager.loadFurnitures()
            this.loadingManager.loadNormalBuildings()
            this.loadingManager.loadDialogue()
            this.showLoadingLabel()
        })
        //显示过场
        if (Logic.isFirst == 1) {
            this.cutScene.isSkip = true
            this.cutScene.unregisterClick()
        }
    }

    showLoadingLabel() {
        if (this.loadingManager.isAllSpriteFramesLoaded()) {
            return
        }
        this.loadingIcon.node.active = true
    }

    showCut(): void {
        if (this.loadingManager.isAllSpriteFramesLoaded() && Logic.isFirst != 1) {
            Logic.isFirst = 1
            this.cutScene.playShow()
        }
    }
    showElevator() {
        if (this.loadingManager.isAllSpriteFramesLoaded() && Logic.elevatorScene > 0) {
            this.isElevatorAnimFinished = false
            this.elevatorScene.active = true
            this.loadingIcon.node.active = false
            if (Logic.elevatorScene == 1) {
                this.elevatorScene.getComponent(cc.Animation).play('ElevatorSceneUp')
            } else if (Logic.elevatorScene == 2) {
                this.elevatorScene.getComponent(cc.Animation).play('ElevatorSceneDown')
            }
            Logic.elevatorScene = 0
            this.scheduleOnce(() => {
                this.isElevatorAnimFinished = true
            }, 1)
        }
    }
    showTransport() {
        if (this.loadingManager.isAllSpriteFramesLoaded() && Logic.shipTransportScene > 0) {
            this.isTransportAnimFinished = false
            this.loadingIcon.node.active = false
            this.shipTransportScene.active = true
            if (Logic.shipTransportScene == 2) {
                this.shipTransportScene.scaleX = -1
            }
            AudioPlayer.play(AudioPlayer.TRANSPORTSHIP)
            Logic.shipTransportScene = 0
            this.scheduleOnce(() => {
                this.isTransportAnimFinished = true
            }, 1)
        }
    }
    update(dt) {
        this.timeDelay += dt
        this.loadingManager.isWorldLoaded = Logic.worldLoader.isloaded
        this.showCut()
        this.showTransport()
        // this.showElevator()
        if (
            this.timeDelay > 0.02 &&
            this.loadingManager.isEquipmentLoaded &&
            this.loadingManager.isAllSpriteFramesLoaded() &&
            this.loadingManager.isMonsterLoaded &&
            this.loadingManager.isNonplayerLoaded &&
            this.loadingManager.isBuffsLoaded &&
            this.loadingManager.isProfessionLoaded &&
            this.loadingManager.isBulletsLoaded &&
            this.loadingManager.isItemsLoaded &&
            this.loadingManager.isSkillsLoaded &&
            this.loadingManager.isWorldLoaded &&
            this.loadingManager.isSuitsLoaded &&
            this.loadingManager.isFurnituresLoaded &&
            this.loadingManager.isSoundLoaded &&
            this.loadingManager.isBgmLoaded &&
            this.loadingManager.isNormalBuildingLoaded &&
            this.loadingManager.isDialogueLoaded &&
            this.cutScene.isSkip &&
            this.isTransportAnimFinished &&
            this.isElevatorAnimFinished
        ) {
            this.timeDelay = 0
            this.cutScene.unregisterClick()
            this.isTransportAnimFinished = false
            this.isElevatorAnimFinished = false
            this.loadingManager.reset()
            Logic.mapManager.loadMap()
            cc.director.loadScene('game')
        }
    }
}
