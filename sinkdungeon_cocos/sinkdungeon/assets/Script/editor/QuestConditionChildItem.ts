// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import QuestConditionItem from './QuestConditionItem'
import QuestSpriteItem from './QuestSpriteItem'

const { ccclass, property } = cc._decorator

@ccclass
export default class QuestConditionChildItem extends cc.Component {
    static readonly TYPE_ITEM = 0
    static readonly TYPE_NPC = 1
    static readonly TYPE_BUILDING = 2
    @property(cc.Label)
    title: cc.Label = null
    @property(cc.Button)
    editbutton: cc.Button = null
    @property(cc.Label)
    textLabel: cc.Label = null
    @property(cc.Node)
    layout: cc.Node = null
    @property(cc.Prefab)
    spriteItem: cc.Prefab = null
    conditionItem: QuestConditionItem
    spriteList: QuestSpriteItem[] = []
    isTextMode = false
    type = 0
    currentSprite: QuestSpriteItem
    // LIFE-CYCLE CALLBACKS:

    init(title: string, type: number) {
        this.title.string = title
        this.type = type
        this.layout.removeAllChildren()
        this.spriteList = []
    }
    updateData(text: string) {
        if (!this.layout) {
            this.layout = this.node.getChildByName('layout')
        }
        this.layout.removeAllChildren()
        this.spriteList = []
        let arr = text.split[';']
        if (arr) {
            for (let t of arr) {
                if (t && t.length > 0) {
                    this.getSprite(t)
                }
            }
        }
    }

    onLoad() {}

    start() {}

    getSprite(t: string) {
        let icon = cc.instantiate(this.spriteItem).getComponent(QuestSpriteItem)
        icon.init(0, this.spriteList.length, t)
        this.layout.addChild(icon.node)
        icon.clickCallback = (value: QuestSpriteItem) => {
            if (this.currentSprite == value) {
                this.pick(this.currentSprite.text)
            } else {
                if (this.currentSprite) {
                    this.currentSprite.select.active = false
                }
                this.currentSprite = value
                this.currentSprite.select.active = true
            }
        }
        switch (this.type) {
            case QuestConditionChildItem.TYPE_ITEM:
                break
            case QuestConditionChildItem.TYPE_NPC:
                break
            case QuestConditionChildItem.TYPE_BUILDING:
                break
        }
        this.spriteList.push(icon)
        return icon
    }
    //button
    addSprite() {
        this.conditionItem.editor.editManager.showSpritePickDialog('', this.type, (flag: boolean, text: string) => {
            if (flag) {
                this.getSprite(text)
            }
        })
    }
    //button
    removeSprite() {
        if (this.currentSprite) {
            this.currentSprite.node.destroy()
            let index = this.currentSprite.index
            this.spriteList.splice(index, 1)
        }
    }
    //button
    switchInfoMode() {
        this.isTextMode = !this.isTextMode
        this.textLabel.node.active = this.isTextMode
        this.layout.active = !this.isTextMode
        this.textLabel.string = this.getFinalText()
    }
    getFinalText() {
        let str = ''
        for (let t of this.spriteList) {
            if (t.text.length > 0) {
                str += ';'
                str += t
            }
        }
        return str
    }
    pick(text: string) {
        this.conditionItem.editor.editManager.showSpritePickDialog(text, this.type, (flag: boolean, text: string) => {
            if (flag) {
                this.currentSprite.text = text
                this.currentSprite.updateSpriteFrame()
            }
        })
    }
}
