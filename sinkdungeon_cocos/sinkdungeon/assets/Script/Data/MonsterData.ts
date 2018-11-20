import DamageData from "./DamageData";
import StatusData from "./StatusData";
import CommonData from "./CommonData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class MonsterData{
    nameCn:string = '';//名字
    nameEn:string = '';
    resName:string = '';//资源名字
    chapter:number = 0;//章节，如果为0所有章节都会出现
    stageLevel:number = 0;//关卡等级，如果为0所有level都会出现
    invisible:number=0;//是否隐身，发起攻击或者冲刺的时候现形,攻击结束以后1s再次隐身,隐身状态下可以被攻击而且现形
    remote:number=0;//是否远程大于0 远程会远离目标到一定范围
    melee:number=0;//是否近战大于0 近战会接近目标
    dash:number=0;//是否冲刺大于0 当距离够的时候会发起冲刺，往目标地点冲刺进行撞击
    disguise:number=0;//是否伪装大于0,数值为距离 伪装状态下不能移动和攻击，当接近的时候会恢复
    pos:cc.Vec2 = cc.v2(0,0);
    currentHealth:number=0;
    private statusTotalData: StatusData;
    private list: CommonData[] = [];
    private common:CommonData;
    constructor(){
        this.statusTotalData = new StatusData();
        this.common = new CommonData();
        this.list = [this.common, this.statusTotalData.Common];
    }
    get StatusTotalData() {
        return this.statusTotalData;
    }
    get Common() {
        return this.common;
    }
    updateHA(currentHealth:number,maxHealth:number,attackPoint:number){
        this.currentHealth = currentHealth;
        this.common.maxHealth = maxHealth;
        this.common.damageMin = attackPoint;
    }
    public valueCopy(data:MonsterData):void{
        this.common.valueCopy(data.common);
        this.nameCn = data.nameCn;
        this.nameEn = data.nameEn;
        this.resName = data.resName;
        this.chapter = data.chapter;
        this.stageLevel = data.stageLevel;
        this.currentHealth = data.currentHealth?data.currentHealth:0;
        this.invisible = data.invisible?data.invisible:0;
        this.remote = data.remote?data.remote:0;
        this.melee = data.melee?data.melee:0;
        this.dash = data.dash?data.dash:0;
        this.pos = data.pos;
        this.disguise = data.disguise?data.disguise:0;
    }
    public clone():MonsterData{
        let e = new MonsterData();
        e.common = this.common.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.resName = this.resName;
        e.chapter = this.chapter;
        e.stageLevel = this.stageLevel;
        e.currentHealth = this.currentHealth;
        e.invisible = this.invisible;
        e.remote = this.remote;
        e.melee = this.melee;
        e.dash = this.dash;
        e.pos = this.pos;
        e.disguise = this.disguise;
        return e;
    }
    getAttackPoint():DamageData{
        let dd = new DamageData();
        dd.realDamage = this.common.realDamage;
        dd.physicalDamage = this.common.damageMin;
        dd.iceDamage = this.common.iceDamage;
        dd.fireDamage = this.common.fireDamage;
        dd.lighteningDamage = this.common.lighteningDamage;
        dd.toxicDamage = this.common.toxicDamage;
        dd.curseDamage = this.common.curseDamage;
        return dd;
    }
    //伤害减免
    getDamage(damageData:DamageData):DamageData{
        let finalDamageData = damageData.clone();
        let defence = this.common.defence;
        let defenceIce = this.common.iceDefence;
        let defenceFire = this.common.fireDefence;
        let defenceLightening = this.common.lighteningDefence;
        let defenceToxic = this.common.toxicDefence;
        let defenceCurse = this.common.curseDefence;
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))可以为负
        finalDamageData.physicalDamage = finalDamageData.physicalDamage*(1-defence*0.06/(defence*0.06+1));
        finalDamageData.iceDamage = finalDamageData.iceDamage*(1-defenceIce/100);
        finalDamageData.fireDamage = finalDamageData.fireDamage*(1-defenceFire/100);
        finalDamageData.lighteningDamage = finalDamageData.lighteningDamage*(1-defenceLightening/100);
        finalDamageData.toxicDamage = finalDamageData.toxicDamage*(1-defenceToxic/100);
        finalDamageData.curseDamage = finalDamageData.curseDamage*(1-defenceCurse/100);
        return finalDamageData;
    }

    //吸血默认是1暴击时吸血翻倍
    getLifeDrain(): number {
        let chance = this.getCriticalStrikeRate();
        let drainRate = this.getLifeDrainRate();
        let drain = 0;
        if (Math.random() < drainRate) {
            drain = 1;
            if (Math.random() < chance) {
                drain = 2;
            }
        }
        return drain;
    }

    //初始速度300,最大速度600 最小速度为10
    getMoveSpeed(): number {
        let speed = 0;
        for (let data of this.list) {
            speed += data.moveSpeed;
        }
        return speed;
    }
    //初始延迟是300,最低延迟为0 最大3000
    getAttackSpeed(): number {
        let speed = 0;
        for (let data of this.list) {
            speed += data.attackSpeed;
        }
        return speed;
    }
    //获取最小攻击力
    getDamageMin(): number {
        let d = 0;
        for (let data of this.list) {
            d += data.damageMin;
        }
        return d;
    }
    //获取最大攻击力
    getDamageMax(): number {
        let d = 0;
        for (let data of this.list) {
            d += data.damageMax;
        }
        return d;
    }

    //获取暴击率
    getCriticalStrikeRate(): number {
        let rate = 1;
        for (let data of this.list) {
            rate *= (1 - data.criticalStrikeRate / 100);
        }
        return 1 - rate;
    }

    //闪避
    getDodge(): number {
        let rate = 1;
        for (let data of this.list) {
            rate *= (1 - data.dodge / 100);
        }
        return 1 - rate;
    }
    //防御,可以为负数
    getDefence(): number {
        let defence = 0;
        for (let data of this.list) {
            defence += data.defence;
        }
        return defence;
    }

    //生命值
    getHealth(): cc.Vec2 {
        let rate = 1;
        let maxHealth = 0;
        for (let data of this.list) {
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
        for (let data of this.list) {
            defence += data.iceDefence;
        }
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }

    getFireDefence(): number {
        let defence = 0;
        for (let data of this.list) {
            defence += data.fireDefence;
        }
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }

    getLighteningDefence(): number {
        let defence = 0;
        for (let data of this.list) {
            defence += data.lighteningDefence;
        }
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }

    getToxicDefence(): number {
        let defence = 0;
        for (let data of this.list) {
            defence += data.toxicDefence;
        }
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }

    getCurseDefence(): number {
        let defence = 0;
        for (let data of this.list) {
            defence += data.curseDefence;
        }
        if (defence > 100) {
            defence = 100;
        }
        return defence;
    }

    getRealDamage(): number {
        let damage = 0;
        for (let data of this.list) {
            damage += data.realDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getIceDamage(): number {
        let damage = 0;
        for (let data of this.list) {
            damage += data.iceDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getFireDamage(): number {
        let damage = 0;
        for (let data of this.list) {
            damage += data.fireDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getLighteningDamage(): number {
        let damage = 0;
        for (let data of this.list) {
            damage += data.lighteningDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getToxicDamage(): number {
        let damage = 0;
        for (let data of this.list) {
            damage += data.toxicDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getCurseDamage(): number {
        let damage = 0;
        for (let data of this.list) {
            damage += data.curseDamage;
        }
        if (damage < 0) {
            damage = 0;
        }
        return damage;
    }

    getRealRate(): number {
        let rate = 0;
        for (let data of this.list) {
            rate += data.realRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    getIceRate(): number {
        let rate = 0;
        for (let data of this.list) {
            rate += data.iceRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    getFireRate(): number {
        let rate = 0;
        for (let data of this.list) {
            rate += data.fireRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    getLighteningRate(): number {
        let rate = 0;
        for (let data of this.list) {
            rate += data.lighteningRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    getToxicRate(): number {
        let rate = 0;
        for (let data of this.list) {
            rate += data.toxicRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    getCurseRate(): number {
        let rate = 0;
        for (let data of this.list) {
            rate += data.curseRate;
        }
        rate = rate < 0 ? 0 : rate;
        rate = rate > 100 ? 100 : rate;
        return rate;
    }

    //30s生命恢复不可以为负数(加入状态以后考虑拿掉)
    getLifeRecovery(): number {
        let lifeRecovery = 0;
        for (let data of this.list) {
            lifeRecovery += data.lifeRecovery;
        }
        return lifeRecovery > 0 ? lifeRecovery : 0;
    }

    getLifeDrainRate(): number {
        let rate = 1;
        for (let data of this.list) {
            rate *= (1 - data.lifeDrain / 100);
        }
        return 1 - rate;

    }
}
