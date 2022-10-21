// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import QuestConditionData from './data/QuestConditionData'
import QuestConditionChildItem from './QuestConditionChildItem'
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
    @property(cc.Prefab)
    childItem: cc.Prefab = null
    isExpand = false
    editor: QuestFileEditor
    itemChild: QuestConditionChildItem
    npcChild: QuestConditionChildItem
    buildingChild: QuestConditionChildItem
    data: QuestConditionData = new QuestConditionData()
    // LIFE-CYCLE CALLBACKS:
    buttonClick() {
        this.isExpand = !this.isExpand
        this.layout.active = this.isExpand
    }
    init(name: string) {
        this.label.string = name
    }
    updateData(data: QuestConditionData) {
        this.data.valueCopy(data)
        if (this.itemChild) {
            this.itemChild.updateData(data.itemList)
            this.buildingChild.updateData(data.buildingList)
            this.npcChild.updateData(data.npcList)
        }
    }

    onLoad() {
        this.itemChild = this.addChildItem('物品触发', QuestConditionChildItem.TYPE_ITEM)
        this.npcChild = this.addChildItem('NPC触发', QuestConditionChildItem.TYPE_NPC)
        this.buildingChild = this.addChildItem('建筑触发', QuestConditionChildItem.TYPE_BUILDING)
    }

    start() {
        this.updateData(this.data)
    }
    private addChildItem(title: string, type: number) {
        let item = cc.instantiate(this.childItem).getComponent(QuestConditionChildItem)
        item.init(title, type)
        item.editor = this.editor
        this.layout.addChild(item.node)
        return item
    }
}
