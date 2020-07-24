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
    damageBack:number = 0;
    moveSpeed: number = 0;
    attackSpeed: number = 0;
    dodge: number = 0;
    health: number = 0;
    titlecolor:string  ='#ffffff';
    color:string = '#ffffff'
    prefix:string = '';
    level:number = 0;
    blockPhysical = 0;//物理格挡
    blockMagic = 0;//魔法格挡
    blockDamage = 0;//弹反伤害
    remoteDamage = 0;//远程伤害
    remoteCritRate = 0;//远程暴击
    remoteSpeed = 0;//远程攻速
    realDamage = 0;//真实伤害
    realRate = 0//真实伤害几率
    magicDamage = 0;//魔法伤害
    magicDefence = 0;//魔法抗性
    iceRate = 0;//冰元素几率
    fireRate = 0;//火元素几率
    lighteningRate = 0;//雷元素几率
    toxicRate = 0;//毒元素几率
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
