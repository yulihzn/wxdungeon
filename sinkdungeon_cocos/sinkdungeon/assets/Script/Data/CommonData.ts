// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**通用数据类 player monster boss item status 通用部分 */
export default class CommonData  {
    maxHealth: number = 0;//最大生命
    damageMin: number = 0;//最小攻击
    damageMax: number = 0;//最大攻击
    criticalStrikeRate: number = 0;//暴击
    defence: number = 0;//物理防御
    lifeDrain: number = 0;//吸血
    lifeRecovery: number = 0;//生命回复
    moveSpeed: number = 0;//移速
    attackSpeed: number = 0;//攻速
    dodge: number = 0;//闪避

    realDamage = 0;//真实伤害
    realRate = 0//真实伤害几率
    iceDamage = 0;//冰元素伤害
    iceDefence = 0;//冰元素抗性
    iceRate = 0;//冰元素几率
    fireDamage = 0;//火元素伤害
    fireDefence = 0;//火元素抗性
    fireRate = 0;//火元素几率
    lighteningDamage = 0;//雷元素伤害
    lighteningDefence = 0;//雷元素抗性
    lighteningRate = 0;//雷元素几率
    toxicDamage = 0;//毒元素伤害
    toxicDefence = 0;//毒元素抗性
    toxicRate = 0;//毒元素几率
    curseDamage = 0;//诅咒元素伤害
    curseDefence = 0;//诅咒元素抗性
    curseRate = 0;//诅咒元素几率

    public valueCopy(data: CommonData): void {
        this.maxHealth = data.maxHealth ? data.maxHealth : 0;
        this.damageMin = data.damageMin ? data.damageMin : 0;
        this.damageMax = data.damageMax ? data.damageMax : 0;
        this.criticalStrikeRate = data.criticalStrikeRate ? data.criticalStrikeRate : 0;
        this.defence = data.defence ? data.defence : 0;
        this.lifeDrain = data.lifeDrain ? data.lifeDrain : 0;
        this.lifeRecovery = data.lifeRecovery ? data.lifeRecovery : 0;
        this.moveSpeed = data.moveSpeed ? data.moveSpeed : 0;
        this.attackSpeed = data.attackSpeed ? data.attackSpeed : 0;
        this.dodge = data.dodge ? data.dodge : 0;
        this.realDamage = this.realDamage ? data.realDamage : 0;
        this.realRate = this.realRate ? data.realRate : 0;
        this.iceDamage = data.iceDamage ? data.iceDamage : 0;
        this.iceDefence = data.iceDefence ? data.iceDefence : 0;
        this.iceRate = data.iceRate ? data.iceRate : 0;
        this.fireDamage = data.fireDamage ? data.fireDamage : 0;
        this.fireDefence = data.fireDefence ? data.fireDefence : 0;
        this.fireRate = data.fireRate ? data.fireRate : 0;
        this.lighteningDamage = data.lighteningDamage ? data.lighteningDamage : 0;
        this.lighteningDefence = data.lighteningDefence ? data.lighteningDefence : 0;
        this.lighteningRate = data.lighteningRate ? data.lighteningRate : 0;
        this.toxicDamage = data.toxicDamage ? data.toxicDamage : 0;
        this.toxicDefence = data.toxicDefence ? data.toxicDefence : 0;
        this.toxicRate = data.toxicRate ? data.toxicRate : 0;
        this.curseDamage = data.curseDamage ? data.curseDamage : 0;
        this.curseDefence = data.curseDefence ? data.curseDefence : 0;
        this.curseRate = data.curseRate ? data.curseRate : 0;
    }
    public clone(): CommonData {
        let e = new CommonData();
        e.maxHealth = this.maxHealth;
        e.damageMin = this.damageMin;
        e.damageMax = this.damageMax;
        e.criticalStrikeRate = this.criticalStrikeRate;
        e.defence = this.defence;
        e.lifeDrain = this.lifeDrain;
        e.lifeRecovery = this.lifeRecovery;
        e.moveSpeed = this.moveSpeed;
        e.attackSpeed = this.attackSpeed;
        e.dodge = this.dodge;
        e.realDamage = this.realDamage;
        e.realRate = this.realRate;
        e.iceDamage = this.iceDamage;
        e.iceDefence = this.iceDefence;
        e.iceRate = this.iceRate;
        e.fireDamage = this.fireDamage;
        e.fireDefence = this.fireDefence;
        e.fireRate = this.fireRate;
        e.lighteningDamage = this.lighteningDamage;
        e.lighteningDefence = this.lighteningDefence;
        e.lighteningRate = this.lighteningRate;
        e.toxicDamage = this.toxicDamage;
        e.toxicDefence = this.toxicDefence;
        e.toxicRate = this.toxicRate;
        e.curseDamage = this.curseDamage;
        e.curseDefence = this.curseDefence;
        e.curseRate = this.curseRate;
        return e;
    }
}
