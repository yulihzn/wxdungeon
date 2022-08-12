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
import BaseAvatar from '../base/BaseAvatar'

const { ccclass, property } = cc._decorator

@ccclass
export default class PlayerAvatar extends BaseAvatar {
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

    waterY = 0
    idlehair = [0, 1]
    static create(prefab: cc.Prefab, parent: cc.Node, data: AvatarData, group: string): PlayerAvatar {
        let avatar = cc.instantiate(prefab).getComponent(PlayerAvatar)
        avatar.node.parent = parent
        avatar.node.zIndex = 0
        avatar.init(data, group)
        return avatar
    }
    public init(data: AvatarData, group: string) {
        if (this.isInit) {
            return
        }
        Utils.changeNodeGroups(this.node, group)
        this.isInit = true
        this.data = new AvatarData()
        this.data.valueCopy(data)
        this.anim = this.getComponent(cc.Animation)
        this.avatarNode = this.getSpriteChildNode(['sprite', 'avatar'])
        this.spriteNode = this.getSpriteChildNode(['sprite'])
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
        this.changeAvatarByDir(BaseAvatar.DIR_RIGHT)
        this.updateSpriteFrameAnim(this.faceSprite, this.data.faceResName, 1)
        this.updateSpriteFrameAnim(this.hairSprite, this.data.hairResName, 2)
        this.updateSpriteFrameAnim(this.eyesSprite, this.data.eyesResName, 1)
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
    playAnim(status: number, dir: number, speedScale?: number, callback?: Function) {
        if (!this.isInit || this.isAniming || BaseAvatar.STATE_DIE == this.status) {
            return
        }
        let scale = speedScale ?? 1
        switch (status) {
            case BaseAvatar.STATE_IDLE:
                if (this.status != status) {
                    this.playIdle(scale)
                }
                break
            case BaseAvatar.STATE_WALK:
                if (this.status != status && BaseAvatar.STATE_ATTACK != this.status && BaseAvatar.STATE_AIRKICK != this.status) {
                    this.playWalk(scale)
                }
                break
            case BaseAvatar.STATE_ATTACK:
                this.playAttack(scale)
                break
            case BaseAvatar.STATE_AIRKICK:
                this.playAirKick(scale)
                break
            case BaseAvatar.STATE_DIE:
                this.playDie(scale)
                break
            case BaseAvatar.STATE_FALL:
                this.playFall(scale)
                break
            case BaseAvatar.STATE_JUMP_UP:
                if (this.status != status) {
                    this.playJumpUp(scale)
                }
                break
            case BaseAvatar.STATE_JUMP_DOWN:
                if (this.status != status) {
                    this.playJumpDown(scale)
                }
                break
            case BaseAvatar.STATE_DISGUISE:
                this.playDisguise(scale)
                break
            case BaseAvatar.STATE_HIT:
                this.playHit(scale)
                break
            case BaseAvatar.STATE_SPECIAL:
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
    }
    protected setInWaterMat(sprite: cc.Sprite, inWater: boolean) {
        if (!sprite || !sprite.spriteFrame) {
            return
        }
        let offset = sprite.spriteFrame.getOffset()
        let rect = sprite.spriteFrame.getRect()
        let texture = sprite.spriteFrame.getTexture()
        sprite.getMaterial(0).setProperty('rect', [rect.x / texture.width, rect.y / texture.height, rect.width / texture.width, rect.height / texture.height])
        sprite.getMaterial(0).setProperty('hidebottom', inWater ? 1 : 0)
        sprite.getMaterial(0).setProperty('isRotated', sprite.spriteFrame.isRotated() ? 1.0 : 0.0)
    }
    private updateSpriteFrameAnim(sprite: cc.Sprite, resName: string, animCount: number) {
        let resLength = animCount && animCount != 0 ? animCount : 1
        sprite.unscheduleAllCallbacks()
        let index = 0
        sprite.schedule(
            () => {
                let start = this.dir == BaseAvatar.DIR_UP ? resLength : 0
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
    protected playJumpDown(speedScale: number) {
        this.anim.play('AvatarJumpDown')
    }
    protected playJumpUp(speedScale: number) {
        this.anim.play('AvatarJumpUp')
    }
    protected playDisguise(speedScale: number) {}
    protected playHit(speedScale: number) {}
    protected playSpecial(speedScale: number) {}
    protected playFall(speedScale: number) {
        this.anim.play('AvatarFall')
    }
    protected playDie(speedScale: number) {
        this.anim.play('AvatarDie')
    }
    protected playIdle(speedScale: number) {
        this.anim.play('AvatarIdle')
    }
    protected playWalk(speedScale: number) {
        this.anim.play('AvatarWalkHorizontal')
    }
    protected playAttack(speedScale: number, callback?: Function) {
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
                this.playAnim(BaseAvatar.STATE_IDLE, this.dir)
            })
            .start()
    }
    protected playAirKick(speedScale: number) {
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
                this.playAnim(BaseAvatar.STATE_IDLE, this.dir)
            })
            .start()
    }
    public playCooking() {
        this.isAniming = true
        this.scheduleOnce(() => {
            this.isAniming = false
        }, 3)
    }
    public playDrink() {
        this.changeAvatarByDir(BaseAvatar.DIR_RIGHT)
        this.anim.play('AvatarDrink')
        AudioPlayer.play(AudioPlayer.DRINK)
        this.isAniming = true
        this.scheduleOnce(() => {
            this.isAniming = false
        }, 1.5)
    }
    public playToilet() {
        this.isAniming = true
        this.scheduleOnce(() => {
            this.isAniming = false
        }, 5)
    }
    public playSleep() {
        this.changeAvatarByDir(BaseAvatar.DIR_RIGHT)
        this.anim.play('AvatarSleep')
        this.isAniming = true
        this.scheduleOnce(() => {
            this.isAniming = false
        }, 5)
    }
    public playWakeUp() {
        this.changeAvatarByDir(BaseAvatar.DIR_RIGHT)
        this.anim.play('AvatarSleep')
        this.isAniming = true
        this.scheduleOnce(() => {
            AudioPlayer.play(AudioPlayer.BUBBLE)
            this.anim.play('AvatarWakeUp')
        }, 1)
        this.scheduleOnce(() => {
            this.isAniming = false
        }, 2)
    }
    public playRead() {
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
