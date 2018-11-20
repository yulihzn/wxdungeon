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


export default class EquipmentData{
    nameCn: string = '';
    nameEn: string = '';
    equipmetType: string = 'empty';
    equipmetTypeCn:string  ='';
    prefix:string = '';
    desc: string = '';
    color:string  ='#ffffff';
    titlecolor:string = '#ffffff';
    img:string = 'emptyequipment';
    level:number = 0;
    stab = 0;//是否突刺
    far = 0; //是否远距离
    isLocked = 0;//是否锁定
    trouserslong = 0;//是否长裤
    private common:CommonData;

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
    constructor(){
        this.common = new CommonData();
    }

    get Common(){
        return this.common;
    }
    public valueCopy(data:EquipmentData):void{
        this.common.valueCopy(data.common);
        this.nameCn = data.nameCn?data.nameCn:'';
        this.nameEn = data.nameEn?data.nameEn:'';
        this.equipmetType = data.equipmetType?data.equipmetType:'';
        this.equipmetTypeCn  =data.equipmetTypeCn?data.equipmetTypeCn:'';
        this.prefix = data.prefix?data.prefix:'';
        this.desc = data.desc?data.desc:'';
        this.color  =data.color?data.color:'#ffffff';
        this.titlecolor = data.titlecolor?data.titlecolor:'#ffffff';
        this.img = data.img?data.img:'emptyequipment';
        this.stab = data.stab?data.stab:0;
        this.far = data.far?data.far:0;
        this.isLocked = data.isLocked?data.isLocked:0;
        this.level = data.level?data.level:0;
        this.trouserslong = data.trouserslong?data.trouserslong:0;
  
        this.info1 = data.info1?data.info1:'';
        this.info2 = data.info2?data.info2:'';
        this.info3 = data.info3?data.info3:'';
        this.suit1 = data.suit1?data.suit1:'';
        this.suit2 = data.suit2?data.suit2:'';
        this.suit3 = data.suit3?data.suit3:'';
        this.infobase = data.infobase?data.infobase:'';
        this.infocolor1 = data.infocolor1?data.infocolor1:'#ffffff';
        this.infocolor2 = data.infocolor2?data.infocolor2:'#ffffff';
        this.infocolor3 = data.infocolor3?data.infocolor3:'#ffffff';
        this.suitcolor1 = data.suitcolor1?data.suitcolor1:'#ffffff';
        this.suitcolor2 = data.suitcolor2?data.suitcolor2:'#ffffff';
        this.suitcolor3 = data.suitcolor3?data.suitcolor3:'#ffffff';
        this.infobasecolor = data.infobasecolor?data.infobasecolor:'#ffffff';
    }
    public clone():EquipmentData{
        let e = new EquipmentData();
        e.common = this.common.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.equipmetType = this.equipmetType;
        e.equipmetTypeCn  =this.equipmetTypeCn;
        e.prefix = this.prefix;
        e.desc = this.desc;
  
        e.color  =this.color;
        e.titlecolor = this.titlecolor;
        e.img = this.img;
        e.stab = this.stab;
        e.far = this.far;
        e.isLocked = this.isLocked;
        e.level = this.level;
        e.trouserslong = this.trouserslong;

        e.info1 = this.info1;
        e.info2 = this.info2;
        e.info3 = this.info3;
        e.suit1 = this.suit1;
        e.suit2 = this.suit2;
        e.suit3 = this.suit3;
        e.infobase = this.infobase;
        e.infocolor1 = this.infocolor1;
        e.infocolor2 = this.infocolor2;
        e.infocolor3 = this.infocolor3;
        e.suitcolor1 = this.suitcolor1;
        e.suitcolor2 = this.suitcolor2;
        e.suitcolor3 = this.suitcolor3;
        e.infobasecolor = this.infobasecolor;
        return e;
    }
}
