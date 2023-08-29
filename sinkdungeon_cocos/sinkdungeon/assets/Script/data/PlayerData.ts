import EquipmentData from './EquipmentData'
import DamageData from './DamageData'
import StatusData from './StatusData'
import CommonData from './CommonData'
import Random from '../utils/Random'
import AvatarData from './AvatarData'
import OilGoldData from './OilGoldData'
import TalentData from './TalentData'
import Shield from '../logic/Shield'
import LifeData from './LifeData'
import DataUtils from '../utils/DataUtils'
import ItemData from './ItemData'
import InventoryData from './InventoryData'
import BaseData from './BaseData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 整改计划
 * 每个角色有独立的两套装备物品和背包且额外封装起来，但是两个角色的容貌是一样的每次梦境结束的时候可以同步部分数据
 * 现实的npc也会有对应的梦境复制体，
 */
export default class PlayerData extends BaseData {
    static DEFAULT_HEALTH = 10
    static DEFAULT_SPEED = 6
    static DEFAULT_JUMP_SPEED = 6
    static DEFAULT_JUMP_HEIGHT = 2
    static DEFAULT_ATTACK = 1
    static DEFAULT_BACK_ATTACK = 0
    static DEFAULT_DREAM = 5
    id = ''
    name: string = ''
    pos: cc.Vec3 = cc.v3(5, 5)
    posZ: number = 0
    roomPos: cc.Vec3 = cc.v3(0, 0)
    isWakeUp = false

    currentHealth: number = PlayerData.DEFAULT_HEALTH
    currentDream: number = PlayerData.DEFAULT_DREAM
    currentAmmo: number = 0
    metalId = ''
    chapterIndex = 999
    chapterLevel = 999
    isEnemy = false

    private common: CommonData
    private equipmentTotalData: EquipmentData
    private statusTotalData: StatusData
    private avatarData: AvatarData
    private oilGoldData: OilGoldData
    private organizationTalentData: TalentData
    private professionTalentData: TalentData
    private statusList: StatusData[]
    private shadowList: number[]
    private lifeData: LifeData
    private finalCommon: CommonData
    private needUpdateFinalCommon = true

    //玩家装备列表
    playerEquips: { [key: string]: EquipmentData } = {}
    playerEquipsReality: { [key: string]: EquipmentData } = {}
    //玩家物品列表
    playerItemList: ItemData[] = new Array()
    playerItemListReality: ItemData[] = new Array()
    //玩家背包列表
    playerInventoryList: InventoryData[] = new Array()
    playerInventoryListReality: InventoryData[] = new Array()

    constructor() {
        super()
        this.id = this.genNonDuplicateID()
        this.equipmentTotalData = new EquipmentData()
        this.statusTotalData = new StatusData()
        this.avatarData = new AvatarData()
        this.oilGoldData = new OilGoldData()
        this.organizationTalentData = new TalentData()
        this.professionTalentData = new TalentData()
        this.lifeData = new LifeData()
        this.statusList = new Array()
        this.common = new CommonData()
        this.common.maxHealth = PlayerData.DEFAULT_HEALTH
        this.common.moveSpeed = PlayerData.DEFAULT_SPEED
        this.common.jumpSpeed = PlayerData.DEFAULT_JUMP_SPEED
        this.common.jumpHeight = PlayerData.DEFAULT_JUMP_HEIGHT
        this.common.damageMin = PlayerData.DEFAULT_ATTACK
        this.common.damageBack = PlayerData.DEFAULT_BACK_ATTACK
        this.common.maxDream = PlayerData.DEFAULT_DREAM
        this.needUpdateFinalCommon = true
        this.shadowList = []
    }

    get ShadowList() {
        return this.shadowList
    }
    get StatusList() {
        return this.statusList
    }
    set StatusList(list: StatusData[]) {
        if (!list) {
            return
        }
        this.statusList = new Array()
        for (let s of list) {
            let data = new StatusData()
            data.valueCopy(s)
            this.statusList.push(data)
        }
    }

