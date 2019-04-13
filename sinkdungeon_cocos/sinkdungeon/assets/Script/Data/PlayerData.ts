import EquipmentData from "./EquipmentData";
import DamageData from "./DamageData";
import StatusData from "./StatusData";
import CommonData from "./CommonData";
import Random from "../Utils/Random";

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
    static DEFAULT_HEALTH = 5000;
    static DefAULT_SPEED = 300;
    static DefAULT_ATTACK = 1;
    name: string = '';
    pos: cc.Vec2 = cc.v2(7, 4);

    currentHealth: number = PlayerData.DEFAULT_HEALTH;

    private common: CommonData;
    private equipmentTotalData: EquipmentData;
    private statusTotalData: StatusData;    

    constructor() {
        this.equipmentTotalData = new EquipmentData();
        this.statusTotalData = new StatusData();
        this.common = new CommonData();
        this.common.maxHealth = PlayerData.DEFAULT_HEALTH;
        this.common.moveSpeed = PlayerData.DefAULT_SPEED;
        this.common.damageMin = PlayerData.DefAULT_ATTACK;
    }
    get EquipmentTotalData() {
        return this.equipmentTotalData;
    }
    get StatusTotalData() {
        return this.statusTotalData;
    }
    get Common() {
        return this.common;
    }
    private getCommonList():CommonData[]{
        return [this.common, this.equipmentTotalData.Common, this.statusTotalData.Common];
    }
    updateHA(health: cc.Vec2, attackPoint: number) {
        this.currentHealth = health.x;
        this.common.maxHealth = health.y;
        this.common.damageMin = this.common.damageMin;
        return this;
    }


    public valueCopy(data: PlayerData): void {
        this.common.valueCopy(data.common);
        this.pos = data.pos ? cc.v2(data.pos.x,data.pos.y) : cc.v2(4, 7);
        this.name = data.name ? data.name : '';
        this.equipmentTotalData.valueCopy(data.equipmentTotalData);
        this.statusTotalData.valueCopy(data.statusTotalData);
        this.currentHealth = data.currentHealth ? data.currentHealth : PlayerData.DEFAULT_HEALTH;
        this.common.maxHealth = data.common.maxHealth ? data.common.maxHealth : PlayerData.DEFAULT_HEALTH;
        this.common.moveSpeed = data.common.moveSpeed ? data.common.moveSpeed : 300;
    }
    public clone(): PlayerData {
        let e = new PlayerData();
        e.common = this.common.clone();
        e.pos = this.pos;
        e.name = this.name;
        e.currentHealth = this.currentHealth;
        e.equipmentTotalData = this.equipmentTotalData;
        e.statusTotalData = this.statusTotalData;
        return e;
    }

    //计算攻击的最终结果  
    //5% 6% 20% 1-0.95x0.94X0.8 = 0.16951
    getFinalAttackPoint(): DamageData {
        let dd = new DamageData();
        let damageMin = this.getDamageMin();
        let damageMax = this.getDamageMax();
        let chance = this.getCriticalStrikeRate();
        let attack = Random.rand() > chance ? damageMin : damageMin + damageMax;
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

    //伤害减免
    getDamage(damageData: DamageData): DamageData {
        let finalDamageData = damageData.clone();
        let defence = this.getDefence();
        let defenceIce = this.getIceDefence();
        let defenceFire = this.getFireDefence();
        let defenceLightening = this.getLighteningDefence();
        let defenceToxic = this.getToxicDefence();
        let defenceCurse = this.getCurseDefence();
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))
        //伤害 = 攻击 + 2-0.94^(-护甲)
        if(defence>=0){
            finalDamageData.physicalDamage = finalDamageData.physicalDamage*(1-defence*0.06/(defence*0.06+1));
        }else{
            finalDamageData.physicalDamage = finalDamageData.physicalDamage * (2-Math.pow(0.94,-defence));
        }
        finalDamageData.iceDamage = finalDamageData.iceDamage * (1 - defenceIce / 100);
        finalDamageData.fireDamage = finalDamageData.fireDamage * (1 - defenceFire / 100);
        finalDamageData.lighteningDamage = finalDamageData.lighteningDamage * (1 - defenceLightening / 100);
        finalDamageData.toxicDamage = finalDamageData.toxicDamage * (1 - defenceToxic / 100);
        finalDamageData.curseDamage = finalDamageData.curseDamage * (1 - defenceCurse / 100);
        return finalDamageData;
    }

    //吸血默认是1暴击时吸血翻倍
    getLifeDrain(): number {
        let chance = this.getCriticalStrikeRate();
        let drainRate = this.getLifeDrainRate();
        let drain = 0;
        if (Random.rand() < drainRate) {
            drain = 1;
            if (Random.rand() < chance) {
                drain = 2;
            }
        }
        return drain;
    }

    //初始速度300,最大速度600 最小速度为10
    getMoveSpeed(): number {
        let speed = 0;
        for (let data of this.getCommonList()) {
            speed += data.moveSpeed;
        }
        if (speed > PlayerData.DefAULT_SPEED * 2) { speed = PlayerData.DefAULT_SPEED * 2 }
        if (speed < -PlayerData.DefAULT_SPEED * 2) { speed = -PlayerData.DefAULT_SPEED * 2; }
        return speed;
    }
    //初始延迟是300,最低延迟为0 最大3000
    getAttackSpeed(): number {
        let speed = 0;
        for (let data of this.getCommonList()) {
            speed += data.attackSpeed;
        }
        return speed;
    }
    //初始延迟是300,最低延迟为10 最大3000
    getRemoteSpeed(): number {
        let speed = 0;
        for (let data of this.getCommonList()) {
            speed += data.remoteSpeed;
        }
        return speed;
    }
    //获取最小攻击力
    getDamageMin(): number {
        let d = 0;
        for (let data of this.getCommonList()) {
            d += data.damageMin;
        }
        return d;
    }
    //获取最大攻击力
    getDamageMax(): number {
        let d = 0;
        for (let data of this.getCommonList()) {
            d += data.damageMax;
        }
        return d;
    }

    //获取暴击率
    getCriticalStrikeRate(): number {
        let rate = 1;
        for (let data of this.getCommonList()) {
            rate *= (1 - data.criticalStrikeRate / 100);
        }
        return 1 - rate;
    }

    //闪避
    getDodge(): number {
        let rate = 1;
        for (let data of this.getCommonList()) {
            rate *= (1 - data.dodge / 100);
        }
        return 1 - rate;
    }
    //防御,可以为负数
    getDefence(): number {
        let defence = 0;
        for (let data of this.getCommonList()) {
            defence += data.defence;
        }
        return defence;
    }

    //生命值
    getHealth(): cc.Vec2 {
        let rate = 1;
        let maxHealth = 0;
        for (let data of this.getCommonList()) {
            maxHealth += data.maxHealth;
        }
        if (maxHealth > 0) {
            rate = this.currentHealth / maxHealth;
        } else {
            return cc.v2(1, 1);
        }
        return cc.v2(maxHealth * rate, maxHealth);
    }

    getIceDefence(): number {
        let defence = 0;
        for (let data of this.getCommonList()) {
            defence += data.iceDefence;
        }
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }

    getFireDefence(): number {
        let defence = 0;
        for (let data of this.getCommonList()) {
            defence += data.fireDefence;
        }
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }

    getLighteningDefence(): number {
        let defence = 0;
        for (let data of this.getCommonList()) {
            defence += data.lighteningDefence;
        }
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }

    getToxicDefence(): number {
        let defence = 0;
        for (let data of this.getCommonList()) {
            defence += data.toxicDefence;
        }
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }

    getCurseDefence(): number {
        let defence = 0;
        for (let data of this.getCommonList()) {
            defence += data.curseDefence;
        }
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }

    getRealDamage(): number {
        let damage = 0;
        for (let data of this.getCommonList()) {
            damage += data.realDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getIceDamage(): number {
        let damage = 0;
        for (let data of this.getCommonList()) {
            damage += data.iceDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getFireDamage(): number {
        let damage = 0;
        for (let data of this.getCommonList()) {
            damage += data.fireDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getLighteningDamage(): number {
        let damage = 0;
        for (let data of this.getCommonList()) {
            damage += data.lighteningDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getToxicDamage(): number {
        let damage = 0;
        for (let data of this.getCommonList()) {
            damage += data.toxicDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getCurseDamage(): number {
        let damage = 0;
        for (let data of this.getCommonList()) {
            damage += data.curseDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getRealRate(): number {
        let rate = 0;
        for (let data of this.getCommonList()) {
            rate += data.realRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    getIceRate(): number {
        let rate = 0;
        for (let data of this.getCommonList()) {
            rate += data.iceRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    getFireRate(): number {
        let rate = 0;
        for (let data of this.getCommonList()) {
            rate += data.fireRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    getLighteningRate(): number {
        let rate = 0;
        for (let data of this.getCommonList()) {
            rate += data.lighteningRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    getToxicRate(): number {
        let rate = 0;
        for (let data of this.getCommonList()) {
            rate += data.toxicRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    getCurseRate(): number {
        let rate = 0;
        for (let data of this.getCommonList()) {
            rate += data.curseRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    //30s生命恢复不可以为负数(加入状态以后考虑拿掉)
    getLifeRecovery(): number {
        let lifeRecovery = 0;
        for (let data of this.getCommonList()) {
            lifeRecovery += data.lifeRecovery;
        }
        return lifeRecovery > 0 ? lifeRecovery : 0;
    }

    getLifeDrainRate(): number {
        let rate = 1;
        for (let data of this.getCommonList()) {
            rate *= (1 - data.lifeDrain / 100);
        }
        return 1 - rate;

    }

}
