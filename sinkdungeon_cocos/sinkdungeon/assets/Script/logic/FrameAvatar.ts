// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from './Logic'
import AvatarData from '../data/AvatarData'
import Utils from '../utils/Utils'
import BaseAvatar from '../base/BaseAvatar'

const { ccclass, property } = cc._decorator

@ccclass
export default class FrameAvatar extends BaseAvatar {
    anim: cc.Animation
    avatarNode: cc.Node = null
    spriteNode: cc.Node = null
    animFrameSprite: cc.Sprite = null
    waterY = 0
    isAnimFrame = false
    idleFrames = [0, 1]
    walkFrames = [2, 5]
    hitFrames = [6, 7]
    dieFrames = [8]
    attackFrames = [9, 10]
    specialFrames = [12, 13]
    disguiseFrames = [14]
    resName = ''
    static create(prefab: cc.Prefab, parent: cc.Node, data: AvatarData, resName: string): FrameAvatar {
        let avatar = cc.instantiate(prefab).getComponent(FrameAvatar)
        avatar.node.parent = parent
        avatar.node.zIndex = 0
        avatar.init(data, resName)
        return avatar
    }

    public init(data: AvatarData, resName: string) {
        if (this.isInit) {
            return
        }
        this.isInit = true
        this.resName = resName
        this.data = new AvatarData()
        this.data.valueCopy(data)
        this.anim = this.getComponent(cc.Animation)
        this.avatarNode = this.getSpriteChildNode(['sprite', 'avatar'])
        this.spriteNode = this.getSpriteChildNode(['sprite'])
        this.animFrameSprite = this.getSpriteChildSprite(['sprite', 'animframe'])
        this.changeAvatarByDir(BaseAvatar.DIR_RIGHT)
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

    private playAnimFrames(frames: number[], speedScale: number, loop: boolean, callback?: Function) {
        if (frames.length < 1) {
            return
        }
        const _tween = cc.tween()
        let startFrame = frames[0]
        let keyFrame = frames[1]
        let endFrame = frames[frames.length - 1]
        for (let i = startFrame; i <= endFrame; i++) {
            _tween.then(
                cc
                    .tween()
                    .call(() => {
                        this.changeAnimFrames(this.resName, `anim${Utils.getNumberStr3(i)}`)
                        if (i == keyFrame && callback) {
                            callback()
                        }
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
    public changeAnimFrames(resName: string, suffix?: string) {
        if (!this.animFrameSprite) {
            this.getSpriteChildSprite(['sprite', 'animframe'])
        }
        let spriteFrame = this.getSpriteFrameByName(resName, suffix)
        if (spriteFrame) {
            this.animFrameSprite.spriteFrame = spriteFrame
            this.animFrameSprite.node.width = spriteFrame.getOriginalSize().width
            this.animFrameSprite.node.height = spriteFrame.getOriginalSize().height
        } else {
            this.animFrameSprite.spriteFrame = null
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
        if (dir != 4) {
            this.dir = dir
        }
    }

    public showLegsWithWater(inWater: boolean, inWaterTile: boolean) {
        this.waterY = inWaterTile ? -32 : 0
        this.node.y = Logic.lerp(this.node.y, this.waterY, 0.2)
        this.setInWaterMat(this.animFrameSprite, inWater)
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
        if (!this.isAnimFrame) {
            sprite.getMaterial(0).setProperty('angularVelocity', 300)
            sprite.getMaterial(0).setProperty('amplitude', 0.001)
        }
        sprite.getMaterial(0).setProperty('isRotated', sprite.spriteFrame.isRotated() ? 1.0 : 0.0)
    }

    protected playJumpDown(speedScale: number) {
        this.playAnimFrames([], speedScale, false)
    }
    protected playJumpUp(speedScale: number) {
        this.playAnimFrames([], speedScale, false)
    }
    protected playDisguise(speedScale: number) {
        this.playAnimFrames(this.disguiseFrames, speedScale, false)
    }
    protected playHit(speedScale: number) {
        let arr = [this.hitFrames[Logic.getRandomNum(0, this.hitFrames.length - 1)]]
        this.playAnimFrames(arr, speedScale, false)
    }
    protected playSpecial(speedScale: number) {}
    protected playFall(speedScale: number) {
        this.playAnimFrames(this.hitFrames, speedScale, false)
    }
    protected playDie(speedScale: number) {
        this.playAnimFrames(this.dieFrames, speedScale, false)
    }
    protected playIdle(speedScale: number) {
        this.playAnimFrames(this.idleFrames, speedScale, true)
    }
    protected playWalk(speedScale: number) {
        this.playAnimFrames(this.walkFrames, speedScale, true)
    }
    protected playAttack(speedScale: number, callback?: Function) {
        this.playAnimFrames(this.attackFrames, speedScale, false, callback)
    }
    protected playAirKick(speedScale: number) {}
    public playCooking() {}
    public playDrink() {}
    public playToilet() {}

    public playSleep() {}
    public playRead() {}
}
