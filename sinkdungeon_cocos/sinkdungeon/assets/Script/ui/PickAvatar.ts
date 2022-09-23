// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from '../logic/Logic'
import AudioPlayer from '../utils/AudioPlayer'
import AttributeSelector from './AttributeSelector'
import AttributeData from '../data/AttributeData'
import BrightnessBar from './BrightnessBar'
import PaletteSelector from './PaletteSelector'
import AvatarData from '../data/AvatarData'
import ProfessionData from '../data/ProfessionData'
import EquipmentManager from '../manager/EquipmentManager'
import InventoryManager from '../manager/InventoryManager'
import LoadingManager from '../manager/LoadingManager'
import LoadingIcon from './LoadingIcon'
import Utils from '../utils/Utils'
import EquipmentData from '../data/EquipmentData'
import CursorArea from './CursorArea'
import LocalStorage from '../utils/LocalStorage'
import ProfileManager from '../manager/ProfileManager'
import ExitData from '../data/ExitData'
import SavePointData from '../data/SavePointData'

const { ccclass, property } = cc._decorator

@ccclass
export default class PickAvatar extends cc.Component {
    readonly SELECTOR_ORGANIZATION = 0
    readonly SELECTOR_GENGER = 1
    readonly SELECTOR_HAIR = 2
    readonly COLOR_PATTLE_HAIR = 3
    readonly SELECTOR_EYES = 4
    readonly COLOR_PATTLE_EYES = 5
    readonly SELECTOR_FACE = 6
    readonly COLOR_PATTLE_FACE = 7
    readonly SELECTOR_BODY = 8
    readonly PROGRESS_SKIN_COLOR = 9
    readonly SELECTOR_PROFESSION = 10
    @property(cc.Node)
    loadingBackground: cc.Node = null
    @property(cc.Node)
    avatarTable: cc.Node = null
    @property(cc.Node)
    attributeLayout: cc.Node = null
    @property(cc.Node)
    randomLayout: cc.Node = null
    @property(cc.Label)
    randomLabelTitle: cc.Label = null
    @property(cc.Label)
    randomLabelName: cc.Label = null
    @property(cc.Label)
    randomLabelDesc: cc.Label = null
    @property(cc.Label)
    randomLabelSkillName: cc.Label = null
    @property(cc.Label)
    randomLabelSkillDesc: cc.Label = null
    @property(cc.Node)
    randomButton: cc.Node = null
    @property(cc.Prefab)
    selectorPrefab: cc.Prefab = null
    @property(cc.Prefab)
    brightnessBarPrefab: cc.Prefab = null
    @property(cc.Prefab)
    palettePrefab: cc.Prefab = null
    @property(cc.Prefab)
    loadingIconPrefab: cc.Prefab = null
    @property(cc.Prefab)
    cursorAreaPrefab: cc.Prefab = null

    private bedSprite: cc.Sprite
    private coverSprite: cc.Sprite
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
    private skinSelector: BrightnessBar
    private hairSelector: AttributeSelector
    private hairColorSelector: PaletteSelector
    private eyesSelector: AttributeSelector
    private eyesColorSelector: PaletteSelector
    private faceSelector: AttributeSelector
    private faceColorSelector: PaletteSelector
    private petSelector: AttributeSelector
    private data: AvatarData

    private randomTouched = false
    private isShow = false
    private loadingManager: LoadingManager = new LoadingManager()
    private loadingIcon: LoadingIcon

