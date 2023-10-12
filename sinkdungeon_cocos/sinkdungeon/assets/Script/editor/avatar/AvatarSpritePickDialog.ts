// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Achievement from '../../logic/Achievement'
import Logic from '../../logic/Logic'
import AvatarSpriteItem from './AvatarSpriteItem'
import QuestSpriteItem from './AvatarSpriteItem'

//任务卡片
const { ccclass, property } = cc._decorator

@ccclass
export default class AvatarSpritePickDialog extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null
    @property(cc.EditBox)
    countEditBox: cc.EditBox = null
    @property(cc.Prefab)
    prefab: cc.Prefab = null
    spriteList: AvatarSpriteItem[] = []
    callback: (flag: boolean, resId: string, count: number) => void
    currentSprite: QuestSpriteItem
    currentListIndex = 0
    currentItemIndex = -1
    resId = ''
    count = 0
    isItem = false
    onLoad() {}

    private showAnim() {
        this.node.active = true
    }
    private hideAnim() {
        this.node.active = false
    }
    public show(resId: string, count: number, callback?: (flag: boolean, resId: string, count: number) => void) {
        this.resId = resId
        this.count = count
        this.callback = callback
        this.showAnim()
        this.changeList(this.getChangeIndex(resId))
    }

    getSprite(resId: string, index: number) {
        let icon = AvatarSpriteItem.create(this.prefab, this.content, resId, index)
        let type1 = this.resId
        let type2 = resId
        if (type1 == type2) {
            if (this.currentSprite) {
                this.currentSprite.select.active = false
            }
            this.currentSprite = icon
            this.currentSprite.select.active = true
            this.countEditBox.string = `${this.count}`
        }
        icon.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.iconClick(icon)
        })
        return icon
    }
    private iconClick(value: AvatarSpriteItem) {
        if (this.currentSprite == value) {
        } else {
            if (this.currentSprite) {
                this.currentSprite.select.active = false
            }
            this.currentSprite = value
            this.currentSprite.select.active = true
        }
    }
    public hide() {
        this.hideAnim()
    }

    //button
    clickOk() {
        if (!this.currentSprite) {
            if (this.callback) {
                this.callback(false, '', 0)
            }
            return
        }
        if (this.callback) {
            this.callback(true, this.currentSprite.resId, this.count)
        }
        this.hide()
    }
    //button
    clickCancel() {
        if (this.callback) {
            this.callback(false, '', 0)
        }
        this.hide()
    }
    //button
    countUp() {
        let count = parseInt(this.countEditBox.string)
        if (isNaN(count)) {
            count = 1
        }
        count++
        if (count < 1) {
            count = 1
        }
        this.countEditBox.string = `${count}`
    }
    //button
    countDown() {
        let count = parseInt(this.countEditBox.string)
        if (isNaN(count)) {
            count = 1
        }
        count--
        if (count < 1) {
            count = 1
        }
        this.countEditBox.string = `${count}`
    }
    getChangeIndex(resId: string) {
        let text = resId
        if (text.indexOf('equip') != -1) {
            return '0'
        } else if (text.indexOf('item') != -1) {
            return '1'
        } else {
            return '0'
        }
    }
    changeList(index: string) {
        this.currentListIndex = parseInt(index)
        this.unscheduleAllCallbacks()
        switch (this.currentListIndex) {
            case Achievement.TYPE_EQUIP:
                this.showEquipList()
                break
            case Achievement.TYPE_ITEM:
                this.showItemList()
                break
        }
    }

    private removeContent() {
        this.content.removeAllChildren()
    }

    private showItemList() {
        this.removeContent()
        let index = 0
        for (let key in Logic.items) {
            index++
            if (index > 5) {
                this.getSprite(key, index)
            }
        }
    }
    private showEquipList() {
        this.removeContent()
        let index = 0
        for (let key in Logic.equipments) {
            index++
            if (index > 1) {
                this.getSprite(key, index)
            }
        }
    }
}
