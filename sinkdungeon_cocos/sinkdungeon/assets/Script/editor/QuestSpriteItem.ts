// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Logic from '../logic/Logic'
import QuestConditionData from './data/QuestConditionData'
import QuestConditionChildItem from './QuestConditionChildItem'
import QuestConditionItem from './QuestConditionItem'
import QuestFileEditor from './QuestFileEditor'

const { ccclass, property } = cc._decorator

@ccclass
export default class QuestSpriteItem extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    select: cc.Node = null

    // LIFE-CYCLE CALLBACKS:
    editor: QuestFileEditor
    index = 0
    type = 0
    text = ''
    clickCallback: Function
    isSelected = false
    conditionParent: QuestConditionChildItem

    onLoad() {
        this.node.on(cc.Node.EventType.MOUSE_ENTER, (event: cc.Event.EventTouch) => {
            this.showInfo(true)
        })
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, (event: cc.Event.EventTouch) => {
            this.showInfo(false)
        })

        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.isSelected) {
                this.pick()
            } else {
                if (this.clickCallback) {
                    this.clickCallback(this)
                }
                this.select.active = this.isSelected
            }
        })
    }
    showInfo(flag: boolean) {
        let arr = this.text.split(',')
        let trigger = ''
        let title = ''
        let count = arr.length > 2 ? arr[2] : 1
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
        let str = `类型：${title}触发条件：${trigger}\n资源名：${arr[0]}\n`
        if (flag) {
            this.editor.questSpriteInfoDialog.show(str)
        } else {
            this.editor.questSpriteInfoDialog.hide()
        }
    }
    pick() {
        this.editor.editManager.showSpritePickDialog(this.text, this.type, (flag: boolean, text: string) => {
            if (flag) {
                this.text = text
                this.updateSpriteFrame()
                this.conditionParent.modifySprite()
            }
        })
    }
    updateSpriteFrame() {
        let resName = this.text.split(',')[0]
        this.sprite.spriteFrame = Logic.spriteFrameRes(resName)
    }

    start() {
        this.updateSpriteFrame()
    }

    // update (dt) {}
}
