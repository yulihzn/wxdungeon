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
 * 正面：祝福、道具、天赋、隐身
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
    magicDamageDirect = 0;//瞬间魔法元素伤害
    magicDamageOvertime = 0;//持续魔法元素伤害
    dizzDurationDirect = 0;//瞬间眩晕时长
    dizzDurationOvertime = 0;//持续眩晕时长
    invisibleDuratonDirect = 0;//隐身持续时长
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
        this.magicDamageDirect = data.magicDamageDirect;
        this.magicDamageOvertime = data.magicDamageOvertime;
        this.dizzDurationDirect = data.dizzDurationDirect;
        this.dizzDurationOvertime = data.dizzDurationOvertime;
        this.invisibleDuratonDirect = data.invisibleDuratonDirect;
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
        e.realDamageOvertime = this.realDamageOvertime;
        e.magicDamageDirect = this.magicDamageDirect
        e.magicDamageOvertime = this.magicDamageOvertime;
        e.spriteFrameName = this.spriteFrameName;
        e.dizzDurationDirect = this.dizzDurationDirect;
        e.dizzDurationOvertime = this.dizzDurationOvertime;
        e.invisibleDuratonDirect = this.invisibleDuratonDirect;
        return e;
    }
}