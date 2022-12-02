import Dungeon from '../logic/Dungeon'
import Logic from '../logic/Logic'
import EquipmentData from '../data/EquipmentData'
import EquipmentDescData from '../data/EquipmentDescData'
import Equipment from '../equipment/Equipment'
import ShopTable from '../building/ShopTable'
import IndexZ from '../utils/IndexZ'
import CommonData from '../data/CommonData'
import Random4Save from '../utils/Random4Save'
import BaseManager from './BaseManager'
import { EventHelper } from '../logic/EventHelper'
import Player from '../logic/Player'
import InventoryManager from './InventoryManager'
import SuitData from '../data/SuitData'
import DataUtils from '../utils/DataUtils'

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
    static readonly RATE_OF_QUALITY = [0.5, 0.85, 0.95, 0.99, 0.999] //   40% 30% 20% 10% 5% 1%
    static readonly QUALITY_WHITE = 0
    static readonly QUALITY_GREEN = 1
    static readonly QUALITY_BLUE = 2
    static readonly QUALITY_PURPLE = 3
    static readonly QUALITY_ORANGE = 4
    static readonly QUALITY_RED = 5

    @property(cc.Prefab)
    equipment: cc.Prefab = null
    groundList: Equipment[] = []
    lastGroundEquip: Equipment

    clear(): void {
        this.groundList = []
    }

    /**
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
    //criticalstrike strong stable drain recovery fast quick agile healthy
    static getRandomDesc(data: EquipmentData, chestQuality?: number): EquipmentDescData {
        let desc = new EquipmentDescData()

        // let arr = ['rough', 'normal', 'good', 'excellent', 'epic', 'legend']
        let arr = ['', '普通的', '精良的', '优秀的', '史诗的', '传说的']
        let colors = ['#dcdcdc', '#ffffff', '#00ff00', '#0000ff', '#800080', '#ffa500']
        let level = 0
        let rand4save = Logic.mapManager.getCurrentRoomRandom4Save()
        //暴击0-20减去装备自带
        let criticalStrikeRate = cc.v3(0, 0)
        if (
            EquipmentManager.isTheEquipType(data.equipmetType, [
                InventoryManager.WEAPON,
                InventoryManager.HELMET,
                InventoryManager.GLOVES,
                InventoryManager.CLOAK,
                InventoryManager.REMOTE
            ]) &&
            data.Common.criticalStrikeRate > 0
        ) {
            let csk = 20 - data.Common.criticalStrikeRate
            if (csk < 5) {
                csk = 5
            }
            criticalStrikeRate = EquipmentManager.getRandomQuality(0, csk, chestQuality, rand4save)
            level = criticalStrikeRate.y > level ? criticalStrikeRate.y : level
            desc.prefix += criticalStrikeRate.y > 2 ? '暴击' : ''
            desc.color = EquipmentManager.getMixColor('#000000', criticalStrikeRate.y > 2 ? EquipmentManager.COLOR_CRITICALSTRIKE : '#000000')
        }

        //基础攻击0-5 +chapter
        let damageMin = cc.v3(0, 0)
        if (
            EquipmentManager.isTheEquipType(data.equipmetType, [InventoryManager.WEAPON, InventoryManager.GLOVES, InventoryManager.CLOTHES, InventoryManager.REMOTE]) &&
            data.Common.damageMin > 0
        ) {
            damageMin = EquipmentManager.getRandomQuality(0, EquipmentManager.getRandomRange(), chestQuality, rand4save)
            level = damageMin.y > level ? damageMin.y : level
        }
        //远程攻击0-5 +chapter
        let remoteDamage = cc.v3(0, 0)
        if (EquipmentManager.isTheEquipType(data.equipmetType, [InventoryManager.GLOVES, InventoryManager.REMOTE]) && data.Common.remoteDamage > 0) {
            remoteDamage = rand4save.rand() < 0.2 ? EquipmentManager.getRandomQuality(0, EquipmentManager.getRandomRange(), chestQuality, rand4save) : cc.v3(0, 0)
            level = remoteDamage.y > level ? remoteDamage.y : level
        }
        //最大攻击0-5 +chapter
        let damageMax = cc.v3(0, 0)
        if (
            EquipmentManager.isTheEquipType(data.equipmetType, [InventoryManager.WEAPON, InventoryManager.GLOVES, InventoryManager.CLOTHES, InventoryManager.REMOTE]) &&
            data.Common.damageMax > 0
        ) {
            damageMax = EquipmentManager.getRandomQuality(damageMin.x, damageMin.x + EquipmentManager.getRandomRange(), chestQuality, rand4save)
            level = damageMax.y > level ? damageMax.y : level
            desc.prefix += damageMax.y > 2 ? '强力' : ''
            desc.color = EquipmentManager.getMixColor(desc.color, damageMax.y > 2 ? EquipmentManager.COLOR_POWERFUL : '#000000')
        }
        //物理防御0-5 +chapter
        let defence = cc.v3(0, 0)
        if (
            EquipmentManager.isTheEquipType(data.equipmetType, [
                InventoryManager.HELMET,
                InventoryManager.GLOVES,
                InventoryManager.CLOAK,
                InventoryManager.TROUSERS,
                InventoryManager.SHOES,
                InventoryManager.SHIELD,
                InventoryManager.CLOTHES
            ]) &&
            data.Common.defence > 0
        ) {
            defence = EquipmentManager.getRandomQuality(0, EquipmentManager.getRandomRange(), chestQuality, rand4save)
            level = defence.y > level ? defence.y : level
            desc.prefix += defence.y > 2 ? '坚固' : ''
            desc.color = EquipmentManager.getMixColor(desc.color, defence.y > 5 ? EquipmentManager.COLOR_STABLE : '#000000')
        }
        //吸血0%-50%
        let lifeDrain = cc.v3(0, 0)
        if (
            EquipmentManager.isTheEquipType(data.equipmetType, [InventoryManager.WEAPON, InventoryManager.HELMET, InventoryManager.GLOVES, InventoryManager.REMOTE]) &&
            data.Common.lifeDrain > 0
        ) {
            let ld = 50 - data.Common.lifeDrain
            if (ld < 5) {
                ld = 5
            }
            lifeDrain = EquipmentManager.getRandomQuality(0, ld, chestQuality, rand4save)
            level = lifeDrain.y > level ? lifeDrain.y : level
            desc.prefix += lifeDrain.y > 2 ? '邪恶' : ''
            desc.color = EquipmentManager.getMixColor(desc.color, lifeDrain.y > 2 ? EquipmentManager.COLOR_LIFEDRAIN : '#000000')
        }
        //背刺伤害10% 0-5 +chapter
        let damageBack = cc.v3(0, 0)
        if (
            EquipmentManager.isTheEquipType(data.equipmetType, [InventoryManager.WEAPON, InventoryManager.GLOVES, InventoryManager.CLOTHES, InventoryManager.REMOTE]) &&
            data.Common.damageBack > 0
        ) {
            damageBack = EquipmentManager.getRandomQuality(0, EquipmentManager.getRandomRange(), chestQuality, rand4save)
            level = damageBack.y > level ? damageBack.y : level
            desc.prefix += damageBack.y > 2 ? '阴冷' : ''
            desc.color = EquipmentManager.getMixColor(desc.color, damageBack.y > 2 ? EquipmentManager.COLOR_BACK : '#000000')
        }
        //移动速度0-5减去装备自带移动速度
        let moveSpeed = cc.v3(0, 0)
        if (
            EquipmentManager.isTheEquipType(data.equipmetType, [InventoryManager.CLOAK, InventoryManager.TROUSERS, InventoryManager.SHOES, InventoryManager.CLOTHES]) &&
            data.Common.moveSpeed > 0
        ) {
            let ms = 5 - data.Common.moveSpeed
            if (ms < 1) {
                ms = 1
            }
            moveSpeed = EquipmentManager.getRandomQuality(0, ms, chestQuality, rand4save)
            level = moveSpeed.y > level ? moveSpeed.y : level
            desc.prefix += moveSpeed.y > 2 ? '灵动' : ''
            desc.color = EquipmentManager.getMixColor(desc.color, moveSpeed.y > 2 ? EquipmentManager.COLOR_MOVESPEED : '#000000')
        }
        //攻击速度0-30减去装备自带攻速
        let attackSpeed = cc.v3(0, 0)
        if (
            EquipmentManager.isTheEquipType(data.equipmetType, [InventoryManager.WEAPON, InventoryManager.GLOVES, InventoryManager.CLOTHES, InventoryManager.REMOTE]) &&
            data.Common.attackSpeed > 0
        ) {
            let as = 30 - data.Common.attackSpeed
            if (as < 5) {
                as = 5
            }
            attackSpeed = EquipmentManager.getRandomQuality(0, as, chestQuality, rand4save)
            level = attackSpeed.y > level ? attackSpeed.y : level
            desc.prefix += attackSpeed.y > 2 ? '迅捷' : ''
            desc.color = EquipmentManager.getMixColor(desc.color, attackSpeed.y > 2 ? EquipmentManager.COLOR_ATTACKSPPED : '#000000')
        }
        //闪避0-30减去装备自带闪避
        let dodge = cc.v3(0, 0)
        if (
            EquipmentManager.isTheEquipType(data.equipmetType, [
                InventoryManager.HELMET,
                InventoryManager.CLOAK,
                InventoryManager.TROUSERS,
                InventoryManager.SHOES,
                InventoryManager.CLOTHES
            ]) &&
            data.Common.dodge > 0
        ) {
            let d1 = 30 - data.Common.dodge
            if (d1 < 10) {
                d1 = 10
            }
            dodge = EquipmentManager.getRandomQuality(0, d1, chestQuality, rand4save)
            level = dodge.y > level ? dodge.y : level
            desc.prefix += dodge.y > 2 ? '飘逸' : ''
            desc.color = EquipmentManager.getMixColor(desc.color, dodge.y > 2 ? EquipmentManager.COLOR_DODGE : '#000000')
        }
        //生命值0-5 +chapter
        let health = cc.v3(0, 0)
        if (
            EquipmentManager.isTheEquipType(data.equipmetType, [
                InventoryManager.HELMET,
                InventoryManager.GLOVES,
                InventoryManager.CLOAK,
                InventoryManager.TROUSERS,
                InventoryManager.SHIELD,
                InventoryManager.SHOES,
                InventoryManager.CLOTHES
            ]) &&
            data.Common.maxHealth > 0
        ) {
            health = EquipmentManager.getRandomQuality(0, EquipmentManager.getRandomRange(), chestQuality, rand4save)
            level = health.y > level ? health.y : level
            desc.prefix += health.y > 2 ? '健康' : ''
            desc.color = EquipmentManager.getMixColor(desc.color, health.y > 2 ? EquipmentManager.COLOR_HEALTHY : '#000000')
        }
        //梦境0-5 +chapter
        let dream = cc.v3(0, 0)
        if (data.Common.maxDream > 0) {
            dream = EquipmentManager.getRandomQuality(0, EquipmentManager.getRandomRange(), chestQuality, rand4save)
            level = dream.y > level ? dream.y : level
            desc.prefix += dream.y > 2 ? '梦幻' : ''
            desc.color = EquipmentManager.getMixColor(desc.color, dream.y > 2 ? EquipmentManager.COLOR_DREAM : '#000000')
        }
        let damageRate = 0.1
        let damage = EquipmentManager.getRandomRange()
        if (EquipmentManager.isTheEquipType(data.equipmetType, [InventoryManager.GLOVES, InventoryManager.REMOTE, InventoryManager.WEAPON])) {
            //流血伤害0-5 +chapter
            let realDamage = rand4save.rand() < damageRate ? EquipmentManager.getRandomQuality(0, damage, chestQuality, rand4save) : cc.v3(0, 0)
            level = realDamage.y > level ? realDamage.y : level
            desc.prefix += realDamage.y > damage / 2 ? '锋利' : ''
            //魔法伤害0-5 +chapter
            let magicDamage = rand4save.rand() < damageRate ? EquipmentManager.getRandomQuality(0, damage, chestQuality, rand4save) : cc.v3(0, 0)
            level = magicDamage.y > level ? magicDamage.y : level
            desc.prefix += magicDamage.y > damage / 2 ? '神秘' : ''

            desc.common.realDamage = realDamage.x
            desc.common.magicDamage = magicDamage.x
        }
        let defenceMax = 60
        let defenceMin = 30
        let defenceRate = 0.1
        //魔法抗性30-60 0.1几率
        let magicDefence = rand4save.rand() < defenceRate ? EquipmentManager.getRandomQuality(defenceMin, defenceMax, chestQuality, rand4save) : cc.v3(0, 0)
        level = magicDefence.y > level ? magicDefence.y : level
        let rateMax = 60
        let rateMin = 10
        let rateRate = 0.05
        //流血几率0-60
        let realRate = rand4save.rand() < rateRate ? EquipmentManager.getRandomQuality(rateMin, rateMax, chestQuality, rand4save) : cc.v3(0, 0)
        level = realRate.y > level ? realRate.y : level
        //冰几率0-60
        let iceRate = rand4save.rand() < rateRate ? EquipmentManager.getRandomQuality(rateMin, rateMax, chestQuality, rand4save) : cc.v3(0, 0)
        level = iceRate.y > level ? iceRate.y : level
        desc.prefix += iceRate.y > rateMax / 2 ? '寒冷' : ''
        //火几率0-60
        let fireRate = rand4save.rand() < rateRate ? EquipmentManager.getRandomQuality(rateMin, rateMax, chestQuality, rand4save) : cc.v3(0, 0)
        level = fireRate.y > level ? fireRate.y : level
        desc.prefix += fireRate.y > rateMax / 2 ? '炎热' : ''
        //雷几率0-60
        let lighteningRate = rand4save.rand() < rateRate ? EquipmentManager.getRandomQuality(rateMin, rateMax, chestQuality, rand4save) : cc.v3(0, 0)
        level = lighteningRate.y > level ? lighteningRate.y : level
        desc.prefix += lighteningRate.y > rateMax / 2 ? '闪电' : ''
        //毒几率0-60
        let toxicRate = rand4save.rand() < rateRate ? EquipmentManager.getRandomQuality(rateMin, rateMax, chestQuality, rand4save) : cc.v3(0, 0)
        level = toxicRate.y > level ? toxicRate.y : level
        desc.prefix += toxicRate.y > rateMax / 2 ? '剧毒' : ''
        //诅咒几率0-60
        let curseRate = rand4save.rand() < rateRate ? EquipmentManager.getRandomQuality(rateMin, rateMax, chestQuality, rand4save) : cc.v3(0, 0)
        level = curseRate.y > level ? curseRate.y : level
        desc.prefix += curseRate.y > rateMax / 2 ? '诅咒' : ''
        desc.prefix = arr[level] + desc.prefix
        desc.titlecolor = colors[level]
        desc.level = level
        desc.color = desc.color == '#000000' ? '#ffffff' : desc.color

        desc.common.criticalStrikeRate = criticalStrikeRate.x
        desc.common.damageMin = damageMin.x
        desc.common.damageMax = damageMax.x
        desc.common.defence = defence.x
        desc.common.lifeDrain = lifeDrain.x
        desc.common.damageBack = damageBack.x
        desc.common.moveSpeed = moveSpeed.x
        desc.common.attackSpeed = attackSpeed.x
        desc.common.dodge = dodge.x
        desc.common.maxHealth = health.x

        desc.common.magicDefence = magicDefence.x
        desc.common.realRate = realRate.x
        desc.common.iceRate = iceRate.x
        desc.common.fireRate = fireRate.x
        desc.common.lighteningRate = lighteningRate.x
        desc.common.toxicRate = toxicRate.x
        desc.common.curseRate = curseRate.x
        desc.common.maxDream = dream.x
        desc.requireLevel = Logic.playerData.OilGoldData.level
        return desc
    }
    static getAffixQuality(type: number) {}
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
    //0.5% 0.25% 0.1% 0.05% 0.01%
    //white 0-0.05 green 0.05-0.075 blue 0.075-0.085 purple 0.085-0.009 orange 0.09-0.0091
    //x:qulity y:level 1-5
    static getRandomQuality(min: number, max: number, chestQuality: number, rand4save: Random4Save): cc.Vec3 {
        let per = (max - min) / 5
        let quality = rand4save.rand()
        //箱子出来的物品属性挂钩相关的优质属性
        if (chestQuality && chestQuality > 0) {
            switch (chestQuality) {
                case 1:
                    quality = rand4save.rand() > 0.5 ? 0.06 : quality
                    break
                case 2:
                    quality = rand4save.rand() > 0.5 ? 0.08 : quality
                    break
                case 3:
                    quality = rand4save.rand() > 0.5 ? 0.086 : quality
                    break
                case 4:
                    quality = rand4save.rand() > 0.5 ? 0.09 : quality
                    break
            }
        }
        let data = cc.v3(0, 0)
        if (quality < 0.05) {
            data.x = rand4save.getRandomNum(0, per)
            if (per > 5 && data.x < 5) {
                data.x = 5
            }
            data.y = 1
        } else if (quality >= 0.05 && quality < 0.075) {
            data.x = rand4save.getRandomNum(per, per * 2)
            data.y = 2
        } else if (quality >= 0.075 && quality < 0.085) {
            data.x = rand4save.getRandomNum(per * 2, per * 3)
            data.y = 3
        } else if (quality >= 0.085 && quality < 0.09) {
            data.x = rand4save.getRandomNum(per * 3, per * 4)
            data.y = 4
        } else if (quality >= 0.09 && quality < 0.091) {
            data.x = rand4save.getRandomNum(per * 4, per * 5)
            data.y = 5
        }
        data.x = parseFloat(data.x.toFixed(0))
        return data
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
                equipData.price = 30 * (equipData.level + 1)
                shopTable.data.equipdata = equipData.clone()
            }
            equipment.refresh(equipData)
        } else {
            //添加新装备
            let data = EquipmentManager.getNewEquipData(equipType, chestQuality)
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
    static getNewEquipData(equipType: string, chestQuality?: number): EquipmentData {
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
        let desc = EquipmentManager.getRandomDesc(data, chestQuality)
        let common = data.Common.clone().add(desc.common)
        data.infobase = EquipmentManager.getInfoBase(common)
        data.info1 = EquipmentManager.getInfo1(common)
        data.info2 = EquipmentManager.getInfo2(common, data)
        data.info3 = EquipmentManager.getInfo3(common)
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
        data.Common.add(desc.common)
        data.prefix = desc.prefix
        data.titlecolor = desc.titlecolor
        if (desc.color != '#ffffff') {
            data.color = desc.color
            if (data.lightcolor != '#ffffff') {
                data.lightcolor = EquipmentManager.getMixColor(desc.color, data.lightcolor)
            } else {
                data.lightcolor = desc.color
            }
        }
        data.level = desc.level
        data.requireLevel = desc.requireLevel
        data.price += EquipmentManager.getPrice(data)
        return data
    }
    static getOriginEquipData(equipType: string) {
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
        let common = data.Common.clone()
        data.infobase = EquipmentManager.getInfoBase(common)
        data.info1 = EquipmentManager.getInfo1(common)
        data.info2 = EquipmentManager.getInfo2(common, data)
        data.info3 = EquipmentManager.getInfo3(common)
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
        data.titlecolor = '#FFFFFF'
        data.price += EquipmentManager.getPrice(data)
        return data
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
        let info3 = EquipmentManager.getInfo3(data.EquipList[suitIndex].Common)
        info += base + ` `
        info += info1 + ` `
        info += info2 + ` `
        info += info3 + ` `
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
        info += DataUtils.getinfoNum2String(common.lifeDrain == 0, '吸血', common.lifeDrain, '%\n')
        info += DataUtils.getinfoNum2String(common.damageBack == 0, '背刺', common.damageBack, '\n')
        info += DataUtils.getinfoNum2String(common.damageBackPercent == 0, `背刺${common.damageBackPercent > 0 ? '提升' : '降低'}`, common.damageBackPercent, '%\n')
        info += DataUtils.getinfoNum2String(common.moveSpeed == 0, '移速', common.moveSpeed, '\n')
        info += DataUtils.getinfoNum2String(common.moveSpeedPercent == 0, `移速${common.moveSpeedPercent > 0 ? '提升' : '降低'}`, common.moveSpeedPercent, '%\n')
        info += DataUtils.getinfoNum2String(common.attackSpeed == 0, `攻速${common.attackSpeed}\n`)
        info += DataUtils.getinfoNum2String(common.attackSpeedPercent == 0, `攻速${common.attackSpeedPercent > 0 ? '提升' : '降低'}`, common.attackSpeedPercent, '%\n')
        info += DataUtils.getinfoNum2String(common.dodge == 0, '闪避', common.dodge, '%\n')
        info += DataUtils.getinfoNum2String(common.blockDamage == 0, '弹反伤害', common.blockDamage, '\n')
        info += DataUtils.getinfoNum2String(common.blockPhysical == 0, '格挡物免', common.blockPhysical, '%\n')
        info += DataUtils.getinfoNum2String(common.blockMagic == 0, '格挡魔免', common.blockMagic, '%\n')
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
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'))
        }
        info = info.replace('+-', '-')
        return info
    }
    static getInfo3(common: CommonData): string {
        let info = ``
        info += DataUtils.getinfoNum2String(common.magicDefence == 0, '元素抗性', common.magicDefence, '%\n')
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
        price += data.Common.maxHealth * 5 //最大生命25
        price += data.Common.maxDream * 10 //最大梦境值25
        price += data.Common.damageMin * 10 //最小攻击50
        price += data.Common.damageMax * 5 //最大攻击25
        price += data.Common.damageBack * 5 //背面额外攻击伤害
        price += data.Common.criticalStrikeRate * 3 //暴击
        price += data.Common.defence * 5 //物理防御
        price += data.Common.blockPhysical / 2 //物理格百分比
        price += data.Common.blockMagic / 2 //魔法格挡百分比
        price += data.Common.blockDamage * 5 //弹反伤害
        price += data.Common.lifeDrain //吸血
        if (data.Common.moveSpeed < 0) {
            price += -20
        } else {
            price += data.Common.moveSpeed * 50 //移速
        }
        if (data.Common.jumpSpeed < 0) {
            price += -20
        } else {
            price += data.Common.jumpSpeed * 20 //跳速
        }
        if (data.Common.jumpHeight < 0) {
            price += -20
        } else {
            price += data.Common.jumpHeight * 20 //跳跃高度
        }
        if (data.Common.attackSpeed < 0) {
            price += -10
        } else {
            price += data.Common.attackSpeed //攻速
        }
        price += data.Common.dodge * 2 //闪避%
        if (data.Common.remoteCooldown > 0) {
            price += Math.floor((1000 / data.Common.remoteCooldown) * 20) //远程间隔
        } else {
            price += Math.floor(data.Common.remoteCooldown / 20)
        }
        if (data.Common.remoteInterval > 0) {
            price += Math.floor((1000 / data.Common.remoteInterval) * 20) //远程冷却
        } else {
            price += Math.floor(data.Common.remoteInterval / 20)
        }
        price += data.Common.maxAmmo * 2 //弹夹容量
        price += data.Common.ammoRecovery * 10 //弹夹回复
        price += data.Common.remoteDamage * 30 //远程攻击
        price += data.Common.remoteCritRate //远程暴击
        price += data.Common.realDamage * 20 //真实伤害
        price += data.Common.realRate * 2 //真实伤害几率%
        price += data.Common.magicDamage * 10 //魔法伤害
        price += data.Common.magicDefence //魔法抗性%
        price += data.Common.iceRate //冰元素几率%
        price += data.Common.fireRate * 2 //火元素几率%
        price += data.Common.lighteningRate //雷元素几率%
        price += data.Common.toxicRate * 2 //毒元素几率%
        price += data.Common.curseRate * 2 //诅咒元素几率%

        price += data.Common.maxHealthPercent * 10 //最大生命%
        price += data.Common.maxDreamPercent * 10 //最大梦境值%
        price += data.Common.maxAmmoPercent * 10 //子弹容量%
        price += data.Common.damageMinPercent * 10 //最小攻击%
        price += data.Common.damageMaxPercent * 10 //最大攻击%
        price += data.Common.damageBackPercent * 10 //背面额外攻击伤害%
        price += data.Common.defencePercent * 10 //物理防御%
        price += data.Common.moveSpeedPercent * 10 //移速%
        price += data.Common.jumpSpeedPercent * 10 //跳速%
        price += data.Common.jumpHeightPercent * 10 //跳跃高度%
        price += data.Common.attackSpeedPercent * 10 //攻速%
        price += data.Common.remoteDamagePercent * 10 //远程攻击%
        price += data.Common.realDamagePercent * 10 //真实伤害%
        price += data.Common.magicDamagePercent * 10 //魔法伤害%

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
