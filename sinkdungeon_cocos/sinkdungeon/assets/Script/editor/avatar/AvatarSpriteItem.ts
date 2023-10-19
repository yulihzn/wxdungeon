// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EquipmentData from '../../data/EquipmentData'
import ItemData from '../../data/ItemData'
import Item from '../../item/Item'
import Logic from '../../logic/Logic'
import InventoryManager from '../../manager/InventoryManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class AvatarSpriteItem extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    select: cc.Node = null
    @property(cc.Label)
    label: cc.Label = null
    index = 0 //列表里的下标
    resId = ''
    equipData: EquipmentData = new EquipmentData()
    itemData: ItemData = new ItemData()
    isItem = false

    onLoad() {}
    static create(prefab: cc.Prefab, parent: cc.Node, resId: string, index: number): AvatarSpriteItem {
        let item = cc.instantiate(prefab).getComponent(AvatarSpriteItem)
        item.node.parent = parent
        item.node.zIndex = 0
        item.init(resId, index)
        return item
    }
    init(resId: string, index: number) {
        this.index = index
        this.resId = resId
        this.updateSpriteFrame()
        if (this.isItem) {
            this.label.string = `${this.itemData.nameCn} \n${this.itemData.desc}`
        } else {
            this.label.string = `${this.equipData.nameCn}\n${this.equipData.desc}`
        }
    }
    updateSpriteFrame() {
        let spriteFrame = this.getSpriteFrameByType()
        if (spriteFrame) {
            this.sprite.spriteFrame = spriteFrame
            let w = spriteFrame.getOriginalSize().width
            let h = spriteFrame.getOriginalSize().height
            this.sprite.node.width = w * 4
            this.sprite.node.height = h * 4
            let size = 32
            if (this.sprite.node.height > size) {
                this.sprite.node.height = size
                this.sprite.node.width = (size / spriteFrame.getOriginalSize().height) * spriteFrame.getOriginalSize().width
            }
            this.select.width = this.sprite.node.width / this.select.scale
            this.select.height = this.sprite.node.height / this.select.scale
        } else {
            this.scheduleOnce(() => {
                this.updateSpriteFrame()
            }, 2)
        }
    }
    getSpriteFrameByType() {
        let id = this.resId
        let spriteFrame = Logic.spriteFrameRes(id)
        let data = new EquipmentData()
        this.isItem = false
        data.valueCopy(Logic.equipments[id])
        this.equipData.valueCopy(data)
        if (data.equipmetType == InventoryManager.CLOTHES) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (data.equipmetType == InventoryManager.HELMET) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (data.equipmetType == InventoryManager.REMOTE) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (data.equipmetType != InventoryManager.EMPTY) {
            spriteFrame = Logic.spriteFrameRes(data.img)
        } else {
            let itemData = new ItemData()
            itemData.valueCopy(Logic.items[id])
            if (itemData.resName != Item.EMPTY) {
                spriteFrame = Logic.spriteFrameRes(itemData.resName)
            }
            this.isItem = true
            this.itemData.valueCopy(itemData)
        }
        return spriteFrame
    }
}
