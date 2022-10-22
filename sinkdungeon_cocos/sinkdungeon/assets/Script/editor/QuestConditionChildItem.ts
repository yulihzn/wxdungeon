// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import QuestConditionItem from './QuestConditionItem'
import QuestFileEditor from './QuestFileEditor'
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
    textArr: string[] = []
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
        let sprite = cc.instantiate(this.spriteItem).getComponent(QuestSpriteItem)
        sprite.conditionParent = this
        sprite.text = t
        sprite.index = this.spriteList.length
        sprite.clickCallback = (value: QuestSpriteItem) => {
            this.currentSprite = value
        }
        switch (this.type) {
            case QuestConditionChildItem.TYPE_ITEM:
                sprite.node.width = 30
                sprite.node.height = 30
                break
            case QuestConditionChildItem.TYPE_NPC:
                break
            case QuestConditionChildItem.TYPE_BUILDING:
                break
        }
        this.layout.addChild(sprite.node)
        this.spriteList.push(sprite)
        this.textArr.push(t)
        return sprite
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
        this.currentSprite.node.destroy()
        let index = this.currentSprite.index
        this.spriteList.splice(index, 1)
        this.textArr.splice(index, 1)
    }
    modifySprite() {
        this.textArr[this.currentSprite.index] = this.currentSprite.text
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
        for (let t of this.textArr) {
            if (t.length > 0) {
                str += ';'
                str += t
            }
        }
        return str
    }
}
