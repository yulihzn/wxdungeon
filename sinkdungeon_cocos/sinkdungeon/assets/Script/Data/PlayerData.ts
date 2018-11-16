import EquipmentData from "./EquipmentData";
import DamageData from "./DamageData";
import StatusData from "./StatusData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class PlayerData {
    static DEFAULT_HEALTH = 5;
    name: string = '';
    //x=current y=max
    // basehealth:cc.Vec2=cc.v2(PlayerData.DEFAULT_HEALTH,PlayerData.DEFAULT_HEALTH);
    // attackPoint:number=1;
    pos: cc.Vec2 = cc.v2(7, 4);

    currentHealth: number = PlayerData.DEFAULT_HEALTH;
    maxHealth: number = PlayerData.DEFAULT_HEALTH;
    damageMin: number = 1;
    damageMax: number = 0;
    criticalStrikeRate: number = 0;
    defence: number = 0;
    lifeDrain: number = 0;
    lifeRecovery: number = 0;
    moveSpeed: number = 300;
    attackSpeed: number = 0;
    dodge: number = 0;

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

    equipmentTotalData: EquipmentData;
    statusTotalData: StatusData;

    constructor(){
        this.equipmentTotalData = new EquipmentData();
        this.statusTotalData = new StatusData();
    }
    updateHA(health: cc.Vec2, attackPoint: number) {
        this.currentHealth = health.x;
        this.maxHealth = health.y;
        this.damageMin = this.damageMin;
        return this;
    }


    public valueCopy(data: PlayerData): void {
        this.pos = data.pos ? data.pos : cc.v2(4, 7);
        this.name = data.name ? data.name : '';
        this.currentHealth = data.currentHealth ? data.currentHealth : PlayerData.DEFAULT_HEALTH;
        this.maxHealth = data.maxHealth ? data.maxHealth : PlayerData.DEFAULT_HEALTH;
        this.damageMin = data.damageMin ? data.damageMin : 0;
        this.damageMax = data.damageMax ? data.damageMax : 0;
        this.criticalStrikeRate = data.criticalStrikeRate ? data.criticalStrikeRate : 0;
        this.defence = data.defence ? data.defence : 0;
        this.lifeDrain = data.lifeDrain ? data.lifeDrain : 0;
        this.lifeRecovery = data.lifeRecovery ? data.lifeRecovery : 0;
        this.moveSpeed = data.moveSpeed ? data.moveSpeed : 300;
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
    public clone(): PlayerData {
        let e = new PlayerData();
        e.pos = this.pos;
        e.name = this.name;
        e.currentHealth = this.currentHealth;
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
        e.equipmentTotalData = this.equipmentTotalData;
        e.statusTotalData = this.statusTotalData;
        return e;
    }

    //初始速度300,最大速度600 最小速度为10
    getMoveSpeed(): number {
        let speed = 0;
        speed = this.equipmentTotalData.moveSpeed + this.statusTotalData.moveSpeed;
        if (speed > 300) { speed = 300 }
        if (speed < -290) { speed = -290 }
        return this.moveSpeed + speed;
    }
    //初始延迟是300,最低延迟为0 最大400
    getAttackSpeed(): number {
        let speed = 0;
        speed = this.equipmentTotalData.attackSpeed + this.statusTotalData.attackSpeed;
        return this.attackSpeed + speed;
    }
    //获取最小攻击力
    getDamageMin(): number {
        return this.damageMin + this.equipmentTotalData.damageMin + this.statusTotalData.physicalDamage;
    }
    //获取最大攻击力
    getDamageMax(): number {
        return this.damageMax + this.equipmentTotalData.damageMax;
    }
    //计算攻击的最终结果  
    //5% 6% 20% 1-0.95x0.94X0.8 = 0.16951
    getFinalAttackPoint(): DamageData {
        let dd = new DamageData();
        let damageMin = this.getDamageMin();
        let damageMax = this.getDamageMax();
        let chance = this.getCriticalStrikeRate();
        let attack = Math.random() > chance ? damageMin : damageMin + damageMax;
        if (attack < 0) {
            attack = 0;
        }
        dd.physicalDamage = attack;
        dd.realDamage = this.getRealDamage();
        dd.iceDamage = this.getIceDamage();
        dd.fireDamage = this.getFireDamage();
        dd.lighteningDamage = this.getLighteningDamage();
        dd.toxicDamage = this.getToxicDamage();
        dd.curseDamage = this.getCurseDamage();
        return dd;
    }
    //获取暴击率
    getCriticalStrikeRate(): number {
        let chance = 1 - (1 - this.criticalStrikeRate / 100) * (1 - this.equipmentTotalData.criticalStrikeRate / 100) * (1 - this.statusTotalData.criticalStrikeRate / 100);
        if (chance < 0) {
            chance = 0;
        }
        return chance;
    }
    //伤害减免
    getDamage(damageData: DamageData): DamageData {
        let finalDamageData = damageData.clone();
        let defence = this.getDefence();
        let defenceIce = this.getIceDefence();
        let defenceFire = this.getFireDefence();
        let defenceLightening = this.getLighteningDefence();
        let defenceToxic = this.getToxicDefence();
        let defenceCurse = this.getCurseDefence();
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))可以为负
        finalDamageData.physicalDamage = finalDamageData.physicalDamage * (1 - defence * 0.06 / (defence * 0.06 + 1));
        finalDamageData.iceDamage = finalDamageData.iceDamage * (1 - defenceIce / 100);
        finalDamageData.fireDamage = finalDamageData.fireDamage * (1 - defenceFire / 100);
        finalDamageData.lighteningDamage = finalDamageData.lighteningDamage * (1 - defenceLightening / 100);
        finalDamageData.toxicDamage = finalDamageData.toxicDamage * (1 - defenceToxic / 100);
        finalDamageData.curseDamage = finalDamageData.curseDamage * (1 - defenceCurse / 100);
        return finalDamageData;
    }
    //闪避
    getDodge(): number {
        let chance = 1 - (1 - this.dodge / 100) * (1 - this.equipmentTotalData.dodge / 100) * (1 - this.statusTotalData.dodge / 100);
        if (chance < 0) {
            chance = 0;
        }
        return chance;
    }
    //防御,可以为负数
    getDefence(): number {
        let defence = this.defence + this.equipmentTotalData.defence + this.statusTotalData.defence;
        return defence;
    }
    getIceDefence(): number {
        let defence = this.iceDefence + this.equipmentTotalData.iceDefence + this.statusTotalData.iceDefence;
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }
    getFireDefence(): number {
        let defence = this.fireDefence + this.equipmentTotalData.fireDefence + this.statusTotalData.fireDefence;
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }
    getLighteningDefence(): number {
        let defence = this.lighteningDefence + this.equipmentTotalData.lighteningDefence + this.statusTotalData.lighteningDefence;
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }
    getToxicDefence(): number {
        let defence = this.toxicDefence + this.equipmentTotalData.toxicDefence + this.statusTotalData.toxicDefence;
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }
    getCurseDefence(): number {
        let defence = this.curseDefence + this.equipmentTotalData.curseDefence + this.statusTotalData.curseDefence;
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }
    getRealDamage(): number {
        let Damage = this.realDamage + this.equipmentTotalData.realDamage + this.statusTotalData.realDamage;
        if (Damage < 0) {
            Damage = 0;
        }
        return Damage;
    }
    getIceDamage(): number {
        let Damage = this.iceDamage + this.equipmentTotalData.iceDamage + this.statusTotalData.iceDamage;
        if (Damage < 0) {
            Damage = 0;
        }
        return Damage;
    }
    getFireDamage(): number {
        let Damage = this.fireDamage + this.equipmentTotalData.fireDamage + this.statusTotalData.fireDamage;
        if (Damage < 0) {
            Damage = 0;
        }
        return Damage;
    }
    getLighteningDamage(): number {
        let Damage = this.lighteningDamage + this.equipmentTotalData.lighteningDamage + this.statusTotalData.lighteningDamage;
        if (Damage < 0) {
            Damage = 0;
        }
        return Damage;
    }
    getToxicDamage(): number {
        let Damage = this.toxicDamage + this.equipmentTotalData.toxicDamage + this.statusTotalData.toxicDamage;
        if (Damage < 0) {
            Damage = 0;
        }
        return Damage;
    }
    getCurseDamage(): number {
        let Damage = this.curseDamage + this.equipmentTotalData.curseDamage + this.statusTotalData.curseDamage;
        if (Damage < 0) {
            Damage = 0;
        }
        return Damage;
    }
    getRealRate(): number {
        let rate = this.realRate + this.equipmentTotalData.realRate + this.statusTotalData.realRate;
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }
    getIceRate(): number {
        let rate = this.iceRate + this.equipmentTotalData.iceRate + this.statusTotalData.iceRate;
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }
    getFireRate(): number {
        let rate = this.fireRate + this.equipmentTotalData.fireRate + this.statusTotalData.fireRate;
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }
    getLighteningRate(): number {
        let rate = this.lighteningRate + this.equipmentTotalData.lighteningRate + this.statusTotalData.lighteningRate;
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }
    getToxicRate(): number {
        let rate = this.toxicRate + this.equipmentTotalData.toxicRate + this.statusTotalData.toxicRate;
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }
    getCurseRate(): number {
        let rate = this.curseRate + this.equipmentTotalData.curseRate + this.statusTotalData.curseRate;
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }
    //30s生命恢复不可以为负数(加入状态以后考虑拿掉)
    getRecovery(): number {
        let recovery = this.lifeRecovery + this.equipmentTotalData.lifeRecovery + this.statusTotalData.lifeRecovery;
        return recovery > 0 ? recovery : 0;
    }
    //吸血默认是1暴击时吸血翻倍
    getLifeDrain(): number {
        let chance = this.getCriticalStrikeRate();
        let drainRate = 1 - (1 - this.lifeDrain / 100) * (1 - this.equipmentTotalData.lifeDrain / 100) * (1 - this.statusTotalData.lifeDrain / 100);
        let drain = 0;
        if (Math.random() < drainRate) {
            drain = 1;
            if (Math.random() < chance) {
                drain = 2;
            }
        }
        return drain;
    }

    //生命值
    getHealth(): cc.Vec2 {
        let rate = 1;
        let maxHealth = this.maxHealth + this.equipmentTotalData.health + this.statusTotalData.maxHealth;
        if (maxHealth > 0) {
            rate = this.currentHealth / maxHealth;
        } else {
            return cc.v2(1, 1);
        }
        return cc.v2(maxHealth * rate, maxHealth);
    }

}
