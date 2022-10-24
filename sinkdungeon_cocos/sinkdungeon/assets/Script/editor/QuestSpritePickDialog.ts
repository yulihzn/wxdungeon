// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Achievement from '../logic/Achievement'
import Logic from '../logic/Logic'
import LoadingManager from '../manager/LoadingManager'
import QuestConditionData from './data/QuestConditionData'
import QuestConditionChildItem from './QuestConditionChildItem'
import QuestFileEditManager from './QuestFileEditManager'
import QuestSpriteItem from './QuestSpriteItem'

//任务卡片
const { ccclass, property } = cc._decorator

@ccclass
export default class QuestSpritePickDialog extends cc.Component {
    @property(cc.Label)
    title: cc.Label = null
    @property(cc.Node)
    content: cc.Node = null
    @property(cc.Label)
    countLabel: cc.Label = null
    @property(cc.ToggleContainer)
    typeContainer: cc.ToggleContainer = null
    @property(cc.Prefab)
    prefab: cc.Prefab = null
    spriteList: QuestSpriteItem[] = []
    callback: Function
    selectText: string = ''
    type: number = 0
    currentSprite: QuestSpriteItem
    currentListIndex = 0
    currentItemIndex = -1
    editorManager: QuestFileEditManager
    triggerType = ''
    // LIFE-CYCLE CALLBACKS:

    onLoad() {}

    private showAnim() {
        this.node.active = true
    }
    private hideAnim() {
        this.node.active = false
    }
    public show(text: string, type: number, callback?: Function) {
        this.selectText = text
        this.type = type
        this.callback = callback
        this.showAnim()
        this.changeList(null, '0')
    }
    getSprite(text: string, index: number) {
        let icon = cc.instantiate(this.prefab).getComponent(QuestSpriteItem)
        icon.init(this.currentListIndex, index++, text)
        this.addItem(icon)
        icon.clickCallback = (value: QuestSpriteItem) => {
            if (this.currentSprite == value) {
            } else {
                if (this.currentSprite) {
                    this.currentSprite.select.active = false
                }
                this.currentSprite = value
                this.currentSprite.select.active = true
                this.typeUpdate(this.currentSprite.text.split(',')[1])
            }
        }
        return icon
    }
    public hide() {
        this.hideAnim()
    }

    //button
    clickOk() {
        if (this.callback) {
            this.currentSprite.text = `${this.currentSprite.text.split(',')[0]}${this.triggerType},${this.countLabel.string}`
            this.callback(true, this.currentSprite.text)
        }
        this.hide()
    }
    //button
    clickCancel() {
        if (this.callback) {
            this.callback(false, '')
        }
        this.hide()
    }
    //button
    countUp() {
        let count = parseInt(this.countLabel.string)
        if (isNaN(count)) {
            count = 1
        }
        count++
        if (count < 1) {
            count = 1
        }
        this.countLabel.string = `${this.countLabel.string}`
    }
    //button
    countDown() {
        let count = parseInt(this.countLabel.string)
        if (isNaN(count)) {
            count = 1
        }
        count--
        if (count < 1) {
            count = 1
        }
        this.countLabel.string = `${this.countLabel.string}`
    }
    //toggle
    changeList(toggle: cc.Toggle, index: string) {
        this.currentListIndex = parseInt(index)
        this.unscheduleAllCallbacks()
        switch (this.currentListIndex) {
            case Achievement.TYPE_CHALLENGE:
                this.removeContent()
                break
            case Achievement.TYPE_MAP:
                this.removeContent()
                break
            case Achievement.TYPE_FURNITURE:
                this.showFurnitureList()
                break
            case Achievement.TYPE_NPC:
                this.showNpcList()
                break
            case Achievement.TYPE_BOSS:
                this.showBossList()
                break
            case Achievement.TYPE_MONSTER:
                this.showMonsterList()
                break
            case Achievement.TYPE_EQUIP:
                this.showEquipList()
                break
            case Achievement.TYPE_ITEM:
                this.showItemList()
                break
        }
    }
    private typeUpdate(triggerType: string) {
        for (let t of this.typeContainer.toggleItems) {
            t.node.active = false
        }
        switch (triggerType) {
            case QuestConditionData.ITEM_PICK:
            case QuestConditionData.ITEM_DROP:
            case QuestConditionData.ITEM_USE:
                this.typeContainer.toggleItems[0].node.active = true
                this.typeContainer.toggleItems[1].node.active = true
                this.typeContainer.toggleItems[2].node.active = true
                break
            case QuestConditionData.BUILDING_TRIGGER:
                this.typeContainer.toggleItems[0].node.active = true
                break
            case QuestConditionData.NPC_ALIVE:
            case QuestConditionData.NPC_KILL:
                this.typeContainer.toggleItems[0].node.active = true
                this.typeContainer.toggleItems[1].node.active = true

                break
        }
        this.typeContainer.toggleItems[0].isChecked = true
    }
    private removeContent() {
        this.content.removeAllChildren()
    }
    private addItem(item: QuestSpriteItem) {
        this.content.addChild(item.node)
    }
    private showMonsterList() {
        this.removeContent()
        let index = 0
        for (let key in Logic.monsters) {
            LoadingManager.loadNpcSpriteAtlas(key, () => {
                let icon = cc.instantiate(this.prefab).getComponent(QuestSpriteItem)
                icon.init(this.currentListIndex, index++, `${key},${QuestConditionData.NPC_KILL},1`)
                this.addItem(icon)
            })
        }
    }
    private showBossList() {
        this.removeContent()
        let index = 0
        for (let key in Logic.bosses) {
            this.getSprite(`${key},${QuestConditionData.NPC_KILL},1`, index++)
        }
    }
    private showNpcList() {
        this.removeContent()
        let index = 0
        for (let key in Logic.nonplayers) {
            this.getSprite(`${key},${QuestConditionData.NPC_KILL},1`, index++)
        }
    }
    private showItemList() {
        this.removeContent()
        let index = 0
        for (let key in Logic.items) {
            index++
            if (index > 5) {
                this.getSprite(`${key},${QuestConditionData.ITEM_PICK},1`, index)
            }
        }
    }
    private showEquipList() {
        this.removeContent()
        let index = 0
        for (let key in Logic.equipments) {
            index++
            if (index > 1) {
                this.getSprite(`${key},${QuestConditionData.ITEM_PICK},1`, index)
            }
        }
    }
    private showFurnitureList() {
        this.removeContent()
        let index = 0
        for (let key in Logic.furnitures) {
            this.getSprite(`${key},${QuestConditionData.BUILDING_TRIGGER},1`, index++)
        }
    }
}
