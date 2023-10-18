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
import AvatarSpriteData from '../data/AvatarSpriteData'

const { ccclass, property } = cc._decorator

@ccclass
export default class AvatarSimpleSpriteItem extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Label)
    title: cc.Label = null
    @property(cc.Label)
    count: cc.Label = null
    type = ''
    resId = ''
    equipData: EquipmentData = new EquipmentData()
    itemData: ItemData = new ItemData()
    isItem = false
    static readonly TYPE_NAME = new Map([
        [AvatarSpriteData.CLOAK, "篷"],
        [AvatarSpriteData.PRIMARY, "主"],
        [AvatarSpriteData.SECONDARY, "副"],
        [AvatarSpriteData.HELMET, "盔"],
        [AvatarSpriteData.SHOES, "鞋"],
        [AvatarSpriteData.PANTS, "裤"],
        [AvatarSpriteData.GLOVES, "手"],
        [AvatarSpriteData.CLOTHES, "衣"],
        [AvatarSpriteData.ITEM1, "物"],
        [AvatarSpriteData.ITEM2, "物"],
        [AvatarSpriteData.ITEM3, "物"],
        [AvatarSpriteData.ITEM4, "物"],
        [AvatarSpriteData.ITEM5, "物"],
        [AvatarSpriteData.ITEM6, "物"]
    ]);

    onLoad() {}
    static create(prefab: cc.Prefab, parent: cc.Node, resId: string, type: string,count:number): AvatarSimpleSpriteItem {
        let item = cc.instantiate(prefab).getComponent(AvatarSimpleSpriteItem)
        item.node.parent = parent
        item.node.zIndex = 0
        item.init(resId, type,count)
        return item
    }
    init(resId: string, type: string,count:number) {
        this.type = type
        this.resId = resId
        this.updateSpriteFrame()
        this.title.string = AvatarSimpleSpriteItem.TYPE_NAME[type]
        if (this.isItem) {
            this.count.string = ` x${count}`
        } else {
            this.count.string=''
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
            let size = 96
            if (this.sprite.node.height > size) {
                this.sprite.node.height = size
                this.sprite.node.width = (size / spriteFrame.getOriginalSize().height) * spriteFrame.getOriginalSize().width
            }
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
