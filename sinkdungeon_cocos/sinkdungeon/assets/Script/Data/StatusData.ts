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
 * 状态有两种添加方式，一种是立即触发，一种是持续触发
 * 状态出现添加时机有：物品装备加载，使用物品，物品装备间隔定时触发，近战攻击按键，远程攻 击按键，
 * 近战攻击击中，aoe持续击中，子弹击中受到伤害，击杀敌人,开始使用技能，
 * 技能持续，技能结束，静止，移动，梦境值耗尽，梦境值满，生命值满，半血，濒死，进出指定范围
 * 状态移除时机有：状态倒计时结束，技能开始，技能结束，物品装备更换，死亡，受到伤害，驱散，
 * 静止，移动，近战攻击按键，远程攻击按键，梦境值耗尽，半血，濒死，进出指定范围
 * 负面：冰冻、燃烧、减速、中毒、诅咒、流血、道具
 * 正面：祝福、道具、天赋、隐身
 */
export default class StatusData {
    private common:CommonData;
    id: number = 0;//状态id
    type: number = 0;//状态类型 0为正面效果1为负面效果
    nameCn: string = '';
    nameEn: string = '';
    duration: number = 0;//持续时间
    desc: string = '';
    spriteFrameName:string = '';
    info1:string = '';
    info2:string = '';
    info3:string = '';
    extraInfo:string = '';
    infobase:string = '';
    infocolor1:string = '#ffffff';
    infocolor2:string = '#ffffff';
    infocolor3:string = '#ffffff';
    infobasecolor:string = '#ffffff';

    physicalDamageDirect: number = 0;//瞬间伤害
    physicalDamageOvertime: number = 0;//持续伤害
    missRate: number = 0;//攻击落空几率
    realDamageDirect:number= 0;//瞬间真实伤害
    realDamageOvertime: number = 0;//持续真实伤害
    dreamDirect:number= 0;//瞬间梦境扣除
    dreamOvertime: number = 0;//持续梦境扣除
    magicDamageDirect = 0;//瞬间魔法元素伤害
    magicDamageOvertime = 0;//持续魔法元素伤害
    dizzDurationDirect = 0;//瞬间眩晕时长
    dizzDurationOvertime = 0;//持续眩晕时长
    invisibleDuratonDirect = 0;//隐身持续时长
    variation = 0;//变异
    finishStatus = '';//状态结束附加新的状态
    unique:number = 0;//唯一的，同样标记的只能有一个，需要移除其它含有相同数字的 1：商品 2：食物 3：塔罗牌或者其它什么
    exOilGold:number = 0;//额外经验获取
    clearHealth = 0;//清理完房间回复生命
    avoidDeath = 0;//抵挡一次致命伤
    sanityDirect: number = 0;//瞬间san值增加
    sanityOvertime: number = 0;//持续san值增加
    solidDirect: number = 0;//瞬间饱腹增加
    solidOvertime: number = 0;//持续饱腹增加
    liquidDirect: number = 0;//瞬间解渴增加
    liquidOvertime: number = 0;//持续解渴值增加
    
    
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
        if(!data){
            return;
        }
        this.common.valueCopy(data.common);
        this.from.valueCopy(data.from);
        this.nameCn = data.nameCn ? data.nameCn : this.nameCn;
        this.nameEn = data.nameEn;
        this.id = data.id?data.id:0;
        this.type = data.type?data.type:0;
        this.duration = data.duration?data.duration:0;
        this.spriteFrameName = data.spriteFrameName;
        this.desc = data.desc;
        this.physicalDamageDirect = data.physicalDamageDirect?data.physicalDamageDirect:0;
        this.physicalDamageOvertime = data.physicalDamageOvertime?data.physicalDamageOvertime:0;
        this.missRate = data.missRate?data.missRate:0;
        this.realDamageDirect = data.realDamageDirect?data.realDamageDirect:0;
        this.realDamageOvertime = data.realDamageOvertime?data.realDamageOvertime:0;
        this.magicDamageDirect = data.magicDamageDirect?data.magicDamageDirect:0;
        this.magicDamageOvertime = data.magicDamageOvertime?data.magicDamageOvertime:0;
        this.dizzDurationDirect = data.dizzDurationDirect?data.dizzDurationDirect:0;
        this.dizzDurationOvertime = data.dizzDurationOvertime?data.dizzDurationOvertime:0;
        this.invisibleDuratonDirect = data.invisibleDuratonDirect?data.invisibleDuratonDirect:0;
        this.dreamDirect = data.dreamDirect?data.dreamDirect:0;
        this.dreamOvertime = data.dreamOvertime?data.dreamOvertime:0;
        this.sanityDirect = data.sanityDirect?data.sanityDirect:0;
        this.sanityOvertime = data.sanityOvertime?data.sanityOvertime:0;
        this.solidDirect = data.solidDirect?data.solidDirect:0;
        this.solidOvertime = data.solidOvertime?data.solidOvertime:0;
        this.liquidDirect = data.liquidDirect?data.liquidDirect:0;
        this.liquidOvertime = data.liquidOvertime?data.liquidOvertime:0;
        this.variation = data.variation?data.variation:0;
        this.unique = data.unique?data.unique:0;
        this.exOilGold = data.exOilGold?data.exOilGold:0;
        this.clearHealth = data.clearHealth?data.clearHealth:0;
        this.avoidDeath = data.avoidDeath?data.avoidDeath:0;
        this.finishStatus = data.finishStatus?data.finishStatus:'';
        this.info1 = data.info1?data.info1:'';
        this.info2 = data.info2?data.info2:'';
        this.info3 = data.info3?data.info3:'';
        this.extraInfo = data.extraInfo?data.extraInfo:'';
        this.infobase = data.infobase?data.infobase:'';
        this.infocolor1 = data.infocolor1?data.infocolor1:'#ffffff';
        this.infocolor2 = data.infocolor2?data.infocolor2:'#ffffff';
        this.infocolor3 = data.infocolor3?data.infocolor3:'#ffffff';
        this.infobasecolor = data.infobasecolor?data.infobasecolor:'#ffffff';
    }
    public clone(): StatusData {
        let e = new StatusData();
        e.common = this.common.clone();
        e.from = this.from.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.id = this.id;
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
        e.dreamDirect = this.dreamDirect;
        e.dreamOvertime = this.dreamOvertime;
        e.sanityDirect = this.sanityDirect;
        e.sanityOvertime = this.sanityOvertime;
        e.liquidDirect = this.liquidDirect;
        e.liquidOvertime = this.liquidOvertime;
        e.solidDirect = this.solidDirect;
        e.solidOvertime = this.solidOvertime;
        e.type = this.type;
        e.variation = this.variation;
        e.finishStatus = this.finishStatus;
        e.unique = this.unique;
        e.exOilGold = this.exOilGold;
        e.clearHealth = this.clearHealth;
        e.avoidDeath = this.avoidDeath;
        e.info1 = this.info1;
        e.info2 = this.info2;
        e.info3 = this.info3;
        e.extraInfo = this.extraInfo;
        e.infobase = this.infobase;
        e.infocolor1 = this.infocolor1;
        e.infocolor2 = this.infocolor2;
        e.infocolor3 = this.infocolor3;
        e.infobasecolor = this.infobasecolor;
        return e;
    }
}