    get LifeData() {
        return this.lifeData
    }
    get EquipmentTotalData() {
        return this.equipmentTotalData
    }
    get StatusTotalData() {
        return this.statusTotalData
    }
    get AvatarData() {
        return this.avatarData
    }
    get OilGoldData() {
        return this.oilGoldData
    }
    get OrganizationTalentData() {
        return this.organizationTalentData
    }
    get ProfessionTalentData() {
        return this.professionTalentData
    }
    set AvatarData(data: AvatarData) {
        this.avatarData = data
    }
    get Common() {
        return this.common
    }
    updateFinalCommon() {
        this.needUpdateFinalCommon = true
    }
    get FinalCommon() {
        if (this.needUpdateFinalCommon) {
            this.needUpdateFinalCommon = false
            this.finalCommon = new CommonData()
                .add(this.common)
                .add(this.statusTotalData.Common)
                .add(this.equipmentTotalData.FinalCommon)
                .add(this.avatarData.professionData.Common)
                .add(this.oilGoldData.Common)
        }
        return this.finalCommon
    }

    public valueCopy(data: PlayerData): PlayerData {
        if (!data) {
            return this
        }
        DataUtils.baseCopy(this, data)
        this.common.valueCopy(data.common)
        this.pos = data.pos ? cc.v3(data.pos.x, data.pos.y) : cc.v3(4, 7)
        this.equipmentTotalData.valueCopy(data.equipmentTotalData)
        this.statusTotalData.valueCopy(data.statusTotalData)
        this.avatarData.valueCopy(data.avatarData)
        this.oilGoldData.valueCopy(data.oilGoldData)
        this.lifeData.valueCopy(data.lifeData)
        this.StatusList = data.statusList
        this.organizationTalentData.valueCopy(data.organizationTalentData)
        this.professionTalentData.valueCopy(data.professionTalentData)
        this.shadowList = data.shadowList
        this.needUpdateFinalCommon = true
        this.roomPos = data.roomPos ? cc.v3(data.roomPos.x, data.roomPos.y) : cc.v3(0, 0)
        this.chapterIndex = data.chapterIndex ? data.chapterIndex : 999
        this.chapterLevel = data.chapterLevel ? data.chapterLevel : 999
        this.playerEquips = DataUtils.cloneKeyValue(data.playerEquips, value => new EquipmentData().valueCopy(value))
        this.playerEquipsReality = DataUtils.cloneKeyValue(data.playerEquipsReality, value => new EquipmentData().valueCopy(value))
        this.playerItemList = DataUtils.copyListValue(data.playerItemList, arg0 => {
            return new ItemData().valueCopy(arg0)
        })
        this.playerItemListReality = DataUtils.copyListValue(data.playerItemListReality, arg0 => {
            return new ItemData().valueCopy(arg0)
        })
        this.playerInventoryList = DataUtils.copyListValue(data.playerInventoryList, arg0 => {
            return new InventoryData().valueCopy(arg0)
        })
        this.playerInventoryListReality = DataUtils.copyListValue(data.playerInventoryListReality, arg0 => {
            return new InventoryData().valueCopy(arg0)
        })
        return this
    }

    public clone(): PlayerData {
        let e = new PlayerData()
        e.valueCopy(this)
        return e
    }

