// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import AttributeData from '../../data/AttributeData'
import AvatarData from '../../data/AvatarData'
import EquipmentData from '../../data/EquipmentData'
import ItemData from '../../data/ItemData'
import PlayerData from '../../data/PlayerData'
import ProfessionData from '../../data/ProfessionData'
import Item from '../../item/Item'
import Logic from '../../logic/Logic'
import EquipmentManager from '../../manager/EquipmentManager'
import InventoryManager from '../../manager/InventoryManager'
import LoadingManager from '../../manager/LoadingManager'
import AttributeSelector from '../../ui/AttributeSelector'
import BrightnessBar from '../../ui/BrightnessBar'
import ColorPicker from '../../ui/ColorPicker'
import PaletteSelector from '../../ui/PaletteSelector'
import Utils from '../../utils/Utils'
import JsCallAndroid from '../utils/JsCallAndroid'
import AvatarSimpleSpriteItem from './AvatarSimpleSpriteItem'
import AvatarSpritePickDialog from './AvatarSpritePickDialog'

const { ccclass, property } = cc._decorator

@ccclass
export default class AvatarFileEditor extends cc.Component {
    @property(cc.Node)
    avatarTable: cc.Node = null
    @property(cc.Node)
    randomButton: cc.Node = null
    @property(ColorPicker)
    colorPicker: ColorPicker = null
    @property(cc.Prefab)
    selectorPrefab: cc.Prefab = null
    @property(cc.Prefab)
    simpleSpritePrefab: cc.Prefab = null
    @property(cc.Node)
    attributeLayout: cc.Node = null
    @property(cc.EditBox)
    editTitle: cc.Label = null
    @property(cc.Label)
    labelName: cc.Label = null
    @property(cc.Label)
    labelDesc: cc.Label = null
    @property(cc.Label)
    labelSkillName: cc.Label = null
    @property(cc.Label)
    labelSkillDesc: cc.Label = null
    @property(cc.Node)
    equipItemLayout: cc.Node = null
    @property(cc.EditBox)
    editDesc: cc.EditBox = null
    @property(AvatarSpritePickDialog)
    spritePickDialog: AvatarSpritePickDialog = null

    private bodySprite: cc.Sprite = null
    private headSprite: cc.Sprite = null
    private hairSprite: cc.Sprite = null
    private eyesSprite: cc.Sprite = null
    private faceSprite: cc.Sprite = null
    private handSprite1: cc.Sprite = null
    private handSprite2: cc.Sprite = null
    private legSprite1: cc.Sprite = null
    private legSprite2: cc.Sprite = null
    private footprite1: cc.Sprite = null
    private footSprite2: cc.Sprite = null
    private cloakSprite: cc.Sprite = null
    private shoesSprite1: cc.Sprite = null
    private shoesSprite2: cc.Sprite = null
    private helmetSprite: cc.Sprite = null
    private pantsSprite: cc.Sprite = null
    private clothesSprite: cc.Sprite = null
    private glovesSprite1: cc.Sprite = null
    private glovesSprite2: cc.Sprite = null
    private weaponSprite: cc.Sprite = null
    private remoteSprite: cc.Sprite = null
    private shieldSprite: cc.Sprite = null
    private petSprite: cc.Sprite = null

    private organizationSelector: AttributeSelector
    private professionSelector: AttributeSelector
    private skinSelector: AttributeSelector
    private hairSelector: AttributeSelector
    private eyesSelector: AttributeSelector
    private faceSelector: AttributeSelector
    private petSelector: AttributeSelector
    data: PlayerData = new PlayerData()
    private randomTouched = false
    private jsCallAndroid: JsCallAndroid = new JsCallAndroid()

