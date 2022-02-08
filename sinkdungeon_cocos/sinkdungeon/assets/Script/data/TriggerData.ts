// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseData from "./BaseData";

/**触发数据类  */
export default class TriggerData extends BaseData{
    static readonly ID_STATUS = 0;//触发类型 状态
    static readonly ID_BULLET = 1;//触发类型 子弹
    static readonly ID_TALENT = 2;//触发类型 技能
    static readonly GROUP_ATTACK = 0;//触发事件 攻击
    static readonly GROUP_HIT = 1;//触发事件 命中
    static readonly GROUP_HURT = 2;//触发事件 受击
    static readonly GROUP_USE = 3;//触发事件 使用
    static readonly GROUP_AUTO = 4;//触发事件 自动
    static readonly TYPE_ATTACK_1 = 1;//触发类别 连招1 √
    static readonly TYPE_ATTACK_2 = 2;//触发类别 连招2 √
    static readonly TYPE_ATTACK_3 = 3;//触发类别 连招3 √
    static readonly TYPE_ATTTACK_REMOTE = 4;//触发类别 远程攻击 √
    static readonly TYPE_HIT = 0;//触发类别 近战命中 √
    static readonly TYPE_HIT_CRIT= 1;//触发类别 近战暴击命中 √
    static readonly TYPE_HIT_BACK = 2;//触发类别 背刺命中 √
    static readonly TYPE_HIT_REMOTE = 3;//触发类别 远程命中 √
    static readonly TYPE_HIT_CRIT_REMOTE = 4;//触发类别 远程暴击命中  √
    static readonly TYPE_HURT = 0;//触发类别 受击 √
    static readonly TYPE_HURT_BLOCK = 1;//触发类别 格挡 √
    static readonly TYPE_HURT_PARRAY = 2;//触发类别 弹反 √
    static readonly TYPE_HURT_DODGE = 3;//触发类别 闪避 √
    static readonly TYPE_HURT_DREAM = 4;//触发类别 梦境盾 √
    static readonly TYPE_USE_ITEM = 0;//触发类别 使用物品 √
    static readonly TYPE_USE_TALENT = 1;//触发类别 使用技能 √
    static readonly TYPE_AUTO = 0;//触发类别 间隔自动 √
    static readonly TARGET_SELF = 0;//触发目标 自己 √
    static readonly TARGET_OTHER = 1;//触发目标 敌对 √
    static readonly TARGET_OTHER_NEAREST = 2;//触发目标 最近敌对 √
    static readonly TARGET_ALL = 3;//触发目标 范围内所有人 √
    static readonly TARGET_ALL_ENEMY = 4;//触发目标 范围内敌对 √
    static readonly TARGET_ALL_ALLY = 5;//触发目标 范围内友方 √
    uuid:string = '';//唯一标识，用来存档
    res:string = '';//状态名
    id: number = 0;//资源id 0状态 1子弹 2技能
    group:number = 0;//分组类型 0：攻击 1：命中 2：受击 3：使用 4：自动
    /**
     * exAttack = '';//额外被动 参数：1：攻击一 2：攻击二 3：攻击三 4:远程
     * exHit = '';//额外被动 攻击命中 参数： 0:普通近战 1:暴击近战 2:背刺近战 3:普通远程 4:暴击远程
     * exHurt = '';//额外被动 受伤 参数：0：受伤 1：格挡 2：弹反 3：闪避 4：梦境盾
     * exUse = '';//额外主动 使用装备 参数：0：使用装备 1：组织技能
     * exAuto = '';//额外被动 穿上后时间间隔 参数：0
     */
    type: number = 0;
    count: number = 0;//触发次数，小于1为几率触发 大于1为次数
    
    target: number = 0;//状态的对象 0：自身 1：对方 2：范围内最近敌对 3：范围内所有人 4：范围内所有敌对 5：范围内所有友方
    range: number = 0;//范围
    autoInterval: number = 0;//间隔时间
    maxAmmo: number = 0;//每次触发的子弹容量
    bulletInterval: number = 0;//远程子弹发射间隔
    bulletAngle:number = 0;//子弹准度偏离范围
    bulletSize = 0;//子弹增加大小 为0代表不改变 1代表加一倍
    bulletOffsetX = 0;//额外子弹偏移x
    bulletArcOffsetX = 0;//扇形发射距离
    bulletArcExNum = 0;//额外扇形喷射子弹数量,为0的时候不计入,最大18,超过的话是一个固定圆，为80的时候是个八方向
    bulletLineExNum = 0;//额外线性喷射子弹数量，为0的时候不计入
    bulletLineInterval = 0;//线性喷射间隔时间（秒）
    bulletSpeed = 0;//子弹额外速度

    public valueCopy(data: TriggerData): void {
        if(!data){
            return;
        }
        this.uuid = data.uuid?data.uuid:'';
        this.res = data.res?data.res:'';
        this.id = data.id? data.id : 0;
        this.group = data.group?data.group:0;
        this.type = data.type ? data.type : 0;
        this.count = data.count ? data.count : 0;
        this.target = data.target ? data.target : 0;
        this.range = data.range ? data.range : 0;
        this.maxAmmo = data.maxAmmo? data.maxAmmo : 0;
        this.bulletInterval = data.bulletInterval?data.bulletInterval:0;
        this.bulletAngle = data.bulletAngle? data.bulletAngle: 0;
        this.bulletSize = data.bulletSize?data.bulletSize:0;
        this.bulletOffsetX = data.bulletOffsetX?data.bulletOffsetX:0;
        this.bulletArcOffsetX = data.bulletArcOffsetX?data.bulletArcOffsetX:0;
        this.bulletArcExNum = data.bulletArcExNum?data.bulletArcExNum:0;
        this.bulletLineExNum = data.bulletLineExNum?data.bulletLineExNum:0;
        this.bulletLineInterval = data.bulletLineInterval?data.bulletLineInterval:0;
        this.bulletSpeed = data.bulletSpeed?data.bulletSpeed:0;
        this.autoInterval = data.autoInterval?data.autoInterval:0;
    }
    public clone(): TriggerData {
        let e = new TriggerData();
        e.uuid = e.uuid;
        e.res = this.res;
        e.id = this.id;
        e.group = e.group;
        e.type = this.type;
        e.count = this.count;
        e.target = this.target;
        e.range = this.range;
        e.maxAmmo = this.maxAmmo;
        e.bulletInterval = this.bulletInterval;
        e.bulletAngle = this.bulletAngle;
        e.bulletSize = this.bulletSize;
        e.bulletOffsetX = this.bulletOffsetX;
        e.bulletArcOffsetX = this.bulletArcOffsetX;
        e.bulletArcExNum = this.bulletArcExNum;
        e.bulletLineExNum = this.bulletLineExNum;
        e.bulletLineInterval = this.bulletLineInterval;
        e.bulletSpeed = this.bulletSpeed;
        e.autoInterval = this.autoInterval;
        return e;
    }
    
    
}
