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
import PlayerData from '../../data/PlayerData'
import Logic from '../../logic/Logic'

//任务卡片
const { ccclass, property } = cc._decorator

@ccclass
export default class AvatarItem extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null
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
    private isInit = false
    private data: PlayerData = new PlayerData()
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            cc.director.loadScene('avatareditor')
        })
        this.cloakSprite = this.getSpriteChildSprite(['sprite', 'cloak'])
        this.legLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft'])
        this.legRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright'])
        this.footLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft', 'foot'])
        this.footRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright', 'foot'])
        this.shoesLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft', 'foot', 'shoes'])
        this.shoesRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright', 'foot', 'shoes'])
        this.handLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'handleft'])
        this.handRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'handright'])
        this.glovesLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'handleft', 'gloves'])
        this.glovesRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'handright', 'gloves'])
        this.headSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head'])
        this.faceSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'face'])
        this.eyesSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'eyes'])
        this.hairSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'hair'])
        this.helmetSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'helmet'])
        this.bodySprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body'])
        this.pantsSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body', 'pants'])
        this.clothesSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body', 'clothes'])
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
        this.cloakSprite = this.getSpriteChildSprite(['sprite', 'cloak'])
        this.legLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft'])
        this.legRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright'])
        this.footLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft', 'foot'])
        this.footRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright', 'foot'])
        this.shoesLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legleft', 'foot', 'shoes'])
        this.shoesRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'legright', 'foot', 'shoes'])
        this.handLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'handleft'])
        this.handRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'handright'])
        this.glovesLeftSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'handleft', 'gloves'])
        this.glovesRightSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'handright', 'gloves'])
        this.headSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head'])
        this.faceSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'face'])
        this.eyesSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'eyes'])
        this.hairSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'hair'])
        this.helmetSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'head', 'helmet'])
        this.bodySprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body'])
        this.pantsSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body', 'pants'])
        this.clothesSprite = this.getSpriteChildSprite(['sprite', 'avatar', 'body', 'clothes'])
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
}
