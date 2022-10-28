// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import QuestConditionData from './data/QuestConditionData'
import QuestDateInputItem from './QuestDateInputItem'
import QuestFileEditor from './QuestFileEditor'
import QuestInputItem from './QuestInputItem'
import QuestSpriteItem from './QuestSpriteItem'

const { ccclass, property } = cc._decorator

@ccclass
export default class QuestConditionItem extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null
    @property(cc.Button)
    button: cc.EditBox = null
    @property(cc.Node)
    layout: cc.Node = null
    @property(cc.Button)
    editbutton: cc.Button = null
    @property(cc.Label)
    textLabel: cc.Label = null
    @property(cc.Node)
    spriteLayout: cc.Node = null
    @property(cc.Prefab)
    spriteItem: cc.Prefab = null
    @property(cc.Prefab)
    inputItem: cc.Prefab = null
    @property(cc.Prefab)
    inputDateItem: cc.Prefab = null
    spriteList: QuestSpriteItem[] = []
    isTextMode = false
    currentSprite: QuestSpriteItem

    isExpand = true
    editor: QuestFileEditor
    data: QuestConditionData = new QuestConditionData()

    private inputStartTime: QuestDateInputItem
    private inputEndTime: QuestDateInputItem
    private inputRoom: QuestInputItem

    // LIFE-CYCLE CALLBACKS:
    buttonClick() {
        this.isExpand = !this.isExpand
        this.collapseExpand()
    }
    init(name: string) {
        this.label.string = name
        this.spriteLayout.removeAllChildren()
        this.spriteList = []
    }
    updateInputData() {
        if (this.inputRoom.node.active) {
            this.data.roomList = this.inputRoom.Value
        }
        if (this.inputStartTime.node.active) {
            this.data.startTime = this.inputStartTime.Value
        }
        if (this.inputEndTime.node.active) {
            this.data.endTime = this.inputEndTime.Value
        }
    }
    updateData(data: QuestConditionData, showRoom: boolean, showStart: boolean, showEnd: boolean) {
        this.data.valueCopy(data)
        if (!this.spriteLayout) {
            this.spriteLayout = this.node.getChildByName('spriteLayout')
        }
        this.spriteLayout.removeAllChildren()
        this.spriteList = []
        let arr = data.conditionList.split(';')
        if (arr) {
            for (let t of arr) {
                if (t && t.length > 0) {
                    this.getSprite(t)
                }
            }
        }
        let d1 = this.data.startTime ? new Date(this.data.startTime) : new Date()
        let d2 = this.data.startTime ? new Date(this.data.endTime) : new Date()
        this.inputRoom.Value = this.data.roomList
        this.inputStartTime.Value = this.data.startTime
        this.inputEndTime.Value = this.data.endTime
        this.inputRoom.node.active = showRoom
        this.inputStartTime.node.active = showStart
        this.inputEndTime.node.active = showEnd
    }

    onLoad() {
        this.collapseExpand()
        this.inputRoom = QuestFileEditor.addInputItem(this.layout, this.inputItem, '坐标：', '章节，层数，房间坐标，进出，次数', 200, 80)
        this.inputStartTime = QuestFileEditor.addDateInputItem(this.layout, this.inputDateItem, '开始：')
        this.inputEndTime = QuestFileEditor.addDateInputItem(this.layout, this.inputDateItem, '结束：')
    }
    collapseExpand() {
        this.layout.active = this.isExpand
        this.button.node.angle = this.isExpand ? 0 : -180
    }

    start() {}

    getSprite(t: string) {
        let icon = cc.instantiate(this.spriteItem).getComponent(QuestSpriteItem)
        icon.init(0, this.spriteList.length, t, true)
        this.spriteLayout.addChild(icon.node)
        icon.clickCallback = (value: QuestSpriteItem) => {
            if (this.currentSprite == value) {
                this.pick(this.currentSprite.text)
            } else {
                if (this.currentSprite && this.currentSprite.select) {
                    this.currentSprite.select.active = false
                }
                this.currentSprite = value
                this.currentSprite.select.active = true
            }
        }
        this.spriteList.push(icon)
        return icon
    }
    //button
    addSprite() {
        this.editor.editManager.showSpritePickDialog('', (flag: boolean, text: string) => {
            if (flag) {
                if (this.currentSprite && this.currentSprite.select) {
                    this.currentSprite.select.active = false
                }
                this.currentSprite = this.getSprite(text)
                this.currentSprite.select.active = true
                this.isExpand = true
                this.collapseExpand()
                this.data.conditionList = this.getFinalText()
            }
        })
    }
    //button
    removeSprite() {
        if (this.currentSprite) {
            this.currentSprite.node.destroy()
            let index = this.currentSprite.index
            this.spriteList.splice(index, 1)
            this.isExpand = true
            this.collapseExpand()
            this.data.conditionList = this.getFinalText()
        }
    }
    //button
    switchInfoMode() {
        this.isTextMode = !this.isTextMode
        this.textLabel.node.active = this.isTextMode
        this.layout.active = !this.isTextMode
        this.textLabel.string = this.getFinalText()
        this.isExpand = true
        this.collapseExpand()
    }
    getFinalText() {
        let str = ''
        for (let i = 0; i < this.spriteList.length; i++) {
            let t = this.spriteList[i]
            if (t.text.length > 0) {
                if (i > 0) {
                    str += ';'
                }
                str += t.text
            }
        }
        return str
    }
    pick(text: string) {
        this.editor.editManager.showSpritePickDialog(text, (flag: boolean, text: string) => {
            if (flag) {
                this.currentSprite.text = text
                this.currentSprite.updateSpriteFrame()
            }
        })
    }
}
