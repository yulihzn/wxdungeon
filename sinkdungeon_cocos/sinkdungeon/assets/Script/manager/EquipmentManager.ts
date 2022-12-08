import Dungeon from '../logic/Dungeon'
import Logic from '../logic/Logic'
import EquipmentData from '../data/EquipmentData'
import Equipment from '../equipment/Equipment'
import ShopTable from '../building/ShopTable'
import IndexZ from '../utils/IndexZ'
import CommonData from '../data/CommonData'
import Random4Save from '../utils/Random4Save'
import BaseManager from './BaseManager'
import { EventHelper } from '../logic/EventHelper'
import Player from '../logic/Player'
import SuitData from '../data/SuitData'
import DataUtils from '../utils/DataUtils'
import AffixManager from './AffixManager'
import AffixData from '../data/AffixData'
import MapManager from './MapManager'
import AffixMapData from '../data/AffixMapData'

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

/**
 * 装备的词缀分为全局和局部两种，全局会影响整体的数值，而局部只会影响当前装备
 * 箱子的等级1,2,3越来越高
 * 装备品质对应随机词缀条数
 * 白色（普通0）→绿色（精良1）→蓝色（优秀2）→紫色（史诗3）→金色（传说4）→橙色（神话5）
 * 红色（诅咒）红色是固定属性的诅咒装备，属于特殊掉落无法重铸和强化，红色装备都是独一无二的
 * 装备的套装属性和成长属性手工填写
 * 一个词缀按强度从1到9，名称也跟着变化，词缀的参数和装备等级挂钩
 * 强化和重铸都需要消耗金币
 * 强化功能可以强化词缀，需要强化碎片来进行强化按概率会出现失败，失败暂时无惩罚
 * 重铸功能可以替换随机词缀，被重铸的词缀的强度保持不变，且可以指定某一条重铸
 * 不需要的装备直接卖钱，根据词缀的强度和类型换算
 *
 * 装备生成权重按白40% 绿30% 蓝15% 紫9% 金5% 橙1%
 * 词缀强度权重会根据品质从绿到红色随机1-4之间概率选取，后续5阶需要自己强化
 *
 */
