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

    speed: number = 0;
    isRect = 0;
    isRotate = 0;
    size = 1;
    resName = '';
    lightName = '';
    lightColor:string = '#ffffff';
    damage:DamageData = new DamageData();
    valueCopy(data:BulletData){
        this.speed = data.speed?data.speed:0;
        this.isRect = data.isRect?data.isRect:0;
        this.isRotate = data.isRotate?data.isRotate:0;
        this.size = data.size?data.size:1;
        this.resName = data.resName?data.resName:'';
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
        e.resName = this.resName;
        e.lightName = this.lightName;
        e.lightColor = this.lightColor;
        e.damage = this.damage.clone();
        return e;
    }
}
