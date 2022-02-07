// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**触发数据类  */
export default class TriggerData {
    id: number = 0;//资源id 状态 子弹 技能
    group:number = 0;//分组类型 0：攻击 1：命中 2：受击 3：使用 4：自动
    /**
     * exAttack = '';//额外被动 参数：0：攻击一 1：攻击二 2：攻击三 3:远程
     * exHit = '';//额外被动 攻击命中 参数： 0:普通近战 1:暴击近战 2:背刺近战 3:普通远程 4:暴击远程
     * exHurt = '';//额外被动 受伤 参数：0：受伤 1：格挡 2：弹反 3：闪避 4：能量盾
     * exUse = '';//额外主动 使用装备 参数：0：使用装备 1：组织技能
     * exInterval = '';//额外被动 穿上或者时间间隔 参数：间隔时间
     */
    type: number = 0;
    count: number = 0;//触发次数，小于1为几率触发 大于1为次数
    
    target: number = 0;//状态的对象 0：自身 1：对方 2：所有敌对 3：所有友方 4：所有人
    
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
        this.id = data.id? data.id : 0;
        this.group = data.group?data.group:0;
        this.type = data.type ? data.type : 0;
        this.count = data.count ? data.count : 0;
        this.target = data.target ? data.target : 0;
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
    }
    public clone(): TriggerData {
        let e = new TriggerData();
        e.id = this.id;
        e.group = e.group;
        e.type = this.type;
        e.count = this.count;
        e.target = this.target;
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
        return e;
    }
    
    
}
