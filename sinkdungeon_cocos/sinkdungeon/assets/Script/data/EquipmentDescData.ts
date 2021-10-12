// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import CommonData from "./CommonData";


export default class EquipmentDescData{
    nameCn: string = '';
    nameEn: string = '';
    titlecolor:string  ='#ffffff';
    color:string = '#ffffff'
    prefix:string = '';
    level:number = 0;
    common:CommonData = new CommonData();
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
