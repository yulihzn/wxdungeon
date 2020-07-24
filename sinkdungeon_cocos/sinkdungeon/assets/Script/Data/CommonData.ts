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
    damageBack: number = 0;//背面额外攻击伤害
    criticalStrikeRate: number = 0;//暴击
    defence: number = 0;//物理防御
    blockPhysical:number = 0;//物理格百分比
    blockMagic:number = 0;//魔法格挡百分比
    blockDamage:number = 0;//弹反伤害
    lifeDrain: number = 0;//吸血
    moveSpeed: number = 0;//移速
    attackSpeed: number = 0;//攻速
    dodge: number = 0;//闪避
    remoteSpeed:number = 0;//远程攻速
    remoteDamage:number = 0;//远程攻速
    remoteCritRate:number = 0;//远程暴击

    realDamage = 0;//真实伤害
    realRate = 0//真实伤害几率
    magicDamage = 0;//魔法伤害
    magicDefence = 0;//魔法抗性
    iceRate = 0;//冰元素几率
    fireRate = 0;//火元素几率
    lighteningRate = 0;//雷元素几率
    toxicRate = 0;//毒元素几率
    curseRate = 0;//诅咒元素几率

    public valueCopy(data: CommonData): void {
        this.maxHealth = data.maxHealth ? data.maxHealth : 0;
        this.damageMin = data.damageMin ? data.damageMin : 0;
        this.damageMax = data.damageMax ? data.damageMax : 0;
        this.remoteDamage = data.remoteDamage ? data.remoteDamage : 0;
        this.criticalStrikeRate = data.criticalStrikeRate ? data.criticalStrikeRate : 0;
        this.remoteCritRate = data.remoteCritRate ? data.remoteCritRate : 0;
        this.defence = data.defence ? data.defence : 0;
        this.lifeDrain = data.lifeDrain ? data.lifeDrain : 0;
        this.damageBack = data.damageBack ? data.damageBack : 0;
        this.moveSpeed = data.moveSpeed ? data.moveSpeed : 0;
        this.attackSpeed = data.attackSpeed ? data.attackSpeed : 0;
        this.remoteSpeed = data.remoteSpeed?data.remoteSpeed:0;
        this.dodge = data.dodge ? data.dodge : 0;
        this.realDamage = data.realDamage ? data.realDamage : 0;
        this.realRate = data.realRate ? data.realRate : 0;
        this.magicDefence = data.magicDefence ? data.magicDefence : 0;
        this.iceRate = data.iceRate ? data.iceRate : 0;
        this.magicDamage = data.magicDamage ? data.magicDamage : 0;
        this.fireRate = data.fireRate ? data.fireRate : 0;
        this.lighteningRate = data.lighteningRate ? data.lighteningRate : 0;
        this.toxicRate = data.toxicRate ? data.toxicRate : 0;
        this.curseRate = data.curseRate ? data.curseRate : 0;
        this.blockPhysical = data.blockPhysical ? data.blockPhysical : 0;
        this.blockMagic = data.blockMagic?data.blockMagic:0;
        this.blockDamage = data.blockDamage?data.blockDamage:0;
    }
    public clone(): CommonData {
        let e = new CommonData();
        e.maxHealth = this.maxHealth;
        e.damageMin = this.damageMin;
        e.damageMax = this.damageMax;
        e.criticalStrikeRate = this.criticalStrikeRate;
        e.defence = this.defence;
        e.lifeDrain = this.lifeDrain;
        e.damageBack = this.damageBack;
        e.moveSpeed = this.moveSpeed;
        e.attackSpeed = this.attackSpeed;
        e.remoteSpeed = this.remoteSpeed;
        e.dodge = this.dodge;
        e.realDamage = this.realDamage;
        e.realRate = this.realRate;
        e.magicDefence = this.magicDefence;
        e.iceRate = this.iceRate;
        e.fireRate = this.fireRate;
        e.lighteningRate = this.lighteningRate;
        e.toxicRate = this.toxicRate;
        e.curseRate = this.curseRate;
        e.remoteDamage = this.remoteDamage;
        e.remoteCritRate = this.remoteCritRate;
        e.blockPhysical = this.blockPhysical;
        e.blockMagic = this.blockMagic;
        e.blockDamage = this.blockDamage;
        return e;
    }
}
