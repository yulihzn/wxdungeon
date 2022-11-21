// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import QuestConditionData from '../data/QuestConditionData'
import QuestTargetData from '../data/QuestTargetData'
import QuestDateInputItem from './QuestDateInputItem'
import QuestFileEditor from './QuestFileEditor'
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
        for (let t of data.list) {
            this.getSprite(t)
        }
        let d1 = this.data.startTime ? new Date(this.data.startTime) : new Date()
        let d2 = this.data.startTime ? new Date(this.data.endTime) : new Date()
        this.inputStartTime.Value = this.data.startTime
        this.inputEndTime.Value = this.data.endTime
        this.inputStartTime.node.active = showStart
        this.inputEndTime.node.active = showEnd
    }

    onLoad() {
        this.collapseExpand()
        this.inputStartTime = QuestFileEditor.addDateInputItem(this.layout, this.inputDateItem, '开始：')
        this.inputEndTime = QuestFileEditor.addDateInputItem(this.layout, this.inputDateItem, '结束：')
    }
    collapseExpand() {
        this.layout.active = this.isExpand
        this.button.node.angle = this.isExpand ? 0 : -180
    }

    start() {}

    getSprite(t: QuestTargetData) {
        let icon = cc.instantiate(this.spriteItem).getComponent(QuestSpriteItem)
        icon.init(0, this.spriteList.length, t, true)
        this.spriteLayout.addChild(icon.node)
        icon.clickCallback = (value: QuestSpriteItem) => {
            if (this.currentSprite == value) {
                this.pick(this.currentSprite.targetData)
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
        this.editor.editManager.showSpritePickDialog(null, (flag: boolean, targetData: QuestTargetData) => {
            if (flag) {
                if (this.currentSprite && this.currentSprite.select) {
                    this.currentSprite.select.active = false
                }
                this.currentSprite = this.getSprite(targetData)
                this.currentSprite.select.active = true
                this.isExpand = true
                this.collapseExpand()
                this.data.copyList(this.getFinalList())
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
            this.data.copyList(this.getFinalList())
        }
    }
    //button
    switchInfoMode() {
        this.isTextMode = !this.isTextMode
        this.textLabel.node.active = this.isTextMode
        this.layout.active = !this.isTextMode
        this.textLabel.string = JSON.stringify(this.data)
        this.isExpand = true
        this.collapseExpand()
    }
    getFinalList() {
        let str = ''
        let list = []
        for (let i = 0; i < this.spriteList.length; i++) {
            let t = this.spriteList[i]
            list.push(t.targetData)
        }
        return list
    }
    pick(targetData: QuestTargetData) {
        this.editor.editManager.showSpritePickDialog(targetData, (flag: boolean, text: string) => {
            if (flag) {
                this.currentSprite.targetData.valueCopy(targetData)
                this.currentSprite.updateSpriteFrame()
            }
        })
    }
}
