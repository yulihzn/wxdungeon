// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from './Logic'
import InventoryManager from '../manager/InventoryManager'
import AvatarData from '../data/AvatarData'
import AudioPlayer from '../utils/AudioPlayer'
import Utils from '../utils/Utils'

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
    static readonly STATE_JUMP_UP = 5
    static readonly STATE_JUMP_DOWN = 6
    static readonly STATE_AIRKICK = 7
    static readonly STATE_HIT = 8
    static readonly STATE_SPECIAL = 9
    static readonly STATE_DISGUISE = 10
    status = PlayerAvatar.STATE_IDLE
    dir = PlayerAvatar.DIR_RIGHT
    anim: cc.Animation
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
    animFrameSprite: cc.Sprite = null
    data: AvatarData
    isAniming = false
    idlehair = [0, 1]
    waterY = 0
    isInit = false
    isAnimFrame = false
    idleFrames = [0, 1]
    walkFrames = [2, 5]
    hitFrames = [6, 7]
    dieFrames = [8]
    attackFrames = [9, 10]
    specialFrames = [12, 13]
    disguiseFrames = [14]
    resName = ''

    public init(data: AvatarData, group: string, isAnimFrame: boolean, resName: string) {
        if (this.isInit) {
            return
        }
        Utils.changeNodeGroups(this.node, group)
        this.isInit = true
        this.isAnimFrame = isAnimFrame
        this.resName = resName
        this.data = new AvatarData()
        this.data.valueCopy(data)
        this.anim = this.getComponent(cc.Animation)
        this.avatarNode = this.getSpriteChildNode(['sprite', 'avatar'])
        this.spriteNode = this.getSpriteChildNode(['sprite'])
        this.animFrameSprite = this.getSpriteChildSprite(['sprite', 'animframe'])
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
        this.headSprite.node.color = cc.Color.WHITE.fromHEX(this.data.skinColor)
        this.faceSprite.node.color = cc.Color.WHITE.fromHEX(this.data.faceColor)
        this.faceSprite.node.opacity = 128
        let eyeColor = cc.Color.WHITE.fromHEX(this.data.eyesColor)
        this.eyesSprite.getMaterial(0).setProperty('eyeColor', eyeColor)
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
        this.updateSpriteFrameAnim(this.faceSprite, this.data.faceResName, 1)
        this.updateSpriteFrameAnim(this.hairSprite, this.data.hairResName, 2)
        this.updateSpriteFrameAnim(this.eyesSprite, this.data.eyesResName, 1)
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
    playAnim(status: number, dir: number, speedScale?: number) {
        if (!this.isInit || this.isAniming || PlayerAvatar.STATE_DIE == this.status) {
            return
        }
        let scale = speedScale ?? 1
        switch (status) {
            case PlayerAvatar.STATE_IDLE:
                if (this.status != status) {
                    this.playIdle(scale)
                }
                break
            case PlayerAvatar.STATE_WALK:
                if (this.status != status && PlayerAvatar.STATE_ATTACK != this.status && PlayerAvatar.STATE_AIRKICK != this.status) {
                    this.playWalk(scale)
                }
                break
            case PlayerAvatar.STATE_ATTACK:
                this.playAttack(scale)
                break
            case PlayerAvatar.STATE_AIRKICK:
                this.playAirKick(scale)
                break
            case PlayerAvatar.STATE_DIE:
                this.playDie(scale)
                break
            case PlayerAvatar.STATE_FALL:
                this.playFall(scale)
                break
            case PlayerAvatar.STATE_JUMP_UP:
                if (this.status != status) {
                    this.playJumpUp(scale)
                }
                break
            case PlayerAvatar.STATE_JUMP_DOWN:
                if (this.status != status) {
                    this.playJumpDown(scale)
                }
                break
            case PlayerAvatar.STATE_DISGUISE:
                this.playDisguise(scale)
                break
            case PlayerAvatar.STATE_HIT:
                this.playHit(scale)
                break
            case PlayerAvatar.STATE_SPECIAL:
                this.playSpecial(scale)
                break
        }
        this.status = status
        if (dir != 4) {
            this.dir = dir
        }
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
    // hitLight(isHit: boolean) {
    //     this.bodySprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    //     this.headSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    //     this.hairSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    //     this.faceSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    //     this.eyesSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    //     this.handLeftSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    //     this.handRightSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    //     this.legLeftSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    //     this.legRightSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    //     this.footLeftSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    //     this.footLeftSprite.getMaterial(0).setProperty('addColor', isHit ? cc.color(200, 200, 200, 100) : cc.Color.TRANSPARENT)
    // }

    public changeEquipDirSpriteFrame(inventoryManager: InventoryManager, dir: number) {
        let helmet = inventoryManager.equips[InventoryManager.HELMET]
        let clothes = inventoryManager.equips[InventoryManager.CLOTHES]
        this.updateSpriteFrameAnim(this.helmetSprite, helmet.img, helmet.anim)
        this.updateSpriteFrameAnim(this.clothesSprite, clothes.img, clothes.anim)
    }
    private playJumpDown(speedScale: number) {
        if (this.isAnimFrame) {
            this.playAnimFrames([], speedScale, false)
            return
        }
        this.anim.play('AvatarJumpDown')
    }
    private playJumpUp(speedScale: number) {
        if (this.isAnimFrame) {
            this.playAnimFrames([], speedScale, false)
            return
        }
        this.anim.play('AvatarJumpUp')
    }
    private playDisguise(speedScale: number) {
        if (this.isAnimFrame) {
            this.playAnimFrames(this.disguiseFrames, speedScale, false)
            return
        }
    }
    private playHit(speedScale: number) {
        if (this.isAnimFrame) {
            let arr = [this.hitFrames[Logic.getRandomNum(0, this.hitFrames.length - 1)]]
            this.playAnimFrames(arr, speedScale, false)
            return
        }
    }
    private playSpecial(speedScale: number) {
        if (this.isAnimFrame) {
            this.playAnimFrames(this.specialFrames, speedScale, false)
            return
        }
    }
    private playFall(speedScale: number) {
        if (this.isAnimFrame) {
            this.playAnimFrames(this.hitFrames, speedScale, false)
            return
        }
        this.anim.play('AvatarFall')
    }
    private playDie(speedScale: number) {
        if (this.isAnimFrame) {
            this.playAnimFrames(this.dieFrames, speedScale, false)
            return
        }
        this.anim.play('AvatarDie')
    }
    private playIdle(speedScale: number) {
        if (this.isAnimFrame) {
            this.playAnimFrames(this.idleFrames, speedScale, true)
            return
        }
        this.anim.play('AvatarIdle')
    }
    private playAnimFrames(frames: number[], speedScale: number, loop: boolean) {
        if (frames.length < 1) {
            return
        }
        const _tween = cc.tween()
        for (let i = frames[0]; i <= frames[1]; i++) {
            _tween.then(
                cc
                    .tween()
                    .call(() => {
                        this.changeAnimFrames(this.resName, `anim${Utils.getNumberStr3(i)}`)
                    })
                    .delay(0.2 * speedScale)
            )
        }
        this.animFrameSprite.node.stopAllActions()
        if (loop && frames[1] > frames[0]) {
            cc.tween(this.animFrameSprite.node).repeatForever(_tween).start()
        } else {
            cc.tween(this.animFrameSprite.node).then(_tween).start()
        }
    }
    private changeAnimFrames(resName: string, suffix?: string) {
        if (!this.animFrameSprite) {
            this.getSpriteChildSprite(['sprite', 'animframe'])
        }
        let spriteFrame = this.getSpriteFrameByName(resName, suffix)
        if (spriteFrame) {
            this.bodySprite.spriteFrame = spriteFrame
            this.bodySprite.node.width = spriteFrame.getOriginalSize().width
            this.bodySprite.node.height = spriteFrame.getOriginalSize().height
        } else {
            this.bodySprite.spriteFrame = null
        }
    }
    private getSpriteFrameByName(resName: string, suffix?: string): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrameRes(resName + suffix)
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(resName)
        }
        return spriteFrame
    }
    public changeAvatarByDir(dir: number) {
        if (this.isAniming) {
            return
        }
        let eyeColor = cc.Color.WHITE.fromHEX(this.data.eyesColor)
        this.eyesSprite.getMaterial(0).setProperty('eyeColor', eyeColor)
        if (dir != 4) {
            this.dir = dir
            this.cloakSprite.node.zIndex = dir == 0 ? this.avatarNode.zIndex + 1 : this.avatarNode.zIndex - 1
            this.handRightSprite.node.zIndex = dir == 0 ? this.bodySprite.node.zIndex - 1 : this.bodySprite.node.zIndex + 1
        }
    }

    public showLegsWithWater(inWater: boolean, inWaterTile: boolean) {
        this.legLeftSprite.node.opacity = inWater ? 0 : 255
        this.legRightSprite.node.opacity = inWater ? 0 : 255
        this.pantsSprite.node.opacity = inWater ? 0 : 255
        this.setInWaterMat(this.bodySprite, inWater)
        this.setInWaterMat(this.clothesSprite, inWater)
        this.setInWaterMat(this.cloakSprite, inWater)
        this.waterY = inWaterTile ? -32 : 0
        this.node.y = Logic.lerp(this.node.y, this.waterY, 0.2)
        if (this.isAnimFrame) {
            this.setInWaterMat(this.animFrameSprite, inWater)
        }
    }
    private setInWaterMat(sprite: cc.Sprite, inWater: boolean) {
        if (!sprite || !sprite.spriteFrame) {
            return
        }
        let offset = sprite.spriteFrame.getOffset()
        let rect = sprite.spriteFrame.getRect()
        let texture = sprite.spriteFrame.getTexture()
        sprite.getMaterial(0).setProperty('rect', [rect.x / texture.width, rect.y / texture.height, rect.width / texture.width, rect.height / texture.height])
        sprite.getMaterial(0).setProperty('hidebottom', inWater ? 1 : 0)
        if (!this.isAnimFrame) {
            sprite.getMaterial(0).setProperty('angularVelocity', 300)
            sprite.getMaterial(0).setProperty('amplitude', 0.001)
        }
        sprite.getMaterial(0).setProperty('isRotated', sprite.spriteFrame.isRotated() ? 1.0 : 0.0)
    }
    private updateSpriteFrameAnim(sprite: cc.Sprite, resName: string, animCount: number) {
        let resLength = animCount && animCount != 0 ? animCount : 1
        sprite.unscheduleAllCallbacks()
        let index = 0
        sprite.schedule(
            () => {
                let start = this.dir == PlayerAvatar.DIR_UP ? resLength : 0
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
    private playWalk(speedScale: number) {
        if (this.isAnimFrame) {
            return
        }
        this.anim.play('AvatarWalkHorizontal')
    }
    private playAttack(speedScale: number) {
        if (this.isAnimFrame) {
            return
        }
        this.anim.play('AvatarAttackHorizontal')
        let offsetX = -16
        let offsetY = 0
        cc.tween(this.spriteNode).stop()
        cc.tween(this.spriteNode)
            .to(0.1, { position: cc.v3(offsetX, offsetY) })
            .to(0.1, { position: cc.v3(-offsetX, -offsetY) })
            .to(0.1, { position: cc.v3(0, 0) })
            .delay(0.1)
            .call(() => {
                this.playAnim(PlayerAvatar.STATE_IDLE, this.dir)
            })
            .start()
    }
    private playAirKick(speedScale: number) {
        if (this.isAnimFrame) {
            return
        }
        this.anim.play('AvatarAirKick')
        let offsetX = -16
        let offsetY = 0
        cc.tween(this.spriteNode).stop()
        cc.tween(this.spriteNode)
            .to(0.1, { position: cc.v3(offsetX, offsetY) })
            .to(0.1, { position: cc.v3(-offsetX, -offsetY) })
            .to(0.1, { position: cc.v3(0, 0) })
            .delay(0.2)
            .call(() => {
                this.playAnim(PlayerAvatar.STATE_IDLE, this.dir)
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
        this.changeAvatarByDir(PlayerAvatar.DIR_RIGHT)
        this.anim.play('AvatarDrink')
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
    checkTimeDelay = 0
    isAnimTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    // update(dt: number) {
    //     if (this.isAnimTimeDelay(dt)) {
    //         this.updateEquipFrameAnim(this.clothesSprite)
    //     }
    // }
}
