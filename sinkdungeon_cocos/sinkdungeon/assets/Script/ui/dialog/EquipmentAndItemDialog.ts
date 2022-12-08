// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BuildingData from '../../data/BuildingData'
import EquipmentData from '../../data/EquipmentData'
import ItemData from '../../data/ItemData'
import NonPlayerData from '../../data/NonPlayerData'
import Logic from '../../logic/Logic'
import AffixManager from '../../manager/AffixManager'
import EquipmentManager from '../../manager/EquipmentManager'
import InventoryManager from '../../manager/InventoryManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class EquipmentAndItemDialog extends cc.Component {
    static readonly BG_TYPE_NONE = 0
    static readonly BG_TYPE_ARROW_NONE = 1
    static readonly BG_TYPE_ARROW_RIGHT = 2
    static readonly BG_TYPE_ARROW_DOWN = 3
    static readonly BG_TYPE_ARROW_LEFT = 4
    @property(cc.Node)
    layout: cc.Node = null
    @property(cc.Label)
    labelTitle: cc.Label = null
    @property(cc.Label)
    requireLevel: cc.Label = null
    @property(cc.Label)
    price: cc.Label = null
    @property(cc.Label)
    infoBase: cc.Label = null //基础属性
    @property(cc.Label)
    info1: cc.Label = null //附加词条1
    @property(cc.Label)
    info2: cc.Label = null //附加词条2
    @property(cc.Label)
    info3: cc.Label = null //附加词条3
    @property(cc.Label)
    extraInfo: cc.Label = null //附加词条4
    @property(cc.Label)
    infoSuit1: cc.Label = null //套装附加词条1
    @property(cc.Label)
    infoSuit2: cc.Label = null //套装附加词条2
    @property(cc.Label)
    infoSuit3: cc.Label = null //套装附加词条3
    @property(cc.Label)
    infoDesc: cc.Label = null //描述
    @property(cc.Label)
    count: cc.Label = null //数量
    @property(cc.SpriteFrame)
    arrowNoneBg: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    arrowRightBg: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    arrowDownBg: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    arrowLeftBg: cc.SpriteFrame = null
    bgType = 0
    // LIFE-CYCLE CALLBACKS:

    onLoad() {}
    changeBgAndAnchor(bgType: number) {
        this.bgType = bgType
        let sprite = this.layout.getComponent(cc.Sprite)
        this.layout.anchorX = 1
        this.layout.anchorY = 1
        switch (this.bgType) {
            case EquipmentAndItemDialog.BG_TYPE_NONE:
                sprite.spriteFrame = null
                break
            case EquipmentAndItemDialog.BG_TYPE_ARROW_NONE:
                sprite.spriteFrame = this.arrowNoneBg
                break
            case EquipmentAndItemDialog.BG_TYPE_ARROW_RIGHT:
                sprite.spriteFrame = this.arrowRightBg
                break
            case EquipmentAndItemDialog.BG_TYPE_ARROW_DOWN:
                sprite.spriteFrame = this.arrowDownBg
                this.layout.anchorX = 0
                this.layout.anchorY = 0
                break
            case EquipmentAndItemDialog.BG_TYPE_ARROW_LEFT:
                sprite.spriteFrame = this.arrowLeftBg
                this.layout.anchorX = 0
                this.layout.anchorY = 1
                break
        }
    }

    private refreshEquipInfo(equipment: EquipmentData) {
        this.layout.color = equipment.requireLevel > Logic.playerData.OilGoldData.level ? cc.Color.RED : this.layout.color.fromHEX(equipment.titlecolor)
        this.requireLevel.node.color = equipment.requireLevel > Logic.playerData.OilGoldData.level ? cc.Color.RED : cc.Color.WHITE
        this.infoBase.node.active = true
        this.requireLevel.node.active = true
        this.info1.node.active = true
        this.info2.node.active = true
        this.info3.node.active = true
        this.extraInfo.node.active = true
        this.infoSuit1.node.active = true
        this.infoSuit2.node.active = true
        this.infoSuit3.node.active = true
        this.requireLevel.string = `所需等级：${equipment.requireLevel}`
        this.price.string = `价格：${equipment.price}`
        //词缀
        let prefix = AffixManager.QUALITY_NAMES[equipment.quality]
        for (let affix of equipment.affixs) {
            prefix += affix.name
        }
        this.labelTitle.string = prefix + equipment.nameCn
        this.labelTitle.node.color = this.labelTitle.node.color.fromHEX(equipment.titlecolor)
        this.infoBase.string = `${equipment.infobase}`
        this.infoBase.node.color = this.infoBase.node.color.fromHEX(equipment.infobasecolor)
        this.info1.string = equipment.info1
        this.info1.node.color = this.info1.node.color.fromHEX(equipment.infocolor1)
        this.info2.string = equipment.info2
        this.info2.node.color = this.info2.node.color.fromHEX(equipment.infocolor2)
        this.info3.string = equipment.info3
        this.info3.node.color = this.info3.node.color.fromHEX(equipment.infocolor3)
        this.extraInfo.string = equipment.extraInfo
        this.infoSuit1.string = equipment.suit1
        this.infoSuit2.string = equipment.suit2
        this.infoSuit3.string = equipment.suit3
        this.infoSuit1.node.color = this.infoSuit1.node.color.fromHEX(equipment.suitcolor1)
        this.infoSuit2.node.color = this.infoSuit2.node.color.fromHEX(equipment.suitcolor2)
        this.infoSuit3.node.color = this.infoSuit3.node.color.fromHEX(equipment.suitcolor3)
        this.infoDesc.string = equipment.desc
        this.infoBase.node.active = this.infoBase.string.length > 0
        this.info1.node.active = this.info1.string.length > 0
        this.info2.node.active = this.info2.string.length > 0
        this.info3.node.active = this.info3.string.length > 0
        this.extraInfo.node.active = this.extraInfo.string.length > 0
        this.infoSuit1.node.active = this.infoSuit1.string.length > 0
        this.infoSuit2.node.active = this.infoSuit2.string.length > 0
        this.infoSuit3.node.active = this.infoSuit3.string.length > 0
        this.count.string = ``
    }

    showDialogEquipInfo(equipment: EquipmentData, inventoryManager?: InventoryManager) {
        this.refreshEquipInfo(equipment)
        this.node.active = true
        if (inventoryManager) {
            let count = 0
            if (equipment.suitType.length > 0 && inventoryManager.suitMap[equipment.suitType]) {
                count = inventoryManager.suitMap[equipment.suitType].count
            }
            this.infoSuit1.node.opacity = count > 1 ? 255 : 50
            this.infoSuit2.node.opacity = count > 2 ? 255 : 50
            this.infoSuit3.node.opacity = count > 3 ? 255 : 50
        }
    }
    private refreshItemInfo(item: ItemData) {
        this.layout.color = cc.Color.WHITE
        this.infoBase.node.active = true
        this.info1.node.active = false
        this.info2.node.active = false
        this.info3.node.active = false
        this.requireLevel.node.active = false
        this.extraInfo.node.active = false
        this.infoSuit1.node.active = false
        this.infoSuit2.node.active = false
        this.infoSuit3.node.active = false
        this.labelTitle.string = `${item.nameCn}`
        let str = `价格：${item.price}\n${item.info}`
        if (item.solidSatiety > 0) {
            str += `\n饱食度：${item.solidSatiety}`
        }
        if (item.liquidSatiety > 0) {
            str += `\n解渴度：${item.liquidSatiety}`
        }
        this.infoBase.string = str
        this.infoDesc.string = item.desc
        this.count.string = `${item.count > 0 ? '×' + item.count : ''}`
        this.labelTitle.node.color = this.labelTitle.node.color.fromHEX('#F4C021')
    }
    showDialogItemInfo(item: ItemData) {
        this.node.active = true
        this.refreshItemInfo(item)
    }
    showDialogNonPlayerInfo(data: NonPlayerData) {
        this.node.active = true
        this.refreshNonPlayerInfo(data)
    }
    private refreshNonPlayerInfo(data: NonPlayerData) {
        this.layout.color = cc.Color.WHITE
        this.infoBase.node.active = true
        this.requireLevel.node.active = false
        this.info1.node.active = false
        this.info2.node.active = false
        this.info3.node.active = false
        this.extraInfo.node.active = false
        this.infoSuit1.node.active = false
        this.infoSuit2.node.active = false
        this.infoSuit3.node.active = false
        this.labelTitle.string = `${data.nameCn}`
        this.infoBase.string = ``
        this.infoDesc.string = ``
        this.count.string = ``
        this.labelTitle.node.color = this.labelTitle.node.color.fromHEX('#F4C021')
    }
    showDialogFurnitureInfo(data: BuildingData) {
        this.node.active = true
        this.refreshFurnitureInfo(data)
    }
    private refreshFurnitureInfo(data: BuildingData) {
        this.layout.color = cc.Color.WHITE
        this.infoBase.node.active = true
        this.info1.node.active = false
        this.info2.node.active = false
        this.info3.node.active = false
        this.requireLevel.node.active = false
        this.extraInfo.node.active = false
        this.infoSuit1.node.active = false
        this.infoSuit2.node.active = false
        this.infoSuit3.node.active = false
        this.labelTitle.string = `${data.nameCn}`
        this.infoBase.string = `价格：${data.price}\n${data.info}`
        this.infoDesc.string = `${data.desc}`
        this.count.string = ``
        this.labelTitle.node.color = this.labelTitle.node.color.fromHEX('#F4C021')
    }
    public showDialog(
        position: cc.Vec3,
        nonPlayerData: NonPlayerData,
        item: ItemData,
        equipment: EquipmentData,
        furniture: BuildingData,
        inventoryManager?: InventoryManager,
        bgType?: number
    ) {
        if (bgType || bgType == 0) {
            this.changeBgAndAnchor(bgType)
        }
        this.node.position = position.clone()
        // let size = cc.view.getVisibleSize();
        // if(this.isArrowDownBg){
        //     let offsetX = this.node.position.x+this.layout.width-size.width;
        //     let offsetY = this.node.position.x+this.layout.width-size.height;
        // }
        if (nonPlayerData) {
            this.showDialogNonPlayerInfo(nonPlayerData)
        } else if (item) {
            this.showDialogItemInfo(item)
        } else if (equipment) {
            this.showDialogEquipInfo(equipment, inventoryManager)
        } else if (furniture) {
            this.showDialogFurnitureInfo(furniture)
        }
    }
    hideDialog() {
        this.node.active = false
    }
}
