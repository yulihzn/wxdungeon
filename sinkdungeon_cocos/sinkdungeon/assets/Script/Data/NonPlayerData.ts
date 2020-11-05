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
    remote:number=0;//是否远程大于0 远程会远离目标到一定范围 数字代表CD
    melee:number=0;//是否近战大于0 近战会接近目标 数字代表CD
    sizeType:number=0;//1正常 怪物大小
    bulletType:string='';//子弹类型
    bulletArcExNum = 0;//额外扇形喷射子弹数量,为0的时候不计入,最大18
    bulletLineExNum = 0;//额外线性喷射子弹数量，为0的时候不计入
    bulletLineInterval = 0;//线性喷射间隔时间（毫秒）
    bulletExSpeed = 0;//子弹额外速度
    shooterOffsetX =0;//远程位置x
    shooterOffsetY =0;//远程位置y
    specialAttack = 0 ;//是否特殊攻击大于0
    specialType = '';//特殊类型
    specialDistance = 0;//特殊类型位置x
    specialBulletArcExNum = 0;//特殊额外扇形喷射子弹数量,为0的时候不计入,最大18
    specialBulletLineExNum = 0;//特殊额外线性喷射子弹数量，为0的时候不计入
    isHeavy = 0;//是否静态
    bodyColor = '#ffffff';
    pos:cc.Vec3 = cc.v3(0,0);
    currentHealth:number=0;
    /**box规格 爬行的21x21 0:y32w80h64，站立的21x21 1:y48w48h96，占满的21x21 2:y48w80h80，站立的32x32 3:y64w80h128，爬行的32x32 4:y32w128h48，站立的48x48 5:y48w80h112*/
    boxType = 0;
    attackType = 0;//近战攻击模式 0：普通 1：突刺 2：范围
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
        this.currentHealth = data.currentHealth?data.currentHealth:0;
        this.remote = data.remote?data.remote:0;
        this.melee = data.melee?data.melee:0;
        this.pos = data.pos ? cc.v3(data.pos.x,data.pos.y) : cc.v3(0, 0);
        this.sizeType = data.sizeType?data.sizeType:0;
        this.bulletType = data.bulletType;
        this.bulletArcExNum = data.bulletArcExNum?data.bulletArcExNum:0;
        this.bulletLineExNum = data.bulletLineExNum?data.bulletLineExNum:0;
        this.bulletLineInterval = data.bulletLineInterval?data.bulletLineInterval:0;
        this.bulletExSpeed = data.bulletExSpeed?data.bulletExSpeed:0;
        this.shooterOffsetX = data.shooterOffsetX?data.shooterOffsetX:0;
        this.shooterOffsetY = data.shooterOffsetY?data.shooterOffsetY:0;
        this.specialAttack = data.specialAttack?data.specialAttack:0;
        this.specialType = data.specialType?data.specialType:'';
        this.specialDistance = data.specialDistance?data.specialDistance:0;
        this.specialBulletArcExNum = data.specialBulletArcExNum?data.specialBulletArcExNum:0;
        this.specialBulletLineExNum = data.specialBulletLineExNum?data.specialBulletLineExNum:0;
        this.boxType = data.boxType?data.boxType:0;
        this.attackType = data.attackType?data.attackType:0;
        this.isHeavy = data.isHeavy?data.isHeavy:0;
        this.bodyColor = data.bodyColor?data.bodyColor:'#ffffff';
    }
    public clone():NonPlayerData{
        let e = new NonPlayerData();
        e.common = this.common.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.resName = this.resName;
        e.currentHealth = this.currentHealth;
        e.remote = this.remote;
        e.melee = this.melee;
        e.pos = this.pos;
        e.sizeType = this.sizeType;
        e.bulletType = this.bulletType;
        e.bulletArcExNum = this.bulletArcExNum;
        e.bulletLineExNum = this.bulletLineExNum;
        e.bulletLineInterval = this.bulletLineInterval;
        e.bulletExSpeed = this.bulletExSpeed;
        e.shooterOffsetX = this.shooterOffsetX;
        e.shooterOffsetY = this.shooterOffsetY;
        e.specialAttack = this.specialAttack;
        e.specialType = this.specialType;
        e.specialDistance = this.specialDistance;
        e.specialBulletArcExNum = this.specialBulletArcExNum;
        e.specialBulletLineExNum = this.specialBulletLineExNum;
        e.boxType = this.boxType;
        e.attackType = this.attackType;
        e.bodyColor = this.bodyColor;
        e.isHeavy = this.isHeavy;
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
