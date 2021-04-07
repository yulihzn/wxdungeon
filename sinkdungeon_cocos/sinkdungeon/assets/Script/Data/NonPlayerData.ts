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


export default class NonPlayerData{
    defaultPos:cc.Vec3;
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
    isRecovery = 0;//是否生命回复
    shooterOffsetX =0;//远程位置x
    shooterOffsetY =0;//远程位置y
    specialAttack = 0 ;//是否特殊攻击大于0
    specialType = '';//特殊类型
    specialDistance = 0;//特殊类型位置x
    specialBulletArcExNum = 0;//特殊额外扇形喷射子弹数量,为0的时候不计入,最大18
    specialBulletLineExNum = 0;//特殊额外线性喷射子弹数量，为0的时候不计入
    bodyColor = '#ffffff';
    pos:cc.Vec3 = cc.v3(0,0);
    currentHealth:number=0;
    /**box规格 
     * 小型爬行的21x21 0:y32w80h64，站立的21x21 1:y48w48h96， 占满的21x21 2:y48w80h80，
     * 中等站立的32x32 3:y64w80h128，中等爬行的32x32 4:y32w128h48，大型站立或爬行的48x24 5:y48w128h96*/
    boxType = 0;
    attackType = 0;//近战攻击模式 0：普通 1：突刺 2：范围
    isEnemy = 0;//是否是敌人
    isFollow = 0;//是否跟随
    lifeTime = 0;//存活时间
    isTest = 0;//是否是测试单位
    reborn = 0;//是否是房间重生的数字代表重生等级
    attackFrame = 2;//攻击帧数
    attackFrame1 = 2;//特殊攻击帧数
    private statusTotalData: StatusData;
    private common:CommonData;
    constructor(){
        this.statusTotalData = new StatusData();
        this.common = new CommonData();
    }
    
    get StatusTotalData() {
        return this.statusTotalData;
    }
    get Common() {
        return this.common;
    }
    get FinalCommon(){
        let data = new CommonData().add(this.common).add(this.statusTotalData.Common);
        return data;
    }
    public updateHA(currentHealth:number,maxHealth:number,attackPoint:number){
        this.currentHealth = currentHealth;
        this.common.maxHealth = maxHealth;
        this.common.damageMin = attackPoint;
    }
    public valueCopy(data:NonPlayerData):void{
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
        this.pos = data.pos ? cc.v3(data.pos.x,data.pos.y) : cc.v3(0, 0);
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
        this.attackType = data.attackType?data.attackType:0;
        this.isRecovery = data.isRecovery?data.isRecovery:0;
        this.isEnemy = data.isEnemy?data.isEnemy:0;
        this.isFollow = data.isFollow?data.isFollow:0;
        this.lifeTime = data.lifeTime?data.lifeTime:0;
        this.isTest = data.isTest?data.isTest:0;
        this.reborn = data.reborn?data.reborn:0;
        this.attackFrame = data.attackFrame?data.attackFrame:2;
        this.attackFrame1 = data.attackFrame1?data.attackFrame1:2;
        this.bodyColor = data.bodyColor?data.bodyColor:'#ffffff';
    }
    public clone():NonPlayerData{
        let e = new NonPlayerData();
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
        e.attackType = this.attackType;
        e.isRecovery = this.isRecovery;
        e.bodyColor = this.bodyColor;
        e.isEnemy = this.isEnemy;
        e.isFollow = this.isFollow;
        e.lifeTime = this.lifeTime;
        e.isTest = this.isTest;
        e.reborn = this.reborn;
        return e;
    }
    
    public getAttackPoint():DamageData{
        let data = this.FinalCommon;
        let dd = new DamageData();
        dd.realDamage = data.realDamage;
        dd.physicalDamage = data.damageMin;
        dd.magicDamage = data.magicDamage;
        return dd;
    }
    //伤害减免
    public getDamage(damageData:DamageData):DamageData{
        let data = this.FinalCommon;
        let finalDamageData = damageData.clone();
        let defence = data.defence;
        let defecneMagic = data.magicDefence;
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))
        //伤害 = 攻击 + 攻击*(2-0.94^(-护甲))
        if(defence>=0){
            finalDamageData.physicalDamage = finalDamageData.physicalDamage*(1-defence*0.06/(defence*0.06+1));
        }else{
            finalDamageData.physicalDamage = finalDamageData.physicalDamage * (2-Math.pow(0.94,-defence));
        }
        finalDamageData.magicDamage = finalDamageData.magicDamage*(1-defecneMagic/100);
        return finalDamageData;
    }

    //生命值
    public getHealth(): cc.Vec3 {
        let rate = 1;
        let data = this.FinalCommon;
        let maxHealth = data.maxHealth;
        if (maxHealth > 0) {
            rate = this.currentHealth / maxHealth;
        } else {
            return cc.v3(1, 1);
        }
        return cc.v3(maxHealth * rate, maxHealth);
    }
}
