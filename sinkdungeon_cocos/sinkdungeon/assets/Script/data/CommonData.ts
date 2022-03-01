// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import DataUtils from "../utils/DataUtils";

/**通用数据类 player monster boss item status 通用部分 */
export default class CommonData {
    maxHealth: number = 0;//最大生命
    maxDream: number = 0;//最大梦境值
    maxAmmo: number = 0;//子弹容量
    damageMin: number = 0;//最小攻击
    damageMax: number = 0;//最大攻击
    damageBack: number = 0;//背面额外攻击伤害
    defence: number = 0;//物理防御
    moveSpeed: number = 0;//移速
    attackSpeed: number = 0;//攻速
    remoteDamage: number = 0;//远程攻击
    realDamage = 0;//真实伤害
    magicDamage = 0;//魔法伤害

    blockDamage: number = 0;//弹反伤害
    remoteCooldown: number = 0;//远程冷却或者充能时间
    criticalStrikeRate: number = 0;//暴击%
    blockPhysical: number = 0;//物理格挡百分比%
    blockMagic: number = 0;//魔法格挡百分比%
    lifeDrain: number = 0;//吸血%
    dodge: number = 0;//闪避%
    remoteCritRate: number = 0;//远程暴击%
    remoteInterval: number = 0;//远程子弹间隔
    remoteAngle: number = 0;//子弹准度偏离范围

    realRate = 0//真实伤害几率%
    magicDefence = 0;//魔法抗性%
    iceRate = 0;//冰元素几率%
    fireRate = 0;//火元素几率%
    lighteningRate = 0;//雷元素几率%
    toxicRate = 0;//毒元素几率%
    curseRate = 0;//诅咒元素几率%

    maxHealthPercent: number = 0;//最大生命%
    maxDreamPercent: number = 0;//最大梦境值%
    maxAmmoPercent: number = 0;//子弹容量%
    damageMinPercent: number = 0;//最小攻击%
    damageMaxPercent: number = 0;//最大攻击%
    damageBackPercent: number = 0;//背面额外攻击伤害%
    defencePercent: number = 0;//物理防御%
    moveSpeedPercent: number = 0;//移速%
    attackSpeedPercent: number = 0;//攻速%
    remoteDamagePercent: number = 0;//远程攻击%
    realDamagePercent = 0;//真实伤害%
    magicDamagePercent = 0;//魔法伤害%

    get MaxHealth() { return Math.floor(this.maxHealth * (1 + this.maxHealthPercent/100)); }
    get MaxDream() { return Math.floor(this.maxDream * (1 + this.maxDreamPercent/100)); }
    get MaxAmmo() { return Math.floor(this.maxAmmo * (1 + this.maxAmmoPercent/100)); }
    get DamageMin() { return Math.floor(this.damageMin * (1 + this.damageMinPercent/100)); }
    get DamageMax() { return Math.floor(this.damageMax * (1 + this.damageMaxPercent/100)); }
    get DamageBack() { return Math.floor(this.damageBack * (1 + this.damageBackPercent/100)); }
    get Defence() { return Math.floor(this.defence * (1 + this.defencePercent/100)); }
    get MoveSpeed() { return Math.floor(this.moveSpeed * (1 + this.moveSpeedPercent/100)); }
    get AttackSpeed() { return Math.floor(this.attackSpeed * (1 + this.attackSpeedPercent/100)); }
    get RemoteDamage() { return Math.floor(this.remoteDamage * (1 + this.remoteDamagePercent/100)); }
    get RealDamage() { return Math.floor(this.realDamage * (1 + this.realDamagePercent/100)); }
    get MagicDamage() { return Math.floor(this.magicDamage * (1 + this.magicDamagePercent/100)); }
    public valueCopy(data: CommonData): void {
        if (!data) {
            return;
        }
        DataUtils.baseCopy(this, data);
    }