    onLoad() {
        CursorArea.init(this.cursorAreaPrefab)
        this.loadingManager.init()
        this.data = new AvatarData()
        this.bedSprite = this.getSpriteChildSprite(this.avatarTable, ['bed'])
        this.coverSprite = this.getSpriteChildSprite(this.avatarTable, ['cover'])
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
        this.loadingBackground.active = true
        this.loadingIcon = cc.instantiate(this.loadingIconPrefab).getComponent(LoadingIcon)
        this.loadingIcon.node.parent = this.loadingBackground
        this.loadingIcon.init([LoadingIcon.TYPE_TEXTURE, LoadingIcon.TYPE_EQUIP])
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_TEXTURES, 'singleColor')
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_EQUIPMENT, 'emptyequipment')
        this.loadingManager.loadProfession()
        this.loadingManager.loadEquipment()
        this.loadingManager.loadTalents()
        this.loadingManager.loadItems()
        this.loadingManager.loadSuits()
        this.attributeLayout.active = false
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
    }
    private getSpriteChildSprite(node: cc.Node, childNames: string[]): cc.Sprite {
        for (let name of childNames) {
            node = node.getChildByName(name)
        }
        return node.getComponent(cc.Sprite)
    }

    show() {
        this.isShow = true
        if (this.loadingIcon && this.loadingIcon.isFirst) {
            cc.tween(this.loadingBackground)
                .to(0.5, { opacity: 0 })
                .call(() => {
                    this.loadingBackground.active = false
                })
                .start()
        } else {
            this.loadingBackground.active = false
        }
        //组织
        let organList = new Array()
        for (let i = 0; i < AvatarData.ORGANIZATION.length; i++) {
            organList.push(new AttributeData(i, AvatarData.ORGANIZATION[i], '', '', '', ''))
        }
        this.organizationSelector = this.addAttributeSelector('组织：', organList)
        this.organizationSelector.selectorCallback = (data: AttributeData) => {
            this.data.organizationIndex = data.id
            this.bedSprite.spriteFrame = Logic.spriteFrameRes(`avatarbed00${data.id}`)
            this.coverSprite.spriteFrame = Logic.spriteFrameRes(`avatarcover00${data.id}`)
            this.randomLabelTitle.string = data.name
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
        this.professionSelector = this.addAttributeSelector('职业：', professionList)
        this.professionSelector.selectorCallback = (data: AttributeData) => {
            this.data.professionData.valueCopy(Logic.professionList[data.id])
            this.randomLabelName.string = `${data.name}`
            this.randomLabelDesc.string = `${data.desc}`
            this.randomLabelSkillName.string = `${data.name1}`
            this.randomLabelSkillDesc.string = `${data.desc1}`
            this.changeEquipment(Logic.professionList[data.id])
        }

        //皮肤颜色
        this.skinSelector = this.addBrightnessBar()
        this.skinSelector.setSelectorCallback((color: cc.Color) => {
            this.bodySprite.node.color = color
            this.headSprite.node.color = color
            this.handSprite1.node.color = color
            this.handSprite2.node.color = color
            this.legSprite1.node.color = color
            this.legSprite2.node.color = color
            this.data.skinColor = color.toHEX('#rrggbb')
        })
        //发型
        let hairList = []
        for (let i = 0; i < 10; i++) {
            hairList.push(new AttributeData(i, `样式${i}`, `avatarhair${Utils.getNumberStr3(i)}`, '', '', ''))
        }
        this.hairSelector = this.addAttributeSelector('发型：', hairList)
        this.hairSelector.selectorCallback = (data: AttributeData) => {
            this.hairSprite.spriteFrame = Logic.spriteFrameRes(data.resName + 'anim0')
            this.data.hairResName = data.resName
        }
        //头发颜色
        this.hairColorSelector = this.addPaletteSelector(PaletteSelector.TYPE_HAIR)
        this.hairColorSelector.setSelectorCallback((color: cc.Color) => {
            this.hairSprite.node.color = color
            this.data.hairColor = color.toHEX('#rrggbb')
        })
        //眼睛
        let eyesList = []
        for (let i = 0; i < 22; i++) {
            eyesList.push(new AttributeData(i, `样式${i}`, `avatareyes${Utils.getNumberStr3(i)}`, '', '', ''))
        }
        this.eyesSelector = this.addAttributeSelector('眼睛：', eyesList)
        this.eyesSelector.selectorCallback = (data: AttributeData) => {
            this.eyesSprite.spriteFrame = Logic.spriteFrameRes(data.resName + 'anim0')
            this.data.eyesResName = data.resName
        }
        //眼睛颜色
        this.eyesColorSelector = this.addPaletteSelector(PaletteSelector.TYPE_EYES)
        this.eyesColorSelector.setSelectorCallback((color: cc.Color) => {
            this.eyesSprite.getMaterial(0).setProperty('eyeColor', color)
            this.data.eyesColor = color.toHEX('#rrggbb')
        })
        //面颊
        let faceList = []
        for (let i = 0; i < 15; i++) {
            faceList.push(new AttributeData(i, `样式${i}`, `avatarface${Utils.getNumberStr3(i)}`, '', '', ''))
        }
        this.faceSelector = this.addAttributeSelector('面颊：', faceList)
        this.faceSelector.selectorCallback = (data: AttributeData) => {
            this.faceSprite.spriteFrame = Logic.spriteFrameRes(data.resName + 'anim0')
            this.data.faceResName = data.resName
        }
        //脸部颜色
        this.faceColorSelector = this.addPaletteSelector(PaletteSelector.TYPE_FACE)
        this.faceColorSelector.setSelectorCallback((color: cc.Color) => {
            this.faceSprite.node.color = color
            this.faceSprite.node.opacity = 128
            this.data.faceColor = color.toHEX('#rrggbb')
        })
        //宠物
        // let petNames = ['柯基', '鹦鹉', '橘子鱼', '天竺鼠', '巴西龟', '变色龙', '刺猬', '火玫瑰蜘蛛', '安哥拉兔', '科尔鸭', '巴马香猪'];
        let petNames = ['柯基', '家猫', '橙子鱼']
        let petList = []
        for (let i = 0; i < petNames.length; i++) {
            petList.push(new AttributeData(i, `${petNames[i]}`, `nonplayer1${Utils.getNumberStr2(i)}`, '', '', ''))
        }
        this.petSelector = this.addAttributeSelector('宠物：', petList)
        this.petSelector.selectorCallback = (data: AttributeData) => {
            LoadingManager.loadNpcSpriteAtlas(data.resName, () => {
                this.petSprite.spriteFrame = Logic.spriteFrameRes(data.resName + 'anim000')
            })
            this.data.petName = `nonplayer1${Utils.getNumberStr2(data.id)}`
        }
        this.petSelector.node.active = this.organizationSelector.CurrentData.id == AvatarData.HUNTER
        this.petSprite.node.active = this.organizationSelector.CurrentData.id == AvatarData.HUNTER

        this.ButtonRandom()
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

    private resetSpriteSize(sprite: cc.Sprite) {
        if (sprite.spriteFrame) {
            sprite.node.width = sprite.spriteFrame.getOriginalSize().width
            sprite.node.height = sprite.spriteFrame.getOriginalSize().height
        }
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
    startGame() {
        if (!this.isShow) {
            return
        }
        //清除存档
        ProfileManager.clearData(Logic.jumpSlotIndex)
        //重置数据
        Logic.resetData(Logic.jumpChapter)
        //加载资源
        AudioPlayer.play(AudioPlayer.SELECT)
        Logic.playerData.AvatarData = this.data.clone()
        let data = new SavePointData()
        switch (Logic.jumpChapter) {
            case Logic.CHAPTER01:
                data = SavePointData.chapter01()
                break
            case Logic.CHAPTER02:
                data = SavePointData.chapter02()
                break
            case Logic.CHAPTER03:
                data = SavePointData.chapter03()
                break
            case Logic.CHAPTER04:
                data = SavePointData.chapter04()
                break
        }
        Logic.loadingNextLevel(ExitData.getDreamExitDataFromReal(data))
        Logic.jumpChapter = 0
        this.addPorfessionEquipment()
    }
    backToHome() {
        cc.director.loadScene('start')
        AudioPlayer.play(AudioPlayer.SELECT)
    }
    addPorfessionEquipment() {
        let equips: { [key: string]: EquipmentData } = {}
        for (let key in Logic.inventoryManager.equips) {
            Logic.inventoryManager.equips[key].valueCopy(EquipmentManager.getNewEquipData(this.data.professionData.equips[key] ? this.data.professionData.equips[key] : ''))
            if (key == InventoryManager.TROUSERS) {
                equips[key] = Logic.inventoryManager.equips[key].clone()
            }
        }
        Logic.profileManager.data.playerEquipsReality = equips
    }
    addBrightnessBar(): BrightnessBar {
        let prefab = cc.instantiate(this.brightnessBarPrefab)
        let script = prefab.getComponent(BrightnessBar)
        this.attributeLayout.addChild(prefab)
        return script
    }
    addAttributeSelector(title: string, nameList: AttributeData[], defaultIndex?: number): AttributeSelector {
        let prefab = cc.instantiate(this.selectorPrefab)
        let script = prefab.getComponent(AttributeSelector)
        this.attributeLayout.addChild(prefab)
        script.init(title, nameList, defaultIndex)
        return script
    }
    addPaletteSelector(colorType: number, defaultIndex?: number): PaletteSelector {
        let prefab = cc.instantiate(this.palettePrefab)
        let script = prefab.getComponent(PaletteSelector)
        this.attributeLayout.addChild(prefab)
        script.init(colorType, defaultIndex)
        return script
    }
    update(dt) {
        if (
            this.loadingManager.isSpriteFramesLoaded(LoadingManager.KEY_TEXTURES) &&
            this.loadingManager.isSpriteFramesLoaded(LoadingManager.KEY_EQUIPMENT) &&
            this.loadingManager.isProfessionLoaded &&
            this.loadingManager.isEquipmentLoaded &&
            this.loadingManager.isSkillsLoaded &&
            this.loadingManager.isItemsLoaded &&
            this.loadingManager.isSuitsLoaded
        ) {
            this.loadingManager.reset()
            this.show()
        }
        if (this.isShow) {
            if (this.isTimeDelay(dt) && this.randomTouched) {
                this.randomButton.angle = 0
                cc.tween(this.randomButton).to(0.2, { angle: 360 }).start()
                this.ButtonRandom()
            }
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
    ButtonSwitch() {
        if (!this.isShow) {
            return
        }
        this.randomLayout.active = this.randomLayout.active ? false : true
        this.attributeLayout.active = this.attributeLayout.active ? false : true
        AudioPlayer.play(AudioPlayer.SELECT)
    }
    ButtonRandom() {
        if (!this.isShow) {
            return
        }
        this.organizationSelector.selectRandom()
        this.professionSelector.selectRandom()
        this.skinSelector.selectRandom()
        this.hairSelector.selectRandom()
        this.hairColorSelector.selectRandom()
        this.eyesSelector.selectRandom()
        this.eyesColorSelector.selectRandom()
        this.faceSelector.selectRandom()
        this.faceColorSelector.selectRandom()
        this.petSelector.selectRandom()
        AudioPlayer.play(AudioPlayer.SELECT)
    }
    ButtonSelect(event: cc.Event, isLeft: number) {
        if (!this.isShow) {
            return
        }
        this.professionSelector.selectNext(isLeft == 0)
        AudioPlayer.play(AudioPlayer.SELECT)
    }
}