@ccclass
export default class EquipmentManager extends BaseManager {
    public static readonly EMPTY = 'emptyequipment'
    public static readonly WEAPON_DINNERFORK = 'weapon000'
    public static readonly WEAPON_KNIFE = 'weapon001'
    public static readonly WEAPON_CHOPPER = 'weapon002'
    public static readonly WEAPON_HUGEBLADE = 'weapon003'
    public static readonly WEAPON_PITCHFORK = 'weapon004'
    public static readonly WEAPON_HUGEAXE = 'weapon005'
    public static readonly WEAPON_CROWBAR = 'weapon006'
    public static readonly WEAPON_KATANA = 'weapon007'
    public static readonly WEAPON_FRUITKNIFE = 'weapon008'
    public static readonly WEAPON_HAPPYFIRE = 'weapon009'
    public static readonly WEAPON_SADICE = 'weapon010'
    public static readonly WEAPON_EGYPTWAND = 'weapon011'
    public static readonly WEAPON_TOXICDAGGER = 'weapon012'
    public static readonly WEAPON_OLDROOTDAGGER = 'weapon013'
    public static readonly WEAPON_COOKCHOPPER = 'weapon014'
    public static readonly WEAPON_LIGHTENINGBLADE = 'weapon015'
    public static readonly WEAPON_JUNGLEFORK = 'weapon016'
    public static readonly WEAPON_KUNAI = 'weapon017'
    public static readonly WEAPON_DEATH = 'weapon018'
    public static readonly WEAPON_SHADOW = 'weapon019'
    public static readonly WEAPON_BLOOD = 'weapon020'
    public static readonly WEAPON_WINE_BOTTLE = 'weapon032'
    public static readonly WEAPON_WOOD_SWORD = 'weapon039'
    public static readonly WEAPON_WOOD_HAMMER = 'weapon040'
    public static readonly WEAPON_WOOD_DAGGER = 'weapon041'
    public static readonly WEAPON_WOOD_SPEAR = 'weapon042'
    public static readonly WEAPON_WOOD_LONG_STICK = 'weapon043'
    public static readonly WEAPON_WOOD_LONG_CROSS = 'weapon044'
    public static readonly WEAPON_BROKEN_GLASS = 'weapon045'
    public static readonly REMOTE_CROSSBOW = 'remote001'
    public static readonly REMOTE_LONGBOW = 'remote002'
    public static readonly REMOTE_WAND = 'remote003'
    public static readonly REMOTE_ALIENGUN = 'remote004'
    public static readonly REMOTE_WINCHESTER = 'remote005'
    public static readonly REMOTE_RPG = 'remote006'
    public static readonly REMOTE_SHURIKEN = 'remote007'
    public static readonly REMOTE_CHICKEN = 'remote008'
    public static readonly REMOTE_OLDGUN = 'remote009'
    public static readonly REMOTE_BASKETBALL = 'remote011'
    public static readonly SHIELD_CIRCLE = 'shield000'
    public static readonly SHIELD_CARDOOR = 'shield001'
    public static readonly SHIELD_POLICE = 'shield002'
    public static readonly CLOTHES_VEST = 'clothes001'
    public static readonly CLOTHES_SHIRT = 'clothes002'
    public static readonly CLOTHES_NAVY = 'clothes003'
    public static readonly CLOTHES_PIRATE = 'clothes004'
    public static readonly CLOTHES_BUCKET = 'clothes005'
    public static readonly CLOTHES_REDROBE = 'clothes006'
    public static readonly CLOTHES_WHITEROBE = 'clothes007'
    public static readonly CLOTHES_GENTLEMAN = 'clothes008'
    public static readonly CLOTHES_RADIATION = 'clothes009'
    public static readonly CLOTHES_JUNGLE = 'clothes010'
    public static readonly CLOTHES_PHARAOH = 'clothes011'
    public static readonly CLOTHES_KNIGHT = 'clothes012'
    public static readonly CLOTHES_DEATH = 'clothes013'
    public static readonly CLOTHES_ENERGY = 'clothes014'
    public static readonly CLOTHES_CAI = 'clothes026'
    public static readonly HELMET_BUCKETHAT = 'helmet002'
    public static readonly HELMET_PIRATEHAT = 'helmet003'
    public static readonly HELMET_REDHAT = 'helmet004'
    public static readonly HELMET_WHITEHAT = 'helmet005'
    public static readonly HELMET_PHARAOH = 'helmet006'
    public static readonly HELMET_CAT = 'helmet007'
    public static readonly HELMET_CHIEF = 'helmet008'
    public static readonly HELMET_HORUS = 'helmet009'
    public static readonly HELMET_GENTLEMAN = 'helmet010'
    public static readonly HELMET_CHICKEN = 'helmet011'
    public static readonly HELMET_DUCK = 'helmet012'
    public static readonly HELMET_GOOSE = 'helmet013'
    public static readonly HELMET_RADIATION = 'helmet014'
    public static readonly HELMET_JUNGLE = 'helmet015'
    public static readonly HELMET_ANUBIS = 'helmet016'
    public static readonly HELMET_KNIGHT = 'helmet017'
    public static readonly HELMET_DEATH = 'helmet018'
    public static readonly HELMET_ENERY = 'helmet019'
    public static readonly CLOAK_WARRIOR = 'cloak001'
    public static readonly TROUSERS_LONG = 'trousers001'
    public static readonly TROUSERS_SHORT = 'trousers002'
    public static readonly TROUSERS_RADIATION = 'trousers003'
    public static readonly TROUSERS_JUNGLE = 'trousers004'
    public static readonly TROUSERS_PHARAOH = 'trousers005'
    public static readonly TROUSERS_KNIGHT = 'trousers006'
    public static readonly TROUSERS_DEATH = 'trousers007'
    public static readonly TROUSERS_ENERGY = 'trousers008'
    public static readonly GLOVES_WARRIOR = 'gloves001'
    public static readonly GLOVES_DEMON = 'gloves002'
    public static readonly GLOVES_BLOODCRAW = 'gloves003'
    public static readonly GLOVES_RADIATION = 'gloves004'
    public static readonly GLOVES_JUNGLE = 'gloves005'
    public static readonly GLOVES_PHARAOH = 'gloves006'
    public static readonly GLOVES_KNIGHT = 'gloves007'
    public static readonly GLOVES_DEATH = 'gloves008'
    public static readonly GLOVES_ENERGY = 'gloves009'
    public static readonly SHOES_WARRIOR = 'shoes001'
    public static readonly SHOES_SKATEBOARD = 'shoes002'
    public static readonly SHOES_DEMON = 'shoes003'
    public static readonly SHOES_RADIATION = 'shoes004'
    public static readonly SHOES_JUNGLE = 'shoes005'
    public static readonly SHOES_PHARAOH = 'shoes006'
    public static readonly SHOES_KNIGHT = 'shoes007'
    public static readonly SHOES_DEATH = 'shoes008'
    public static readonly SHOES_ENERGY = 'shoes009'

