// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class DataUtils {
    static baseCopy(self: any, other: any, keepDefault?: boolean) {
        if (!other) {
            return
        }
        if (!self) {
            return
        }
        if (self === other) {
            return
        }
        for (const key of Object.keys(self)) {
            if (typeof self[key] == 'number') {
                if (keepDefault) {
                    self[key] = other[key] ? other[key] : self[key]
                } else {
                    self[key] = other[key] ? other[key] : 0
                }
            } else if (typeof self[key] == 'string') {
                if (keepDefault) {
                    self[key] = other[key] ? other[key] : self[key]
                } else {
                    self[key] = other[key] ? other[key] : ''
                }
            } else if (typeof self[key] == 'boolean') {
                if (keepDefault) {
                    self[key] = other[key] ? other[key] : self[key]
                } else {
                    self[key] = other[key] ? other[key] : false
                }
            }
        }
    }

    /**几率相加 范围0-100 */
    public static addRateFixed(origin: number, target: number): number {
        return DataUtils.fixRateRange(DataUtils.addRate(origin, target), 0, 100)
    }
    public static addRate(origin: number, target: number): number {
        if (!target || isNaN(target)) {
            if (!origin || isNaN(origin)) {
                return 0
            }
            return origin
        }
        if (!origin || isNaN(origin)) {
            if (!target || isNaN(target)) {
                return 0
            }
            return target
        }
        let rate = 1
        rate *= 1 - origin / 100
        rate *= 1 - target / 100
        return (1 - rate) * 100
    }
    /**正面属性百分比相加 范围-100% - 9999% */
    public static addPercentFixed(origin: number, target: number): number {
        return DataUtils.fixRateRange(DataUtils.addRate(origin, target), -100, 9999)
    }
    public static fixRateRange(rate: number, min: number, max: number) {
        rate = rate < min ? min : rate
        rate = rate > max ? max : rate
        return rate
    }
}
