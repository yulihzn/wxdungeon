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

    damageRemote = 0;//远程伤害
    realDamage = 0;//真实伤害
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
    infocolor1:string = '#ffffff';
    infocolor2:string = '#ffffff';
    infocolor3:string = '#ffffff';
    suitcolor1:string = '#ffffff';
    suitcolor2:string = '#ffffff';
    suitcolor3:string = '#ffffff';
    infobasecolor:string = '#ffffff';
}