    //暴击的(暴击)
    public static readonly COLOR_CRITICALSTRIKE = '#DC143C' //猩红
    //迅捷的(攻击速度)
    public static readonly COLOR_ATTACKSPPED = '#5F9EA0' //军校蓝
    //灵动的(移动速度)
    public static readonly COLOR_MOVESPEED = '#00BFFF' //深天蓝
    //飘逸的(闪避几率)
    public static readonly COLOR_DODGE = '#FFFF00' //黄色
    //坚固的(防御力)
    public static readonly COLOR_STABLE = '#DEB887' //结实的树棕色
    //强力的(攻击力)
    public static readonly COLOR_POWERFUL = '#ADFF2F' //绿黄色
    //健康的(最大生命值)
    public static readonly COLOR_HEALTHY = '#90EE90' //淡绿色
    //邪恶的(生命汲取)
    public static readonly COLOR_LIFEDRAIN = '#FFC0CB' //粉红
    //阴冷的(背刺)
    public static readonly COLOR_BACK = '#9370DB' //适中的兰花紫
    //梦幻的(背刺)
    public static readonly COLOR_DREAM = '#800080' //紫色

    static readonly GREEN_AFFIX_RATE = [0.5, 0.85, 0.95, 1] //   50% 35% 10% 5%
    static readonly BLUE_AFFIX_RATE = [0.4, 0.7, 0.9, 1] //   40% 30% 20% 10%
    static readonly PURPLE_AFFIX_RATE = [0.3, 0.6, 0.8, 1] //   30% 30% 20% 20%
    static readonly YELLOW_AFFIX_RATE = [0.2, 0.4, 0.7, 1] //   20% 20% 30% 30%
    static readonly ORANGE_AFFIX_RATE = [0.1, 0.2, 0.5, 1] //   10% 10% 30% 50%
    static readonly QUALITY_RATE = [0.81, 0.91, 0.96, 0.99, 0.999] //   81% 10% 5% 3% 0.9% 0.1%
    static readonly QUALITY_WHITE = 0
    static readonly QUALITY_GREEN = 1
    static readonly QUALITY_BLUE = 2
    static readonly QUALITY_PURPLE = 3
    static readonly QUALITY_GOLD = 4
    static readonly QUALITY_ORANGE = 5
    static readonly QUALITY_RED = 6

    @property(cc.Prefab)
    equipment: cc.Prefab = null
    groundList: Equipment[] = []
    lastGroundEquip: Equipment

    clear(): void {
        this.groundList = []
    }

