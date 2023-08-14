import AvatarData from '../data/AvatarData'
import PlayerData from '../data/PlayerData'
import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import ProfileManager from '../manager/ProfileManager'
import AudioPlayer from '../utils/AudioPlayer'
import Utils from '../utils/Utils'
import SaveSlotDialog from './dialog/SaveSlotDialog'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class SaveSlotItem extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    closeButton: cc.Node = null
    @property(cc.Node)
    deleteCover: cc.Node = null
    index = 0 //列表里的下标
    dialog: SaveSlotDialog = null
    hasSaveData = false
    isPressing = false
    @property(cc.SpriteFrame)
    chapter00: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    chapter01: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    chapter02: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    chapter03: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    chapter04: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    chapter05: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    chapter099: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    empty: cc.SpriteFrame = null
    static readonly PRESSINGWIDTH = 300
    // LIFE-CYCLE CALLBACKS:

    onLoad() {}
    init(index: number, dialog: SaveSlotDialog) {
        this.index = index
        this.dialog = dialog
        this.scheduleOnce(() => {
            this.updateUi(this.index, false)
        }, 0.1)
    }
    updateUi(index: number, isEdit: boolean) {
        let data = ProfileManager.getSaveData(index)
        if (data && data.playerDatas && data.lastPlayerId.length > 0) {
            this.hasSaveData = true
        } else {
            this.hasSaveData = false
        }
        if (this.hasSaveData) {
            let playerData = new PlayerData()
            playerData.valueCopy(data.playerDatas[data.lastPlayerId])
            this.label.string = `${index} ${playerData.AvatarData.professionData.nameCn} ${AvatarData.ORGANIZATION[playerData.AvatarData.organizationIndex]} Lv.${
                Logic.getOilGoldData(data.oilGolds).level
            }\n${Utils.getFullFormatTime(data.lastSaveTime)}`
            this.sprite.spriteFrame = this.getIcon(data.chapterIndex)
        } else {
            this.label.string = `空${index}`
            this.sprite.spriteFrame = this.empty
        }
        this.node.opacity = this.hasSaveData ? 255 : 128
        this.closeButton.active = isEdit && this.hasSaveData
        this.isPressing = false
        this.closeButton.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.isPressing = true
        })
        this.closeButton.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.isPressing = false
        })
        this.closeButton.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.isPressing = false
        })
    }
    getIcon(chapterIndex: number) {
        switch (chapterIndex) {
            case Logic.CHAPTER00:
                return this.chapter00
            case Logic.CHAPTER01:
                return this.chapter01
            case Logic.CHAPTER02:
                return this.chapter02
            case Logic.CHAPTER03:
                return this.chapter03
            case Logic.CHAPTER04:
                return this.chapter04
            case Logic.CHAPTER05:
                return this.chapter05
            case Logic.CHAPTER099:
                return this.chapter099
        }
        return this.empty
    }
    picked() {
        if (this.dialog) {
            this.dialog.onItemClick(this)
            this.dialog.dismiss()
            AudioPlayer.play(AudioPlayer.SELECT)
        }
    }

    start() {}

    update(dt) {
        if (this.hasSaveData) {
            this.deleteCover.width = Logic.lerp(this.deleteCover.width, this.isPressing ? SaveSlotItem.PRESSINGWIDTH : 0, dt * 3)
            if (this.isPressing && this.deleteCover.width > SaveSlotItem.PRESSINGWIDTH - 5) {
                ProfileManager.clearData(this.index)
                EventHelper.emit(EventHelper.DELETE_SAVE_SLOT)
                this.updateUi(this.index, false)
            }
        } else {
            this.deleteCover.width = 0
        }
    }
}
