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
import InventoryManager from '../../manager/InventoryManager'
import AvatarSpriteItem from './AvatarSpriteItem'

//任务卡片
const { ccclass, property } = cc._decorator

@ccclass
export default class AvatarSpritePickDialog extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null
    @property(cc.EditBox)
    countEditBox: cc.EditBox = null
    @property(cc.Node)
    countLayout: cc.Node = null
    @property(cc.Prefab)
    prefab: cc.Prefab = null
    spriteList: AvatarSpriteItem[] = []
    callback: (flag: boolean, resId: string, count: number) => void
    currentSprite: AvatarSpriteItem
    type = ''
    resId = ''
    count = 1
    onLoad() {}

    private showAnim() {
        this.node.active = true
    }
    private hideAnim() {
        this.node.active = false
    }
    public show(resId: string, type: string, count: number, callback?: (flag: boolean, resId: string, count: number) => void) {
        this.type = type
        this.count = count
        this.callback = callback
        this.showAnim()
        this.resId = resId
        this.showList(type)
    }

    getSprite(resId: string, index: number) {
        let icon = AvatarSpriteItem.create(this.prefab, this.content, resId, index)
        icon.select.active = false
        let type1 = this.resId
        let type2 = resId
        this.countEditBox.string = `${this.count}`
        if (type1 == type2) {
            if (this.currentSprite) {
                this.currentSprite.select.active = false
            }
            this.currentSprite = icon
            this.countEditBox.string = this.count > 0 ? `${this.count}` : ''
            this.currentSprite = icon
            this.currentSprite.select.active = true
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
        this.clickOk()
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
            let count = parseInt(this.countEditBox.string)
            count = isNaN(count) ? 0 : count
            this.callback(true, this.currentSprite.resId, count)
        }
        this.hide()
    }
    //button
    clickClear() {
        if (this.callback) {
            this.callback(true, InventoryManager.EMPTY, 0)
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

    showList(type: string) {
        if (type.startsWith('item')) {
            this.showItemList()
            this.countLayout.active = true
        } else {
            this.showEquipList(type)
            this.countLayout.active = false
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
    private showEquipList(type: string) {
        this.removeContent()
        let index = 0
        for (let key in Logic.equipments) {
            index++
            if (index > 1) {
                if (key.startsWith(type)) {
                    this.getSprite(key, index)
                }
            }
        }
    }
}