    static getRandomRange() {
        return 5 + Logic.chapterMaxIndex + Math.floor(Logic.playerData.OilGoldData.level / 5)
    }
    static isTheEquipType(theType: string, types: string[]): boolean {
        let isTheType = false
        for (let t of types) {
            if (t == theType) {
                isTheType = true
            }
        }
        return isTheType
    }
    //如果有箱子品质则保底为箱子品质
    static getRandomQuality(chestQuality: number, rand4save: Random4Save) {
        let quality = 0
        let rand = rand4save.rand()
        //箱子出来的物品属性挂钩相关的优质属性
        if (chestQuality && chestQuality > 0 && rand4save.getHalfChance()) {
            return chestQuality
        }
        if (rand < EquipmentManager.QUALITY_RATE[0]) {
            quality = 0
        } else if (rand >= EquipmentManager.QUALITY_RATE[0] && rand < EquipmentManager.QUALITY_RATE[1]) {
            quality = 1
        } else if (rand >= EquipmentManager.QUALITY_RATE[1] && rand < EquipmentManager.QUALITY_RATE[2]) {
            quality = 2
        } else if (rand >= EquipmentManager.QUALITY_RATE[2] && rand < EquipmentManager.QUALITY_RATE[3]) {
            quality = 3
        } else if (rand >= EquipmentManager.QUALITY_RATE[3] && rand < EquipmentManager.QUALITY_RATE[4]) {
            quality = 4
        } else {
            quality = 5
        }
        if (chestQuality && chestQuality > 0 && quality < chestQuality) {
            quality = chestQuality
        }
        cc.log(rand)
        return quality
    }
    getEquipment(equipType: string, pos: cc.Vec3, parent: cc.Node, equipData?: EquipmentData, chestQuality?: number, shopTable?: ShopTable): Equipment {
        let equipmentPrefab = cc.instantiate(this.equipment)
        equipmentPrefab.parent = parent
        equipmentPrefab.position = pos
        equipmentPrefab.zIndex = IndexZ.OVERHEAD
        let equipment = equipmentPrefab.getComponent(Equipment)
        equipment.pos = Dungeon.getIndexInMap(pos)
        if (equipData) {
            //复制已有装备
            if (shopTable) {
                equipment.shopTable = shopTable
                equipData.price = 50 * (equipData.quality + 1)
                shopTable.data.equipdata = equipData.clone()
            }
            equipment.refresh(equipData)
        } else {
            //添加新装备
            let data = EquipmentManager.getNewEquipData(equipType, false, chestQuality)
            if (shopTable) {
                equipment.shopTable = shopTable
                shopTable.data.equipdata = data.clone()
                shopTable.data.price = data.price
            }
            equipment.refresh(data)
        }
        this.groundList.push(equipment)
        return equipment
    }
    /**
     * 获取新的装备数据
     * @param equipType 装备类别
     * @param isOriginal 是否初始无随机词缀
     * @param chestQuality 最低品质 isOriginal为true的时候无效
     * @returns
     */
    static getNewEquipData(equipType: string, isOriginal?: boolean, chestQuality?: number): EquipmentData {
        if (equipType.length == 0) {
            return
        }
        let data = new EquipmentData()
        data.valueCopy(Logic.equipments[equipType])
        let tempid = data.img.substring(data.equipmetType.length)
        if (tempid.length > 0) {
            data.id = data.id + parseInt(tempid)
        }
        data.uuid = data.genNonDuplicateID()
        for (let ex of data.exTriggers) {
            ex.uuid = data.genNonDuplicateID()
        }
        if (!isOriginal) {
            let rand4save = Logic.mapManager.getCurrentRoomRandom4Save(MapManager.RANDOM_EQUIP)
            //获取品质
            data.quality = EquipmentManager.getRandomQuality(chestQuality, rand4save)
            //根据品质生成随机属性
            AffixManager.buildEquipmentAffixs(data, rand4save)
        }
        //升级装备和价值
        EquipmentManager.updateUpgradeEquipment(data)

        return data.clone()
    }
    /**
     * 装备升级信息更新 装备生成完毕需要调用这个来修正等级带来的加成
     * @param data
     */
    static updateUpgradeEquipment(data: EquipmentData) {
        for (let i of AffixManager.BASE_UPGRADE) {
            let map = new AffixMapData().valueCopy(Logic.affixs[i])
            data.Common[map.common] = data.Common[map.common] + data.Common[map.common] * map.factor * data.requireLevel
        }
        for (let affix of data.affixs) {
            let map = new AffixMapData().valueCopy(Logic.affixs[affix.groupId])
            AffixManager.buildAffixNameAndCommon(affix, map, data.requireLevel)
        }
        data.updateFinalCommon()
        data.price += EquipmentManager.getPrice(data)
        data.infobase = EquipmentManager.getInfoBase(data.Common)
        data.info1 = EquipmentManager.getInfo1(data.Common)
        data.info2 = EquipmentManager.getInfo2(data.Common, data)
        data.info3 = EquipmentManager.getInfo3(data.affixs)
        data.suit1 = EquipmentManager.getSuitDesc(data.suitType, 0)
        data.suit2 = EquipmentManager.getSuitDesc(data.suitType, 1)
        data.suit3 = EquipmentManager.getSuitDesc(data.suitType, 2)
        data.infobasecolor = '#fffff0' //象牙
        data.infocolor1 = '#9370DB' //适中的紫色
        data.infocolor2 = '#87CEFA' //淡蓝色
        data.infocolor3 = '#BC8F8F' //玫瑰棕色
        data.suitcolor1 = '#FFD700' //金
        data.suitcolor2 = '#FFD700' //金
        data.suitcolor3 = '#FFD700' //金
    }
    /**
     * 升级装备
     * @param data
     */
    static upgradeEquipment(data: EquipmentData) {
        if (data.requireLevel >= Logic.playerData.OilGoldData.level) {
            return
        }
        data.requireLevel++
        this.updateUpgradeEquipment(data)
    }

