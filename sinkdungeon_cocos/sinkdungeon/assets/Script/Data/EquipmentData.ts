// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class EquipmentData{
    nameCn: string = '';
    nameEn: string = '';
    equipmetType: string = 'empty';
    equipmetTypeCn:string  ='';
    prefix:string = '';
    desc: string = '';
    damageMin: number = 0;
    damageMax: number = 0;
    criticalStrikeRate: number = 0;
    defence: number = 0;
    lifeDrain: number = 0;
    lifeRecovery:number = 0;
    moveSpeed: number = 0;
    attackSpeed: number = 0;
    dodge: number = 0;
    health: number = 0;
    color:string  ='#ffffff';
    titlecolor:string = '#ffffff';
    img:string = 'emptyequipment';
    level:number = 0;
    stab = 0;//是否突刺
    far = 0; //是否远距离
    isLocked = 0;//是否锁定
    trouserslong = 0;//是否长裤
    realDamge = 0;//真实伤害
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

    info1:string = '';
    info2:string = '';
    info3:string = '';
    suit1:string = '';
    suit2:string = '';
    suit3:string = '';
    infobase:string = '';

    public valueCopy(data:EquipmentData):void{
        this.nameCn = data.nameCn?data.nameCn:'';
        this.nameEn = data.nameEn?data.nameEn:'';
        this.equipmetType = data.equipmetType?data.equipmetType:'';
        this.equipmetTypeCn  =data.equipmetTypeCn?data.equipmetTypeCn:'';
        this.prefix = data.prefix?data.prefix:'';
        this.desc = data.desc?data.desc:'';
        this.damageMin = data.damageMin?data.damageMin:0;
        this.damageMax = data.damageMax?data.damageMax:0;
        this.criticalStrikeRate = data.criticalStrikeRate?data.criticalStrikeRate:0;
        this.defence = data.defence?data.defence:0;
        this.lifeDrain = data.lifeDrain?data.lifeDrain:0;
        this.lifeRecovery = data.lifeRecovery?data.lifeRecovery:0;
        this.moveSpeed = data.moveSpeed?data.moveSpeed:0;
        this.attackSpeed = data.attackSpeed?data.attackSpeed:0;
        this.dodge = data.dodge?data.dodge:0;
        this.health = data.health?data.health:0;
        this.color  =data.color?data.color:'#ffffff';
        this.titlecolor = data.titlecolor?data.titlecolor:'#ffffff';
        this.img = data.img?data.img:'emptyequipment';
        this.stab = data.stab?data.stab:0;
        this.far = data.far?data.far:0;
        this.isLocked = data.isLocked?data.isLocked:0;
        this.level = data.level?data.level:0;
        this.trouserslong = data.trouserslong?data.trouserslong:0;
        this.realDamge = this.realDamge?data.realDamge:0;
        this.realRate = this.realRate?data.realRate:0;
        this.iceDamage = data.iceDamage?data.iceDamage:0;
        this.iceDefence = data.iceDefence?data.iceDefence:0;
        this.iceRate = data.iceRate?data.iceRate:0;
        this.fireDamage = data.fireDamage?data.fireDamage:0;
        this.fireDefence = data.fireDefence?data.fireDefence:0;
        this.fireRate = data.fireRate?data.fireRate:0;
        this.lighteningDamage = data.lighteningDamage?data.lighteningDamage:0;
        this.lighteningDefence = data.lighteningDefence?data.lighteningDefence:0;
        this.lighteningRate = data.lighteningRate?data.lighteningRate:0;
        this.toxicDamage = data.toxicDamage?data.toxicDamage:0;
        this.toxicDefence = data.toxicDefence?data.toxicDefence:0;
        this.toxicRate = data.toxicRate?data.toxicRate:0;
        this.curseDamage = data.curseDamage?data.curseDamage:0;
        this.curseDefence = data.curseDefence?data.curseDefence:0;
        this.curseRate = data.curseRate?data.curseRate:0;
        this.info1 = data.info1?data.info1:'';
        this.info2 = data.info2?data.info2:'';
        this.info3 = data.info3?data.info3:'';
        this.suit1 = data.suit1?data.suit1:'';
        this.suit2 = data.suit2?data.suit2:'';
        this.suit3 = data.suit3?data.suit3:'';
        this.infobase = data.infobase?data.infobase:'';
    }
    public clone():EquipmentData{
        let e = new EquipmentData();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.equipmetType = this.equipmetType;
        e.equipmetTypeCn  =this.equipmetTypeCn;
        e.prefix = this.prefix;
        e.desc = this.desc;
        e.damageMin = this.damageMin;
        e.damageMax = this.damageMax;
        e.criticalStrikeRate = this.criticalStrikeRate;
        e.defence = this.defence;
        e.lifeDrain = this.lifeDrain;
        e.lifeRecovery = this.lifeRecovery;
        e.moveSpeed = this.moveSpeed;
        e.attackSpeed = this.attackSpeed;
        e.dodge = this.dodge;
        e.health = this.health;
        e.color  =this.color;
        e.titlecolor = this.titlecolor;
        e.img = this.img;
        e.stab = this.stab;
        e.far = this.far;
        e.isLocked = this.isLocked;
        e.level = this.level;
        e.trouserslong = this.trouserslong;
        e.realDamge = this.realDamge;
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
        e.info1 = this.info1;
        e.info2 = this.info2;
        e.info3 = this.info3;
        e.suit1 = this.suit1;
        e.suit2 = this.suit2;
        e.suit3 = this.suit3;
        e.infobase = this.infobase;
        return e;
    }
}
