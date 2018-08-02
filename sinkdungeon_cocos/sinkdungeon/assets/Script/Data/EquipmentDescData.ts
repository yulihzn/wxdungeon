// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class EquipmentDescData{
    nameCn: string = '';
    nameEn: string = '';
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
    titlecolor:string  ='#ffffff';
    color:string = '#ffffff'
    prefix:string = '';
    level:number = 0;

    // constructor(nameCn: string,
    // nameEn: string,
    // damageMin: number,
    // damageMax: number,
    // criticalStrikeRate: number,
    // defence: number,
    // lifeDrain: number,
    // lifeRecovery:number,
    // moveSpeed: number,
    // attackSpeed: number,
    // dodge: number,
    // health: number,
    // desccolor:string){
    //     this.nameCn= nameCn;
    //     this.nameEn= nameEn;
    //     this.damageMin = damageMin;
    //     this.damageMax = damageMax;
    //     this.criticalStrikeRate = criticalStrikeRate;
    //     this.defence = defence;
    //     this.lifeDrain = lifeDrain;
    //     this.lifeRecovery = lifeRecovery;
    //     this.moveSpeed = moveSpeed;
    //     this.attackSpeed = attackSpeed;
    //     this.dodge = dodge;
    //     this.health = health;
    //     this.desccolor ='#ffffff';
    // }
}
