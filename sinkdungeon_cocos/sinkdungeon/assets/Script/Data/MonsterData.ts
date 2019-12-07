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


export default class MonsterData{
    defaultPos:cc.Vec2;
    nameCn:string = '';//名字
    nameEn:string = '';
    resName:string = '';//资源名字
    chapter:number = 0;//章节，如果为0所有章节都会出现
    stageLevel:number = 0;//关卡等级，如果为0所有level都会出现
    invisible:number=0;//是否隐身，发起攻击或者冲刺的时候现形,攻击结束以后1s再次隐身,隐身状态下可以被攻击而且现形
    remote:number=0;//是否远程大于0 远程会远离目标到一定范围 数字代表CD
    melee:number=0;//是否近战大于0 近战会接近目标 数字代表CD
    dash:number=0;//是否冲刺大于0 当距离够的时候会发起冲刺，往目标地点冲刺进行撞击 数字代表CD
    disguise:number=0;//是否伪装大于0,数值为距离 伪装状态下不能移动和攻击，当接近的时候会恢复 
    sizeType:number=0;//1正常 怪物大小
    bulletType:string='';//子弹类型
    bulletArcExNum = 0;//额外扇形喷射子弹数量,为0的时候不计入,最大18
    bulletLineExNum = 0;//额外线性喷射子弹数量，为0的时候不计入
    bulletLineInterval = 0;//线性喷射间隔时间（毫秒）
    bulletExSpeed = 0;//子弹额外速度
    isArcAim = 0;//是否是扇形瞄准
    isLineAim = 0;//是否是线性瞄准
    blink = 0;//是否闪烁大于0 数字代表cd
    isBoom = 0;//是否死亡爆炸
    isHeavy = 0;//是否很重 如果很重是转向的
    shooterOffsetX =0;//远程位置x
    shooterOffsetY =0;//远程位置y
    specialAttack = 0 ;//是否特殊攻击大于0
    specialType = '';//特殊类型
    specialDistance = 0;//特殊类型位置x
    specialBulletArcExNum = 0;//特殊额外扇形喷射子弹数量,为0的时候不计入,最大18
    specialBulletLineExNum = 0;//特殊额外线性喷射子弹数量，为0的时候不计入
    pos:cc.Vec2 = cc.v2(0,0);
    currentHealth:number=0;
    /**box规格 爬行的21x21 0:y32w80h64，站立的21x21 1:y48w48h96，占满的21x21 2:y48w80h80，站立的32x32 3:y64w80h128，爬行的32x32 4:y32w128h48，站立的48x48 5:y48w80h112*/
    boxType = 0;
    private statusTotalData: StatusData;
    private common:CommonData;
    constructor(){
        this.statusTotalData = new StatusData();
        this.common = new CommonData();
    }
    private getCommonList():CommonData[]{
        return [this.common, this.statusTotalData.Common];
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
        this.pos = data.pos ? cc.v2(data.pos.x,data.pos.y) : cc.v2(0, 0);
        this.disguise = data.disguise?data.disguise:0;
        this.sizeType = data.sizeType?data.sizeType:0;
        this.bulletType = data.bulletType;
        this.bulletArcExNum = data.bulletArcExNum?data.bulletArcExNum:0;
        this.bulletLineExNum = data.bulletLineExNum?data.bulletLineExNum:0;
        this.bulletLineInterval = data.bulletLineInterval?data.bulletLineInterval:0;
        this.isArcAim = data.isArcAim?data.isArcAim:0;
        this.isLineAim = data.isLineAim?data.isLineAim:0;
        this.blink = data.blink?data.blink:0;
        this.isBoom = data.isBoom?data.isBoom:0;
        this.bulletExSpeed = data.bulletExSpeed?data.bulletExSpeed:0;
        this.isHeavy = data.isHeavy?data.isHeavy:0;
        this.shooterOffsetX = data.shooterOffsetX?data.shooterOffsetX:0;
        this.shooterOffsetY = data.shooterOffsetY?data.shooterOffsetY:0;
        this.specialAttack = data.specialAttack?data.specialAttack:0;
        this.specialType = data.specialType?data.specialType:'';
        this.specialDistance = data.specialDistance?data.specialDistance:0;
        this.specialBulletArcExNum = data.specialBulletArcExNum?data.specialBulletArcExNum:0;
        this.specialBulletLineExNum = data.specialBulletLineExNum?data.specialBulletLineExNum:0;
        this.boxType = data.boxType?data.boxType:0;
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
        e.sizeType = this.sizeType;
        e.bulletType = this.bulletType;
        e.bulletArcExNum = this.bulletArcExNum;
        e.bulletLineExNum = this.bulletLineExNum;
        e.bulletLineInterval = this.bulletLineInterval;
        e.isArcAim = this.isArcAim;
        e.isLineAim = this.isLineAim;
        e.blink = this.blink;
        e.isBoom = this.isBoom;
        e.bulletExSpeed = this.bulletExSpeed;
        e.isHeavy = this.isHeavy;
        e.shooterOffsetX = this.shooterOffsetX;
        e.shooterOffsetY = this.shooterOffsetY;
        e.specialAttack = this.specialAttack;
        e.specialType = this.specialType;
        e.specialDistance = this.specialDistance;
        e.specialBulletArcExNum = this.specialBulletArcExNum;
        e.specialBulletLineExNum = this.specialBulletLineExNum;
        e.boxType = this.boxType;
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
        let defence = this.getDefence();
        let defenceIce = this.getIceDefence();
        let defenceFire = this.getFireDefence();
        let defenceLightening = this.getLighteningDefence();
        let defenceToxic = this.getToxicDefence();
        let defenceCurse = this.getCurseDefence();
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))
        //伤害 = 攻击 + 攻击*(2-0.94^(-护甲))
        if(defence>=0){
            finalDamageData.physicalDamage = finalDamageData.physicalDamage*(1-defence*0.06/(defence*0.06+1));
        }else{
            finalDamageData.physicalDamage = finalDamageData.physicalDamage * (2-Math.pow(0.94,-defence));
        }
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
