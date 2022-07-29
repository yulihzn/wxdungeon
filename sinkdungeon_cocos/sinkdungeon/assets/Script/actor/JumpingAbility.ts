import { MoveComponent } from './../ecs/component/MoveComponent'
import Actor from '../base/Actor'
import TriggerData from '../data/TriggerData'
import AudioPlayer from '../utils/AudioPlayer'
import Utils from '../utils/Utils'

const { ccclass, property } = cc._decorator

@ccclass
export default class JumpingAbility extends cc.Component {
    static readonly CALLBACK_INIT = 0
    static readonly CALLBACK_JUMP = 1
    static readonly CALLBACK_AIR_PAUSE = 2
    actor: Actor
    isAcceleratedFall = false //是否加速下落，加速下落时无法取消
    currentJumpCount = 1 //当前多次跳跃次数
    maxJumpCount = 1 //最大多次跳跃次数
    lastLinearVelocityZ = 0
    lastZ = 0
    callbacks: Map<number, Function> = new Map()
    isJumpPressed = false
    isAirPause = false
    maxJumpHeight = 0
    maxFlyHeight = 0
    flySpeed = 0
    /**初始化跳跃回调 */
    init(actor: Actor, maxJumpCount: number, callbackKey: number, callback?: Function) {
        this.actor = actor
        if (maxJumpCount && maxJumpCount > 0) {
            this.currentJumpCount = maxJumpCount
            this.maxJumpCount = maxJumpCount
        }
        if (callback) {
            this.callbacks.set(callbackKey, callback)
        }
    }
    jump(speed: number, maxJumpHeightUnit: number, callbackKey?: number, callback?: Function) {
        //判断跳跃是否按下，直到下次松开
        if (this.isJumpPressed) {
            return
        }
        //加速下落无法取消
        if (this.isAcceleratedFall) {
            return
        }
        if (this.currentJumpCount < 1) {
            //判断是否还有跳跃次数
            return
        }
        if (callback) {
            this.callbacks.set(callbackKey, callback)
        }
        let ajustSpeed = speed
        if (maxJumpHeightUnit && maxJumpHeightUnit > 0) {
            this.maxJumpHeight = maxJumpHeightUnit * MoveComponent.PIXELS_PER_UNIT + this.actor.entity.Transform.z
            let tempSpeed = Utils.getDashSpeedByDistance(this.maxJumpHeight, this.actor.entity.Move.gravity)
            if (ajustSpeed > tempSpeed) {
                ajustSpeed = tempSpeed
            }
        }
        //跳跃按下，跳跃次数减少,播放音效，获取按键失效时间并重新倒计时，设置传入速度，修改重力为0，回调
        this.currentJumpCount--
        this.isJumpPressed = true
        this.isAirPause = false
        AudioPlayer.play(AudioPlayer.DASH)
        let second = Utils.getJumpTimeBySpeedDistance(maxJumpHeightUnit, ajustSpeed, this.actor.entity.Move.gravity)
        this.unscheduleAllCallbacks()
        this.scheduleOnce(() => {
            this.actor.entity.Move.gravity = MoveComponent.DEFAULT_GRAVITY
        }, second)
        this.actor.entity.Move.gravity = 0
        this.actor.entity.Move.linearVelocityZ = ajustSpeed
        this.callbacks.forEach((callback, key) => {
            callback(TriggerData.GROUP_JUMP, TriggerData.TYPE_JUMP_START)
        })
        this.actor.sc.isJumping = true
    }
    /**短暂浮空 */
    airPause(speed: number, duration: number, callbackKey?: number, callback?: Function) {
        this.actor.entity.Move.gravity = 0
        this.actor.entity.Move.linearVelocityZ = speed
        this.actor.sc.isJumping = true
        this.isAirPause = true
        if (callback) {
            this.callbacks.set(callbackKey, callback)
        }
        this.unscheduleAllCallbacks()
        this.scheduleOnce(() => {
            this.actor.entity.Move.gravity = MoveComponent.DEFAULT_GRAVITY
            this.isAirPause = false
        }, duration)
    }
    acceleratedFall(gravityScale: number) {
        this.isAcceleratedFall = true
        let scale = gravityScale > 0 ? gravityScale : 1
        this.actor.entity.Move.gravity = MoveComponent.DEFAULT_GRAVITY * scale
        if (this.actor.entity.Move.linearVelocityZ > 0) {
            this.actor.entity.Move.linearVelocityZ = 0
        }
    }
    cancel() {
        //跳跃取消，回复重力，如果是加速下落重力x2
        this.isJumpPressed = false
        if (!this.isAcceleratedFall) {
            this.actor.entity.Move.gravity = MoveComponent.DEFAULT_GRAVITY
        }
    }
    fly(flySpeed: number, maxFlyHeightUnit: number) {
        this.flySpeed = flySpeed
        this.actor.entity.Move.linearVelocityZ = flySpeed
        this.maxFlyHeight = maxFlyHeightUnit * MoveComponent.PIXELS_PER_UNIT
        this.actor.sc.isFlying = true
    }
    flyCancel(gravityScale: number) {
        this.actor.sc.isFlying = false
        this.acceleratedFall(gravityScale)
    }
    updateLogic() {
        //判断上次速度和当前速度方向不一致代表到达最高点
        if ((this.actor.entity.Move.linearVelocityZ <= 0 && this.lastLinearVelocityZ > 0) || (this.maxJumpHeight > 0 && this.actor.entity.Transform.z > this.maxJumpHeight)) {
            this.callbacks.forEach((callback, key) => {
                callback(TriggerData.GROUP_JUMP, TriggerData.TYPE_JUMP_HIGHEST)
            })
            if (!this.isAirPause && !this.actor.sc.isFlying && !this.isAcceleratedFall) {
                this.actor.entity.Move.gravity = MoveComponent.DEFAULT_GRAVITY
                if (this.actor.entity.Move.linearVelocityZ > 0) {
                    this.actor.entity.Move.linearVelocityZ = 0
                }
            }
        }
        //落地加速状态结束，跳跃结束
        if (this.lastZ > this.actor.entity.Transform.base && this.actor.entity.Transform.z <= this.actor.entity.Transform.base) {
            this.callbacks.forEach((callback, key) => {
                callback(TriggerData.GROUP_JUMP, TriggerData.TYPE_JUMP_END)
            })
            this.isAcceleratedFall = false
            this.actor.sc.isJumping = false
            this.currentJumpCount = this.maxJumpCount
            this.actor.entity.Move.gravity = MoveComponent.DEFAULT_GRAVITY
            this.isJumpPressed = false
            this.isAirPause = false
        }
        this.lastLinearVelocityZ = this.actor.entity.Move.linearVelocityZ
        this.lastZ = this.actor.entity.Transform.z
        if (this.actor.sc.isFlying) {
            this.actor.entity.Move.linearVelocityZ = this.actor.entity.Transform.z > this.maxFlyHeight ? 0 : this.flySpeed
        }
    }
    removeCallback(key: number) {
        if (this.callbacks.has(key)) {
            this.callbacks.delete(key)
        }
    }
}
