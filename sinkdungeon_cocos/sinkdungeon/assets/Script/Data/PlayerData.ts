import EquipmentData from "./EquipmentData";
import DamageData from "./DamageData";
import StatusData from "./StatusData";
import CommonData from "./CommonData";
import Random from "../Utils/Random";
import AvatarData from "./AvatarData";
import Shield from "../Shield";

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
    static DEFAULT_HEALTH = 10;
    static DefAULT_SPEED = 300;
    static DefAULT_ATTACK = 1;
    static DefAULT_BACK_ATTACK = 0;
    name: string = '';
    pos: cc.Vec3 = cc.v3(7, 4);

    currentHealth: number = PlayerData.DEFAULT_HEALTH;

    private common: CommonData;
    private equipmentTotalData: EquipmentData;
    private statusTotalData: StatusData;
    private avatarData:AvatarData;

    constructor() {
        this.equipmentTotalData = new EquipmentData();
        this.statusTotalData = new StatusData();
        this.avatarData = new AvatarData();
        this.common = new CommonData();
        this.common.maxHealth = PlayerData.DEFAULT_HEALTH;
        this.common.moveSpeed = PlayerData.DefAULT_SPEED;
        this.common.damageMin = PlayerData.DefAULT_ATTACK;
        this.common.damageBack = PlayerData.DefAULT_BACK_ATTACK;
    }
    get EquipmentTotalData() {
        return this.equipmentTotalData;
    }
    get StatusTotalData() {
        return this.statusTotalData;
    }
    get AvatarData(){
        return this.avatarData;
    }
    set AvatarData(data:AvatarData){
        this.avatarData = data;
    }
    get Common() {
        return this.common;
    }
    private getCommonList():CommonData[]{
        return [this.common, this.equipmentTotalData.Common, this.statusTotalData.Common];
    }
    updateHA(health: cc.Vec3, attackPoint: number) {
        this.currentHealth = health.x;
        this.common.maxHealth = health.y;
        this.common.damageMin = this.common.damageMin;
        return this;
    }


    public valueCopy(data: PlayerData): void {
        this.common.valueCopy(data.common);
        this.pos = data.pos ? cc.v3(data.pos.x,data.pos.y) : cc.v3(4, 7);
        this.name = data.name ? data.name : '';
        this.equipmentTotalData.valueCopy(data.equipmentTotalData);
        this.statusTotalData.valueCopy(data.statusTotalData);
        this.avatarData.valueCopy(data.avatarData);
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
        e.avatarData = this.avatarData;
        return e;
    }

    //计算攻击的最终结果  
    //5% 6% 20% 1-0.95x0.94X0.8 = 0.16951
    getFinalAttackPoint(): DamageData {
        let dd = new DamageData();
        let damageMin = this.getDamageMin();
        let damageMax = this.getDamageMax();
        let chance = this.getCriticalStrikeRate();
        let isCritical = Random.rand() < chance;
        let attack = isCritical ? damageMin + damageMax : damageMin;
        if (attack < 0) {
            attack = 0;
        }
        dd.isCriticalStrike = isCritical;
        dd.physicalDamage = attack;
        dd.realDamage = this.getRealDamage();
        dd.magicDamage = this.getMagicDamage();
        return dd;
    }
    //获取最终远程伤害
    getFinalRemoteDamage(): DamageData {
        let dd = new DamageData();
        let remoteDamage = this.getRemoteDamage();
        let chance = this.getRemoteCritRate();
        let isCritical = Random.rand() < chance;
        let attack = isCritical ? remoteDamage+remoteDamage : remoteDamage;
        if (attack < 0) {
            attack = 0;
        }
        dd.physicalDamage = attack;
        dd.isCriticalStrike = isCritical;
        return dd;
    }
    //伤害减免
    getDamage(damageData: DamageData,blockLevel:number): DamageData {
        let finalDamageData = damageData.clone();
        let defence = this.getDefence();
        let defenceMagic = this.getMagicDefence();
        let blockReduction = this.getBlockReduction();
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))
        //伤害 = 攻击 + 2-0.94^(-护甲)
        if(defence>=0){
            finalDamageData.physicalDamage = finalDamageData.physicalDamage*(1-defence*0.06/(defence*0.06+1));
        }else{
            finalDamageData.physicalDamage = finalDamageData.physicalDamage * (2-Math.pow(0.94,-defence));
        }
        finalDamageData.magicDamage = finalDamageData.magicDamage * (1 - defenceMagic / 100);
        if(blockLevel == Shield.BLOCK_NORMAL){
            finalDamageData.physicalDamage = finalDamageData.physicalDamage * (1 - blockReduction / 100);
        }else if(blockLevel == Shield.BLOCK_REFLECT){
            finalDamageData.physicalDamage = 0;
            finalDamageData.magicDamage = 0;
        }
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

    //初始速度300,最大速度600 最小速度为0
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
    //获取远程攻击
    getRemoteDamage():number{
        let d = 0;
        for (let data of this.getCommonList()) {
            d += data.remoteDamage;
        }
        return d;
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

    //获取远程暴击率
    getRemoteCritRate(): number {
        let rate = 1;
        for (let data of this.getCommonList()) {
            rate *= (1 - data.remoteCritRate / 100);
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

    getBlockReduction(): number {
        let block = 0;
        for (let data of this.getCommonList()) {
            block += data.blockReduction;
        }
        if (block > 100) {
            block = 100;
        }
        return block;
    }

    //生命值
    getHealth(): cc.Vec3 {
        let rate = 1;
        let maxHealth = 0;
        for (let data of this.getCommonList()) {
            maxHealth += data.maxHealth;
        }
        if (maxHealth > 0) {
            rate = this.currentHealth / maxHealth;
        } else {
            return cc.v3(1, 1);
        }
        return cc.v3(maxHealth * rate, maxHealth);
    }
    getMagicDefence(): number {
        let defence = 0;
        for (let data of this.getCommonList()) {
            defence += data.magicDefence;
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
    getMagicDamage(): number {
        let damage = 0;
        for (let data of this.getCommonList()) {
            damage += data.magicDamage;
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

    //背刺伤害
    getDamageBack(): number {
        let damageBack = 0;
        for (let data of this.getCommonList()) {
            damageBack += data.damageBack;
        }
        return damageBack > 0 ? damageBack : 0;
    }

    getLifeDrainRate(): number {
        let rate = 1;
        for (let data of this.getCommonList()) {
            rate *= (1 - data.lifeDrain / 100);
        }
        return 1 - rate;

    }

}
