import DamageData from "./DamageData";
import FromData from "./FromData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class BulletData {

    speed: number = 0;//移动速度
    isRect = 0;//碰撞体是否是矩形
    isRotate = 0;//是否旋转
    rotateAngle = 0;//每0.3s旋转角度默认15
    isLaser = 0;//是否是激光
    laserRange = 0;//激光长度
    isDecelerate = 0;//是否减速
    decelerateDelta = 0;//减速系数
    delayDecelerate = 0;//延迟减速
    isBoom = 0;//是否爆炸1 2
    isPhysical = 0;//是否有碰撞
    delaytrack = 0;//延迟追踪s
    isTracking = 0;//是否跟踪 不能和激光同时存在 激光大于跟踪
    lifeTime = 0;//存活时间 秒
    size = 1;//子弹大小
    resName = '';//子弹贴图
    lightName = '';//子弹消失的光芒
    resNameLaser = "";//激光贴图
    lightColor:string = '#ffffff';//子弹颜色
    fixedRotation = 0;//是否固定方向
    statusType:string = "";//附加状态
    statusRate = 0;//状态几率
    canBreakBuilding = 0;//是否可以打破部分建筑
    isInvincible = 0;//是否无敌，无法被主动销毁
    splitBulletType = '';//分裂子弹名
    splitTime = 0;//分裂时间 如果为0表示不分裂
    splitArcExNum = 0;//分裂额外扇形
    splitLineExNum = 0;//分裂额外线形
    damage:DamageData = new DamageData();
    from:FromData = new FromData();//来源
    valueCopy(data:BulletData){
        this.speed = data.speed?data.speed:0;
        this.isRect = data.isRect?data.isRect:0;
        this.isRotate = data.isRotate?data.isRotate:0;
        this.rotateAngle = data.rotateAngle?data.rotateAngle:0;
        this.isDecelerate = data.isDecelerate?data.isDecelerate:0;
        this.decelerateDelta = data.decelerateDelta?data.decelerateDelta:0;
        this.delayDecelerate = data.delayDecelerate?data.delayDecelerate:0;
        this.isLaser = data.isLaser?data.isLaser:0;
        this.laserRange = data.laserRange?data.laserRange:0;
        this.isBoom = data.isBoom?data.isBoom:0;
        this.isTracking = data.isTracking?data.isTracking:0;
        this.isPhysical = data.isPhysical?data.isPhysical:0;
        this.delaytrack = data.delaytrack?data.delaytrack:0;
        this.fixedRotation = data.fixedRotation?data.fixedRotation:0;
        this.size = data.size?data.size:1;
        this.lifeTime = data.lifeTime?data.lifeTime:0;
        this.resName = data.resName?data.resName:'';
        this.resNameLaser = data.resNameLaser?data.resNameLaser:"";
        this.lightName = data.lightName?data.lightName:'';
        this.statusType = data.statusType?data.statusType:'';
        this.statusRate = data.statusRate?data.statusRate:0;
        this.canBreakBuilding = data.canBreakBuilding?data.canBreakBuilding:0;
        this.isInvincible = data.isInvincible?data.isInvincible:0;
        this.splitTime = data.splitTime?data.splitTime:0;
        this.splitBulletType = data.splitBulletType?data.splitBulletType:'';
        this.splitArcExNum = data.splitArcExNum?data.splitArcExNum:0;
        this.splitLineExNum = data.splitLineExNum?data.splitLineExNum:0;
        this.lightColor = data.lightColor?data.lightColor:'#ffffff'
        this.damage.valueCopy(data.damage);
        this.from.valueCopy(data.from);
    }
    clone():BulletData{
        let e = new BulletData();
        e.speed = this.speed;
        e.isRect = this.isRect;
        e.isRotate = this.isRotate;
        e.rotateAngle = this.rotateAngle;
        e.decelerateDelta = this.decelerateDelta;
        e.isDecelerate = this.isDecelerate;
        e.delayDecelerate = this.delayDecelerate;
        e.size = this.size;
        e.isLaser = this.isLaser;
        e.laserRange = this.laserRange;
        e.isBoom = this.isBoom;
        e.isTracking = this.isTracking;
        e.resName = this.resName;
        e.resNameLaser = this.resNameLaser;
        e.lightName = this.lightName;
        e.lightColor = this.lightColor;
        e.lifeTime = this.lifeTime;
        e.isPhysical = this.isPhysical;
        e.delaytrack = this.delaytrack;
        e.fixedRotation = this.fixedRotation;
        e.statusType = this.statusType;
        e.statusRate = this.statusRate;
        e.canBreakBuilding = this.canBreakBuilding;
        e.isInvincible = this.isInvincible;
        e.splitBulletType = this.splitBulletType;
        e.splitTime = this.splitTime;
        e.splitArcExNum = this.splitArcExNum;
        e.splitLineExNum = this.splitLineExNum;
        e.damage = this.damage.clone();
        e.from = this.from.clone();
        return e;
    }
}
