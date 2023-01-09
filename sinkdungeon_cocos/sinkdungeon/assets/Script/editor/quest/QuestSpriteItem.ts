// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import BuildingData from '../../data/BuildingData'
import EquipmentData from '../../data/EquipmentData'
import ItemData from '../../data/ItemData'
import Item from '../../item/Item'
import { EventHelper } from '../../logic/EventHelper'
import Logic from '../../logic/Logic'
import InventoryManager from '../../manager/InventoryManager'
import QuestTargetData from '../data/QuestTargetData'

const { ccclass, property } = cc._decorator

@ccclass
export default class QuestSpriteItem extends cc.Component {
    // static readonly TYPE_ITEM = 0
    // static readonly TYPE_EQUIP = 1
    // static readonly TYPE_NPC = 2
    // static readonly TYPE_MONSTER = 3
    // static readonly TYPE_BOSS = 4
    // static readonly TYPE_BUILDING = 5
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    select: cc.Node = null
    index = 0 //列表里的下标
    parentIndex = 0 //父下标
    // LIFE-CYCLE CALLBACKS:
    targetData = new QuestTargetData()
    clickCallback: Function
    isSmall: boolean
    isLongPress = false

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.showInfo(true, event.getLocation())
            this.isLongPress = false
            this.unschedule(this.longPressCallback)
            this.scheduleOnce(this.longPressCallback, 0.2)
        })
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.showInfo(false, event.getLocation())
            if (!this.isLongPress && this.clickCallback) {
                this.clickCallback(this)
            }
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.showInfo(false, event.getLocation())
        })
    }
    longPressCallback = () => {
        this.isLongPress = true
    }
    init(parentIndex: number, index: number, targetData: QuestTargetData, isSmall: boolean) {
        this.parentIndex = parentIndex
        this.index = index
        this.targetData.valueCopy(targetData)
        this.isSmall = isSmall
        this.updateSpriteFrame()
    }
    updateSpriteFrame() {
        let spriteFrame = this.getSpriteFrameByType()
        if (spriteFrame) {
            this.sprite.spriteFrame = spriteFrame
            let w = spriteFrame.getOriginalSize().width
            let h = spriteFrame.getOriginalSize().height
            this.sprite.node.width = w * 4
            this.sprite.node.height = h * 4
            let size = this.isSmall ? 32 : 96
            if (this.sprite.node.height > size) {
                this.sprite.node.height = size
                this.sprite.node.width = (size / spriteFrame.getOriginalSize().height) * spriteFrame.getOriginalSize().width
            }
            this.select.width = this.sprite.node.width / this.select.scale
            this.select.height = this.sprite.node.height / this.select.scale
        } else {
            this.scheduleOnce(() => {
                this.updateSpriteFrame()
            }, 2)
        }
    }
    getSpriteFrameByType() {
        let id = this.targetData.resId
        let spriteFrame = Logic.spriteFrameRes(id)
        let data = new EquipmentData()
        data.valueCopy(Logic.equipments[id])
        if (data.equipmetType == InventoryManager.CLOTHES) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (data.equipmetType == InventoryManager.HELMET) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (data.equipmetType == InventoryManager.REMOTE) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (data.equipmetType != InventoryManager.EMPTY) {
            spriteFrame = Logic.spriteFrameRes(data.img)
        } else if (id.indexOf('furniture') != -1) {
            let fd = new BuildingData()
            fd.valueCopy(Logic.furnitures[id])
            spriteFrame = Logic.spriteFrameRes(fd.resName)
        } else if (id.indexOf('boss') != -1 && id.indexOf('food') == -1) {
            spriteFrame = Logic.spriteFrameRes('icon' + id)
        } else if ((id.indexOf('monster') != -1 || id.indexOf('nonplayer') != -1) && id.indexOf('food') == -1) {
            spriteFrame = Logic.spriteFrameRes(id + 'anim000')
        } else if (id.indexOf('roomsxyz') != -1) {
            spriteFrame = Logic.spriteFrameRes(id)
        } else {
            let itemData = new ItemData()
            itemData.valueCopy(Logic.items[id])
            if (itemData.resName != Item.EMPTY) {
                spriteFrame = Logic.spriteFrameRes(itemData.resName)
            }
        }
        return spriteFrame
    }
    showInfo(flag: boolean, wpos: cc.Vec2) {
        let str = this.targetData.getDesc(true)
        EventHelper.emit(EventHelper.EDITOR_SHOW_SPRITE_INFO, { isShow: flag, text: str, wpos: wpos })
    }

    // update (dt) {}
}
