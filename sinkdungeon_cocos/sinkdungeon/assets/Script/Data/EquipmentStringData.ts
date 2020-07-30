import EquipmentData from "./EquipmentData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class EquipmentStringData {
    nameCn: string = '';
    nameEn: string = '';
    equipmetType: string = 'empty';
    desc: string = '';
    img:string = 'emptyequipment';

    maxHealth: number = 0;//最大生命
    damageMin: number = 0;//最小攻击
    damageMax: number = 0;//最大攻击
    criticalStrikeRate: number = 0;//暴击
    defence: number = 0;//物理防御
    lifeDrain: number = 0;//吸血
    damageBack: number = 0;//生命回复
    moveSpeed: number = 0;//移速
    attackSpeed: number = 0;//攻速
    dodge: number = 0;//闪避
    remoteCooldown:number = 0;//远程攻速

    realDamage = 0;//真实伤害
    realRate = 0//真实伤害几率
    magicDamage = 0;//魔法伤害
    magicDefence = 0;//魔法抗性
    iceRate = 0;//冰元素几率
    fireRate = 0;//火元素几率
    lighteningRate = 0;//雷元素几率
    toxicRate = 0;//毒元素几率
    curseRate = 0;//诅咒元素几率

    stab = 0;//是否突刺
    far = 0; //是否远距离
    trouserslong = 0;//是否长裤
    bulletType = "";//子弹类别
    bulletSize = 0;//子弹增加大小 为0代表不改变 1代表加一倍
    bulletArcExNum = 0;//额外扇形喷射子弹数量,为0的时候不计入,最大18
    bulletLineExNum = 0;//额外线性喷射子弹数量，为0的时候不计入
    bulletLineInterval = 0;//线性喷射间隔时间（秒）
    showShooter = 0;//是否显示发射器
    isHeavy = 0;//是否是重型武器比如激光,具体影响是开枪时候减速
    isLineAim = 0;//是否是线性瞄准
    hideHair = 0;//是否隐藏头发
    bulletExSpeed = 0;//子弹额外速度

    constructor(){
    }

    public valueCopy(data:EquipmentData):void{
        this.maxHealth = data.Common.maxHealth ? data.Common.maxHealth : 0;
        this.damageMin = data.Common.damageMin ? data.Common.damageMin : 0;
        this.damageMax = data.Common.damageMax ? data.Common.damageMax : 0;
        this.criticalStrikeRate = data.Common.criticalStrikeRate ? data.Common.criticalStrikeRate : 0;
        this.defence = data.Common.defence ? data.Common.defence : 0;
        this.lifeDrain = data.Common.lifeDrain ? data.Common.lifeDrain : 0;
        this.damageBack = data.Common.damageBack ? data.Common.damageBack : 0;
        this.moveSpeed = data.Common.moveSpeed ? data.Common.moveSpeed : 0;
        this.attackSpeed = data.Common.attackSpeed ? data.Common.attackSpeed : 0;
        this.remoteCooldown = data.Common.remoteCooldown?data.Common.remoteCooldown:0;
        this.dodge = data.Common.dodge ? data.Common.dodge : 0;
        this.realDamage = data.Common.realDamage ? data.Common.realDamage : 0;
        this.realRate = data.Common.realRate ? data.Common.realRate : 0;
        this.magicDefence = data.Common.magicDefence ? data.Common.magicDefence : 0;
        this.iceRate = data.Common.iceRate ? data.Common.iceRate : 0;
        this.magicDamage = data.Common.magicDamage ? data.Common.magicDamage : 0;
        this.fireRate = data.Common.fireRate ? data.Common.fireRate : 0;
        this.lighteningRate = data.Common.lighteningRate ? data.Common.lighteningRate : 0;
        this.toxicRate = data.Common.toxicRate ? data.Common.toxicRate : 0;
        this.curseRate = data.Common.curseRate ? data.Common.curseRate : 0;
        this.nameCn = data.nameCn?data.nameCn:'';
        this.nameEn = data.nameEn?data.nameEn:'';
        this.equipmetType = data.equipmetType?data.equipmetType:'';
        this.desc = data.desc?data.desc:'';
        this.img = data.img?data.img:'emptyequipment';
        this.stab = data.stab?data.stab:0;
        this.far = data.far?data.far:0;
        this.bulletArcExNum = data.bulletArcExNum?data.bulletArcExNum:0;
        this.bulletLineExNum = data.bulletLineExNum?data.bulletLineExNum:0;
        this.bulletLineInterval = data.bulletLineInterval?data.bulletLineInterval:0;
        this.trouserslong = data.trouserslong?data.trouserslong:0;
        this.showShooter = data.showShooter?data.showShooter:0;
        this.isHeavy = data.isHeavy?data.isHeavy:0;
        this.bulletType = data.bulletType?data.bulletType:'';
        this.isLineAim = data.isLineAim?data.isLineAim:0;
        this.hideHair = data.hideHair?data.hideHair:0;
        this.bulletSize = data.bulletSize?data.bulletSize:0;
        this.bulletExSpeed = data.bulletExSpeed?data.bulletExSpeed:0;
  
    }
    public clone():EquipmentStringData{
        let e = new EquipmentStringData();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.equipmetType = this.equipmetType;
        e.desc = this.desc;
  
        e.img = this.img;
        e.stab = this.stab;
        e.far = this.far;
        e.trouserslong = this.trouserslong;
        e.showShooter = this.showShooter;
        e.bulletType = this.bulletType;
        e.isHeavy = this.isHeavy;
        e.isLineAim = this.isLineAim;
        e.bulletArcExNum = this.bulletArcExNum;
        e.bulletLineExNum = this.bulletLineExNum;
        e.bulletLineInterval = this.bulletLineInterval;
        e.hideHair = this.hideHair;
        e.bulletSize = this.bulletSize;
        e.bulletExSpeed = this.bulletExSpeed;

        e.maxHealth = this.maxHealth;
        e.damageMin = this.damageMin;
        e.damageMax = this.damageMax;
        e.criticalStrikeRate = this.criticalStrikeRate;
        e.defence = this.defence;
        e.lifeDrain = this.lifeDrain;
        e.damageBack = this.damageBack;
        e.moveSpeed = this.moveSpeed;
        e.attackSpeed = this.attackSpeed;
        e.remoteCooldown = this.remoteCooldown;
        e.dodge = this.dodge;
        e.realDamage = this.realDamage;
        e.realRate = this.realRate;
        e.magicDefence = this.magicDefence;
        e.iceRate = this.iceRate;
        e.magicDamage = this.magicDamage;
        e.fireRate = this.fireRate;
        e.lighteningRate = this.lighteningRate;
        e.toxicRate = this.toxicRate;
        e.curseRate = this.curseRate;
        return e;
    }
    
}
