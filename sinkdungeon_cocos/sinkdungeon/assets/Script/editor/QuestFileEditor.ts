// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import QuestConditionItem from './QuestConditionItem'
import QuestData from './data/QuestData'
import QuestFileEditManager from './QuestFileEditManager'
import QuestInputItem from './QuestInputItem'

//任务卡片
const { ccclass, property } = cc._decorator

@ccclass
export default class QuestFileEditor extends cc.Component {
    @property(cc.Prefab)
    inputPrefab: cc.Prefab = null
    @property(cc.Prefab)
    conditonPrefab: cc.Prefab = null
    @property(cc.Node)
    content: cc.Node = null

    data: QuestData = new QuestData()
    private inputName: QuestInputItem
    private inputContent: QuestInputItem
    private conditionTriggerItem: QuestConditionItem
    private conditionSuccessItem: QuestConditionItem
    private conditionFailItem: QuestConditionItem
    editManager: QuestFileEditManager
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.inputName = QuestFileEditor.addInputItem(this.content, this.inputPrefab, '名称：', '请输入任务名称')
        this.inputContent = QuestFileEditor.addInputItem(this.content, this.inputPrefab, '描述：', '请输入任务描述', 200, 200)
        this.conditionTriggerItem = this.addQuestConditionItem('触发条件')
        this.conditionSuccessItem = this.addQuestConditionItem('完成条件')
        this.conditionFailItem = this.addQuestConditionItem('失败条件')
    }

    static addInputItem(parent: cc.Node, prefab: cc.Prefab, name: string, placeholder: string, maxLength?: number, editHeight?: number) {
        let item = cc.instantiate(prefab).getComponent(QuestInputItem)
        item.label.string = name
        item.editBox.placeholder = placeholder
        item.node.parent = parent
        if (editHeight) {
            item.editBox.node.height = editHeight
        }
        if (maxLength) {
            item.editBox.maxLength = maxLength
        }
        return item
    }
    private addQuestConditionItem(name: string) {
        let item = cc.instantiate(this.conditonPrefab).getComponent(QuestConditionItem)
        item.node.parent = this.content
        item.editor = this
        item.init(name)
        return item
    }
    private showAnim() {
        this.node.stopAllActions()
        if (this.node.scaleX != 1) {
            this.node.scaleX = 0
        }
        cc.tween(this.node).to(0.1, { scaleX: 1 }).start()
    }
    private hideAnim() {
        this.node.stopAllActions()
        if (this.node.scaleX != 0) {
            this.node.scaleX = 1
        }
        cc.tween(this.node).to(0.1, { scaleX: 0 }).start()
    }
    public show(data: QuestData) {
        this.data.valueCopy(data)
        this.showAnim()
        this.initAllData()
    }

    private updateData() {
        this.data.name = this.inputName.Value
        this.data.content = this.inputContent.Value
        this.conditionTriggerItem.updateInputData()
        this.conditionSuccessItem.updateInputData()
        this.conditionFailItem.updateInputData()
        this.data.triggerCondition.valueCopy(this.conditionTriggerItem.data)
        this.data.successCondition.valueCopy(this.conditionSuccessItem.data)
        this.data.failCondition.valueCopy(this.conditionFailItem.data)
    }
    initAllData() {
        if (!this.conditionTriggerItem) {
            return
        }
        this.inputName.Value = this.data.name
        this.inputContent.Value = this.data.content
        this.conditionTriggerItem.updateData(this.data.triggerCondition)
        this.conditionSuccessItem.updateData(this.data.successCondition)
        this.conditionFailItem.updateData(this.data.failCondition)
    }
    public canHide() {
        if (this.node.scaleX == 0) {
            return true
        }
        if (this.isDataChanged()) {
            return false
        }
        return true
    }
    public hide() {
        this.hideAnim()
        return true
    }
    isDataChanged() {
        this.updateData()
        let str1 = JSON.stringify(this.editManager.getTreeNode(this.data.indexId, this.data.parentId))
        let str2 = JSON.stringify(this.data)
        return str1 != str2
    }
    protected start(): void {
        this.initAllData()
    }
    //button
    save() {
        this.updateData()
        this.editManager.updateTreeNodeData(this.data.indexId, this.data.parentId, this.data)
    }
}
