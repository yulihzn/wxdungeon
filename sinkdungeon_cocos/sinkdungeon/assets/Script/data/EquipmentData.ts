import CommonData from "./CommonData";
import BaseData from "./BaseData";
import TriggerData from "./TriggerData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class EquipmentData extends BaseData {
    uuid: string = '';//唯一标识，用来存档
    id: number = 10000000;//装备类型id，用来排序前四位为大类别后四位为装备贴图id
    pos: cc.Vec3 = cc.v3(0, 0);//下标
    nameCn: string = '';
    nameEn: string = '';
    equipmetType: string = 'empty';
    equipmetTypeCn: string = '';
    prefix: string = '';
    desc: string = '';
    color: string = '#ffffff';
    lightcolor: string = '#ffffff';//刀光的颜色
    titlecolor: string = '#ffffff';
    img: string = 'emptyequipment';
    level: number = 0;
    requireLevel = 0;
    stab = 0;//是否突刺
    far = 0; //是否远距离
    blunt = 0;//是否钝器
    isLocked = 0;//是否锁定
    isReflect = 0;//子弹偏转 仅限近战武器
    trouserslong = 0;//是否长裤
    bulletType = "";//子弹类别
    bulletSize = 0;//子弹增加大小 为0代表不改变 1代表加一倍
    bulletArcExNum = 0;//额外扇形喷射子弹数量,为0的时候不计入,最大18,超过的话是一个固定圆，为80的时候是个八方向
    bulletArcOffsetX = 0;//扇形发射距离
    bulletLineExNum = 0;//额外线性喷射子弹数量，为0的时候不计入
    bulletLineInterval = 0;//线性喷射间隔时间（秒）
    exBulletOffsetX = 0;//额外子弹偏移x
    bulletExSpeed = 0;//子弹额外速度
    showShooter = 0;//是否显示发射器
    isHeavy = 0;//是否是重型武器比如 激光,具体影响是开枪时候移动减速 大盾牌 影响举盾速度
    isLineAim = 0;//是否是线性瞄准
    hideHair = 0;//是否隐藏头发
    // bulletNets = 0;//是否排状子弹11发并排数量为发射次数 为0的时候不触发 
    // statusInterval = 0;//添加常规状态的间隔@deprecated
    // statusName = '';//自身状态类别 获得装备时添加每次间隔时间到添加@deprecated
    // statusNameParrySelf = '';//完美盾反对自己添加的状态@deprecated
    // statusNameParryOther = '';//完美盾反对敌人添加的状态@deprecated
    // statusRateParry = 0;//完美盾反添加状态的几率@deprecated
    // statusNameBlockSelf = '';//普通盾防对自己添加的状态@deprecated
    // statusNameBlockOther = '';//普通盾防对敌人添加的状态@deprecated
    // statusRateBlock = 0;//普通盾防添加状态的几率@deprecated
    // statusNameHurtSelf = '';//受伤对自己添加的状态@deprecated
    // statusNameHurtOther = '';//受伤对敌人添加的状态@deprecated
    // statusRateHurt = 0;//受伤添加状态的几率@deprecated
    // exBulletTypeAttack = '';//攻击额外子弹类别@deprecated
    // exBulletTypeHurt = '';//受伤害额外子弹类别@deprecated
    // exBulletTypeParry = '';//盾反额外子弹类别@deprecated
    // exBulletTypeBlock = '';//普通格挡额外子弹类别@deprecated
    // exBulletRate = 0;//额外子弹几率@deprecated
    // exBulletCombo1 = 0;//攻击额外子弹连段，为1代表在这一次攻击释放@deprecated
    // exBulletCombo2 = 0;//@deprecated
    // exBulletCombo3 = 0;//@deprecated
    /**额外效果列表 */
    exTriggers: TriggerData[] = [];
    ignoreTrap = 0;//无视尖刺伤害
    remoteAudio = '';//远程音效
    exBeatBack = 0;//额外击退
    test = 0;//测试用武器，测试用武器在有刷新点的情况下不保存

    price: number = 0;

    private common: CommonData;

    info1: string = '';
    info2: string = '';
    info3: string = '';
    extraInfo: string = '';
    suitType = '';//套装资源名
    suit1: string = '';
    suit2: string = '';
    suit3: string = '';
    infobase: string = '';
    infocolor1: string = '#ffffff';
    infocolor2: string = '#ffffff';
    infocolor3: string = '#ffffff';
    suitcolor1: string = '#ffffff';
    suitcolor2: string = '#ffffff';
    suitcolor3: string = '#ffffff';
    infobasecolor: string = '#ffffff';
    constructor() {
        super();
        this.common = new CommonData();
    }

    get Common() {
        return this.common;
    }
    public valueCopy(data: EquipmentData): void {
        if (!data) {
            return;
        }
        this.uuid = data.uuid ? data.uuid : '';
        this.id = data.id ? data.id : 10000000;
        this.pos = data.pos ? cc.v3(data.pos.x, data.pos.y) : cc.v3(0, 0);
        this.common.valueCopy(data.common);
        this.nameCn = data.nameCn ? data.nameCn : '';
        this.nameEn = data.nameEn ? data.nameEn : '';
        this.equipmetType = data.equipmetType ? data.equipmetType : '';
        this.equipmetTypeCn = data.equipmetTypeCn ? data.equipmetTypeCn : '';
        this.prefix = data.prefix ? data.prefix : '';
        this.desc = data.desc ? data.desc : '';
        this.color = data.color ? data.color : '#ffffff';
        this.titlecolor = data.titlecolor ? data.titlecolor : '#ffffff';
        this.lightcolor = data.lightcolor ? data.lightcolor : '#ffffff';
        this.img = data.img ? data.img : 'emptyequipment';
        this.stab = data.stab ? data.stab : 0;
        this.far = data.far ? data.far : 0;
        this.blunt = data.blunt ? data.blunt : 0;
        this.isLocked = data.isLocked ? data.isLocked : 0;
        this.bulletArcExNum = data.bulletArcExNum ? data.bulletArcExNum : 0;
        this.bulletLineExNum = data.bulletLineExNum ? data.bulletLineExNum : 0;
        this.bulletLineInterval = data.bulletLineInterval ? data.bulletLineInterval : 0;
        this.bulletSize = data.bulletSize ? data.bulletSize : 0;
        this.bulletExSpeed = data.bulletExSpeed ? data.bulletExSpeed : 0;
        this.bulletArcOffsetX = data.bulletArcOffsetX ? data.bulletArcOffsetX : 0;
        this.level = data.level ? data.level : 0;
        this.trouserslong = data.trouserslong ? data.trouserslong : 0;
        this.showShooter = data.showShooter ? data.showShooter : 0;
        this.isHeavy = data.isHeavy ? data.isHeavy : 0;
        this.bulletType = data.bulletType ? data.bulletType : '';
        this.isLineAim = data.isLineAim ? data.isLineAim : 0;
        this.hideHair = data.hideHair ? data.hideHair : 0;
        this.isReflect = data.isReflect ? data.isReflect : 0;
        this.exBulletOffsetX = data.exBulletOffsetX ? data.exBulletOffsetX : 0;
        this.ignoreTrap = data.ignoreTrap ? data.ignoreTrap : 0;
        this.price = data.price ? data.price : 0;
        this.info1 = data.info1 ? data.info1 : '';
        this.info2 = data.info2 ? data.info2 : '';
        this.info3 = data.info3 ? data.info3 : '';
        this.extraInfo = data.extraInfo ? data.extraInfo : '';
        this.suit1 = data.suit1 ? data.suit1 : '';
        this.suit2 = data.suit2 ? data.suit2 : '';
        this.suit3 = data.suit3 ? data.suit3 : '';
        this.suitType = data.suitType ? data.suitType : '';
        this.infobase = data.infobase ? data.infobase : '';
        this.infocolor1 = data.infocolor1 ? data.infocolor1 : '#ffffff';
        this.infocolor2 = data.infocolor2 ? data.infocolor2 : '#ffffff';
        this.infocolor3 = data.infocolor3 ? data.infocolor3 : '#ffffff';
        this.suitcolor1 = data.suitcolor1 ? data.suitcolor1 : '#ffffff';
        this.suitcolor2 = data.suitcolor2 ? data.suitcolor2 : '#ffffff';
        this.suitcolor3 = data.suitcolor3 ? data.suitcolor3 : '#ffffff';
        this.infobasecolor = data.infobasecolor ? data.infobasecolor : '#ffffff';
        this.remoteAudio = data.remoteAudio ? data.remoteAudio : '';
        this.exBeatBack = data.exBeatBack ? data.exBeatBack : 0;
        this.test = data.test ? data.test : 0;
        this.requireLevel = data.requireLevel ? data.requireLevel : 0;
        this.exTriggers = [];
        if (data.exTriggers) {
            for (let ex of data.exTriggers) {
                let d = new TriggerData();
                d.valueCopy(ex);
                this.exTriggers.push(d);
            }
        }
    }
    public clone(): EquipmentData {
        let e = new EquipmentData();
        e.uuid = this.uuid;
        e.id = this.id;
        e.pos = this.pos;
        e.common = this.common.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.equipmetType = this.equipmetType;
        e.equipmetTypeCn = this.equipmetTypeCn;
        e.prefix = this.prefix;
        e.desc = this.desc;

        e.color = this.color;
        e.titlecolor = this.titlecolor;
        e.lightcolor = this.lightcolor;
        e.img = this.img;
        e.stab = this.stab;
        e.far = this.far;
        e.blunt = this.blunt;
        e.isLocked = this.isLocked;
        e.level = this.level;
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
        e.bulletArcOffsetX = this.bulletArcOffsetX;
        e.isReflect = this.isReflect;
        e.exBulletOffsetX = this.exBulletOffsetX;
        e.ignoreTrap = this.ignoreTrap;
        e.suitType = this.suitType;
        e.price = this.price;
        e.info1 = this.info1;
        e.info2 = this.info2;
        e.info3 = this.info3;
        e.extraInfo = this.extraInfo;
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
        e.remoteAudio = this.remoteAudio;
        e.exBeatBack = this.exBeatBack;
        e.test = this.test;
        e.requireLevel = this.requireLevel;
        e.exTriggers = this.exTriggers;
        return e;
    }
    public add(data: EquipmentData): EquipmentData {
        this.common = this.common.clone().add(data.Common);
        this.ignoreTrap = this.ignoreTrap + data.ignoreTrap;
        this.exBeatBack = this.exBeatBack + data.exBeatBack;
        return this;
    }

}