    //计算攻击的最终结果
    //5% 6% 20% 1-0.95x0.94X0.8 = 0.16951
    public getFinalAttackPoint(): DamageData {
        let data = this.FinalCommon
        let dd = new DamageData()
        let damageMin = data.DamageMin
        let damageMax = data.DamageMax
        let chance = data.criticalStrikeRate / 100
        let isCritical = Random.rand() < chance
        let attack = isCritical ? damageMin + damageMax : damageMin
        if (attack < 0) {
            attack = 0
        }
        dd.isCriticalStrike = isCritical
        dd.realDamage = data.RealDamage
        dd.magicDamage = data.MagicDamage
        dd.physicalDamage = attack
        if (this.avatarData.organizationIndex == AvatarData.TECH) {
            dd.physicalDamage += this.currentDream * 0.5
        }
        return dd
    }
    //获取最终远程伤害
    public getFinalRemoteDamage(): DamageData {
        let data = this.FinalCommon
        let dd = new DamageData()
        let remoteDamage = data.RemoteDamage
        if (this.avatarData.organizationIndex == AvatarData.HUNTER) {
            remoteDamage += this.currentDream * 0.5
        }
        let chance = data.remoteCritRate / 100
        let isCritical = Random.rand() < chance
        let attack = isCritical ? remoteDamage + remoteDamage : remoteDamage
        if (attack < 0) {
            attack = 0
        }
        dd.physicalDamage = attack
        dd.isCriticalStrike = isCritical
        return dd
    }
    //伤害减免
    public getDamage(damageData: DamageData, blockLevel: number): DamageData {
        let data = this.FinalCommon
        let finalDamageData = damageData.clone()
        let defence = data.Defence
        let defenceMagic = data.magicDefenceRate / 100
        let blockPhysical = data.blockPhysicalRate / 100
        let blockMagic = data.blockMagicRate / 100
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))
        //伤害 = 攻击 + 2-0.94^(-护甲)
        if (defence >= 0) {
            finalDamageData.physicalDamage = finalDamageData.physicalDamage * (1 - (defence * 0.06) / (defence * 0.06 + 1))
        } else {
            finalDamageData.physicalDamage = finalDamageData.physicalDamage * (2 - Math.pow(0.94, -defence))
        }
        finalDamageData.magicDamage = finalDamageData.magicDamage * (1 - defenceMagic)
        if (finalDamageData.physicalDamage > 0 || finalDamageData.magicDamage > 0) {
            if (blockLevel == Shield.BLOCK_NORMAL) {
                finalDamageData.physicalDamage = finalDamageData.physicalDamage * (1 - blockPhysical)
                finalDamageData.magicDamage = finalDamageData.magicDamage * (1 - blockMagic)
            } else if (blockLevel == Shield.BLOCK_PARRY) {
                finalDamageData.physicalDamage = 0
                finalDamageData.magicDamage = 0
                finalDamageData.realDamage = 0
            }
        }

        return finalDamageData
    }

    //吸血默认是1暴击时吸血翻倍
    public getLifeDrain(): number {
        let data = this.FinalCommon
        let chance = data.criticalStrikeRate / 100
        let drainRate = data.lifeDrainRate / 100
        let drain = 0
        if (Random.rand() < drainRate) {
            drain = 0.2
            if (Random.rand() < chance) {
                drain = 1
            }
        }
        return drain
    }

    //初始速度300,最大速度600 最小速度为0
    public getMoveSpeed(): number {
        let data = this.FinalCommon
        let speed = data.MoveSpeed
        if (speed > PlayerData.DEFAULT_SPEED * 2) {
            speed = PlayerData.DEFAULT_SPEED * 2
        }
        if (speed < -PlayerData.DEFAULT_SPEED * 2) {
            speed = -PlayerData.DEFAULT_SPEED * 2
        }
        return speed
    }
    public getJumpSpeed(): number {
        let data = this.FinalCommon
        let speed = data.JumpSpeed
        if (speed < 0) {
            speed = 0
        }
        return speed
    }
    public getJumpHeight(): number {
        let data = this.FinalCommon
        let speed = data.JumpHeight
        if (speed < 0) {
            speed = 0
        }
        return speed
    }
    //生命值
    public getHealth(data: CommonData): cc.Vec3 {
        let rate = 1
        let maxHealth = data.MaxHealth
        if (this.lifeData.sanity <= 0) {
            maxHealth = 1
        }
        if (maxHealth > 0) {
            rate = this.currentHealth / maxHealth
        } else {
            return cc.v3(1, 1)
        }
        return cc.v3(maxHealth * rate, maxHealth)
    }

    //梦境值
    public getDream(data: CommonData): cc.Vec3 {
        let rate = 1
        let maxDream = data.MaxDream
        if (this.lifeData.sanity <= 0) {
            maxDream = 1
        }
        if (maxDream > 0) {
            rate = this.currentDream / maxDream
        } else {
            return cc.v3(1, 1)
        }
        return cc.v3(maxDream * rate, maxDream)
    }
    toJSON(): any {
        const { equipmentTotalData, statusTotalData, ...rest } = this
        return rest
    }
}
