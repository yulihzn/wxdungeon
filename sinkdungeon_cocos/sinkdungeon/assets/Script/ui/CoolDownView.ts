// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'

const { ccclass, property } = cc._decorator

@ccclass
export default class CoolDownView extends cc.Component {
    static readonly PROFESSION = 0
    static readonly ORGANIZATION = 1
    static readonly EQUIPITEM = 2
    id = CoolDownView.PROFESSION
    skillIcon: cc.Sprite = null
    graphics: cc.Graphics = null
    coolDownFuc: Function = null
    label: cc.Label = null
    labelBg: cc.Node = null
    private lastTime = 0
    private duration = 0
    private storePoint = 1
    private storePointMax = 1
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics)
        this.label = this.node.getChildByName('label').getComponent(cc.Label)
        this.labelBg = this.node.getChildByName('labelbg')
        this.labelBg.active = false
        this.skillIcon = this.node.getChildByName('mask').getChildByName('sprite').getComponent(cc.Sprite)
        this.skillIcon.node.opacity = 255
        EventHelper.on(EventHelper.HUD_CONTROLLER_COOLDOWN, detail => {
            if (this.node && detail.id == this.id) {
                this.setData(detail.duration, detail.lastTime, detail.storePoint, detail.storePointMax)
            }
        })
    }
    init(id: number) {
        this.id = id
        if (!this.skillIcon) {
            this.skillIcon = this.node.getChildByName('mask').getChildByName('sprite').getComponent(cc.Sprite)
        }
        if (id == CoolDownView.PROFESSION) {
            this.setSkillIcon(Logic.playerData.AvatarData.professionData.talent)
        } else if (id == CoolDownView.ORGANIZATION) {
            this.setSkillIcon(`talent10${Logic.playerData.AvatarData.organizationIndex}`)
        }
    }
    private setSkillIcon(resName: string) {
        this.skillIcon.spriteFrame = Logic.spriteFrameRes(resName)
    }

    private setData(duration: number, lastTime: number, storePoint: number, storePointMax: number) {
        if (!this.node) {
            return
        }

        if (duration <= 0) {
            duration = 0
        }
        this.storePointMax = storePointMax
        this.duration = duration
        this.lastTime = lastTime
        this.storePoint = storePoint
        this.drawSkillCoolDown()
    }
    private drawSkillCoolDown() {
        if (this.duration <= 0) {
            return
        }
        this.label.string = this.storePoint > 0 && this.storePointMax > 1 ? `${this.storePoint}` : ``
        this.labelBg.active = this.label.string.length > 0
        if (this.graphics) {
            this.graphics.clear()
        }
        let p = cc.Vec3.ZERO
        let currentTime = Date.now()
        let percent = (currentTime - this.lastTime) / (this.duration * 1000) //当前百分比
        if (percent > 1) {
            percent = 1
        }
        if (percent < 1) {
            this.drawArc(360 * (1 - percent), p, this.graphics)
        }
    }
    private drawArc(angle: number, center: cc.Vec3, graphics: cc.Graphics) {
        if (!graphics) {
            return
        }
        graphics.clear()
        if (angle < 0) {
            return
        }
        let r = 48
        let endAngle = (angle * 2 * Math.PI) / 360
        graphics.arc(center.x, center.y, r, 2 * Math.PI, 2 * Math.PI - endAngle)
        graphics.stroke()
    }
    timeDelay = 0
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt
        if (this.timeDelay > 0.1) {
            this.timeDelay = 0
            return true
        }
        return false
    }
    changeKeyShow(show: boolean) {
        this.node.getChildByName('btn').active = show
    }
    start() {}

    update(dt) {
        if (this.isTimeDelay(dt)) {
            this.drawSkillCoolDown()
        }
    }
}
