// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from "./Logic"
import InventoryManager from "../manager/InventoryManager"
import AvatarData from "../data/AvatarData"
import AudioPlayer from "../utils/AudioPlayer"

const { ccclass, property } = cc._decorator

@ccclass
export default class PlayerAvatar extends cc.Component {
    static readonly DIR_UP = 0
    static readonly DIR_DOWN = 1
    static readonly DIR_LEFT = 2
    static readonly DIR_RIGHT = 3
    static readonly STATE_IDLE = 0
    static readonly STATE_WALK = 1
    static readonly STATE_ATTACK = 2
    static readonly STATE_FALL = 3
    static readonly STATE_DIE = 4
    static readonly STATE_JUMP = 5
    dir = PlayerAvatar.DIR_RIGHT
    status = PlayerAvatar.STATE_IDLE
    anim: cc.Animation
    shadowSprite: cc.Sprite = null
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
    avatarNode: cc.Node = null
    spriteNode: cc.Node = null
    data: AvatarData
    isAniming = false
    idlehair = [0, 1]
    private clothesLength = 1//衣服动画长度
    private helmetLeghth = 1//头盔动画长度


    onLoad() {
        this.init()
    }
    private init() {
        this.data = Logic.playerData.AvatarData.clone()
        this.anim = this.getComponent(cc.Animation)
        this.avatarNode = this.getSpriteChildNode(["sprite", "avatar"])
        this.spriteNode = this.getSpriteChildNode(["sprite"])
        this.cloakSprite = this.getSpriteChildSprite(["sprite", "cloak"])
        this.shadowSprite = this.getSpriteChildSprite(["sprite", "shadow"])
        this.legLeftSprite = this.getSpriteChildSprite(["sprite", "avatar", "legleft"])
        this.legRightSprite = this.getSpriteChildSprite(["sprite", "avatar", "legright"])
        this.footLeftSprite = this.getSpriteChildSprite(["sprite", "avatar", "legleft", "foot"])
        this.footRightSprite = this.getSpriteChildSprite(["sprite", "avatar", "legright", "foot"])
        this.shoesLeftSprite = this.getSpriteChildSprite(["sprite", "avatar", "legleft", "foot", "shoes"])
        this.shoesRightSprite = this.getSpriteChildSprite(["sprite", "avatar", "legright", "foot", "shoes"])
        this.handLeftSprite = this.getSpriteChildSprite(["sprite", "avatar", "handleft"])
        this.handRightSprite = this.getSpriteChildSprite(["sprite", "avatar", "handright"])
        this.glovesLeftSprite = this.getSpriteChildSprite(["sprite", "avatar", "handleft", "gloves"])
        this.glovesRightSprite = this.getSpriteChildSprite(["sprite", "avatar", "handright", "gloves"])
        this.headSprite = this.getSpriteChildSprite(["sprite", "avatar", "head"])
        this.faceSprite = this.getSpriteChildSprite(["sprite", "avatar", "head", "face"])
        this.eyesSprite = this.getSpriteChildSprite(["sprite", "avatar", "head", "eyes"])
        this.hairSprite = this.getSpriteChildSprite(["sprite", "avatar", "head", "hair"])
        this.helmetSprite = this.getSpriteChildSprite(["sprite", "avatar", "head", "helmet"])
        this.bodySprite = this.getSpriteChildSprite(["sprite", "avatar", "body"])
        this.pantsSprite = this.getSpriteChildSprite(["sprite", "avatar", "body", "pants"])
        this.clothesSprite = this.getSpriteChildSprite(["sprite", "avatar", "body", "clothes"])
        this.headSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
        this.faceSprite.node.color = cc.Color.WHITE.fromHEX(this.data.faceColor)
        this.faceSprite.node.opacity = 128
        let eyeColor = cc.Color.WHITE.fromHEX(this.data.eyesColor)
        this.eyesSprite.getMaterial(0).setProperty("eyeColor", eyeColor)
        this.hairSprite.node.color = cc.Color.WHITE.fromHEX(this.data.hairColor)
        this.bodySprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
        this.legLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
        this.legRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
        this.footLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
        this.footRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
        this.handLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
        this.handRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
        this.hairSprite.node.stopAllActions()
        this.changeAvatarByDir(PlayerAvatar.DIR_RIGHT)
        let index = 0
        this.schedule(
            () => {
                this.hairSprite.spriteFrame = Logic.spriteFrameRes(this.data.hairResName + this.idlehair[index++])
                if (index > 1) {
                    index = 0
                }
            },
            0.2,
            cc.macro.REPEAT_FOREVER,
            0.1
        )
    }
    private getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node
        for (let name of childNames) {
            node = node.getChildByName(name)
        }
        return node.getComponent(cc.Sprite)
    }
    private getSpriteChildNode(childNames: string[]): cc.Node {
        let node = this.node
        for (let name of childNames) {
            node = node.getChildByName(name)
        }
        return node
    }
    showHandsWithInteract(flag: boolean, isLift: boolean) {
        this.handLeftSprite.node.scaleY = 0.2
        this.handRightSprite.node.scaleY = 0.2
        this.handLeftSprite.node.opacity = 0
        this.handRightSprite.node.opacity = 0
        this.handLeftSprite.node.y = 8
        this.handRightSprite.node.y = 8
        if (flag) {
            this.handLeftSprite.node.opacity = 255
            this.handRightSprite.node.opacity = 255
            if (isLift) {
                this.handLeftSprite.node.scaleY = 0.3
                this.handRightSprite.node.scaleY = 0.3
                this.handLeftSprite.node.y = 16
                this.handRightSprite.node.y = 16
            }
        }
    }
    playAnim(status: number, dir: number) {
        if (!this.anim) {
            this.init()
        }
        if (this.isAniming) {
            return
        }
        switch (status) {
            case PlayerAvatar.STATE_IDLE:
                if (this.status != status && PlayerAvatar.STATE_DIE != this.status) {
                    this.playIdle(dir)
                }
                break
            case PlayerAvatar.STATE_WALK:
                if ((this.status != status || this.dir != dir) && PlayerAvatar.STATE_ATTACK != this.status && PlayerAvatar.STATE_DIE != this.status) {
                    this.playWalk(dir)
                }
                break
            case PlayerAvatar.STATE_ATTACK:
                if (PlayerAvatar.STATE_DIE != this.status) {
                    this.playAttack(dir)
                }
                break
            case PlayerAvatar.STATE_DIE:
                if (PlayerAvatar.STATE_DIE != this.status) {
                    this.playDie()
                }
                break
            case PlayerAvatar.STATE_FALL:
                if (PlayerAvatar.STATE_DIE != this.status) {
                    this.anim.play("AvatarFall")
                }
                break
            case PlayerAvatar.STATE_JUMP:
                if (PlayerAvatar.STATE_DIE != this.status) {
                    this.anim.play("AvatarJump")
                }
                break
        }
        this.status = status
        this.dir = dir
    }

    changeLegColor(isLong: boolean, colorHex: string) {
        if (isLong) {
            this.legLeftSprite.node.color = cc.Color.WHITE.fromHEX(colorHex)
            this.legRightSprite.node.color = cc.Color.WHITE.fromHEX(colorHex)
            this.footLeftSprite.node.color = cc.Color.WHITE.fromHEX(colorHex)
            this.footRightSprite.node.color = cc.Color.WHITE.fromHEX(colorHex)
        } else {
            this.legLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
            this.legRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
            this.footLeftSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
            this.footRightSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
        }
    }
    hitLight(isHit: boolean) {
        this.bodySprite.getMaterial(0).setProperty("addColor", isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
        this.headSprite.getMaterial(0).setProperty("addColor", isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
        this.hairSprite.getMaterial(0).setProperty("addColor", isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
        this.faceSprite.getMaterial(0).setProperty("addColor", isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
        this.eyesSprite.getMaterial(0).setProperty("addColor", isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
        this.handLeftSprite.getMaterial(0).setProperty("addColor", isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
        this.handRightSprite.getMaterial(0).setProperty("addColor", isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
        this.legLeftSprite.getMaterial(0).setProperty("addColor", isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
        this.legRightSprite.getMaterial(0).setProperty("addColor", isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
        this.footLeftSprite.getMaterial(0).setProperty("addColor", isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
        this.footLeftSprite.getMaterial(0).setProperty("addColor", isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    }
    changeEquipDirSpriteFrame(inventoryManager: InventoryManager, dir: number) {
        let helmet = inventoryManager.equips[InventoryManager.HELMET]
        let clothes = inventoryManager.equips[InventoryManager.CLOTHES]
        this.cloakSprite.node.zIndex = dir == 0 ? this.avatarNode.zIndex + 1 : this.avatarNode.zIndex - 1
        if (dir == 0 && Logic.spriteFrameRes(helmet.img + "anim2")) {
            this.helmetSprite.spriteFrame = Logic.spriteFrameRes(helmet.img + "anim2")
        } else if (dir == 1 && Logic.spriteFrameRes(helmet.img + "anim1")) {
            this.helmetSprite.spriteFrame = Logic.spriteFrameRes(helmet.img + "anim1")
        } else {
            this.helmetSprite.spriteFrame = Logic.spriteFrameRes(helmet.img + "anim0")
        }
        if (dir == 0 && Logic.spriteFrameRes(clothes.img + "anim2")) {
            this.clothesSprite.spriteFrame = Logic.spriteFrameRes(clothes.img + "anim2")
        } else if (dir == 1 && Logic.spriteFrameRes(clothes.img + "anim1")) {
            this.clothesSprite.spriteFrame = Logic.spriteFrameRes(clothes.img + "anim1")
        } else {
            this.clothesSprite.spriteFrame = Logic.spriteFrameRes(clothes.img + "anim0")
        }
    }
    private playDie() {
        this.anim.play("AvatarDie")
    }
    private playIdle(dir: number) {
        this.anim.play("AvatarIdle")
    }
    changeAvatarByDir(dir: number, isFaceUp?: number) {
        let eyesprefix = this.data.eyesResName
        let faceprefix = this.data.faceResName
        switch (dir) {
            case PlayerAvatar.DIR_UP:
                this.idlehair = [2, 3]
                this.eyesSprite.spriteFrame = null
                this.faceSprite.spriteFrame = null
                break
            case PlayerAvatar.DIR_DOWN:
                this.idlehair = [0, 1]
                this.eyesSprite.spriteFrame = Logic.spriteFrameRes(eyesprefix)
                this.faceSprite.spriteFrame = Logic.spriteFrameRes(faceprefix)
                break
            case PlayerAvatar.DIR_LEFT:
                this.idlehair = [4, 5]
                this.eyesSprite.spriteFrame = Logic.spriteFrameRes("side" + eyesprefix)
                this.faceSprite.spriteFrame = Logic.spriteFrameRes("side" + faceprefix)
                break
            case PlayerAvatar.DIR_RIGHT:
                this.idlehair = [4, 5]
                this.eyesSprite.spriteFrame = Logic.spriteFrameRes("side" + eyesprefix)
                this.faceSprite.spriteFrame = Logic.spriteFrameRes("side" + faceprefix)
                break
        }
        let eyeColor = cc.Color.WHITE.fromHEX(this.data.eyesColor)
        this.eyesSprite.getMaterial(0).setProperty("eyeColor", eyeColor)
        this.hairSprite.spriteFrame = Logic.spriteFrameRes(this.data.hairResName + this.idlehair[0])
        if (dir != 4) {
            this.cloakSprite.node.zIndex = dir == 0 ? this.avatarNode.zIndex + 1 : this.avatarNode.zIndex - 1
            this.handRightSprite.node.zIndex = dir == 0 ? this.bodySprite.node.zIndex - 1 : this.bodySprite.node.zIndex + 1
        }
    }
    public showLegsWithWater(inWater: boolean) {
        this.legLeftSprite.node.opacity = inWater ? 0 : 255
        this.legRightSprite.node.opacity = inWater ? 0 : 255
        this.shadowSprite.node.opacity = inWater ? 0 : 255
        this.pantsSprite.node.opacity = inWater ? 0 : 255
        this.setInWaterMat(this.bodySprite, inWater)
        this.setInWaterMat(this.clothesSprite, inWater)
    }
    public hideShadow() {
        this.shadowSprite.node.opacity = 0
    }
    private setInWaterMat(sprite: cc.Sprite, inWater: boolean) {
        if (!sprite || !sprite.spriteFrame) {
            return
        }
        let offset = sprite.spriteFrame.getOffset()
        let rect = sprite.spriteFrame.getRect()
        let texture = sprite.spriteFrame.getTexture()
        sprite.getMaterial(0).setProperty("rect", [rect.x / texture.width, rect.y / texture.height, rect.width / texture.width, rect.height / texture.height])
        sprite.getMaterial(0).setProperty("hidebottom", inWater ? 1 : 0)
        sprite.getMaterial(0).setProperty("isRotated", sprite.spriteFrame.isRotated() ? 1.0 : 0.0)
    }
    private playWalk(dir: number) {
        this.anim.play(dir == PlayerAvatar.DIR_UP || dir == PlayerAvatar.DIR_DOWN ? "AvatarWalkVertical" : "AvatarWalkHorizontal")
    }
    private playAttack(dir: number) {
        this.anim.play(dir == PlayerAvatar.DIR_UP || dir == PlayerAvatar.DIR_DOWN ? "AvatarAttackVertical" : "AvatarAttackHorizontal")
        let offsetX = 0
        let offsetY = 0
        switch (dir) {
            case PlayerAvatar.DIR_UP:
                offsetY = -16
                break
            case PlayerAvatar.DIR_DOWN:
                offsetY = 16
                break
            case PlayerAvatar.DIR_LEFT:
                offsetX = -16
                break
            case PlayerAvatar.DIR_RIGHT:
                offsetX = -16
                break
        }
        cc.tween(this.spriteNode).stop()
        cc.tween(this.spriteNode)
            .to(0.1, { position: cc.v3(offsetX, offsetY) })
            .to(0.1, { position: cc.v3(-offsetX, -offsetY) })
            .to(0.1, { position: cc.v3(0, 0) })
            .delay(0.1)
            .call(() => {
                this.playAnim(PlayerAvatar.STATE_IDLE, dir)
            })
            .start()
    }
    public cooking() {
        this.isAniming = true
        this.scheduleOnce(() => {
            this.isAniming = false
        }, 3)
    }
    public drink() {
        this.anim.play("AvatarDrink")
        AudioPlayer.play(AudioPlayer.DRINK)
        this.isAniming = true
        this.scheduleOnce(() => {
            this.isAniming = false
        }, 1.5)
    }
    public toilet() {
        this.isAniming = true
        this.scheduleOnce(() => {
            this.isAniming = false
        }, 5)
    }
    public sleep() {
        this.isAniming = true
        this.scheduleOnce(() => {
            this.isAniming = false
        }, 5)
    }
    public read() {
        this.isAniming = true
        this.scheduleOnce(() => {
            this.isAniming = false
        }, 5)
    }
    start() {}

    // update (dt) {}
}
