import CommonData from "./CommonData";
import BaseData from "./BaseData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class EquipmentData extends BaseData{
    uuid:string = '';//唯一标识，用来存档
    pos:cc.Vec2 = cc.v2(0,0);//下标
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
    isReflect = 0;//子弹偏转 仅限近战武器
    trouserslong = 0;//是否长裤
    bulletType = "";//子弹类别
    bulletSize = 0;//子弹增加大小 为0代表不改变 1代表加一倍
    bulletArcExNum = 0;//额外扇形喷射子弹数量,为0的时候不计入,最大18,超过的话是一个固定圆，为80的时候是个八方向
    bulletLineExNum = 0;//额外线性喷射子弹数量，为0的时候不计入
    bulletLineInterval = 0;//线性喷射间隔时间（秒）
    bulletNets = 0;//是否排状子弹11发并排数量为发射次数 为0的时候不触发 
    showShooter = 0;//是否显示发射器
    isHeavy = 0;//是否是重型武器比如激光,具体影响是开枪时候减速
    isArcAim = 0;//是否是扇形瞄准
    isLineAim = 0;//是否是线性瞄准
    hideHair = 0;//是否隐藏头发
    bulletExSpeed = 0;//子弹额外速度
    statusName = '';//状态类别
    statusInterval = 0;//添加状态的间隔
    exBulletTypeAttack = '';//攻击额外子弹类别
    exBulletTypeHurt = '';//受伤害额外子弹类别
    exBulletRate = 0;//额外子弹几率
    exBulletCombo1 = 0;//攻击额外子弹连段，为1代表在这一次攻击释放
    exBulletCombo2 = 0;
    exBulletCombo3 = 0;
    exBulletOffsetX = 0;//额外子弹偏移x

    private common:CommonData;

    info1:string = '';
    info2:string = '';
    info3:string = '';
    info4:string = '';
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
        super();
        this.common = new CommonData();
    }

    get Common(){
        return this.common;
    }
    public valueCopy(data:EquipmentData):void{
        this.uuid = data.uuid?data.uuid:'';
        this.pos = data.pos?cc.v2(data.pos.x,data.pos.y):cc.v2(0,0);
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
        this.bulletArcExNum = data.bulletArcExNum?data.bulletArcExNum:0;
        this.bulletLineExNum = data.bulletLineExNum?data.bulletLineExNum:0;
        this.bulletLineInterval = data.bulletLineInterval?data.bulletLineInterval:0;
        this.bulletNets = data.bulletNets?data.bulletNets:0;
        this.level = data.level?data.level:0;
        this.trouserslong = data.trouserslong?data.trouserslong:0;
        this.showShooter = data.showShooter?data.showShooter:0;
        this.isHeavy = data.isHeavy?data.isHeavy:0;
        this.bulletType = data.bulletType?data.bulletType:'';
        this.exBulletTypeAttack = data.exBulletTypeAttack?data.exBulletTypeAttack:'';
        this.exBulletTypeHurt = data.exBulletTypeHurt?data.exBulletTypeHurt:'';
        this.isArcAim = data.isArcAim?data.isArcAim:0;
        this.isLineAim = data.isLineAim?data.isLineAim:0;
        this.hideHair = data.hideHair?data.hideHair:0;
        this.bulletSize = data.bulletSize?data.bulletSize:0;
        this.bulletExSpeed = data.bulletExSpeed?data.bulletExSpeed:0;
        this.statusName = data.statusName?data.statusName:'';
        this.statusInterval = data.statusInterval?data.statusInterval:0;
        this.isReflect = data.isReflect?data.isReflect:0;
        this.exBulletRate = data.exBulletRate?data.exBulletRate:0;
        this.exBulletCombo1 = data.exBulletCombo1?data.exBulletCombo1:0;
        this.exBulletCombo2 = data.exBulletCombo2?data.exBulletCombo2:0;
        this.exBulletCombo3 = data.exBulletCombo3?data.exBulletCombo3:0;
        this.exBulletOffsetX = data.exBulletOffsetX?data.exBulletOffsetX:0;
  
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
        e.uuid = this.uuid;
        e.pos = this.pos;
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
        e.showShooter = this.showShooter;
        e.bulletType = this.bulletType;
        e.exBulletTypeAttack = this.exBulletTypeAttack;
        e.exBulletTypeHurt = this.exBulletTypeHurt;
        e.isHeavy = this.isHeavy;
        e.isArcAim = this.isArcAim;
        e.isLineAim = this.isLineAim;
        e.bulletArcExNum = this.bulletArcExNum;
        e.bulletLineExNum = this.bulletLineExNum;
        e.bulletLineInterval = this.bulletLineInterval;
        e.bulletNets = this.bulletNets;
        e.hideHair = this.hideHair;
        e.bulletSize = this.bulletSize;
        e.bulletExSpeed = this.bulletExSpeed;
        e.isReflect = this.isReflect;
        e.exBulletRate = this.exBulletRate;
        e.exBulletCombo1 = this.exBulletCombo1;
        e.exBulletCombo2 = this.exBulletCombo2;
        e.exBulletCombo3 = this.exBulletCombo3;
        e.exBulletOffsetX = this.exBulletOffsetX;

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
