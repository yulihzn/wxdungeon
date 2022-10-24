// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EquipmentData from '../data/EquipmentData'
import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import InventoryManager from '../manager/InventoryManager'
import QuestConditionData from './data/QuestConditionData'

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
    text = ''
    clickCallback: Function

    onLoad() {
        this.node.on(cc.Node.EventType.MOUSE_ENTER, (event: cc.Event.EventTouch) => {
            this.showInfo(true)
        })
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, (event: cc.Event.EventTouch) => {
            this.showInfo(false)
        })

        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.clickCallback) {
                this.clickCallback(this)
            }
        })
    }
    init(parentIndex: number, index: number, text: string) {
        this.parentIndex = parentIndex
        this.index = index
        this.text = text
        this.updateSpriteFrame()
    }
    updateSpriteFrame() {
        let spriteFrame = this.getSpriteFrameByType()
        if (spriteFrame) {
            this.sprite.spriteFrame = null
            this.sprite.spriteFrame = spriteFrame
            let w = spriteFrame.getOriginalSize().width
            let h = spriteFrame.getOriginalSize().height
            this.sprite.node.width = w * 4
            this.sprite.node.height = h * 4
            if (this.sprite.node.height > 96) {
                this.sprite.node.height = 96
                this.sprite.node.width = (96 / spriteFrame.getOriginalSize().height) * spriteFrame.getOriginalSize().width
            }
        }
    }
    getSpriteFrameByType() {
        let id = this.text.split[0]
        let spriteFrame = Logic.spriteFrameRes(id)
        let data = new EquipmentData()
        data.valueCopy(Logic.equipments[id])
        if (data.equipmetType == InventoryManager.CLOTHES) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (data.equipmetType == InventoryManager.HELMET) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (data.equipmetType == InventoryManager.REMOTE) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (id.indexOf('boss') != -1) {
            spriteFrame = Logic.spriteFrameRes('icon' + id)
        } else if (id.indexOf('monster') != -1 || id.indexOf('nonplayer') != -1) {
            spriteFrame = Logic.spriteFrameRes(id + 'anim000')
        }
        return spriteFrame
    }
    showInfo(flag: boolean) {
        let arr = this.text.split
        let trigger = ''
        let title = ''
        let count = parseInt(arr[2])
        switch (arr[1]) {
            case QuestConditionData.BUILDING_TRIGGER:
                title = '建筑'
                trigger = `交互${count}次`
                break
            case QuestConditionData.ITEM_DROP:
                title = '物品'
                trigger = `丢弃`
                break
            case QuestConditionData.ITEM_PICK:
                title = '物品'
                trigger = `拾取${count}个`
                break
            case QuestConditionData.ITEM_USE:
                title = '物品'
                trigger = `使用${count}次`
                break
            case QuestConditionData.NPC_ALIVE:
                title = 'NPC'
                trigger = `存活${count}个`
                break
            case QuestConditionData.NPC_KILL:
                title = 'NPC'
                trigger = `击杀${count}个`
                break
        }
        let str = `类型：${title}触发条件:${trigger}\n资源名:${arr[0]}\n`
        EventHelper.emit(EventHelper.EDITOR_SHOW_SPRITE_INFO, { isShow: flag, text: str })
    }

    // update (dt) {}
}
