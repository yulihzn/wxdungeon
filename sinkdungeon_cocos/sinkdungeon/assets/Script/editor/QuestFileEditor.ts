// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import QuestData from './data/QuestData'
import QuestFileEditManager from './QuestFileEditManager'
import QuestInputItem from './QuestInputItem'

//任务卡片
const { ccclass, property } = cc._decorator

@ccclass
export default class QuestFileEditor extends cc.Component {
    @property(cc.Prefab)
    inputPrefab: cc.Prefab = null
    @property(cc.Node)
    content: cc.Node = null
    data: QuestData = new QuestData()
    private inputName: QuestInputItem
    private inputContent: QuestInputItem
    editManager: QuestFileEditManager
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.inputName = this.addInputItem('名称：', '请输入任务名称')
        this.inputContent = this.addInputItem('描述：', '请输入任务描述')
    }

    private addInputItem(name: string, placeholder: string) {
        let item = cc.instantiate(this.inputPrefab).getComponent(QuestInputItem)
        item.label.string = name
        item.editBox.placeholder = placeholder
        item.node.parent = this.content
        item.editor = this
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
        this.inputName.Value = data.name
        this.inputContent.Value = data.content
    }

    updateData() {
        this.data.name = this.inputName.Value
        this.data.content = this.inputContent.Value
    }
    public canHide() {
        if (this.node.opacity == 0) {
            return false
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
        let str1 = JSON.stringify(this.editManager.getTreeNode(this.data.indexId, this.data.parentId))
        let str2 = JSON.stringify(this.data)
        return str1 != str2
    }
    //button
    save() {
        this.editManager.updateTreeNodeData(this.data.indexId, this.data.parentId, this.data)
    }
}
