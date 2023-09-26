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
import ProfessionData from '../../data/ProfessionData'
import Logic from '../../logic/Logic'
import InventoryManager from '../../manager/InventoryManager'
import LoadingManager from '../../manager/LoadingManager'
import AttributeSelector from '../../ui/AttributeSelector'
import BrightnessBar from '../../ui/BrightnessBar'
import ColorPicker from '../../ui/ColorPicker'
import PaletteSelector from '../../ui/PaletteSelector'
import Utils from '../../utils/Utils'

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
    @property(cc.Node)
    attributeLayout: cc.Node = null
    private bodySprite: cc.Sprite
    private headSprite: cc.Sprite
    private hairSprite: cc.Sprite
    private eyesSprite: cc.Sprite
    private faceSprite: cc.Sprite
    private handSprite1: cc.Sprite
    private handSprite2: cc.Sprite
    private legSprite1: cc.Sprite
    private legSprite2: cc.Sprite
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
    private data: AvatarData = new AvatarData()
    private randomTouched = false

    onLoad() {
        this.petSprite = this.getSpriteChildSprite(this.avatarTable, ['pet'])
        this.bodySprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body'])
        this.handSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'hand1'])
        this.handSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'hand2'])
        this.legSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'leg1'])
        this.legSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'leg2'])
        this.headSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'head'])
        this.hairSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'head', 'hair'])
        this.faceSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'head', 'face'])
        this.eyesSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'head', 'eyes'])
        this.helmetSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'head', 'helmet'])
        this.pantsSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'pants'])
        this.cloakSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'cloak'])
        this.weaponSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'weapon'])
        this.remoteSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'remote'])
        this.shieldSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'shield'])
        this.clothesSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'clothes'])
        this.glovesSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'hand1', 'gloves'])
        this.glovesSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'hand2', 'gloves'])
        this.shoesSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'leg1', 'shoes'])
        this.shoesSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'leg2', 'shoes'])
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
            this.data.organizationIndex = data.id
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
            professionList.push(new AttributeData(data.id, data.nameCn, '', data.desc, `技能：${talent.nameCn}`, `${talent.desc}`))
        }
        this.professionSelector = this.addAttributeSelector('职业：', professionList, 0, false, [])
        this.professionSelector.selectorCallback = (data: AttributeData, color: cc.Color) => {
            this.data.professionData.valueCopy(Logic.professionList[data.id])
            // this.randomLabelName.string = `${data.name}`
            // this.randomLabelDesc.string = `${data.desc}`
            // this.randomLabelSkillName.string = `${data.name1}`
            // this.randomLabelSkillDesc.string = `${data.desc1}`
            this.changeEquipment(Logic.professionList[data.id])
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
            this.bodySprite.node.color = color
            this.headSprite.node.color = color
            this.handSprite1.node.color = color
            this.handSprite2.node.color = color
            this.legSprite1.node.color = color
            this.legSprite2.node.color = color
            this.data.skinColor = color.toHEX('#rrggbb')
        }
        //发型
        let hairList = []
        for (let i = 0; i < 10; i++) {
            hairList.push(new AttributeData(i, `样式${i}`, `avatarhair${Utils.getNumberStr3(i)}`, '', '', ''))
        }
        this.hairSelector = this.addAttributeSelector('发型：', hairList, 0, true, PaletteSelector.HAIRCOLORS)
        this.hairSelector.selectorCallback = (data: AttributeData, color: cc.Color) => {
            this.hairSprite.spriteFrame = Logic.spriteFrameRes(data.resName + 'anim0')
            this.data.hairResName = data.resName
            this.hairSprite.node.color = color
            this.data.hairColor = color.toHEX('#rrggbb')
        }
        //眼睛
        let eyesList = []
        for (let i = 0; i < 22; i++) {
            eyesList.push(new AttributeData(i, `样式${i}`, `avatareyes${Utils.getNumberStr3(i)}`, '', '', ''))
        }
        this.eyesSelector = this.addAttributeSelector('眼睛：', eyesList, 0, true, PaletteSelector.EYESCOLORS)
        this.eyesSelector.selectorCallback = (data: AttributeData, color: cc.Color) => {
            this.eyesSprite.spriteFrame = Logic.spriteFrameRes(data.resName + 'anim0')
            this.data.eyesResName = data.resName
            this.eyesSprite.getMaterial(0).setProperty('eyeColor', color)
            this.data.eyesColor = color.toHEX('#rrggbb')
        }
        //面颊
        let faceList = []
        for (let i = 0; i < 15; i++) {
            faceList.push(new AttributeData(i, `样式${i}`, `avatarface${Utils.getNumberStr3(i)}`, '', '', ''))
        }
        this.faceSelector = this.addAttributeSelector('面颊：', faceList, 0, true, PaletteSelector.FACECOLORS)
        this.faceSelector.selectorCallback = (data: AttributeData, color: cc.Color) => {
            this.faceSprite.spriteFrame = Logic.spriteFrameRes(data.resName + 'anim0')
            this.data.faceResName = data.resName
            this.faceSprite.node.color = color
            this.faceSprite.node.opacity = 128
            this.data.faceColor = color.toHEX('#rrggbb')
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
            this.data.petName = `nonplayer1${Utils.getNumberStr2(data.id)}`
        }
        this.petSelector.node.active = this.organizationSelector.CurrentData.id == AvatarData.HUNTER
        this.petSprite.node.active = this.organizationSelector.CurrentData.id == AvatarData.HUNTER

        this.ButtonRandom()
    }
    private getSpriteChildSprite(node: cc.Node, childNames: string[]): cc.Sprite {
        for (let name of childNames) {
            node = node.getChildByName(name)
        }
        return node.getComponent(cc.Sprite)
    }
    addAttributeSelector(title: string, nameList: AttributeData[], defaultIndex: number, colorPick: boolean, defaultColors: string[]): AttributeSelector {
        let prefab = cc.instantiate(this.selectorPrefab)
        let script = prefab.getComponent(AttributeSelector)
        this.attributeLayout.addChild(prefab)
        script.init(title, nameList, defaultIndex, colorPick ? this.colorPicker : null, defaultColors)
        return script
    }
    private changeEquipment(data: ProfessionData) {
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
        this.resetSpriteSize(this.weaponSprite)
        this.resetSpriteSize(this.remoteSprite)
        this.resetSpriteSize(this.shieldSprite)
    }
    private changeRes(sprite: cc.Sprite, resName: string, subfix?: string) {
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
    }
    private resetSpriteSize(sprite: cc.Sprite) {
        if (sprite.spriteFrame) {
            sprite.node.width = sprite.spriteFrame.getOriginalSize().width
            sprite.node.height = sprite.spriteFrame.getOriginalSize().height
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
    ButtonRandom() {
        this.organizationSelector.selectRandom()
        this.professionSelector.selectRandom()
        this.skinSelector.selectRandom(this.skinSelector.currentIndex == 0)
        this.hairSelector.selectRandom()
        // this.hairColorSelector.selectRandom()
        this.eyesSelector.selectRandom()
        // this.eyesColorSelector.selectRandom()
        this.faceSelector.selectRandom()
        // this.faceColorSelector.selectRandom()
        this.petSelector.selectRandom()
    }
}
