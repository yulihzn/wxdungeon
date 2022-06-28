import DataUtils from '../utils/DataUtils'
import BaseData from './BaseData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class LifeData extends BaseData {
    sanity: number = 75 //神志
    solidSatiety: number = 75 //饱腹值
    liquidSatiety: number = 75 //解渴值
    poo: number = 0 //固体
    pee: number = 0 //液体
    timeScale: number = 1 //消耗的速率默认1
    static readonly SOLID_LOSS: number = 0.0035 //每秒消耗掉的饱腹值
    static readonly LIQUID_LOSS: number = 0.005 //每秒消耗掉的解渴值
    static readonly POO_RATE: number = 0.2 //固体转化率
    static readonly PEERATE: number = 0.2 //液体转化率

    public valueCopy(data: LifeData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        // this.sanity = data.sanity?data.sanity:0;
        // this.solidSatiety = data.solidSatiety?data.solidSatiety:0;
        // this.liquidSatiety = data.liquidSatiety?data.liquidSatiety:0;
        // this.poo = data.poo?data.poo:0;
        // this.pee = data.pee?data.pee:0;
        this.timeScale = data.timeScale ? data.timeScale : 1
    }
    public clone(): LifeData {
        let e = new LifeData()
        e.valueCopy(this)
        // e.sanity = this.sanity;
        // e.solidSatiety = this.solidSatiety;
        // e.liquidSatiety = this.liquidSatiety;
        // e.poo = this.poo;
        // e.pee = this.pee;
        // e.timeScale = this.timeScale;
        return e
    }
}
