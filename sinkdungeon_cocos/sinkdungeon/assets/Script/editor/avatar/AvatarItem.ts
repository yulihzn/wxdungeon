// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import AvatarData from '../../data/AvatarData'
import EquipmentData from '../../data/EquipmentData'
import PlayerData from '../../data/PlayerData'
import ProfessionData from '../../data/ProfessionData'
import Logic from '../../logic/Logic'
import InventoryManager from '../../manager/InventoryManager'
import LoadingManager from '../../manager/LoadingManager'

//任务卡片
const { ccclass, property } = cc._decorator

@ccclass
export default class AvatarItem extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null
    cloakSprite: cc.Sprite = null
    legLeftSprite: cc.Sprite = null
    legRightSprite: cc.Sprite = null
    footLeftSprite: cc.Sprite = null
    footRightSprite: cc.Sprite = null
    shoesLeftSprite: cc.Sprite = null
    shoesRightSprite: cc.Sprite = null
    handLeftSprite: cc.Sprite = null
    glovesLeftSprite: cc.Sprite = null
    handRightSprite: cc.Sprite = null
    glovesRightSprite: cc.Sprite = null
    headSprite: cc.Sprite = null
    faceSprite: cc.Sprite = null
    eyesSprite: cc.Sprite = null
    hairSprite: cc.Sprite = null
    helmetSprite: cc.Sprite = null
    bodySprite: cc.Sprite = null
    pantsSprite: cc.Sprite = null
    clothesSprite: cc.Sprite = null
    private petSprite: cc.Sprite = null
    private weaponSprite: cc.Sprite = null
    private remoteSprite: cc.Sprite = null
    private shieldSprite: cc.Sprite = null
    private isInit = false
    private data: PlayerData = new PlayerData()
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            Logic.currentEditPlayerData.valueCopy(this.data)
            cc.director.loadScene('avatareditor')
        })
    }
    static create(prefab: cc.Prefab, parent: cc.Node, data: PlayerData): AvatarItem {
        let avatar = cc.instantiate(prefab).getComponent(AvatarItem)
        avatar.node.parent = parent
        avatar.node.zIndex = 0
        avatar.init(data)
        return avatar
    }
    public init(data: PlayerData) {
        if (this.isInit) {
            return
        }
        this.isInit = true
        this.data = new PlayerData()
        this.data.valueCopy(data)
        this.petSprite = this.getSpriteChildSprite(['pet'])
        this.cloakSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'cloak'])
        this.legLeftSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'legleft'])
        this.legRightSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'legright'])
        this.footLeftSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'legleft', 'foot'])
        this.footRightSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'legright', 'foot'])
        this.shoesLeftSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'legleft', 'foot', 'shoes'])
        this.shoesRightSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'legright', 'foot', 'shoes'])
        this.handLeftSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'handleft'])
        this.handRightSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'handright'])
        this.glovesLeftSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'handleft', 'gloves'])
        this.glovesRightSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'handright', 'gloves'])
        this.headSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'head'])
        this.faceSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'head', 'face'])
        this.eyesSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'head', 'eyes'])
        this.hairSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'head', 'hair'])
        this.helmetSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'head', 'helmet'])
        this.bodySprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'body'])
        this.pantsSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'body', 'pants'])
        this.clothesSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'body', 'clothes'])
        this.weaponSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'weapon'])
        this.remoteSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'remote'])
        this.shieldSprite = this.getSpriteChildSprite(['avatar', 'sprite', 'avatar', 'shield'])
        this.headSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
        this.faceSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.faceColor)
        this.faceSprite.node.opacity = 128
        let eyeColor = cc.Color.WHITE.fromHEX(this.data.AvatarData.eyesColor)
        this.eyesSprite.getMaterial(0).setProperty('eyeColor', eyeColor)
        this.hairSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.hairColor)
        this.bodySprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
        this.legLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
        this.legRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
        this.footLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
        this.footRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
        this.handLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
        this.handRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
        this.hairSprite.node.stopAllActions()
        this.updateSpriteFrameAnim(this.faceSprite, this.data.AvatarData.faceResName, 1)
        this.updateSpriteFrameAnim(this.hairSprite, this.data.AvatarData.hairResName, 2)
        this.updateSpriteFrameAnim(this.eyesSprite, this.data.AvatarData.eyesResName, 1)
        this.label.string = this.data.name
        this.changeEquipmentByProfession(this.data.AvatarData.professionData)
        if (this.data.AvatarData.organizationIndex == AvatarData.HUNTER) {
            LoadingManager.loadNpcSpriteAtlas(this.data.AvatarData.petName, () => {
                this.petSprite.spriteFrame = Logic.spriteFrameRes(this.data.AvatarData.petName + 'anim000')
            })
        }
        this.changeEquipment()
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
    getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node
        for (let name of childNames) {
            node = node.getChildByName(name)
        }
        return node.getComponent(cc.Sprite)
    }
    private updateSpriteFrameAnim(sprite: cc.Sprite, resName: string, animCount: number) {
        let resLength = animCount && animCount != 0 ? animCount : 1
        sprite.unscheduleAllCallbacks()
        let index = 0
        sprite.schedule(
            () => {
                let start = 0
                sprite.spriteFrame = Logic.spriteFrameRes(`${resName}anim${start + index++}`)
                if (index > resLength - 1) {
                    index = 0
                }
            },
            0.2,
            cc.macro.REPEAT_FOREVER,
            0.1
        )
    }
    private changeEquipmentByProfession(data: ProfessionData) {
        this.changeRes(this.helmetSprite, data.equips[InventoryManager.HELMET], 'anim0')
        this.changeRes(this.pantsSprite, data.equips[InventoryManager.TROUSERS])
        this.changeRes(this.cloakSprite, data.equips[InventoryManager.CLOAK])
        this.changeRes(this.weaponSprite, data.equips[InventoryManager.WEAPON])
        this.changeRes(this.remoteSprite, data.equips[InventoryManager.REMOTE], 'anim0')
        this.changeRes(this.shieldSprite, data.equips[InventoryManager.SHIELD])
        this.changeRes(this.clothesSprite, data.equips[InventoryManager.CLOTHES], 'anim0')
        this.changeRes(this.glovesLeftSprite, data.equips[InventoryManager.GLOVES])
        this.changeRes(this.glovesRightSprite, data.equips[InventoryManager.GLOVES])
        this.changeRes(this.shoesLeftSprite, data.equips[InventoryManager.SHOES])
        this.changeRes(this.shoesRightSprite, data.equips[InventoryManager.SHOES])
        this.resetSpriteSize(this.weaponSprite)
        this.resetSpriteSize(this.remoteSprite)
        this.resetSpriteSize(this.shieldSprite)
    }
    private changeEquipment() {
        this.changeRes(this.helmetSprite, this.data.playerEquips[InventoryManager.HELMET]?.img, 'anim0', this.data.playerEquips[InventoryManager.HELMET]?.color)
        this.changeRes(this.pantsSprite, this.data.playerEquips[InventoryManager.TROUSERS]?.img, '', this.data.playerEquips[InventoryManager.TROUSERS]?.color)
        this.changeRes(this.cloakSprite, this.data.playerEquips[InventoryManager.CLOAK]?.img, '', this.data.playerEquips[InventoryManager.CLOAK]?.color)
        this.changeRes(this.weaponSprite, this.data.playerEquips[InventoryManager.WEAPON]?.img, '', this.data.playerEquips[InventoryManager.WEAPON]?.color)
        this.changeRes(this.remoteSprite, this.data.playerEquips[InventoryManager.REMOTE]?.img, 'anim0', this.data.playerEquips[InventoryManager.REMOTE]?.color)
        this.changeRes(this.shieldSprite, this.data.playerEquips[InventoryManager.SHIELD]?.img, '', this.data.playerEquips[InventoryManager.SHIELD]?.color)
        this.changeRes(this.clothesSprite, this.data.playerEquips[InventoryManager.CLOTHES]?.img, 'anim0', this.data.playerEquips[InventoryManager.CLOTHES]?.color)
        this.changeRes(this.glovesLeftSprite, this.data.playerEquips[InventoryManager.GLOVES]?.img, '', this.data.playerEquips[InventoryManager.GLOVES]?.color)
        this.changeRes(this.glovesRightSprite, this.data.playerEquips[InventoryManager.GLOVES]?.img, '', this.data.playerEquips[InventoryManager.GLOVES]?.color)
        this.changeRes(this.shoesLeftSprite, this.data.playerEquips[InventoryManager.SHOES]?.img, '', this.data.playerEquips[InventoryManager.SHOES]?.color)
        this.changeRes(this.shoesRightSprite, this.data.playerEquips[InventoryManager.SHOES]?.img, '', this.data.playerEquips[InventoryManager.SHOES]?.color)
        this.resetSpriteSize(this.weaponSprite)
        this.resetSpriteSize(this.remoteSprite)
        this.resetSpriteSize(this.shieldSprite)
    }
    changeLegColor(isLong: boolean, colorHex: string) {
        if (isLong) {
            this.legLeftSprite.node.color = cc.Color.WHITE.fromHEX(colorHex)
            this.legRightSprite.node.color = cc.Color.WHITE.fromHEX(colorHex)
            this.footLeftSprite.node.color = cc.Color.WHITE.fromHEX(colorHex)
            this.footRightSprite.node.color = cc.Color.WHITE.fromHEX(colorHex)
        } else {
            this.legLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
            this.legRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
            this.footLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
            this.footRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.AvatarData.skinColor)
        }
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
    private resetSpriteSize(sprite: cc.Sprite) {
        if (sprite.spriteFrame) {
            sprite.node.width = sprite.spriteFrame.getOriginalSize().width
            sprite.node.height = sprite.spriteFrame.getOriginalSize().height
        }
    }
}
