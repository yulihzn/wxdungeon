// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LocalStorage from '../../utils/LocalStorage'
import BaseDialog from './BaseDialog'
import SaveSlotItem from '../SaveSlotItem'

const { ccclass, property } = cc._decorator

@ccclass
export default class SaveSlotDialog extends BaseDialog {
    @property(cc.Prefab)
    item: cc.Prefab = null
    @property(cc.Node)
    content: cc.Node = null
    @property(cc.Toggle)
    editToggle: cc.Toggle = null
    @property(cc.Node)
    baseBg: cc.Node = null
    itemList: SaveSlotItem[] = []
    indexs: number[] = []
    isEdit = false
    callback: Function
    onLoad() {
        this.baseBg.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.dismiss()
        })
    }
    onItemSelectListener(callback: Function) {
        this.callback = callback
    }
    onItemClick(item: SaveSlotItem) {
        if (this.callback) {
            this.callback(item.index)
        }
    }
    init() {
        this.content.removeAllChildren()
        let arr = [0, 1, 2]
        this.indexs = []
        this.itemList = []
        for (let i = arr.length - 1; i >= 0; i--) {
            if (i == LocalStorage.getLastSaveSlotKey()) {
                this.indexs.push(arr[i])
                arr.splice(i, 1)
                break
            }
        }
        this.indexs = this.indexs.concat(arr)
        for (let i = 0; i < this.indexs.length; i++) {
            this.itemList.push(this.getItem(this.indexs[i]))
        }
        this.editToggle.isChecked = false
    }

    private getItem(index: number): SaveSlotItem {
        let prefab = cc.instantiate(this.item)
        this.content.addChild(prefab)
        let item = prefab.getComponent(SaveSlotItem)
        item.init(index, this)
        return item
    }
    changeEditMode() {
        for (let i = 0; i < this.itemList.length; i++) {
            this.itemList[i].updateUi(this.indexs[i], this.editToggle.isChecked)
        }
    }

    start() {}

    show() {
        super.show()
        this.init()
    }
}
