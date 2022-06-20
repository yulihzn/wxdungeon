import Actor from '../base/Actor'
import PlayerData from '../data/PlayerData'
import TriggerData from '../data/TriggerData'
import PlayerAvatar from '../logic/PlayerAvatar'
import AudioPlayer from '../utils/AudioPlayer'
import Utils from '../utils/Utils'

const { ccclass, property } = cc._decorator

@ccclass
export default class JumpingAbility extends cc.Component {
    static readonly UP = 0
    static readonly DOWN = 1
    actor: Actor
    isFall = false //是否下落
    isRise = false //是否上升
    isAcceleratedFall = false //是否加速下落
    isUniformRise = false //匀速上升
    isPressing = false //跳跃按钮是否按下
    isTimeOut = false //跳跃按钮按下超时
    jumpCount = 1 //多次跳跃次数
    lastLinearVelocityZ = 0
    callback: Function
    jump(speed: number, callback?: Function) {
        if (callback) {
            this.callback = callback
        }
        let second = Utils.getJumpTimeBySpeedDistance(PlayerData.DEFAULT_JUMP_HEIGHT, speed, this.actor.entity.Move.gravity)
        if (!this.isPressing && this.jumpCount > 0) {
            this.callback(TriggerData.GROUP_JUMP, TriggerData.TYPE_JUMP_START)
            this.unscheduleAllCallbacks()
            this.scheduleOnce(() => {
                this.isTimeOut = true
            }, second)
            AudioPlayer.play(AudioPlayer.DASH)
        }
        if (!this.isTimeOut || !this.isPressing) {
            this.actor.entity.Move.linearVelocityZ = speed
        }
    }
    /**短暂浮空 */
    airPause() {}
    cancel() {}
    updateLogic() {
        if (this.actor.entity.Move.linearVelocityZ <= 0 && this.lastLinearVelocityZ > 0) {
            this.callback(TriggerData.GROUP_JUMP, TriggerData.TYPE_JUMP_HIGHEST)
            this.isFall = true
            this.isRise = false
        }
        if (this.actor.entity.Transform.z <= this.actor.entity.Transform.base) {
            this.callback(TriggerData.GROUP_JUMP, TriggerData.TYPE_JUMP_END)
        }
        this.lastLinearVelocityZ = this.actor.entity.Move.linearVelocityZ
    }
}
