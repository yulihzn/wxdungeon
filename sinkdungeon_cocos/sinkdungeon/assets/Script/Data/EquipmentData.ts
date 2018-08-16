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
    isLocked = 0;//是否锁定
    public valueCopy(data:EquipmentData):void{
        this.nameCn = data.nameCn?data.nameCn:this.nameCn;
        this.nameEn = data.nameEn?data.nameEn:this.nameEn;
        this.equipmetType = data.equipmetType?data.equipmetType:this.equipmetType;
        this.equipmetTypeCn  =data.equipmetTypeCn?data.equipmetTypeCn:this.equipmetTypeCn;
        this.prefix = data.prefix?data.prefix:this.prefix;
        this.desc = data.desc?data.desc:this.desc;
        this.damageMin = data.damageMin?data.damageMin:this.damageMin;
        this.damageMax = data.damageMax?data.damageMax:this.damageMax;
        this.criticalStrikeRate = data.criticalStrikeRate?data.criticalStrikeRate:this.criticalStrikeRate;
        this.defence = data.defence?data.defence:this.defence;
        this.lifeDrain = data.lifeDrain?data.lifeDrain:this.lifeDrain;
        this.lifeRecovery = data.lifeRecovery?data.lifeRecovery:this.lifeRecovery;
        this.moveSpeed = data.moveSpeed?data.moveSpeed:this.moveSpeed;
        this.attackSpeed = data.attackSpeed?data.attackSpeed:this.attackSpeed;
        this.dodge = data.dodge?data.dodge:this.dodge;
        this.health = data.health?data.health:this.health;
        this.color  =data.color?data.color:this.color;
        this.titlecolor = data.titlecolor?data.titlecolor:this.titlecolor;
        this.img = data.img?data.img:this.img;
        this.stab = data.stab?data.stab:this.stab;
        this.isLocked = data.isLocked?data.isLocked:this.isLocked;
        this.level = data.level?data.level:this.level;
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
        e.isLocked = this.isLocked;
        e.level = this.level;
        return e;
    }
}
