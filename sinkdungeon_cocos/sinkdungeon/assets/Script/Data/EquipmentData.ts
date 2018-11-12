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
    public valueCopy(data:EquipmentData):void{
        this.nameCn = data.nameCn?data.nameCn:this.nameCn;
        this.nameEn = data.nameEn;
        this.equipmetType = data.equipmetType;
        this.equipmetTypeCn  =data.equipmetTypeCn;
        this.prefix = data.prefix;
        this.desc = data.desc;
        this.damageMin = data.damageMin;
        this.damageMax = data.damageMax;
        this.criticalStrikeRate = data.criticalStrikeRate;
        this.defence = data.defence;
        this.lifeDrain = data.lifeDrain;
        this.lifeRecovery = data.lifeRecovery;
        this.moveSpeed = data.moveSpeed;
        this.attackSpeed = data.attackSpeed;
        this.dodge = data.dodge;
        this.health = data.health;
        this.color  =data.color;
        this.titlecolor = data.titlecolor;
        this.img = data.img;
        this.stab = data.stab;
        this.far = data.far;
        this.isLocked = data.isLocked;
        this.level = data.level;
        this.trouserslong = data.trouserslong;
        this.iceDamage = data.iceDamage;
        this.iceDefence = data.iceDefence;
        this.iceRate = data.iceRate;
        this.fireDamage = data.fireDamage;
        this.fireDefence = data.fireDefence;
        this.fireRate = data.fireRate;
        this.lighteningDamage = data.lighteningDamage;
        this.lighteningDefence = data.lighteningDefence;
        this.lighteningRate = data.lighteningRate;
        this.toxicDamage = data.toxicDamage;
        this.toxicDefence = data.toxicDefence;
        this.toxicRate = data.toxicRate;
        this.curseDamage = data.curseDamage;
        this.curseDefence = data.curseDefence;
        this.curseRate = data.curseRate;
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
        return e;
    }
}
