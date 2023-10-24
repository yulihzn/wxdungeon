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
import EquipmentManager from '../../manager/EquipmentManager'
import InventoryManager from '../../manager/InventoryManager'
import AvatarSpriteData from '../data/AvatarSpriteData'
import AvatarFileEditor from './AvatarFileEditor'

const { ccclass, property } = cc._decorator

@ccclass
export default class AvatarSimpleSpriteItem extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Label)
    titleLabel: cc.Label = null
    @property(cc.Label)
    countLabel: cc.Label = null
    type = ''
    resId = ''
    count = 0
    equipData: EquipmentData = new EquipmentData()
    itemData: ItemData = new ItemData()
    isItem = false
    static readonly TYPE_NAME = new Map([
        [InventoryManager.CLOAK, '篷'],
        [InventoryManager.WEAPON, '主'],
        [InventoryManager.REMOTE, '射'],
        [InventoryManager.SHIELD, '盾'],
        [InventoryManager.HELMET, '盔'],
        [InventoryManager.SHOES, '鞋'],
        [InventoryManager.TROUSERS, '裤'],
        [InventoryManager.GLOVES, '手'],
        [InventoryManager.CLOTHES, '衣'],
        [AvatarSpriteData.ITEM1, '物'],
        [AvatarSpriteData.ITEM2, '物'],
        [AvatarSpriteData.ITEM3, '物'],
        [AvatarSpriteData.ITEM4, '物'],
        [AvatarSpriteData.ITEM5, '物'],
        [AvatarSpriteData.ITEM6, '物']
    ])
    avatarEditor: AvatarFileEditor = null
    onLoad() {
        this.node.on(
            cc.Node.EventType.TOUCH_END,
            (event: cc.Event.EventTouch) => {
                if (this.avatarEditor && this.avatarEditor.spritePickDialog) {
                    this.avatarEditor.spritePickDialog.show(this.resId, this.type, this.count, (flag: boolean, resId: string, count: number) => {
                        if (flag) {
                            this.init(resId, count)
                            if (!this.type.startsWith('item')) {
                                this.avatarEditor.data.playerEquips[this.type] = new EquipmentData().valueCopy(EquipmentManager.getNewEquipData(resId, true))
                                this.avatarEditor.data.playerEquipsReality[this.type] = new EquipmentData().valueCopy(EquipmentManager.getNewEquipData(resId, true))
                                if (this.type == InventoryManager.REMOTE) {
                                    this.avatarEditor.data.playerEquips[InventoryManager.SHIELD] = null
                                    this.avatarEditor.data.playerEquipsReality[InventoryManager.SHIELD] = null
                                } else if (this.type == InventoryManager.SHIELD) {
                                    this.avatarEditor.data.playerEquips[InventoryManager.REMOTE] = null
                                    this.avatarEditor.data.playerEquipsReality[InventoryManager.REMOTE] = null
                                }
                                this.avatarEditor.changeEquipment()
                            }
                        }
                    })
                }
            },
            this
        )
    }
    static create(prefab: cc.Prefab, parent: cc.Node, resId: string, type: string, count: number, avatarEditor: AvatarFileEditor): AvatarSimpleSpriteItem {
        let item = cc.instantiate(prefab).getComponent(AvatarSimpleSpriteItem)
        item.node.parent = parent
        item.node.zIndex = 0
        item.avatarEditor = avatarEditor
        item.type = type
        item.titleLabel.string = AvatarSimpleSpriteItem.TYPE_NAME.get(type)
        item.init(resId, count)
        return item
    }
    init(resId: string, count: number) {
        this.resId = resId
        this.count = count
        this.updateSpriteFrame()
        if (this.isItem) {
            this.countLabel.string = count > 0 ? ` x${count}` : ''
        } else {
            this.countLabel.string = ''
        }
    }
    updateSpriteFrame() {
        let spriteFrame = this.getSpriteFrameByType()
        this.sprite.spriteFrame = spriteFrame
        if (spriteFrame) {
            let w = spriteFrame.getOriginalSize().width
            let h = spriteFrame.getOriginalSize().height
            this.sprite.node.width = w * 4
            this.sprite.node.height = h * 4
            let size = 48
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
