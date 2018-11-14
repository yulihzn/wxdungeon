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
export default class DamageData {
    realDamge:number = 0;//真实伤害
    physicalDamage: number = 0;//物理伤害
    iceDamage = 0;//冰元素伤害
    fireDamage = 0;//火元素伤害
    lighteningDamage = 0;//雷元素伤害
    toxicDamage = 0;//毒元素伤害
    curseDamage = 0;//诅咒元素伤害

    realRate = 0;//真实伤害释放几率
    iceRate = 0;//冰元素释放几率
    fireRate = 0;//火元素释放几率
    lighteningRate = 0;//雷元素释放几率
    toxicRate = 0;//毒元素释放几率
    curseRate = 0;//诅咒元素释放几率

    constructor(realDamge?:number){
        this.realDamge = realDamge?realDamge:0;
    }

    public valueCopy(data: DamageData): void {
        this.realDamge = data.realDamge?data.realDamge:0;
        this.physicalDamage = data.physicalDamage?data.physicalDamage:0;
        this.iceDamage = data.iceDamage?data.iceDamage:0;
        this.fireDamage = data.fireDamage?data.fireDamage:0;
        this.lighteningDamage = data.lighteningDamage?data.lighteningDamage:0;
        this.toxicDamage = data.toxicDamage?data.toxicDamage:0;
        this.curseDamage = data.curseDamage?data.curseDamage:0;
        this.realRate = data.realRate?data.realRate:0;
        this.iceRate = data.iceRate?data.iceRate:0;
        this.fireRate = data.fireRate?data.fireRate:0;
        this.lighteningRate = data.lighteningRate?data.lighteningRate:0;
        this.toxicRate = data.toxicRate?data.toxicRate:0;
        this.curseRate = data.curseRate?data.curseRate:0;
    }
   
    public clone(): DamageData {
        let e = new DamageData();
        e.realDamge = this.realDamge;
        e.physicalDamage = this.physicalDamage;
        e.iceDamage = this.iceDamage;
        e.fireDamage = this.fireDamage;
        e.lighteningDamage = this.lighteningDamage;
        e.toxicDamage = this.toxicDamage;
        e.curseDamage = this.curseDamage;
        e.realRate = this.realRate;
        e.iceRate = this.iceRate;
        e.fireRate = this.fireRate;
        e.lighteningRate = this.lighteningRate;
        e.toxicRate = this.toxicRate;
        e.curseRate = this.curseRate;
        return e;
    }
    public getTotalDamge():number{
        return this.physicalDamage+this.iceDamage+this.fireDamage+this.lighteningDamage+this.toxicDamage+this.curseDamage;
    }
}