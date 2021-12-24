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


export default class LifeData extends BaseData{
    sanity:number = 50;//神志
    solidSatiety:number = 50;//饱腹值
    liquidSatiety:number = 50;//解渴值
    solidLoss:number = 1;//每小时消耗掉的饱腹值
    liquidLoss:number = 2;//每小时消耗掉的解渴值
    poo:number = 0;//便便
    pee:number = 0;//尿尿
    pooRate:number = 10;//便便转化率%
    peeRate:number = 10;//尿尿转化率%

    public valueCopy(data:LifeData):void{
        if(!data){
            return;
        }
        this.sanity = data.sanity?data.sanity:0;
        this.solidSatiety = data.solidSatiety?data.solidSatiety:0;
        this.liquidSatiety = data.liquidSatiety?data.liquidSatiety:0;
        this.liquidLoss = data.liquidLoss?data.liquidLoss:0;
        this.solidLoss = data.solidLoss?data.solidLoss:0;
        this.poo = data.poo?data.poo:0;
        this.pee = data.pee?data.pee:0;
        this.pooRate = data.pooRate?data.pooRate:0;
        this.peeRate = data.peeRate?data.peeRate:0;
       
    }
    public clone():LifeData{
        let e = new LifeData();
        e.sanity = this.sanity;
        e.solidSatiety = this.solidSatiety;
        e.liquidSatiety = this.liquidSatiety;
        e.solidLoss = this.solidLoss;
        e.liquidLoss = this.liquidLoss;
        e.poo = this.poo;
        e.pee = this.pee;
        e.pooRate = this.pooRate;
        e.peeRate = this.peeRate;
        return e;
    }
    
}
