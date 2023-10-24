// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerData from '../../data/PlayerData'
import Logic from '../../logic/Logic'
import LoadingManager from '../../manager/LoadingManager'
import Utils from '../../utils/Utils'
import JsCallAndroid from '../utils/JsCallAndroid'
import AvatarItem from './AvatarItem'

const { ccclass, property } = cc._decorator

@ccclass
export default class AvatarItemList extends cc.Component {
    @property(cc.Prefab)
    avatarPrefab: cc.Prefab = null
    @property(cc.Node)
    content: cc.Node = null
    @property(cc.Button)
    addButton: cc.Button = null
    private loadingManager: LoadingManager = new LoadingManager()
    private jsCallAndroid: JsCallAndroid = new JsCallAndroid()
    private isShowed = false
    players: { [key: string]: PlayerData } = {}
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.setFrameRate(45)
        this.content.removeAllChildren()
        this.loadingManager.init()
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_TEXTURES, 'singleColor')
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_EQUIPMENT, 'emptyequipment')
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_ITEM, 'ammo')
        this.loadingManager.loadProfession()
        this.loadingManager.loadEquipment()
        this.loadingManager.loadTalents()
        this.loadingManager.loadItems()
        this.loadingManager.loadSuits()
        this.loadingManager.loadAffixs()
        this.loadingManager.loadPlayer()
        this.addButton.getComponentInChildren(cc.Label).string = '加载中，请稍候...'
    }
    update(dt) {
        if (
            this.loadingManager.isSpriteFramesLoaded(LoadingManager.KEY_TEXTURES) &&
            this.loadingManager.isSpriteFramesLoaded(LoadingManager.KEY_EQUIPMENT) &&
            this.loadingManager.isProfessionLoaded &&
            this.loadingManager.isEquipmentLoaded &&
            this.loadingManager.isSkillsLoaded &&
            this.loadingManager.isItemsLoaded &&
            this.loadingManager.isSuitsLoaded &&
            this.loadingManager.isPlayerLoaded &&
            this.loadingManager.isAffixsLoaded
        ) {
            this.jsCallAndroid.loadEquipTexture()
            this.jsCallAndroid.loadItemTexture()
            this.loadingManager.reset()
            this.show()
        }
    }

    show() {
        this.jsCallAndroid.loadPlayers()
        this.jsCallAndroid.loadEquipments()
        this.jsCallAndroid.loadItems()
        this.players = {}
        for (let key in Logic.players) {
            let data = new PlayerData().valueCopy(Logic.players[key])
            this.players[key] = data
        }
        for (let key in this.jsCallAndroid.players) {
            let data = new PlayerData().valueCopy(this.jsCallAndroid.players[key])
            this.players[key] = data
        }
        for (let key in this.players) {
            let data = new PlayerData().valueCopy(this.players[key])
            data.valueCopy(this.jsCallAndroid.getPlayerDataById(data.id))
            AvatarItem.create(this.avatarPrefab, this.content, data)
        }
        this.isShowed = true
        this.addButton.getComponentInChildren(cc.Label).string = '新增'
    }
    addNew() {
        if (!this.isShowed) {
            cc.log('加载中')
            return
        }
        let last = new PlayerData()
        for (let key in this.players) {
            last = this.players[key]
        }
        let id = last.id.substring('player'.length)
        if (id.length < 1) {
            id = 'player001'
        } else {
            id = 'player' + Utils.getNumberStr3(parseInt(id) + 1)
        }
        console.log(id)
        let data = new PlayerData()
        data.id = id
        Logic.currentEditPlayerData.valueCopy(data)
        cc.director.loadScene('avatareditor')
    }
}
