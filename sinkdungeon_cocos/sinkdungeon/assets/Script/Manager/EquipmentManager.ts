import Dungeon from "../Dungeon";
import Logic from "../Logic";
import EquipmentData from "../Data/EquipmentData";
import EquipmentDescData from "../Data/EquipmentDescData";
import Equipment from "../Equipment/Equipment";
import ShopTable from "../Building/ShopTable";
import Random from "../Utils/Random";
import IndexZ from "../Utils/IndexZ";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class EquipmentManager extends cc.Component {

    public static readonly EMPTY = "emptyequipment";
    public static readonly WEAPON_DINNERFORK = "weapon000";
    public static readonly WEAPON_KNIFE = "weapon001";
    public static readonly WEAPON_CHOPPER = "weapon002";
    public static readonly WEAPON_HUGEBLADE = "weapon003";
    public static readonly WEAPON_PITCHFORK = "weapon004";
    public static readonly WEAPON_HUGEAXE = "weapon005";
    public static readonly WEAPON_CROWBAR = "weapon006";
    public static readonly WEAPON_KATANA = "weapon007";
    public static readonly WEAPON_FRUITKNIFE = "weapon008";
    public static readonly WEAPON_HAPPYFIRE = "weapon009";
    public static readonly WEAPON_SADICE = "weapon010";
    public static readonly WEAPON_EGYPTWAND = "weapon011";
    public static readonly WEAPON_TOXICDAGGER = "weapon012";
    public static readonly WEAPON_OLDROOTDAGGER = "weapon013";
    public static readonly WEAPON_COOKCHOPPER = "weapon014";
    public static readonly WEAPON_LIGHTENINGBLADE = "weapon015";
    public static readonly WEAPON_JUNGLEFORK = "weapon016";
    public static readonly WEAPON_KUNAI = "weapon017";
    public static readonly WEAPON_DEATH = "weapon018";
    public static readonly WEAPON_SHADOW = "weapon019";
    public static readonly WEAPON_BLOOD = "weapon020";
    public static readonly REMOTE_CROSSBOW = "remote001";
    public static readonly REMOTE_LONGBOW = "remote002";
    public static readonly REMOTE_WAND = "remote003";
    public static readonly REMOTE_ALIENGUN = "remote004";
    public static readonly REMOTE_WINCHESTER = "remote005";
    public static readonly REMOTE_RPG = "remote006";
    public static readonly REMOTE_SHURIKEN = "remote007";
    public static readonly REMOTE_CHICKEN = "remote008";
    public static readonly SHIELD_CIRCLE = "shield000";
    public static readonly CLOTHES_VEST = "clothes001";
    public static readonly CLOTHES_SHIRT = "clothes002";
    public static readonly CLOTHES_NAVY = "clothes003";
    public static readonly CLOTHES_PIRATE = "clothes004";
    public static readonly CLOTHES_BUCKET = "clothes005";
    public static readonly CLOTHES_REDROBE = "clothes006";
    public static readonly CLOTHES_WHITEROBE = "clothes007";
    public static readonly CLOTHES_GENTLEMAN = "clothes008";
    public static readonly CLOTHES_RADIATION = "clothes009";
    public static readonly CLOTHES_JUNGLE = "clothes010";
    public static readonly CLOTHES_PHARAOH = "clothes011";
    public static readonly CLOTHES_KNIGHT = "clothes012";
    public static readonly CLOTHES_DEATH = "clothes013";
    public static readonly CLOTHES_ENERGY = "clothes014";
    public static readonly HELMET_BUCKETHAT = "helmet002";
    public static readonly HELMET_PIRATEHAT = "helmet003";
    public static readonly HELMET_REDHAT = "helmet004";
    public static readonly HELMET_WHITEHAT = "helmet005";
    public static readonly HELMET_PHARAOH = "helmet006";
    public static readonly HELMET_CAT = "helmet007";
    public static readonly HELMET_CHIEF = "helmet008";
    public static readonly HELMET_HORUS = "helmet009";
    public static readonly HELMET_GENTLEMAN = "helmet010";
    public static readonly HELMET_CHICKEN = "helmet011";
    public static readonly HELMET_DUCK = "helmet012";
    public static readonly HELMET_GOOSE = "helmet013";
    public static readonly HELMET_RADIATION = "helmet014";
    public static readonly HELMET_JUNGLE = "helmet015";
    public static readonly HELMET_ANUBIS = "helmet016";
    public static readonly HELMET_KNIGHT = "helmet017";
    public static readonly HELMET_DEATH = "helmet018";
    public static readonly HELMET_ENERY = "helmet019";
    public static readonly CLOAK_WARRIOR = "cloak001";
    public static readonly TROUSERS_LONG = "trousers001";
    public static readonly TROUSERS_SHORT = "trousers002";
    public static readonly TROUSERS_RADIATION = "trousers003";
    public static readonly TROUSERS_JUNGLE = "trousers004";
    public static readonly TROUSERS_PHARAOH = "trousers005";
    public static readonly TROUSERS_KNIGHT = "trousers006";
    public static readonly TROUSERS_DEATH = "trousers007";
    public static readonly TROUSERS_ENERGY = "trousers008";
    public static readonly GLOVES_WARRIOR = "gloves001";
    public static readonly GLOVES_DEMON = "gloves002";
    public static readonly GLOVES_BLOODCRAW = "gloves003";
    public static readonly GLOVES_RADIATION = "gloves004";
    public static readonly GLOVES_JUNGLE = "gloves005";
    public static readonly GLOVES_PHARAOH = "gloves006";
    public static readonly GLOVES_KNIGHT = "gloves007";
    public static readonly GLOVES_DEATH = "gloves008";
    public static readonly GLOVES_ENERGY = "gloves009";
    public static readonly SHOES_WARRIOR = "shoes001";
    public static readonly SHOES_SKATEBOARD = "shoes002";
    public static readonly SHOES_DEMON = "shoes003";
    public static readonly SHOES_RADIATION = "shoes004";
    public static readonly SHOES_JUNGLE = "shoes005";
    public static readonly SHOES_PHARAOH = "shoes006";
    public static readonly SHOES_KNIGHT = "shoes007";
    public static readonly SHOES_DEATH = "shoes008";
    public static readonly SHOES_ENERGY = "shoes009";

    //暴击的(暴击)
    public static readonly COLOR_CRITICALSTRIKE = "#DC143C";//猩红
    //迅捷的(攻击速度)
    public static readonly COLOR_ATTACKSPPED = "#5F9EA0";//军校蓝
    //灵动的(移动速度)
    public static readonly COLOR_MOVESPEED = "#00BFFF";//深天蓝
    //飘逸的(闪避几率)
    public static readonly COLOR_DODGE = "#FFFF00";//黄色
    //坚固的(防御力)
    public static readonly COLOR_STABLE = "#DEB887";//结实的树棕色
    //强力的(攻击力)
    public static readonly COLOR_POWERFUL = "#ADFF2F";//绿黄色
    //健康的(最大生命值)
    public static readonly COLOR_HEALTHY = "#90EE90";//淡绿色
    //邪恶的(生命汲取)
    public static readonly COLOR_LIFEDRAIN = "#FFC0CB";//粉红
    //阴冷的(背刺)
    public static readonly COLOR_BACK = "#9370DB";//适中的兰花紫
    @property(cc.Prefab)
    equipment: cc.Prefab = null;



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }
    /*灰色（粗糙）→白色（普通）→绿色（精良）→蓝色（优秀）→紫色（史诗）→橙色（传说）
    箱子的等级1,2,3越来越高*/
    //criticalstrike strong stable drain recovery fast quick agile healthy 
    getRandomDesc(data: EquipmentData, chestQuality?: number): EquipmentDescData {
        let desc = new EquipmentDescData();

        // let arr = ['rough', 'normal', 'good', 'excellent', 'epic', 'legend']
        let arr = ['', '普通的', '精良的', '优秀的', '史诗的', '传说的']
        let colors = ['#dcdcdc', '#ffffff', '#00ff00', '#0000ff', '#800080', '#ffa500']
        let level = 0;
        //暴击0-20减去装备自带
        let criticalStrikeRate = cc.v3(0, 0);
        if (this.isTheEquipType(data.equipmetType, [Equipment.WEAPON, Equipment.HELMET
            , Equipment.GLOVES, Equipment.CLOAK, Equipment.REMOTE])
            && data.Common.criticalStrikeRate > 0) {
            let csk = 20 - data.Common.criticalStrikeRate;
            if (csk < 5) { csk = 5; }
            criticalStrikeRate = this.getRandomQuality(0, csk, chestQuality);
            level = criticalStrikeRate.y > level ? criticalStrikeRate.y : level;
            desc.prefix += criticalStrikeRate.y > 2 ? '暴击' : '';
            desc.color = this.getMixColor('#000000'
                , criticalStrikeRate.y > 2 ? EquipmentManager.COLOR_CRITICALSTRIKE : '#000000');
        }

        //基础攻击0-5
        let damageMin = cc.v3(0, 0);
        if (this.isTheEquipType(data.equipmetType, [Equipment.WEAPON, Equipment.GLOVES
            , Equipment.CLOTHES, Equipment.REMOTE])
            && data.Common.damageMin > 0) {
            damageMin = this.getRandomQuality(0, 5, chestQuality);
            level = damageMin.y > level ? damageMin.y : level;
        }
        //最大攻击0-5
        let damageMax = cc.v3(0, 0);
        if (this.isTheEquipType(data.equipmetType, [Equipment.WEAPON, Equipment.GLOVES
            , Equipment.CLOTHES, Equipment.REMOTE])
            && data.Common.damageMax > 0) {
            damageMax = this.getRandomQuality(damageMin.x, damageMin.x + 5, chestQuality);
            level = damageMax.y > level ? damageMax.y : level;
            desc.prefix += damageMax.y > 2 ? '强力' : '';
            desc.color = this.getMixColor(desc.color
                , damageMax.y > 2 ? EquipmentManager.COLOR_POWERFUL : '#000000');
        }
        //物理防御0-10
        let defence = cc.v3(0, 0);
        if (this.isTheEquipType(data.equipmetType, [Equipment.HELMET, Equipment.GLOVES
            , Equipment.CLOAK, Equipment.TROUSERS, Equipment.SHOES
            , Equipment.CLOTHES])
            && data.Common.defence > 0) {
            defence = this.getRandomQuality(0, 10, chestQuality);
            level = defence.y > level ? defence.y : level;
            desc.prefix += defence.y > 2 ? '坚固' : '';
            desc.color = this.getMixColor(desc.color
                , defence.y > 5 ? EquipmentManager.COLOR_STABLE : '#000000');
        }
        //吸血0%-50%
        let lifeDrain = cc.v3(0, 0);
        if (this.isTheEquipType(data.equipmetType, [Equipment.WEAPON, Equipment.HELMET
            , Equipment.GLOVES, Equipment.REMOTE])
            && data.Common.lifeDrain > 0) {
            let ld = 50 - data.Common.lifeDrain;
            if (ld < 5) { ld = 5; }
            lifeDrain = this.getRandomQuality(0, ld, chestQuality);
            level = lifeDrain.y > level ? lifeDrain.y : level;
            desc.prefix += lifeDrain.y > 2 ? '邪恶' : '';
            desc.color = this.getMixColor(desc.color
                , lifeDrain.y > 2 ? EquipmentManager.COLOR_LIFEDRAIN : '#000000');
        }
        //背刺伤害10% 0-5
        let damageBack = cc.v3(0, 0);
        if (this.isTheEquipType(data.equipmetType, [Equipment.WEAPON, Equipment.GLOVES
            , Equipment.CLOTHES, Equipment.REMOTE])
            && data.Common.damageBack > 0) {
            damageBack = this.getRandomQuality(0, 5, chestQuality);
            level = damageBack.y > level ? damageBack.y : level;
            desc.prefix += damageBack.y > 2 ? '阴冷' : '';
            desc.color = this.getMixColor(desc.color
                , damageBack.y > 2 ? EquipmentManager.COLOR_BACK : '#000000');
        }
        //移动速度0-80减去装备自带移动速度
        let moveSpeed = cc.v3(0, 0);
        if (this.isTheEquipType(data.equipmetType, [Equipment.CLOAK, Equipment.TROUSERS
            , Equipment.SHOES, Equipment.CLOTHES])
            && data.Common.moveSpeed > 0) {
            let ms = 80 - data.Common.moveSpeed;
            if (ms < 10) { ms = 10; }
            moveSpeed = this.getRandomQuality(0, ms, chestQuality);
            level = moveSpeed.y > level ? moveSpeed.y : level;
            desc.prefix += moveSpeed.y > 2 ? '灵动' : '';
            desc.color = this.getMixColor(desc.color
                , moveSpeed.y > 2 ? EquipmentManager.COLOR_MOVESPEED : '#000000');
        }
        //攻击速度0-30减去装备自带攻速
        let attackSpeed = cc.v3(0, 0);
        if (this.isTheEquipType(data.equipmetType, [Equipment.WEAPON
            , Equipment.GLOVES, Equipment.CLOTHES
            , Equipment.REMOTE])
            && data.Common.attackSpeed > 0) {
            let as = 30 - data.Common.attackSpeed;
            if (as < 5) { as = 5; }
            attackSpeed = this.getRandomQuality(0, as, chestQuality);
            level = attackSpeed.y > level ? attackSpeed.y : level;
            desc.prefix += attackSpeed.y > 2 ? '迅捷' : '';
            desc.color = this.getMixColor(desc.color
                , attackSpeed.y > 2 ? EquipmentManager.COLOR_ATTACKSPPED : '#000000');
        }
        //闪避0-30减去装备自带闪避
        let dodge = cc.v3(0, 0);
        if (this.isTheEquipType(data.equipmetType, [Equipment.HELMET
            , Equipment.CLOAK, Equipment.TROUSERS
            , Equipment.SHOES, Equipment.CLOTHES])
            && data.Common.dodge > 0) {
            let d1 = 30 - data.Common.dodge;
            if (d1 < 10) { d1 = 10; }
            dodge = this.getRandomQuality(0, d1, chestQuality);
            level = dodge.y > level ? dodge.y : level;
            desc.prefix += dodge.y > 2 ? '飘逸' : '';
            desc.color = this.getMixColor(desc.color
                , dodge.y > 2 ? EquipmentManager.COLOR_DODGE : '#000000');
        }
        //生命值0-5
        let health = cc.v3(0, 0);
        if (this.isTheEquipType(data.equipmetType, [Equipment.HELMET
            , Equipment.GLOVES, Equipment.CLOAK, Equipment.TROUSERS
            , Equipment.SHOES, Equipment.CLOTHES])
            && data.Common.maxHealth > 0) {
            health = this.getRandomQuality(0, 5, chestQuality);
            level = health.y > level ? health.y : level;
            desc.prefix += health.y > 2 ? '健康' : '';
            desc.color = this.getMixColor(desc.color
                , health.y > 2 ? EquipmentManager.COLOR_HEALTHY : '#000000');
        }
        let damageRate = 0.1;
        let damage = 5;
        if (this.isTheEquipType(data.equipmetType, [Equipment.GLOVES, Equipment.REMOTE, Equipment.WEAPON])) {
            //流血伤害0-5
            let realDamage = Random.rand() < damageRate ? this.getRandomQuality(0, damage, chestQuality) : cc.v3(0, 0);
            level = realDamage.y > level ? realDamage.y : level;
            desc.prefix += realDamage.y > damage / 2 ? '锋利' : '';
            //魔法伤害0-5
            let magicDamage = Random.rand() < damageRate ? this.getRandomQuality(0, damage, chestQuality) : cc.v3(0, 0);
            level = magicDamage.y > level ? magicDamage.y : level;
            desc.prefix += magicDamage.y > damage / 2 ? '神秘' : '';

            desc.realDamage = realDamage.x;
            desc.magicDamage = magicDamage.x;
        }
        let defenceMax = 60;
        let defenceMin = 30;
        let defenceRate = 0.1;
        //魔法抗性30-60 0.1几率
        let magicDefence = Random.rand() < defenceRate ? this.getRandomQuality(defenceMin, defenceMax, chestQuality) : cc.v3(0, 0);
        level = magicDefence.y > level ? magicDefence.y : level;
        let rateMax = 60;
        let rateMin = 10;
        let rateRate = 0.05;
        //流血几率0-60
        let realRate = Random.rand() < rateRate ? this.getRandomQuality(rateMin, rateMax, chestQuality) : cc.v3(0, 0);
        level = realRate.y > level ? realRate.y : level;
        //冰几率0-60
        let iceRate = Random.rand() < rateRate ? this.getRandomQuality(rateMin, rateMax, chestQuality) : cc.v3(0, 0);
        level = iceRate.y > level ? iceRate.y : level;
        desc.prefix += iceRate.y > rateMax / 2 ? '寒冷' : '';
        //火几率0-60
        let fireRate = Random.rand() < rateRate ? this.getRandomQuality(rateMin, rateMax, chestQuality) : cc.v3(0, 0);
        level = fireRate.y > level ? fireRate.y : level;
        desc.prefix += fireRate.y > rateMax / 2 ? '炎热' : '';
        //雷几率0-60
        let lighteningRate = Random.rand() < rateRate ? this.getRandomQuality(rateMin, rateMax, chestQuality) : cc.v3(0, 0);
        level = lighteningRate.y > level ? lighteningRate.y : level;
        desc.prefix += lighteningRate.y > rateMax / 2 ? '闪电' : '';
        //毒几率0-60
        let toxicRate = Random.rand() < rateRate ? this.getRandomQuality(rateMin, rateMax, chestQuality) : cc.v3(0, 0);
        level = toxicRate.y > level ? toxicRate.y : level;
        desc.prefix += toxicRate.y > rateMax / 2 ? '剧毒' : '';
        //诅咒几率0-60
        let curseRate = Random.rand() < rateRate ? this.getRandomQuality(rateMin, rateMax, chestQuality) : cc.v3(0, 0);
        level = curseRate.y > level ? curseRate.y : level;
        desc.prefix += curseRate.y > rateMax / 2 ? '诅咒' : '';
        desc.prefix = arr[level] + desc.prefix;
        desc.titlecolor = colors[level];
        desc.level = level;
        desc.color = desc.color == '#000000' ? '#ffffff' : desc.color;


        desc.criticalStrikeRate = criticalStrikeRate.x;
        desc.damageMin = damageMin.x;
        desc.damageMax = damageMax.x;
        desc.defence = defence.x;
        desc.lifeDrain = lifeDrain.x;
        desc.damageBack = damageBack.x;
        desc.moveSpeed = moveSpeed.x;
        desc.attackSpeed = attackSpeed.x;
        desc.dodge = dodge.x;
        desc.health = health.x;
      
        desc.magicDefence = magicDefence.x;
        desc.realRate = realRate.x;
        desc.iceRate = iceRate.x;
        desc.fireRate = fireRate.x;
        desc.lighteningRate = lighteningRate.x;
        desc.toxicRate = toxicRate.x;
        desc.curseRate = curseRate.x;
        return desc;
    }
    isTheEquipType(theType: string, types: string[]): boolean {
        let isTheType = false;
        for (let t of types) {
            if (t == theType) {
                isTheType = true;
            }
        }
        return isTheType;
    }
    //0.5% 0.25% 0.1% 0.05% 0.01%
    //white 0-0.05 green 0.05-0.075 blue 0.075-0.085 purple 0.085-0.009 orange 0.09-0.0091
    //x:qulity y:level 1-5
    getRandomQuality(min: number, max: number, chestQuality: number): cc.Vec3 {
        let per = (max - min) / 5;
        let quality = Random.rand();
        //箱子出来的物品属性挂钩相关的优质属性
        if (chestQuality > 0) {
            switch (chestQuality) {
                case 1: quality = Random.rand() > 0.5 ? 0.06 : quality; break;
                case 2: quality = Random.rand() > 0.5 ? 0.08 : quality; break;
                case 3: quality = Random.rand() > 0.5 ? 0.086 : quality; break;
                case 4: quality = Random.rand() > 0.5 ? 0.09 : quality; break;
            }
        }
        let data = cc.v3(0, 0);
        if (quality < 0.05) {
            data.x = Logic.getRandomNum(0, per);
            if (per > 5 && data.x < 5) {
                data.x = 5;
            }
            data.y = 1;
        } else if (quality >= 0.05 && quality < 0.075) {
            data.x = Logic.getRandomNum(per, per * 2);
            data.y = 2;
        } else if (quality >= 0.075 && quality < 0.085) {
            data.x = Logic.getRandomNum(per * 2, per * 3);
            data.y = 3;
        } else if (quality >= 0.085 && quality < 0.09) {
            data.x = Logic.getRandomNum(per * 3, per * 4);
            data.y = 4;
        } else if (quality >= 0.09 && quality < 0.091) {
            data.x = Logic.getRandomNum(per * 4, per * 5);
            data.y = 5;
        }
        data.x = parseFloat(data.x.toFixed(0));
        return data;
    }
    getEquipment(equipType: string, pos: cc.Vec3, parent: cc.Node, equipData?: EquipmentData, chestQuality?: number, shopTable?: ShopTable): Equipment {
        let equipmentPrefab = cc.instantiate(this.equipment);
        equipmentPrefab.parent = parent;
        equipmentPrefab.position = Dungeon.getPosInMap(pos);
        equipmentPrefab.zIndex = IndexZ.OVERHEAD;
        let equipment = equipmentPrefab.getComponent(Equipment);
        equipment.pos = pos;
        if (equipData) {
            //复制已有装备
            if (shopTable) {
                equipment.shopTable = shopTable;
                shopTable.data.equipdata = equipData.clone();
                shopTable.data.price = 20 * (equipData.level + 1);
            }
            equipment.refresh(equipData);
        } else {
            //添加新装备
            let data = new EquipmentData();
            data.valueCopy(Logic.equipments[equipType]);
            data.uuid = data.genNonDuplicateID();
            let desc = this.getRandomDesc(data, chestQuality);
            data.infobase = this.getEquipmentInfoBase(desc, data);
            data.info1 = this.getEquipmentInfo1(desc, data);
            data.info2 = this.getEquipmentInfo2(desc, data);
            data.info3 = this.getEquipmentInfo3(desc, data);
            data.infobasecolor = '#fffff0';//象牙
            data.infocolor1 = '#9370DB';//适中的紫色
            data.infocolor2 = '#87CEFA';//淡蓝色
            data.infocolor3 = '#BC8F8F';//玫瑰棕色
            data.Common.criticalStrikeRate += desc.criticalStrikeRate;
            data.Common.damageMin += desc.damageMin;
            data.Common.damageMax += desc.damageMax;
            data.Common.defence += desc.defence;
            data.Common.lifeDrain += desc.lifeDrain;
            data.Common.damageBack += desc.damageBack;
            data.Common.moveSpeed += desc.moveSpeed;
            data.Common.attackSpeed += desc.attackSpeed;
            data.Common.dodge += desc.dodge;
            data.Common.maxHealth += desc.health;
            data.Common.realDamage += desc.realDamage;
            data.Common.magicDamage += desc.magicDamage;
            data.Common.magicDefence += desc.magicDefence;
            data.Common.realRate += desc.realRate;
            data.Common.iceRate += desc.iceRate;
            data.Common.fireRate += desc.fireRate;
            data.Common.lighteningRate += desc.lighteningRate;
            data.Common.toxicRate += desc.toxicRate;
            data.Common.curseRate += desc.curseRate;
            data.prefix = desc.prefix;
            data.titlecolor = desc.titlecolor;
            if (desc.color != "#ffffff") {
                data.color = desc.color;
                if (data.lightcolor != "#ffffff") {
                    data.lightcolor = this.getMixColor(desc.color, data.lightcolor);
                } else {
                    data.lightcolor = desc.color;
                }
            }
            data.level = desc.level;
            if (shopTable) {
                equipment.shopTable = shopTable;
                shopTable.data.equipdata = data.clone();
                shopTable.data.price = 20 * (desc.level + 1);
            }
            equipment.refresh(data);
        }
        return equipment;

    }
    getEquipmentInfoBase(desc: EquipmentDescData, data: EquipmentData): string {
        let info = ``;
        info += data.Common.remoteDamage + desc.remoteDamage == 0 ? `` : `远程伤害${data.Common.remoteDamage + desc.remoteDamage}\n`;
        info += data.Common.remoteCritRate + desc.remoteCritRate == 0 ? `` : `远程暴击率${data.Common.remoteCritRate + desc.remoteCritRate}\n`;
        info += data.Common.remoteSpeed + desc.remoteSpeed == 0 ? `` : `远程攻速${data.Common.remoteSpeed + desc.remoteSpeed}\n`;
        info += data.Common.damageMin + desc.damageMin == 0 ? `` : `攻击${data.Common.damageMin + desc.damageMin} 最大攻击力${data.Common.damageMax + desc.damageMax}\n`;
        info += data.Common.damageMin + desc.damageMin == 0 && data.Common.damageMax != 0 ? `最大攻击力${data.Common.damageMax + desc.damageMax}\n` : ``
        info += data.Common.defence + desc.defence == 0 ? `` : `防御${data.Common.defence + desc.defence}\n`;
        info += data.Common.maxHealth + desc.health == 0 ? `` : `生命${data.Common.maxHealth + desc.health}\n`;
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'));
        }
        info = info.replace('+-', '-');
        return info;
    }
    getEquipmentInfo1(desc: EquipmentDescData, data: EquipmentData): string {
        let info = ``;
        info += data.Common.criticalStrikeRate + desc.criticalStrikeRate == 0 ? `` : `暴击${data.Common.criticalStrikeRate + desc.criticalStrikeRate}%\n`;
        info += data.Common.lifeDrain + desc.lifeDrain == 0 ? `` : `吸血${data.Common.lifeDrain + desc.lifeDrain}%\n`;
        info += data.Common.damageBack + desc.damageBack == 0 ? `` : `背刺${data.Common.damageBack + desc.damageBack}\n`;
        info += data.Common.moveSpeed + desc.moveSpeed == 0 ? `` : `移速${data.Common.moveSpeed + desc.moveSpeed}\n`;
        info += data.Common.attackSpeed + desc.attackSpeed == 0 ? `` : `攻速${data.Common.attackSpeed + desc.attackSpeed}\n`;
        info += data.Common.dodge + desc.dodge == 0 ? `` : `闪避${data.Common.dodge + desc.dodge}%\n`;
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'));
        }
        info = info.replace('+-', '-');
        return info;
    }
    getEquipmentInfo2(desc: EquipmentDescData, data: EquipmentData): string {
        let info = ``;
        info += data.isReflect == 0 ? `` : `反弹子弹\n`;
        info += data.Common.realDamage + desc.realDamage == 0 ? `` : `攻击附加${data.Common.realDamage + desc.realDamage}点流血伤害\n`;
        info += data.Common.realRate + desc.realRate == 0 ? `` : `攻击有${data.Common.realRate + desc.realRate}%几率释放流血\n`;
        info += data.Common.magicDamage + desc.magicDamage == 0 ? `` : `攻击附加${data.Common.magicDamage + desc.magicDamage}点元素伤害\n`;
        info += data.Common.iceRate + desc.iceRate == 0 ? `` : `攻击有${data.Common.iceRate + desc.iceRate}%几率释放冰冻\n`;
        info += data.Common.fireRate + desc.fireRate == 0 ? `` : `攻击有${data.Common.fireRate + desc.fireRate}%几率释放燃烧\n`;
        info += data.Common.lighteningRate + desc.lighteningRate == 0 ? `` : `攻击有${data.Common.lighteningRate + desc.lighteningRate}%几率释放闪电\n`;
        info += data.Common.toxicRate + desc.toxicRate == 0 ? `` : `毒攻击有${data.Common.toxicRate + desc.toxicRate}%几率释放毒素\n`;
        info += data.Common.curseRate + desc.curseRate == 0 ? `` : `攻击有${data.Common.curseRate + desc.curseRate}%几率释放诅咒\n`;
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'));
        }
        info = info.replace('+-', '-');
        return info;
    }
    getEquipmentInfo3(desc: EquipmentDescData, data: EquipmentData): string {
        let info = ``;
        info += data.Common.magicDefence + desc.magicDefence == 0 ? `` : `元素抗性${data.Common.magicDefence + desc.magicDefence}%\n`;
        if (info.length > 0 && info.lastIndexOf('\n') != -1) {
            info = info.substring(0, info.lastIndexOf('\n'));
        }
        info = info.replace('+-', '-');
        return info;
    }

    start() {

    }

    getMixColor(color1: string, color2: string): string {
        let c1 = cc.color().fromHEX(color1);
        let c2 = cc.color().fromHEX(color2);
        let c3 = cc.color();
        let r = c1.getR() + c2.getR();
        let g = c1.getG() + c2.getG();
        let b = c1.getB() + c2.getB();

        c3.setR(r > 255 ? 255 : r);
        c3.setG(g > 255 ? 255 : g);
        c3.setB(b > 255 ? 255 : b);
        return '#' + c3.toHEX('#rrggbb');
    }



    // update (dt) {}
}