    onLoad() {
        cc.game.setFrameRate(45)
        this.jsCallAndroid.loadPlayers()
        this.jsCallAndroid.loadEquipments()
        this.jsCallAndroid.loadItems()
        this.data.valueCopy(Logic.currentEditPlayerData)
        this.petSprite = this.getSpriteChildSprite(this.avatarTable, ['pet'])
        this.bodySprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'body'])
        this.handSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'handleft'])
        this.handSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'handright'])
        this.legSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'legleft'])
        this.legSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'legright'])
        this.footprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'legleft', 'foot'])
        this.footSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'legright', 'foot'])
        this.headSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'head'])
        this.hairSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'head', 'hair'])
        this.faceSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'head', 'face'])
        this.eyesSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'head', 'eyes'])
        this.helmetSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'head', 'helmet'])
        this.pantsSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'body', 'pants'])
        this.cloakSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'cloak'])
        this.weaponSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'weapon'])
        this.remoteSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'remote'])
        this.shieldSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'shield'])
        this.clothesSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'body', 'clothes'])
        this.glovesSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'handleft', 'gloves'])
        this.glovesSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'handright', 'gloves'])
        this.shoesSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'legleft', 'foot', 'shoes'])
        this.shoesSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'sprite', 'avatar', 'legright', 'foot', 'shoes'])

        this.editTitle.string = this.data.name
        this.editDesc.string = this.data.desc

        this.randomButton.on(
            cc.Node.EventType.TOUCH_START,
            (event: cc.Event.EventTouch) => {
                this.randomTouched = true
            },
            this
        )

        this.randomButton.on(
            cc.Node.EventType.TOUCH_END,
            (event: cc.Event.EventTouch) => {
                this.randomTouched = false
            },
            this
        )

        this.randomButton.on(
            cc.Node.EventType.TOUCH_CANCEL,
            (event: cc.Event.EventTouch) => {
                this.randomTouched = false
            },
            this
        )

        //组织
        let organList = new Array()
        for (let i = 0; i < AvatarData.ORGANIZATION.length; i++) {
            organList.push(new AttributeData(i, AvatarData.ORGANIZATION[i], '', '', '', ''))
        }
        this.organizationSelector = this.addAttributeSelector('组织：', organList, 0, false, [])
        this.organizationSelector.selectorCallback = (data: AttributeData, color: cc.Color) => {
            this.data.AvatarData.organizationIndex = data.id
            if (this.petSelector) {
                this.petSelector.node.active = data.id == AvatarData.HUNTER
            }
            this.petSprite.node.active = data.id == AvatarData.HUNTER
        }
        //职业
        let professionList = new Array()
        for (let i = 0; i < Logic.professionList.length; i++) {
            let data = Logic.professionList[i]
            let talent = Logic.talents[data.talent]
            professionList.push(new AttributeData(data.id, data.nameCn, data.id + '', data.desc, `技能：${talent.nameCn}`, `${talent.desc}`))
        }
        this.professionSelector = this.addAttributeSelector('职业：', professionList, 0, false, [])
        this.professionSelector.selectorCallback = (data: AttributeData, color: cc.Color) => {
            this.data.AvatarData.professionData.valueCopy(Logic.professionList[data.id])
            this.labelName.string = `${data.name}`
            this.labelDesc.string = `${data.desc}`
            this.labelSkillName.string = `${data.name1}`
            this.labelSkillDesc.string = `${data.desc1}`
            this.changeEquipmentByProfession(Logic.professionList[data.id])
        }

        //皮肤颜色
        this.skinSelector = this.addAttributeSelector(
            '肤色',
            [new AttributeData(0, '默认', '', '', ``, ``), new AttributeData(1, '随机', '', '', ``, ``)],
            0,
            true,
            BrightnessBar.SKIN_COLORS
        )
        this.skinSelector.selectorCallback = (data: AttributeData, color: cc.Color) => {
            this.changeSkinColor(color)
        }
        //发型
        let hairList = []
        for (let i = 0; i < 10; i++) {
            hairList.push(new AttributeData(i, `样式${i}`, `avatarhair${Utils.getNumberStr3(i)}`, '', '', ''))
        }
        this.hairSelector = this.addAttributeSelector('发型：', hairList, 0, true, PaletteSelector.HAIRCOLORS)
        this.hairSelector.selectorCallback = (data: AttributeData, color: cc.Color) => {
            this.hairSprite.spriteFrame = Logic.spriteFrameRes(data.resName + 'anim0')
            this.data.AvatarData.hairResName = data.resName
            this.hairSprite.node.color = color
            this.data.AvatarData.hairColor = color.toHEX('#rrggbb')
        }
        //眼睛
        let eyesList = []
        for (let i = 0; i < 22; i++) {
            eyesList.push(new AttributeData(i, `样式${i}`, `avatareyes${Utils.getNumberStr3(i)}`, '', '', ''))
        }
        this.eyesSelector = this.addAttributeSelector('眼睛：', eyesList, 0, true, PaletteSelector.EYESCOLORS)
        this.eyesSelector.selectorCallback = (data: AttributeData, color: cc.Color) => {
            this.eyesSprite.spriteFrame = Logic.spriteFrameRes(data.resName + 'anim0')
            this.data.AvatarData.eyesResName = data.resName
            this.eyesSprite.getMaterial(0).setProperty('eyeColor', color)
            this.data.AvatarData.eyesColor = color.toHEX('#rrggbb')
        }
        //面颊
        let faceList = []
        for (let i = 0; i < 15; i++) {
            faceList.push(new AttributeData(i, `样式${i}`, `avatarface${Utils.getNumberStr3(i)}`, '', '', ''))
        }
        this.faceSelector = this.addAttributeSelector('面颊：', faceList, 0, true, PaletteSelector.FACECOLORS)
        this.faceSelector.selectorCallback = (data: AttributeData, color: cc.Color) => {
            this.faceSprite.spriteFrame = Logic.spriteFrameRes(data.resName + 'anim0')
            this.data.AvatarData.faceResName = data.resName
            this.faceSprite.node.color = color
            this.faceSprite.node.opacity = 128
            this.data.AvatarData.faceColor = color.toHEX('#rrggbb')
        }
        //宠物
        // let petNames = ['柯基', '鹦鹉', '橘子鱼', '天竺鼠', '巴西龟', '变色龙', '刺猬', '火玫瑰蜘蛛', '安哥拉兔', '科尔鸭', '巴马香猪'];
        let petNames = ['柯基', '家猫', '橙子鱼']
        let petList = []
        for (let i = 0; i < petNames.length; i++) {
            petList.push(new AttributeData(i, `${petNames[i]}`, `nonplayer1${Utils.getNumberStr2(i)}`, '', '', ''))
        }
        this.petSelector = this.addAttributeSelector('宠物：', petList, 0, false, [])
        this.petSelector.selectorCallback = (data: AttributeData, color: cc.Color) => {
            LoadingManager.loadNpcSpriteAtlas(data.resName, () => {
                this.petSprite.spriteFrame = Logic.spriteFrameRes(data.resName + 'anim000')
            })
            this.data.AvatarData.petName = `nonplayer1${Utils.getNumberStr2(data.id)}`
        }
        this.petSelector.node.active = this.organizationSelector.CurrentData.id == AvatarData.HUNTER
        this.petSprite.node.active = this.organizationSelector.CurrentData.id == AvatarData.HUNTER
        this.spritePickDialog.node.active = false
        this.selectTarget()
        this.equipItemLayout.removeAllChildren()
        for (let key of InventoryManager.EQUIP_TAGS) {
            let equip = this.data.playerEquips[key]
            if (equip) {
                this.addSimpleSpriteItem(equip.img, key, 0)
            } else {
                this.addSimpleSpriteItem('', key, 0)
            }
        }
        for (let i = 0; i < InventoryManager.MAX_ITEM; i++) {
            if (i < this.data.playerItemList.length) {
                this.addSimpleSpriteItem(this.data.playerItemList[0].resName, `item${i + 1}`, 0)
            } else {
                this.addSimpleSpriteItem('', `item${i + 1}`, 0)
            }
        }
    }
    private changeSkinColor(color: cc.Color) {
        this.bodySprite.node.color = color
        this.headSprite.node.color = color
        this.handSprite1.node.color = color
        this.handSprite2.node.color = color
        this.legSprite1.node.color = color
        this.legSprite2.node.color = color
        this.footprite1.node.color = color
        this.footSprite2.node.color = color
        this.data.AvatarData.skinColor = color.toHEX('#rrggbb')
        let hasLong = false
        let equipColor = ''

        if (this.data.AvatarData.professionData.equips[InventoryManager.TROUSERS]) {
            let data = new EquipmentData()
            data.valueCopy(Logic.equipments[this.data.AvatarData.professionData.equips[InventoryManager.TROUSERS]])
            if (Logic.equipments[this.data.AvatarData.professionData.equips[InventoryManager.TROUSERS]]?.trouserslong == 1) {
                hasLong = true
                equipColor = data.color
            }
        }
        if (this.data.playerEquips[InventoryManager.TROUSERS]?.trouserslong == 1) {
            hasLong = true
            equipColor = this.data.playerEquips[InventoryManager.TROUSERS].color
        }
        this.changeLegColor(hasLong, equipColor)
    }

    changeLegColor(isLong: boolean, colorHex: string) {
        if (isLong) {
            this.legSprite1.node.color = cc.Color.WHITE.fromHEX(colorHex)
            this.legSprite2.node.color = cc.Color.WHITE.fromHEX(colorHex)
            this.footprite1.node.color = cc.Color.WHITE.fromHEX(colorHex)
            this.footSprite2.node.color = cc.Color.WHITE.fromHEX(colorHex)
        } else {
            this.legSprite1.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
            this.legSprite2.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
            this.footprite1.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
            this.footSprite2.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
        }
    }
    private getSpriteChildSprite(node: cc.Node, childNames: string[]): cc.Sprite {
        for (let name of childNames) {
            node = node.getChildByName(name)
        }
        return node.getComponent(cc.Sprite)
    }
    addAttributeSelector(title: string, nameList: AttributeData[], defaultIndex: number, colorPick: boolean, defaultColors: string[]): AttributeSelector {
        let node = cc.instantiate(this.selectorPrefab)
        let script = node.getComponent(AttributeSelector)
        this.attributeLayout.addChild(node)
        script.init(title, nameList, defaultIndex, colorPick ? this.colorPicker : null, defaultColors)
        return script
    }
    addSimpleSpriteItem(resId: string, type: string, count: number) {
        AvatarSimpleSpriteItem.create(this.simpleSpritePrefab, this.equipItemLayout, resId, type, count, this)
    }
    private changeEquipmentByProfession(data: ProfessionData) {
        this.changeRes(this.helmetSprite, data.equips[InventoryManager.HELMET], 'anim0')
        this.changeRes(this.pantsSprite, data.equips[InventoryManager.TROUSERS])
        this.changeRes(this.cloakSprite, data.equips[InventoryManager.CLOAK])
        this.changeRes(this.weaponSprite, data.equips[InventoryManager.WEAPON])
        this.changeRes(this.remoteSprite, data.equips[InventoryManager.REMOTE], 'anim0')
        this.changeRes(this.shieldSprite, data.equips[InventoryManager.SHIELD])
        this.changeRes(this.clothesSprite, data.equips[InventoryManager.CLOTHES], 'anim0')
        this.changeRes(this.glovesSprite1, data.equips[InventoryManager.GLOVES])
        this.changeRes(this.glovesSprite2, data.equips[InventoryManager.GLOVES])
        this.changeRes(this.shoesSprite1, data.equips[InventoryManager.SHOES])
        this.changeRes(this.shoesSprite2, data.equips[InventoryManager.SHOES])
        this.resetSpriteSize(this.weaponSprite, 1)
        this.resetSpriteSize(this.remoteSprite, 0.5)
        this.resetSpriteSize(this.shieldSprite, 1)
        this.changeEquipment()
    }
    changeEquipment() {
        this.changeRes(this.helmetSprite, this.data.playerEquips[InventoryManager.HELMET]?.img, 'anim0', this.data.playerEquips[InventoryManager.HELMET]?.color)
        this.changeRes(this.pantsSprite, this.data.playerEquips[InventoryManager.TROUSERS]?.img, '', this.data.playerEquips[InventoryManager.TROUSERS]?.color)
        this.changeRes(this.cloakSprite, this.data.playerEquips[InventoryManager.CLOAK]?.img, '', this.data.playerEquips[InventoryManager.CLOAK]?.color)
        this.changeRes(this.weaponSprite, this.data.playerEquips[InventoryManager.WEAPON]?.img, '', this.data.playerEquips[InventoryManager.WEAPON]?.color)
        this.changeRes(this.remoteSprite, this.data.playerEquips[InventoryManager.REMOTE]?.img, 'anim0', this.data.playerEquips[InventoryManager.REMOTE]?.color)
        this.changeRes(this.shieldSprite, this.data.playerEquips[InventoryManager.SHIELD]?.img, '', this.data.playerEquips[InventoryManager.SHIELD]?.color)
        this.changeRes(this.clothesSprite, this.data.playerEquips[InventoryManager.CLOTHES]?.img, 'anim0', this.data.playerEquips[InventoryManager.CLOTHES]?.color)
        this.changeRes(this.glovesSprite1, this.data.playerEquips[InventoryManager.GLOVES]?.img, '', this.data.playerEquips[InventoryManager.GLOVES]?.color)
        this.changeRes(this.glovesSprite2, this.data.playerEquips[InventoryManager.GLOVES]?.img, '', this.data.playerEquips[InventoryManager.GLOVES]?.color)
        this.changeRes(this.shoesSprite1, this.data.playerEquips[InventoryManager.SHOES]?.img, '', this.data.playerEquips[InventoryManager.SHOES]?.color)
        this.changeRes(this.shoesSprite2, this.data.playerEquips[InventoryManager.SHOES]?.img, '', this.data.playerEquips[InventoryManager.SHOES]?.color)
        this.resetSpriteSize(this.weaponSprite, 1)
        this.resetSpriteSize(this.remoteSprite, 0.5)
        this.resetSpriteSize(this.shieldSprite, 1)
        this.changeSkinColor(cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor))
    }

    private changeRes(sprite: cc.Sprite, resName: string, subfix?: string, color?: string) {
        if (!sprite) {
            return false
        }
        let spriteFrame = Logic.spriteFrameRes(resName)
        if (subfix && Logic.spriteFrameRes(resName + subfix)) {
            spriteFrame = Logic.spriteFrameRes(resName + subfix)
        }
        if (spriteFrame) {
            sprite.spriteFrame = spriteFrame
        } else {
            sprite.spriteFrame = null
        }
        if (color && color.length > 0) {
            let c = cc.color(255, 255, 255).fromHEX(color)
            sprite.node.color = c
        }
    }
    private resetSpriteSize(sprite: cc.Sprite, ratio: number) {
        if (sprite.spriteFrame) {
            sprite.node.width = sprite.spriteFrame.getOriginalSize().width * ratio
            sprite.node.height = sprite.spriteFrame.getOriginalSize().height * ratio
        }
    }
    update(dt) {
        if (this.isTimeDelay(dt) && this.randomTouched) {
            this.randomButton.angle = 0
            cc.tween(this.randomButton).to(0.2, { angle: 360 }).start()
            this.ButtonRandom()
        }
    }
    private delayTime = 0
    private isTimeDelay(dt: number): boolean {
        this.delayTime += dt
        if (this.delayTime > 0.2) {
            this.delayTime = 0
            return true
        }
        return false
    }
    //button
    backToList() {
        cc.director.loadScene('avatarlist')
    }
    //button
    ButtonRandom() {
        this.organizationSelector.selectRandom()
        this.professionSelector.selectRandom()
        this.skinSelector.selectRandom(this.skinSelector.currentIndex == 0)
        this.hairSelector.selectRandom()
        this.eyesSelector.selectRandom()
        this.faceSelector.selectRandom()
        this.petSelector.selectRandom()
    }
    selectTarget() {
        this.organizationSelector.selectTarget(AvatarData.ORGANIZATION[this.data.AvatarData.organizationIndex])
        this.professionSelector.selectTarget(this.data.AvatarData.professionData.id + '')
        this.skinSelector.selectTarget('', cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor))
        this.hairSelector.selectTarget(this.data.AvatarData.hairResName, cc.Color.WHITE.fromHEX(this.data.AvatarData.hairColor))
        this.eyesSelector.selectTarget(this.data.AvatarData.eyesResName, cc.Color.WHITE.fromHEX(this.data.AvatarData.eyesColor))
        this.faceSelector.selectTarget(this.data.AvatarData.faceResName, cc.Color.WHITE.fromHEX(this.data.AvatarData.faceColor))
        this.petSelector.selectTarget(this.data.AvatarData.petName)
    }
    //button
    saveData() {
        if (this.editTitle.string.length > 0) {
            this.data.name = this.editTitle.string
            this.data.desc = this.editDesc.string
            this.jsCallAndroid.savePlayerDataById(this.data)
            this.backToList()
        } else {
            cc.tween(this.editTitle.node).to(0.2, { scale: 1.2 }).to(0.2, { scale: 1 }).start()
        }
    }

    setSpriteFrame(id: string, sprite: cc.Sprite) {
        let spriteFrame = Logic.spriteFrameRes(id)
        let data = new EquipmentData()
        data.valueCopy(Logic.equipments[id])
        if (data.equipmentType == InventoryManager.CLOTHES) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (data.equipmentType == InventoryManager.HELMET) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (data.equipmentType == InventoryManager.REMOTE) {
            spriteFrame = Logic.spriteFrameRes(data.img + 'anim0')
        } else if (data.equipmentType != InventoryManager.EMPTY) {
            spriteFrame = Logic.spriteFrameRes(data.img)
        } else {
            let itemData = new ItemData()
            itemData.valueCopy(Logic.items[id])
            if (itemData.resName != Item.EMPTY) {
                spriteFrame = Logic.spriteFrameRes(itemData.resName)
            }
        }
        if (spriteFrame) {
            sprite.spriteFrame = spriteFrame
            let w = spriteFrame.getOriginalSize().width
            let h = spriteFrame.getOriginalSize().height
            sprite.node.width = w * 4
            sprite.node.height = h * 4
            let size = 48
            if (sprite.node.height > size) {
                sprite.node.height = size
                sprite.node.width = (size / spriteFrame.getOriginalSize().height) * spriteFrame.getOriginalSize().width
            }
        }
    }
}
