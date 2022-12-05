// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Actor from '../base/Actor'
import DamageData from '../data/DamageData'
import StatusData from '../data/StatusData'
import Logic from '../logic/Logic'
import EquipmentManager from '../manager/EquipmentManager'
import StatusIcon from '../ui/StatusIcon'
import DataUtils from '../utils/DataUtils'

const { ccclass, property } = cc._decorator

@ccclass
export default class Status extends cc.Component {
    static readonly BUFF = 0
    static readonly DEBUFF = 1
    anim: cc.Animation
    label: cc.Label
    private stateRunning: boolean = false
    sprite: cc.Sprite = null
    data: StatusData = new StatusData()
    private actor: Actor
    icon: StatusIcon

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite)
        this.label = this.node.getChildByName('sprite').getChildByName('label').getComponent(cc.Label)
        this.anim = this.getComponent(cc.Animation)
    }

    start() {}
    showStatus(data: StatusData, actor: Actor, isFromSave: boolean) {
        if (!this.anim) {
            return
        }
        this.data = data
        this.actor = actor
        this.sprite.spriteFrame = Logic.spriteFrameRes(data.spriteFrameName)
        this.anim.play('StatusShow')
        if (!isFromSave) {
            this.doStatusDamage(true) //非数据保存状态执行瞬时效果
        }
        this.stateRunning = true
        this.label.string = `${this.data.duration > 0 ? this.data.duration : ''}`
        this.label.node.opacity = this.data.duration < 0 || this.data.duration > 500 ? 0 : 255
        if (this.icon) {
            let common = data.Common
            data.infobase = EquipmentManager.getInfoBase(common)
            data.info1 = EquipmentManager.getInfo1(common)
            data.info2 = EquipmentManager.getInfo2(common, null)
            data.info3 = ''
            data.infobasecolor = '#fffff0' //象牙
            data.infocolor1 = '#9370DB' //适中的紫色
            data.infocolor2 = '#87CEFA' //淡蓝色
            data.infocolor3 = '#BC8F8F' //玫瑰棕色
            data.extraInfo = this.getInfo(data)
            this.icon.showStatus(data)
        }
    }
    private getInfo(data: StatusData) {
        let info = ''
        info += DataUtils.getinfoNum2String(data.stackable == 0, '最大层数为', data.stackable, '')
        info += DataUtils.getinfoNum2String(data.physicalDamageOvertime == 0, '每秒受到', data.physicalDamageOvertime, '点物理伤害\n')
        if (data.realDamageOvertime > 0) {
            info += DataUtils.getinfoNum2String(data.realDamageOvertime == 0, '每秒受到', data.realDamageOvertime, '点流血伤害\n')
        } else {
            info += DataUtils.getinfoNum2String(data.realDamageOvertime == 0, '每秒恢复', -data.realDamageOvertime, '点生命\n')
        }
        info += DataUtils.getinfoNum2String(data.magicDamageOvertime == 0, '每秒受到', data.magicDamageOvertime, '点魔法伤害\n')
        info += DataUtils.getinfoNum2String(data.missRate == 0, '攻击丢失几率', data.missRate, '%\n')
        info += DataUtils.getinfoNum2String(data.dizzDurationOvertime == 0, '眩晕', data.dizzDurationOvertime, '秒\n')
        info += DataUtils.getinfoNum2String(data.invisibleDuratonDirect == 0, '隐身', data.invisibleDuratonDirect, '秒\n')
        info += DataUtils.getinfoNum2String(data.variation == 0, '变异', data.variation, '秒\n')
        info += DataUtils.getinfoNum2String(data.dreamOvertime == 0, '持续', data.dreamOvertime, '秒恢复梦境\n')
        info += DataUtils.getinfoNum2String(data.exOilGold == 0, '额外经验获取', data.exOilGold, '点\n')
        info += DataUtils.getinfoNum2String(data.clearHealth == 0, '清理完房间回复生命\n')
        info += DataUtils.getinfoNum2String(data.avoidDeath == 0, '抵挡致命伤')
        return info
    }
    stopStatus() {
        if (!this.node) {
            return
        }
        this.data.duration = 0
        if (this.stateRunning) {
            this.node.destroy()
            if (this.icon) {
                this.icon.node.destroy()
            }
        }
    }
    isStatusRunning(): boolean {
        return this.data.duration > 0 || this.data.duration == -1
    }

    private doStatusDamage(isDirect: boolean) {
        if (!this.data) {
            return
        }
        let dd = isDirect ? this.getDamageDirect() : this.getDamageOverTime()
        let dizzDuration = isDirect ? this.data.dizzDurationDirect : this.data.dizzDurationOvertime
        let dream = isDirect ? this.data.dreamDirect : this.data.dreamOvertime
        if (this.actor) {
            if (dd.getTotalDamage() != 0) {
                this.actor.takeDamage(dd, this.data.From)
            }
            if (dizzDuration > 0) this.actor.takeDizz(dizzDuration)
            if (dream && dream != 0) this.actor.updateDream(dream)
            if (this.data.invisibleDuratonDirect > 0) this.actor.hideSelf(this.data.invisibleDuratonDirect)
            if (isDirect) {
                this.actor.updateLife(this.data.sanityDirect, this.data.solidDirect, this.data.liquidDirect)
            } else {
                this.actor.updateLife(this.data.sanityOvertime, this.data.solidOvertime, this.data.liquidOvertime)
            }
        }
    }

    public updateLogic() {
        this.label.string = `${this.data.duration > 0 ? this.data.duration : ''}`
        this.label.node.opacity = this.data.duration < 0 || this.data.duration > 500 ? 0 : 255
        if (this.icon) {
            this.icon.updateLogic(this.data)
            if (this.data.duration == -1) {
                this.node.active = false
            }
        }
        if (this.data.duration > 0) {
            if (this.data.duration != -1) {
                this.data.duration--
            }
            this.doStatusDamage(false)
        }
        if (this.data.duration == 0 && this.stateRunning) {
            this.stateRunning = false
            this.anim.play('StatusHide')
            this.scheduleOnce(() => {
                if (this.node) {
                    this.node.destroy()
                    if (this.icon) {
                        this.icon.node.destroy()
                    }
                }
            }, 0.5)
        }
    }
    private getDamageDirect(): DamageData {
        let dd = new DamageData()
        dd.realDamage = this.data.realDamageDirect ? this.data.realDamageDirect : 0
        dd.physicalDamage = this.data.physicalDamageDirect ? this.data.physicalDamageDirect : 0
        dd.magicDamage = this.data.magicDamageDirect ? this.data.magicDamageDirect : 0
        return dd
    }
    private getDamageOverTime(): DamageData {
        let dd = new DamageData()
        dd.realDamage = this.data.realDamageOvertime ? this.data.realDamageOvertime : 0
        dd.physicalDamage = this.data.physicalDamageOvertime ? this.data.physicalDamageOvertime : 0
        dd.magicDamage = this.data.magicDamageOvertime ? this.data.magicDamageOvertime : 0
        return dd
    }
}