    static getSuitDesc(suitType: string, suitIndex: number) {
        let suit = Logic.suits[suitType]
        if (!suit) {
            return ''
        }
        let data = new SuitData()
        data.valueCopy(Logic.suits[suitType])
        if (suitIndex >= data.EquipList.length) {
            return ''
        }
        let info = ``
        let title = suitIndex == 0 ? `${data.nameCn}\n` : ``
        let base = EquipmentManager.getInfoBase(data.EquipList[suitIndex].Common)
        let info1 = EquipmentManager.getInfo1(data.EquipList[suitIndex].Common)
        let info2 = EquipmentManager.getInfo2(data.EquipList[suitIndex].Common, data.EquipList[suitIndex])
        info += base + ` `
        info += info1 + ` `
        info += info2 + ` `
        info += data.EquipList[suitIndex].extraInfo
        return title + info.replace('\n', '')
    }
    static getInfoBase(common: CommonData): string {
        let info = ``
        info += DataUtils.getinfoNum2String(common.remoteDamage == 0, '子弹伤害', common.remoteDamage, '\n')
        info += DataUtils.getinfoNum2String(common.remoteDamagePercent == 0, `子弹伤害${common.remoteDamagePercent > 0 ? '提升' : '降低'}`, common.remoteDamagePercent, '%\n')
        info += DataUtils.getinfoNum2String(common.remoteCritRate == 0, ' 子弹暴击率', common.remoteCritRate, '\n')
        info += DataUtils.getinfoNum2String(common.remoteCooldown == 0, ' 装填时间', common.remoteCooldown / 1000, 's\n')
        info += DataUtils.getinfoNum2String(common.remoteInterval == 0, '射击间隔', common.remoteInterval / 1000, 's\n')
        info += DataUtils.getinfoNum2String(common.remoteAngle == 0, '误差角度', common.remoteAngle, '\n')
        info += DataUtils.getinfoNum2String(common.maxAmmo == 0, `弹夹容量${common.maxAmmo > 0 ? common.maxAmmo : '∞'}\n`)
        info += DataUtils.getinfoNum2String(common.ammoRecovery == 0, '弹夹回复', common.ammoRecovery, '\n')
        info += DataUtils.getinfoNum2String(common.maxAmmoPercent == 0, `弹夹容量${common.maxAmmoPercent > 0 ? '提升' : '降低'}`, common.maxAmmoPercent, '%\n')
        info += DataUtils.getinfoNum2String(common.ammoRecoveryPercent == 0, `弹夹回复${common.ammoRecoveryPercent > 0 ? '提升' : '降低'}`, common.ammoRecoveryPercent, '%\n')
        info += DataUtils.getinfoNum2String(common.damageMin == 0, `攻击${common.damageMin} ${common.damageMax != 0 ? '最大攻击力' + common.damageMax : ''}\n`)
        if (common.damageMin == 0) {
            info += DataUtils.getinfoNum2String(common.damageMax == 0, '最大攻击力', common.damageMax, '\n')
        }
        info += DataUtils.getinfoNum2String(common.damageMinPercent == 0, `攻击${common.damageMin > 0 ? '提升' : '降低'}`, common.damageMin, '%\n')
        info += DataUtils.getinfoNum2String(common.damageMaxPercent == 0, `最大攻击力${common.damageMaxPercent > 0 ? '提升' : '降低'}`, common.damageMaxPercent, '%\n')
        info += DataUtils.getinfoNum2String(common.defence == 0, '防御', common.defence, '\n')
        info += DataUtils.getinfoNum2String(common.defencePercent == 0, `防御${common.defencePercent > 0 ? '提升' : '降低'}`, common.defencePercent, '%\n')
        info += DataUtils.getinfoNum2String(common.maxHealth == 0, '生命', common.maxHealth, '\n')
        info += DataUtils.getinfoNum2String(common.maxHealthPercent == 0, `生命${common.maxHealthPercent > 0 ? '提升' : '降低'}`, common.maxHealthPercent, '%\n')
        info += DataUtils.getinfoNum2String(common.maxDream == 0, '梦境', common.maxDream, '\n')
        info += DataUtils.getinfoNum2String(common.maxDreamPercent == 0, `梦境${common.maxDreamPercent > 0 ? '提升' : '降低'}`, common.maxDreamPercent, '%\n')
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'))
        }
        info = info.replace('+-', '-')
        return info
    }
    static getInfo1(common: CommonData): string {
        let info = ``
        info += DataUtils.getinfoNum2String(common.criticalStrikeRate == 0, '暴击', common.criticalStrikeRate, '%\n')
        info += DataUtils.getinfoNum2String(common.lifeDrainRate == 0, '吸血', common.lifeDrainRate, '%\n')
        info += DataUtils.getinfoNum2String(common.damageBack == 0, '背刺', common.damageBack, '\n')
        info += DataUtils.getinfoNum2String(common.damageBackPercent == 0, `背刺${common.damageBackPercent > 0 ? '提升' : '降低'}`, common.damageBackPercent, '%\n')
        info += DataUtils.getinfoNum2String(common.moveSpeed == 0, '移速', common.moveSpeed, '\n')
        info += DataUtils.getinfoNum2String(common.moveSpeedPercent == 0, `移速${common.moveSpeedPercent > 0 ? '提升' : '降低'}`, common.moveSpeedPercent, '%\n')
        info += DataUtils.getinfoNum2String(common.attackSpeed == 0, `攻速${common.attackSpeed}\n`)
        info += DataUtils.getinfoNum2String(common.attackSpeedPercent == 0, `攻速${common.attackSpeedPercent > 0 ? '提升' : '降低'}`, common.attackSpeedPercent, '%\n')
        info += DataUtils.getinfoNum2String(common.dodgeRate == 0, '闪避', common.dodgeRate, '%\n')
        info += DataUtils.getinfoNum2String(common.blockDamage == 0, '弹反伤害', common.blockDamage, '\n')
        info += DataUtils.getinfoNum2String(common.blockPhysicalRate == 0, '格挡物免', common.blockPhysicalRate, '%\n')
        info += DataUtils.getinfoNum2String(common.blockMagicRate == 0, '格挡魔免', common.blockMagicRate, '%\n')
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'))
        }
        info = info.replace('+-', '-')
        return info
    }
    static getInfo2(common: CommonData, data: EquipmentData): string {
        let info = ``
        info += `${data && data.isReflect > 0 ? '反弹子弹\n' : ''}`
        info += DataUtils.getinfoNum2String(common.realDamage == 0, '攻击附加', common.realDamage, '点流血伤害\n')
        info += DataUtils.getinfoNum2String(common.realDamagePercent == 0, `流血伤害${common.realDamagePercent > 0 ? '提升' : '降低'}`, common.realDamagePercent, '%\n')
        info += DataUtils.getinfoNum2String(common.realRate == 0, '攻击有', common.realRate, '%几率释放流血\n')
        info += DataUtils.getinfoNum2String(common.magicDamage == 0, '攻击附加', common.magicDamage, '点元素伤害\n')
        info += DataUtils.getinfoNum2String(common.magicDamagePercent == 0, `元素伤害${common.magicDamagePercent > 0 ? '提升' : '降低'}`, common.magicDamagePercent, '%\n')
        info += DataUtils.getinfoNum2String(common.iceRate == 0, '攻击有', common.iceRate, '%几率释放冰冻\n')
        info += DataUtils.getinfoNum2String(common.fireRate == 0, '攻击有', common.fireRate, '%几率释放燃烧\n')
        info += DataUtils.getinfoNum2String(common.lighteningRate == 0, '攻击有', common.lighteningRate, '%几率释放闪电\n')
        info += DataUtils.getinfoNum2String(common.toxicRate == 0, '攻击有', common.toxicRate, '%几率释放毒素\n')
        info += DataUtils.getinfoNum2String(common.curseRate == 0, '攻击有', common.curseRate, '%几率释放诅咒\n')
        info += DataUtils.getinfoNum2String(common.magicDefenceRate == 0, '元素抗性', common.magicDefenceRate, '%\n')
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'))
        }
        info = info.replace('+-', '-')
        return info
    }
    static getInfo3(affixs: AffixData[]): string {
        let info = ``
        for (let affix of affixs) {
            info += `${affix.desc}\n`
        }
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'))
        }
        info = info.replace('+-', '-')
        return info
    }

    start() {}

    static getMixColor(color1: string, color2: string): string {
        let c1 = cc.color().fromHEX(color1)
        let c2 = cc.color().fromHEX(color2)
        let c3 = cc.color()
        let r = c1.getR() + c2.getR()
        let g = c1.getG() + c2.getG()
        let b = c1.getB() + c2.getB()

        c3.setR(r > 255 ? 255 : r)
        c3.setG(g > 255 ? 255 : g)
        c3.setB(b > 255 ? 255 : b)
        return '#' + c3.toHEX('#rrggbb')
    }
    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 0.2) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }

    static getPrice(data: EquipmentData): number {
        let price = 0
        if (data.test > 0) {
            return 0
        }
        price += data.FinalCommon.maxHealth * 5 //最大生命25
        price += data.FinalCommon.maxDream * 10 //最大梦境值25
        price += data.FinalCommon.damageMin * 10 //最小攻击50
        price += data.FinalCommon.damageMax * 5 //最大攻击25
        price += data.FinalCommon.damageBack * 5 //背面额外攻击伤害
        price += data.FinalCommon.criticalStrikeRate * 3 //暴击
        price += data.FinalCommon.defence * 5 //物理防御
        price += data.FinalCommon.blockPhysicalRate / 2 //物理格百分比
        price += data.FinalCommon.blockMagicRate / 2 //魔法格挡百分比
        price += data.FinalCommon.blockDamage * 5 //弹反伤害
        price += data.FinalCommon.lifeDrainRate //吸血
        if (data.FinalCommon.moveSpeed < 0) {
            price += -20
        } else {
            price += data.FinalCommon.moveSpeed * 50 //移速
        }
        if (data.FinalCommon.jumpSpeed < 0) {
            price += -20
        } else {
            price += data.FinalCommon.jumpSpeed * 20 //跳速
        }
        if (data.FinalCommon.jumpHeight < 0) {
            price += -20
        } else {
            price += data.FinalCommon.jumpHeight * 20 //跳跃高度
        }
        if (data.FinalCommon.attackSpeed < 0) {
            price += -10
        } else {
            price += data.FinalCommon.attackSpeed //攻速
        }
        price += data.FinalCommon.dodgeRate * 2 //闪避%
        if (data.FinalCommon.remoteCooldown > 0) {
            price += Math.floor((1000 / data.FinalCommon.remoteCooldown) * 20) //远程间隔
        } else {
            price += Math.floor(data.FinalCommon.remoteCooldown / 20)
        }
        if (data.FinalCommon.remoteInterval > 0) {
            price += Math.floor((1000 / data.FinalCommon.remoteInterval) * 20) //远程冷却
        } else {
            price += Math.floor(data.FinalCommon.remoteInterval / 20)
        }
        price += data.FinalCommon.maxAmmo * 2 //弹夹容量
        price += data.FinalCommon.ammoRecovery * 10 //弹夹回复
        price += data.FinalCommon.remoteDamage * 30 //远程攻击
        price += data.FinalCommon.remoteCritRate //远程暴击
        price += data.FinalCommon.realDamage * 20 //真实伤害
        price += data.FinalCommon.realRate * 2 //真实伤害几率%
        price += data.FinalCommon.magicDamage * 10 //魔法伤害
        price += data.FinalCommon.magicDefenceRate //魔法抗性%
        price += data.FinalCommon.iceRate //冰元素几率%
        price += data.FinalCommon.fireRate * 2 //火元素几率%
        price += data.FinalCommon.lighteningRate //雷元素几率%
        price += data.FinalCommon.toxicRate * 2 //毒元素几率%
        price += data.FinalCommon.curseRate * 2 //诅咒元素几率%

        price += data.FinalCommon.maxHealthPercent * 10 //最大生命%
        price += data.FinalCommon.maxDreamPercent * 10 //最大梦境值%
        price += data.FinalCommon.maxAmmoPercent * 10 //子弹容量%
        price += data.FinalCommon.damageMinPercent * 10 //最小攻击%
        price += data.FinalCommon.damageMaxPercent * 10 //最大攻击%
        price += data.FinalCommon.damageBackPercent * 10 //背面额外攻击伤害%
        price += data.FinalCommon.defencePercent * 10 //物理防御%
        price += data.FinalCommon.moveSpeedPercent * 10 //移速%
        price += data.FinalCommon.jumpSpeedPercent * 10 //跳速%
        price += data.FinalCommon.jumpHeightPercent * 10 //跳跃高度%
        price += data.FinalCommon.attackSpeedPercent * 10 //攻速%
        price += data.FinalCommon.remoteDamagePercent * 10 //远程攻击%
        price += data.FinalCommon.realDamagePercent * 10 //真实伤害%
        price += data.FinalCommon.magicDamagePercent * 10 //魔法伤害%

        return price > 0 ? Math.floor(price) : 0
    }
    updateLogic(dt: number, player: Player) {
        if (this.isCheckTimeDelay(dt)) {
            let distance = 200
            let equip: Equipment = null
            for (let i = this.groundList.length - 1; i >= 0; i--) {
                let e = this.groundList[i]
                e.highLight(false)
                if (e.isTaken || !e.isValid) {
                    this.groundList.splice(i, 1)
                    continue
                }
                let d = Logic.getDistanceNoSqrt(e.node.position, player.node.position)
                if (d < distance) {
                    distance = d
                    equip = e
                }
            }

            if (distance < 64 && equip) {
                equip.highLight(true)
                if (!this.lastGroundEquip || this.lastGroundEquip.uuid != equip.uuid) {
                    cc.tween(equip.taketips).to(0.2, { opacity: 255 }).delay(1).to(0.2, { opacity: 0 }).start()
                    EventHelper.emit(EventHelper.HUD_GROUND_EQUIPMENT_INFO_SHOW, { worldPos: equip.node.convertToWorldSpaceAR(cc.v3(64, 32)), equipData: equip.data })
                }
                this.lastGroundEquip = equip
            } else {
                this.lastGroundEquip = null
                EventHelper.emit(EventHelper.HUD_GROUND_EQUIPMENT_INFO_HIDE)
            }
        }
    }
}
