import AvatarData from '../data/AvatarData'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const { ccclass, property } = cc._decorator

@ccclass
export default abstract class BaseAvatar extends cc.Component {
    public static readonly DIR_UP = 0
    public static readonly DIR_DOWN = 1
    public static readonly DIR_LEFT = 2
    public static readonly DIR_RIGHT = 3
    public static readonly STATE_IDLE = 0
    public static readonly STATE_WALK = 1
    public static readonly STATE_ATTACK = 2
    public static readonly STATE_FALL = 3
    public static readonly STATE_DIE = 4
    public static readonly STATE_JUMP_UP = 5
    public static readonly STATE_JUMP_DOWN = 6
    public static readonly STATE_AIRKICK = 7
    public static readonly STATE_HIT = 8
    public static readonly STATE_SPECIAL = 9
    public static readonly STATE_DISGUISE = 10
    public static readonly STATE_DASH = 11
    public static readonly STATE_DASH1 = 12
    data: AvatarData
    status = BaseAvatar.STATE_IDLE
    dir = BaseAvatar.DIR_RIGHT
    isAniming = false
    isInit = false
    public abstract init(data: AvatarData, group?: string, resName?: string): void
    public abstract playAnim(status: number, dir: number, speedScale?: number, callback?: Function): void
    public abstract showLegsWithWater(inWater: boolean, inWaterTile: boolean): void
    protected abstract setInWaterMat(sprite: cc.Sprite, inWater: boolean): void
    protected abstract playJumpDown(speedScale: number, callback?: Function): void
    protected abstract playJumpUp(speedScale: number, callback?: Function): void
    protected abstract playDisguise(speedScale: number, callback?: Function): void
    protected abstract playHit(speedScale: number, callback?: Function): void
    protected abstract playSpecial(speedScale: number, callback?: Function): void
    protected abstract playFall(speedScale: number, callback?: Function): void
    protected abstract playDie(speedScale: number, callback?: Function): void
    protected abstract playIdle(speedScale: number, callback?: Function): void
    protected abstract playWalk(speedScale: number, callback?: Function): void
    protected abstract playAttack(speedScale: number, callback?: Function): void
    protected abstract playAirKick(speedScale: number, callback?: Function): void
    public abstract playCooking(speedScale: number, callback?: Function): void
    public abstract playDrink(speedScale: number, callback?: Function): void
    public abstract playToilet(speedScale: number, callback?: Function): void
    public abstract playSleep(speedScale: number, callback?: Function): void
    public abstract playRead(speedScale: number, callback?: Function): void

    protected getSpriteChildSprite(childNames: string[]): cc.Sprite {
        let node = this.node
        for (let name of childNames) {
            node = node.getChildByName(name)
        }
        return node.getComponent(cc.Sprite)
    }
    protected getSpriteChildNode(childNames: string[]): cc.Node {
        let node = this.node
        for (let name of childNames) {
            node = node.getChildByName(name)
        }
        return node
    }
}
