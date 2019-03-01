import DamageData from "./DamageData";

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
    isLaser = 0;//是否是激光 
    isBoom = 0;//是否爆炸
    isPhysical = 0;//是否有碰撞
    delaytrack = 0;//延迟追踪
    isTracking = 0;//是否跟踪 不能和激光同时存在 激光大于跟踪
    lifeTime = 0;//存活时间 秒
    size = 1;//子弹大小
    resName = '';//子弹贴图
    lightName = '';//子弹消失的光芒
    resNameLaser = "";//激光贴图
    lightColor:string = '#ffffff';//子弹颜色
    damage:DamageData = new DamageData();
    valueCopy(data:BulletData){
        this.speed = data.speed?data.speed:0;
        this.isRect = data.isRect?data.isRect:0;
        this.isRotate = data.isRotate?data.isRotate:0;
        this.isLaser = data.isLaser?data.isLaser:0;
        this.isBoom = data.isBoom?data.isBoom:0;
        this.isTracking = data.isTracking?data.isTracking:0;
        this.isPhysical = data.isPhysical?data.isPhysical:0;
        this.delaytrack = data.delaytrack?data.delaytrack:0;
        this.size = data.size?data.size:1;
        this.lifeTime = data.lifeTime?data.lifeTime:0;
        this.resName = data.resName?data.resName:'';
        this.resNameLaser = data.resNameLaser?data.resNameLaser:"";
        this.lightName = data.lightName?data.lightName:'';
        this.lightColor = data.lightColor?data.lightColor:'#ffffff'
        this.damage.valueCopy(data.damage);
    }
    clone():BulletData{
        let e = new BulletData();
        e.speed = this.speed;
        e.isRect = this.isRect;
        e.isRotate = this.isRotate;
        e.size = this.size;
        e.isLaser = this.isLaser;
        e.isBoom = this.isBoom;
        e.isTracking = this.isTracking;
        e.resName = this.resName;
        e.resNameLaser = this.resNameLaser;
        e.lightName = this.lightName;
        e.lightColor = this.lightColor;
        e.lifeTime = this.lifeTime;
        e.isPhysical = this.isPhysical;
        e.delaytrack = this.delaytrack;
        e.damage = this.damage.clone();
        return e;
    }
}