    public clone(): CommonData {
        let e = new CommonData();
        e.valueCopy(this);
        return e;
    }
    /**相加 */
    public add(data: CommonData): CommonData {
        this.maxHealth += data.maxHealth ? data.maxHealth : 0;
        this.maxDream += data.maxDream ? data.maxDream : 0;
        this.damageMin += data.damageMin ? data.damageMin : 0;
        this.damageMax += data.damageMax ? data.damageMax : 0;
        this.maxAmmo += data.maxAmmo ? data.maxAmmo : 0;
        this.remoteDamage += data.remoteDamage ? data.remoteDamage : 0;
        this.defence += data.defence ? data.defence : 0;
        this.damageBack += data.damageBack ? data.damageBack : 0;
        this.moveSpeed += data.moveSpeed ? data.moveSpeed : 0;
        this.attackSpeed += data.attackSpeed ? data.attackSpeed : 0;
        this.remoteCooldown += data.remoteCooldown ? data.remoteCooldown : 0;
        this.remoteInterval += data.remoteInterval ? data.remoteInterval : 0;
        this.remoteAngle += data.remoteAngle ? data.remoteAngle : 0;
        this.realDamage += data.realDamage ? data.realDamage : 0;
        this.magicDamage += data.magicDamage ? data.magicDamage : 0;
        this.blockDamage += data.blockDamage ? data.blockDamage : 0;

        this.iceRate = DataUtils.addRateFixed(this.iceRate, data.iceRate);
        this.fireRate = DataUtils.addRateFixed(this.fireRate, data.fireRate);
        this.lighteningRate = DataUtils.addRateFixed(this.lighteningRate, data.lighteningRate);
        this.toxicRate = DataUtils.addRateFixed(this.toxicRate, data.toxicRate);
        this.curseRate = DataUtils.addRateFixed(this.curseRate, data.curseRate);
        this.blockPhysical = DataUtils.addRateFixed(this.blockPhysical, data.blockPhysical);
        this.blockMagic = DataUtils.addRateFixed(this.blockMagic, data.blockMagic);
        this.magicDefence = DataUtils.addRateFixed(this.magicDefence, data.magicDefence);
        this.realRate = DataUtils.addRateFixed(this.realRate, data.realRate);
        this.lifeDrain = DataUtils.addRateFixed(this.lifeDrain, data.lifeDrain);
        this.dodge = DataUtils.addRateFixed(this.dodge, data.dodge);
        this.remoteCritRate = DataUtils.addRateFixed(this.remoteCritRate, data.remoteCritRate);
        this.criticalStrikeRate = DataUtils.addRateFixed(this.criticalStrikeRate, data.criticalStrikeRate);
        this.maxHealthPercent = DataUtils.addPercentFixed(this.maxHealthPercent, data.maxHealthPercent);
        this.maxDreamPercent = DataUtils.addPercentFixed(this.maxDreamPercent, data.maxDreamPercent);
        this.maxAmmoPercent = DataUtils.addPercentFixed(this.maxAmmoPercent, data.maxAmmoPercent);
        this.damageMinPercent = DataUtils.addPercentFixed(this.damageMinPercent, data.damageMinPercent);
        this.damageMaxPercent = DataUtils.addPercentFixed(this.damageMaxPercent, data.damageMaxPercent);
        this.damageBackPercent = DataUtils.addPercentFixed(this.damageBackPercent, data.damageBackPercent);
        this.defencePercent = DataUtils.addPercentFixed(this.defencePercent, data.defencePercent);
        this.moveSpeedPercent = DataUtils.addPercentFixed(this.moveSpeedPercent, data.moveSpeedPercent);
        this.attackSpeedPercent = DataUtils.addPercentFixed(this.attackSpeedPercent, data.attackSpeedPercent);
        this.remoteDamagePercent = DataUtils.addPercentFixed(this.remoteDamagePercent, data.remoteDamagePercent);
        this.realDamagePercent = DataUtils.addPercentFixed(this.realDamagePercent, data.realDamagePercent);
        this.magicDamagePercent = DataUtils.addPercentFixed(this.magicDamagePercent, data.magicDamagePercent);
        return this;
    }

}
