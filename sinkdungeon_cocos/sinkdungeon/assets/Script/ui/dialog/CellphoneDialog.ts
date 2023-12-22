// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Achievement from '../../logic/Achievement'
import CellphoneData from '../../data/CellphoneData'
import ItemData from '../../data/ItemData'
import { EventHelper } from '../../logic/EventHelper'
import Logic from '../../logic/Logic'
import AudioPlayer from '../../utils/AudioPlayer'
import LocalStorage from '../../utils/LocalStorage'
import Utils from '../../utils/Utils'
import CellphoneItem from '../CellphoneItem'
import BaseDialog from './BaseDialog'
import EquipmentAndItemDialog from './EquipmentAndItemDialog'
import BuildingData from '../../data/BuildingData'
import TimeDelay from '../../utils/TimeDelay'

const { ccclass, property } = cc._decorator

@ccclass
export default class CellphoneDialog extends BaseDialog {
    @property(cc.Prefab)
    item: cc.Prefab = null
    @property(cc.Node)
    content: cc.Node = null
    @property(cc.Prefab)
    equipmentAndItemDialogPrefab: cc.Prefab = null
    @property(cc.Node)
    buyButton: cc.Node = null
    list: CellphoneItem[] = []
    @property(cc.Node)
    itemSelect: cc.Node = null
    @property(cc.Node)
    title: cc.Label = null
    @property(cc.Label)
    priceLabel: cc.Label = null
    @property(cc.Label)
    hourLabel: cc.Label = null
    @property(cc.Label)
    dayLabel: cc.Label = null
    @property(cc.Node)
    layer: cc.Node = null
    @property(cc.Sprite)
    flashLightSprite: cc.Sprite = null
    @property(cc.Node)
    top: cc.Node = null
    @property(cc.Node)
    bottom: cc.Node = null
    currentSelectIndex: number
    equipmentAndItemDialog: EquipmentAndItemDialog = null
    itemList: ItemData[] = []
    appIndex = 0
    onLoad() {
        this.itemSelect.opacity = 0
        this.layer.active = false
        this.equipmentAndItemDialog = this.initDialog()
        this.dayLabel.string = Utils.getDay(Logic.getTickTime())
        this.hourLabel.string = Utils.getHour(Logic.getTickTime())
        this.updateList(this.appIndex)
        EventHelper.on(EventHelper.PLAYER_SHOW_FLASHLIGHT, detail => {
            if (this.node) {
                this.changeFlashLightSprite(detail.isOpen)
            }
        })
        this.flashLightSprite.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            CellphoneDialog.changeFlashLight()
        })
        this.changeFlashLightSprite(Logic.settings.isFlashLightOpen)
    }
    static changeFlashLight() {
        AudioPlayer.play(AudioPlayer.FLASHLIGHT)
        Logic.settings.isFlashLightOpen = !Logic.settings.isFlashLightOpen
        LocalStorage.saveSystemSettings(Logic.settings)
        EventHelper.emit(EventHelper.PLAYER_SHOW_FLASHLIGHT, { isOpen: Logic.settings.isFlashLightOpen })
    }
    private changeFlashLightSprite(isOpen: boolean) {
        this.changeSwitchSprite(this.flashLightSprite, isOpen, 'cellphone_flashlight1', 'cellphone_flashlight0')
    }
    private changeSwitchSprite(sprite: cc.Sprite, isOpen: boolean, spriteName0: string, spriteName1: string) {
        sprite.spriteFrame = Logic.spriteFrameRes(isOpen ? spriteName0 : spriteName1)
    }
    private initDialog() {
        let node = cc.instantiate(this.equipmentAndItemDialogPrefab)
        node.parent = this.node
        let dialog = node.getComponent(EquipmentAndItemDialog)
        dialog.changeBgAndAnchor(EquipmentAndItemDialog.BG_TYPE_ARROW_NONE)
        dialog.hideDialog()
        return dialog
    }
    private getItem(index: number, data: CellphoneData): CellphoneItem {
        let prefab = cc.instantiate(this.item)
        prefab.parent = this.content
        let item = prefab.getComponent(CellphoneItem)
        item.init(this, index, data)
        return item
    }

    start() {}

    show() {
        super.show()
        this.updateList(this.appIndex)
    }
    //button
    home() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.layer.stopAllActions()
        cc.tween(this.layer)
            .to(0.2, { opacity: 0 })
            .call(() => {
                this.layer.active = false
            })
            .start()
    }
    //button
    openApp(event: cc.Event, index: string) {
        let color = '#FFFFFF'
        let i = parseInt(index)
        switch (i) {
            case 0:
                this.title.string = '吃饱啦'
                color = '#03418d'
                break
            case 1:
                this.title.string = '宜住家'
                color = '#b56300'
                break
            case 2:
                this.title.string = '萌宠乐园'
                color = '#940011'
                break
            case 3:
                this.title.string = '生活到家'
                color = '#a18000'
                break
            case 4:
                this.title.string = '他们聊'
                color = '#00801c'
                break
        }
        this.top.color = cc.color().fromHEX(color)
        this.bottom.color = cc.color().fromHEX(color)
        this.layer.stopAllActions()
        this.layer.active = true
        cc.tween(this.layer).to(0.2, { opacity: 255 }).start()
        AudioPlayer.play(AudioPlayer.SELECT)
        this.updateList(i)
    }

    clearSelect() {
        this.currentSelectIndex = -1
        this.equipmentAndItemDialog.hideDialog()
        this.buyButton.active = false
        this.priceLabel.string = ``
        this.itemSelect.opacity = 0
    }
    showSelect(item: CellphoneItem) {
        this.currentSelectIndex = item.index
        this.itemSelect.parent = item.node
        this.itemSelect.position = cc.Vec3.ZERO
        this.itemSelect.opacity = 200
        AudioPlayer.play(AudioPlayer.SELECT)
        this.priceLabel.string = `${Math.floor(item.data.price)}`
        this.buyButton.active = true
        this.equipmentAndItemDialog.showDialog(cc.v3(-240, 160), null, item.data.itemData, null, item.data.furnitureData)
    }
    updateList(appIndex: number) {
        this.clearSelect()
        this.list = []
        this.content.removeAllChildren()
        this.appIndex = appIndex
        let dataList: CellphoneData[] = []
        if (appIndex == 1) {
            let normallist: CellphoneData[] = []
            let purchasedlist: CellphoneData[] = []
            let index = 0
            for (let key in Logic.furnitures) {
                let fd = new BuildingData()
                fd.valueCopy(Logic.furnitures[key])
                if (fd.price <= 0) {
                    continue
                }
                let save = LocalStorage.getFurnitureData(fd.id)
                if (save) {
                    fd.triggerCount = save.triggerCount
                    fd.purchased = save.purchased
                }
                let data = new CellphoneData()
                data.createTime = new Date().getTime()
                data.type = CellphoneItem.TYPE_FURNITURE
                data.furnitureData = fd
                if (fd.purchased) {
                    purchasedlist.push(data)
                } else {
                    normallist.push(data)
                }
                this.list.push(this.getItem(index++, data))
            }
            dataList = normallist.concat(purchasedlist)
            for (let i = 0; i < this.list.length; i++) {
                this.list[i].updateData(dataList[i])
            }
        } else {
        }
    }

    //button 购买
    sale() {
        //未选中或者为空直接返回
        if (this.currentSelectIndex == -1 || this.list[this.currentSelectIndex].data.type == CellphoneItem.TYPE_EMPTY) {
            return
        }
        let current = this.list[this.currentSelectIndex]
        if (current.data.type == CellphoneItem.TYPE_FURNITURE) {
            let fd = current.data.furnitureData
            if (!fd.purchased && Logic.data.coins >= fd.price) {
                EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: -fd.price })
                AudioPlayer.play(AudioPlayer.COIN)
                current.data.furnitureData.purchased = true
                current.updateData()
                Achievement.addFurnituresAchievement(fd.id)
                LocalStorage.saveFurnitureData(fd)
                this.clearSelect()
                Utils.toast('购买成功,快去看看是否已经到家', true, true)
                AudioPlayer.play(AudioPlayer.CASHIERING)
                EventHelper.emit(EventHelper.HUD_FURNITURE_REFRESH, { id: fd.id })
            } else {
                Utils.toast('购买失败，余额不足', true, true)
                AudioPlayer.play(AudioPlayer.SELECT_FAIL)
            }
        }
    }
    update(dt) {
        if (this.checkTimeChangeDelay.check(dt)) {
            this.dayLabel.string = Utils.getDay(Logic.getTickTime())
            this.hourLabel.string = Utils.getHour(Logic.getTickTime())
        }
    }
    checkTimeChangeDelay = new TimeDelay(1)

    //button
    close() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.dismiss()
        this.content.removeAllChildren()
    }

    waitOneHour() {
        if (Logic.isDreaming()) {
            Logic.data.dreamTime += 60000 * 60
        } else {
            Logic.data.realTime += 60000 * 60
        }
        this.dayLabel.string = Utils.getDay(Logic.getTickTime())
        this.hourLabel.string = Utils.getHour(Logic.getTickTime())
    }
}
