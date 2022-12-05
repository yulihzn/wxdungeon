import PlayerData from '../data/PlayerData'
import EquipmentData from '../data/EquipmentData'
import StatusData from '../data/StatusData'
import AvatarData from '../data/AvatarData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class PlayerInfoDialog extends cc.Component {
    attack: cc.Label = null
    organization: cc.Label = null
    criticalStrikeRate: cc.Label = null
    defence: cc.Label = null
    lifeDrain: cc.Label = null
    damageBack: cc.Label = null
    moveSpeed: cc.Label = null
    attackSpeed: cc.Label = null
    dodge: cc.Label = null
    health: cc.Label = null
    dream: cc.Label = null
    realDamage: cc.Label = null
    realRate: cc.Label = null
    magicDamage: cc.Label = null
    magicDefence: cc.Label = null
    iceRate: cc.Label = null
    fireRate: cc.Label = null
    lighteningRate: cc.Label = null
    toxicRate: cc.Label = null
    curseRate: cc.Label = null
    remoteDamage: cc.Label = null
    remoteCritRate: cc.Label = null
    remoteCooldown: cc.Label = null
    sanity: cc.Label = null
    solidSatiety: cc.Label = null
    liquidSatiety: cc.Label = null

    isShow = false
    layout: cc.Node = null
    playerData: PlayerData
    equipmentData: EquipmentData
    statusData: StatusData
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.attack = this.node.getChildByName('layout').getChildByName('attack').getChildByName('label').getComponent(cc.Label)
        this.organization = this.node.getChildByName('layout').getChildByName('organization').getChildByName('label').getComponent(cc.Label)
        this.criticalStrikeRate = this.node.getChildByName('layout').getChildByName('criticalStrikeRate').getChildByName('label').getComponent(cc.Label)
        this.defence = this.node.getChildByName('layout').getChildByName('defence').getChildByName('label').getComponent(cc.Label)
        this.lifeDrain = this.node.getChildByName('layout').getChildByName('lifeDrainRate').getChildByName('label').getComponent(cc.Label)
        this.damageBack = this.node.getChildByName('layout').getChildByName('damageBack').getChildByName('label').getComponent(cc.Label)
        this.moveSpeed = this.node.getChildByName('layout').getChildByName('moveSpeed').getChildByName('label').getComponent(cc.Label)
        this.attackSpeed = this.node.getChildByName('layout').getChildByName('attackSpeed').getChildByName('label').getComponent(cc.Label)
        this.dodge = this.node.getChildByName('layout').getChildByName('dodgeRate').getChildByName('label').getComponent(cc.Label)
        this.health = this.node.getChildByName('layout').getChildByName('health').getChildByName('label').getComponent(cc.Label)
        this.dream = this.node.getChildByName('layout').getChildByName('dream').getChildByName('label').getComponent(cc.Label)
        this.realDamage = this.node.getChildByName('layout').getChildByName('realDamage').getChildByName('label').getComponent(cc.Label)
        this.realRate = this.node.getChildByName('layout').getChildByName('realRate').getChildByName('label').getComponent(cc.Label)
        this.magicDamage = this.node.getChildByName('layout').getChildByName('magicDamage').getChildByName('label').getComponent(cc.Label)
        this.magicDefence = this.node.getChildByName('layout').getChildByName('magicDefence').getChildByName('label').getComponent(cc.Label)
        this.iceRate = this.node.getChildByName('layout').getChildByName('iceRate').getChildByName('label').getComponent(cc.Label)
        this.fireRate = this.node.getChildByName('layout').getChildByName('fireRate').getChildByName('label').getComponent(cc.Label)
        this.lighteningRate = this.node.getChildByName('layout').getChildByName('lighteningRate').getChildByName('label').getComponent(cc.Label)
        this.toxicRate = this.node.getChildByName('layout').getChildByName('toxicRate').getChildByName('label').getComponent(cc.Label)
        this.curseRate = this.node.getChildByName('layout').getChildByName('curseRate').getChildByName('label').getComponent(cc.Label)
        this.remoteCooldown = this.node.getChildByName('layout').getChildByName('remoteCooldown').getChildByName('label').getComponent(cc.Label)
        this.remoteCritRate = this.node.getChildByName('layout').getChildByName('remoteCritRate').getChildByName('label').getComponent(cc.Label)
        this.remoteDamage = this.node.getChildByName('layout').getChildByName('remoteDamage').getChildByName('label').getComponent(cc.Label)
        this.sanity = this.node.getChildByName('layout').getChildByName('sanity').getChildByName('label').getComponent(cc.Label)
        this.solidSatiety = this.node.getChildByName('layout').getChildByName('solidSatiety').getChildByName('label').getComponent(cc.Label)
        this.liquidSatiety = this.node.getChildByName('layout').getChildByName('liquidSatiety').getChildByName('label').getComponent(cc.Label)
        this.layout = this.node.getChildByName('layout')
        this.addSpriteTouchEvent()
    }

    start() {}
    refreshDialog(playerData: PlayerData, equipmentData: EquipmentData, statusData: StatusData) {
        if (!this.attack || !playerData || !equipmentData || !statusData) {
            return
        }
        this.playerData = playerData
        this.equipmentData = equipmentData
        this.statusData = statusData
        if (!this.layout.active) {
            return
        }
        let baseCommonData = playerData.Common.clone().add(playerData.AvatarData.professionData.Common)
        this.organization.string = AvatarData.ORGANIZATION[playerData.AvatarData.organizationIndex]
        this.attack.string =
            this.getInfo(baseCommonData.DamageMin, equipmentData.FinalCommon.DamageMin, statusData.Common.DamageMin) +
            '    MAX:' +
            this.getInfo(baseCommonData.DamageMax, equipmentData.FinalCommon.DamageMax, statusData.Common.DamageMax)
        this.criticalStrikeRate.string = this.getInfo(baseCommonData.criticalStrikeRate, equipmentData.FinalCommon.criticalStrikeRate, statusData.Common.criticalStrikeRate, true)
        this.defence.string = this.getInfo(baseCommonData.Defence, equipmentData.FinalCommon.Defence, statusData.Common.Defence)
        this.lifeDrain.string = this.getInfo(baseCommonData.lifeDrainRate, equipmentData.FinalCommon.lifeDrainRate, statusData.Common.lifeDrainRate, true)
        this.damageBack.string = this.getInfo(baseCommonData.DamageBack, equipmentData.FinalCommon.DamageBack, statusData.Common.DamageBack)
        this.moveSpeed.string = this.getInfo(baseCommonData.MoveSpeed, equipmentData.FinalCommon.MoveSpeed, statusData.Common.MoveSpeed)
        this.attackSpeed.string = this.getInfo(baseCommonData.AttackSpeed, equipmentData.FinalCommon.AttackSpeed, statusData.Common.AttackSpeed)
        this.dodge.string = this.getInfo(baseCommonData.dodgeRate, equipmentData.FinalCommon.dodgeRate, statusData.Common.dodgeRate, true)
        this.health.string =
            playerData.currentHealth.toFixed(1).replace('.0', '') + '/' + this.getInfo(baseCommonData.MaxHealth, equipmentData.FinalCommon.MaxHealth, statusData.Common.MaxHealth)
        this.dream.string =
            playerData.currentDream.toFixed(1).replace('.0', '') + '/' + this.getInfo(baseCommonData.MaxDream, equipmentData.FinalCommon.MaxDream, statusData.Common.MaxDream)
        this.realDamage.string = this.getInfo(baseCommonData.RealDamage, equipmentData.FinalCommon.RealDamage, statusData.Common.RealDamage)
        this.realRate.string = this.getInfo(baseCommonData.realRate, equipmentData.FinalCommon.realRate, statusData.Common.realRate, true)
        this.magicDamage.string = this.getInfo(baseCommonData.MagicDamage, equipmentData.FinalCommon.MagicDamage, statusData.Common.MagicDamage)
        this.magicDefence.string = this.getInfo(baseCommonData.magicDefenceRate, equipmentData.FinalCommon.magicDefenceRate, statusData.Common.magicDefenceRate, true)
        this.iceRate.string = this.getInfo(baseCommonData.iceRate, equipmentData.FinalCommon.iceRate, statusData.Common.iceRate, true)
        this.fireRate.string = this.getInfo(baseCommonData.fireRate, equipmentData.FinalCommon.fireRate, statusData.Common.fireRate, true)
        this.lighteningRate.string = this.getInfo(baseCommonData.lighteningRate, equipmentData.FinalCommon.lighteningRate, statusData.Common.lighteningRate, true)
        this.toxicRate.string = this.getInfo(baseCommonData.toxicRate, equipmentData.FinalCommon.toxicRate, statusData.Common.toxicRate, true)
        this.curseRate.string = this.getInfo(baseCommonData.curseRate, equipmentData.FinalCommon.curseRate, statusData.Common.curseRate, true)
        this.remoteCritRate.string = this.getInfo(baseCommonData.remoteCritRate, equipmentData.FinalCommon.remoteCritRate, statusData.Common.remoteCritRate, true)
        this.remoteDamage.string = this.getInfo(baseCommonData.RemoteDamage, equipmentData.FinalCommon.RemoteDamage, statusData.Common.RemoteDamage)
        this.remoteCooldown.string = this.getInfo(baseCommonData.remoteCooldown, equipmentData.FinalCommon.remoteCooldown, statusData.Common.remoteCooldown)
        this.sanity.string = this.getInfo(playerData.LifeData.sanity, 0, 0, true)
        this.solidSatiety.string = this.getInfo(playerData.LifeData.solidSatiety, 0, 0, true)
        this.liquidSatiety.string = this.getInfo(playerData.LifeData.liquidSatiety, 0, 0, true)
    }

    private getInfo(base: number, equip: number, status: number, isPercent?: boolean): string {
        let s = `${(base + equip + status).toFixed(1).replace('.0', '')}`
        if (isPercent) {
            s += '%'
        }
        if (equip > 0) {
            s += ' E:+' + equip.toFixed(1).replace('.0', '')
            if (isPercent) {
                s += '%'
            }
        } else if (equip < 0) {
            s += ' E:' + equip.toFixed(1).replace('.0', '')
            if (isPercent) {
                s += '%'
            }
        }
        if (status > 0) {
            s += ' S:+' + status.toFixed(1).replace('.0', '')
            if (isPercent) {
                s += '%'
            }
        } else if (status < 0) {
            s += ' S:' + status.toFixed(1).replace('.0', '')
            if (isPercent) {
                s += '%'
            }
        }
        return s
    }
    addSpriteTouchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.isShow = true
            this.refreshDialog(this.playerData, this.equipmentData, this.statusData)
        })
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.isShow = false
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.isShow = false
        })
    }
    update(dt) {
        this.layout.active = this.isShow
    }
}
