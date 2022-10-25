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
    @property(cc.ToggleContainer)
    titleList: cc.ToggleContainer = null
    @property(cc.Prefab)
    prefab: cc.Prefab = null
    spriteList: QuestSpriteItem[] = []
    callback: Function
    currentSprite: QuestSpriteItem
    currentListIndex = 0
    currentItemIndex = -1
    editorManager: QuestFileEditManager
    showText = ''
    static readonly TYPES_ITEM = [`拾取,${QuestConditionData.ITEM_PICK}`, `使用,${QuestConditionData.ITEM_PICK}`, `丢弃,${QuestConditionData.ITEM_PICK}`]
    static readonly TYPES_NPC = [`击杀,${QuestConditionData.NPC_KILL}`, `存活,${QuestConditionData.NPC_ALIVE}`]
    static readonly TYPES_BUILDING = [`使用,${QuestConditionData.BUILDING_TRIGGER}`]
    static readonly TYPES_EQUIP = [
        `拾取,${QuestConditionData.EQUIP_PICK}`,
        `装备,${QuestConditionData.EQUIP_ON}`,
        `脱下,${QuestConditionData.EQUIP_OFF}`,
        `丢弃,${QuestConditionData.EQUIP_DROP}`
    ]
    currentTypeArr = QuestSpritePickDialog.TYPES_ITEM
    // LIFE-CYCLE CALLBACKS:

    onLoad() {}

    private showAnim() {
        this.node.active = true
    }
    private hideAnim() {
        this.node.active = false
    }
    public show(text: string, callback?: Function) {
        this.showText = text
        this.callback = callback
        this.showAnim()
        this.changeList(null, this.getChangeIndex(text))
        this.typeUpdate('')
    }

    getSprite(text: string, index: number) {
        let icon = cc.instantiate(this.prefab).getComponent(QuestSpriteItem)
        icon.init(this.currentListIndex, index++, text, false)
        this.addItem(icon)
        if (this.showText.length > 0 && text.length > 0) {
            let type1 = this.showText.split(',')[0]
            let type2 = text.split(',')[0]
            if (type1 == type2) {
                if (this.currentSprite) {
                    this.currentSprite.select.active = false
                }
                this.currentSprite = icon
                this.currentSprite.select.active = true
                this.typeUpdate(this.currentSprite.text.split(',')[1])
            }
        }
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
        if (!this.currentSprite) {
            if (this.callback) {
                this.callback(false, '')
            }
            return
        }
        if (this.callback) {
            let triggerType = ''
            for (let i = 0; i < this.typeContainer.toggleItems.length; i++) {
                if (this.typeContainer.toggleItems[i].isChecked) {
                    triggerType = this.currentTypeArr[i].split(',')[1]
                }
            }

            this.currentSprite.text = `${this.currentSprite.text.split(',')[0]},${triggerType},${this.countLabel.string}`
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
    getChangeIndex(text: string) {
        if (text.indexOf('challenge') != -1) {
            return '0'
        } else if (text.indexOf('map') != -1) {
            return '1'
        } else if (text.indexOf('building') != -1) {
            return '2'
        } else if (text.indexOf('npc') != -1) {
            return '3'
        } else if (text.indexOf('boss') != -1) {
            return '4'
        } else if (text.indexOf('monster') != -1) {
            return '5'
        } else if (text.indexOf('equip') != -1) {
            return '6'
        } else if (text.indexOf('item') != -1) {
            return '7'
        } else {
            return '0'
        }
    }
    //toggle
    changeList(toggle: cc.Toggle, index: string) {
        this.currentListIndex = parseInt(index)
        if (!toggle) {
            this.titleList.toggleItems[this.currentListIndex].isChecked = true
        }
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
                this.activeToggles(QuestSpritePickDialog.TYPES_ITEM, triggerType)
                break
            case QuestConditionData.EQUIP_PICK:
            case QuestConditionData.EQUIP_ON:
            case QuestConditionData.EQUIP_OFF:
            case QuestConditionData.EQUIP_DROP:
                this.activeToggles(QuestSpritePickDialog.TYPES_EQUIP, triggerType)
                break
            case QuestConditionData.BUILDING_TRIGGER:
                this.activeToggles(QuestSpritePickDialog.TYPES_BUILDING, triggerType)
                break
            case QuestConditionData.NPC_ALIVE:
            case QuestConditionData.NPC_KILL:
            case QuestConditionData.MONSTER_ALIVE:
            case QuestConditionData.MONSTER_KILL:
            case QuestConditionData.BOSS_ALIVE:
            case QuestConditionData.BOSS_KILL:
                this.activeToggles(QuestSpritePickDialog.TYPES_NPC, triggerType)
                break
        }
    }
    private activeToggles(list: string[], triggerType: string) {
        for (let i = 0; i < list.length; i++) {
            let arr = list[i].split(',')
            this.typeContainer.toggleItems[i].node.active = true
            this.typeContainer.toggleItems[i].getComponentInChildren(cc.Label).string = arr[0]
            if (triggerType == arr[1]) {
                this.typeContainer.toggleItems[i].isChecked = true
            }
        }
        this.currentTypeArr = list
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
                if (this.currentListIndex == Achievement.TYPE_MONSTER) {
                    this.getSprite(`${key},${QuestConditionData.MONSTER_KILL},1`, index++)
                }
            })
        }
    }
    private showBossList() {
        this.removeContent()
        let index = 0
        for (let key in Logic.bosses) {
            this.getSprite(`${key},${QuestConditionData.BOSS_KILL},1`, index++)
        }
    }
    private showNpcList() {
        this.removeContent()
        let index = 0
        for (let key in Logic.nonplayers) {
            LoadingManager.loadNpcSpriteAtlas(key, () => {
                if (this.currentListIndex == Achievement.TYPE_NPC) {
                    this.getSprite(`${key},${QuestConditionData.NPC_KILL},1`, index++)
                }
            })
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
                this.getSprite(`${key},${QuestConditionData.EQUIP_PICK},1`, index)
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
