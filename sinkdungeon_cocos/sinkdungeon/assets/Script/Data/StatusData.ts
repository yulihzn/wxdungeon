import CommonData from "./CommonData";
import FromData from "./FromData";

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
 * 状态
 * 负面：冰冻、燃烧、减速、中毒、诅咒、流血、道具
 * 正面：祝福、道具、天赋
 */
export default class StatusData {
    private common:CommonData;
    statusType: number = 0;//状态类型
    nameCn: string = '';
    nameEn: string = '';
    duration: number = 0;//持续时间
    desc: string = '';
    spriteFrameName:string = '';

    physicalDamageDirect: number = 0;//瞬间伤害
    physicalDamageOvertime: number = 0;//持续伤害
    missRate: number = 0;//攻击落空几率
    realDamageDirect:number= 0;//瞬间真实伤害
    realDamageOvertime: number = 0;//持续真实伤害
    iceDamageDirect = 0;//瞬间冰元素伤害
    iceDamageOvertime = 0;//持续冰元素伤害
    fireDamageDirect = 0;//瞬间火元素伤害
    fireDamageOvertime = 0;//持续火元素伤害
    lighteningDamageDirect = 0;//瞬间雷元素伤害
    lighteningDamageOvertime = 0;//持续雷元素伤害
    toxicDamageDirect = 0;//瞬间毒元素伤害
    toxicDamageOvertime = 0;//持续毒元素伤害
    curseDamageDirect = 0;//瞬间诅咒元素伤害
    curseDamageOvertime = 0;//持续诅咒元素伤害
    dizzDurationDirect = 0;//瞬间眩晕时长
    dizzDurationOvertime = 0;//持续眩晕时长
    private from:FromData;//来源
    constructor(){
        this.common = new CommonData();
        this.from = new FromData();
    }

    get Common(){
        return this.common;
    }
    get From(){
        return this.from;
    }
    public valueCopy(data: StatusData): void {
        this.common.valueCopy(data.common);
        this.from.valueCopy(data.from);
        this.nameCn = data.nameCn ? data.nameCn : this.nameCn;
        this.nameEn = data.nameEn;
        this.statusType = data.statusType;
        this.duration = data.duration;
        this.spriteFrameName = data.spriteFrameName;
        this.desc = data.desc;
        this.physicalDamageDirect = data.physicalDamageDirect;
        this.physicalDamageOvertime = data.physicalDamageOvertime;
        this.missRate = data.missRate;
        this.realDamageDirect = data.realDamageDirect;
        this.realDamageOvertime = data.realDamageOvertime;
        this.iceDamageDirect = data.iceDamageDirect;
        this.iceDamageOvertime = data.iceDamageOvertime;
        this.fireDamageDirect = data.fireDamageDirect;
        this.fireDamageOvertime = data.fireDamageOvertime;
        this.lighteningDamageDirect = data.lighteningDamageDirect;
        this.lighteningDamageOvertime = data.lighteningDamageOvertime;
        this.toxicDamageDirect = data.toxicDamageDirect;
        this.toxicDamageOvertime = data.toxicDamageOvertime;
        this.curseDamageDirect = data.curseDamageDirect;
        this.curseDamageOvertime = data.curseDamageOvertime;
        this.dizzDurationDirect = data.dizzDurationDirect;
        this.dizzDurationOvertime = data.dizzDurationOvertime;
    }
    public clone(): StatusData {
        let e = new StatusData();
        e.common = this.common.clone();
        e.from = this.from.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.statusType = this.statusType;
        e.duration = this.duration;
        e.desc = this.desc;
        e.physicalDamageDirect = this.physicalDamageDirect;
        e.physicalDamageOvertime = this.physicalDamageOvertime;
        e.missRate = this.missRate;
        e.realDamageDirect = this.realDamageDirect;
        e.realDamageOvertime = this.realDamageDirect;
        e.iceDamageDirect = this.iceDamageDirect;
        e.iceDamageOvertime = this.iceDamageOvertime;
        e.fireDamageDirect = this.fireDamageDirect;
        e.fireDamageOvertime = this.fireDamageOvertime;
        e.lighteningDamageDirect = this.lighteningDamageDirect;
        e.lighteningDamageOvertime = this.lighteningDamageOvertime;
        e.toxicDamageDirect = this.toxicDamageDirect;
        e.toxicDamageOvertime = this.toxicDamageOvertime;
        e.curseDamageDirect = this.curseDamageDirect;
        e.curseDamageOvertime = this.curseDamageOvertime;
        e.spriteFrameName = this.spriteFrameName;
        e.dizzDurationDirect = this.dizzDurationDirect;
        e.dizzDurationOvertime = this.dizzDurationOvertime;
        return e;
    }
}