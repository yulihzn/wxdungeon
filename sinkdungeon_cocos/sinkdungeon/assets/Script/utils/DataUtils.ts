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
                self[key] = other[key] ? other[key] : false
            }
        }
    }
    static copyMapValue<T, K>(map1: Map<T, K>, map2: Map<T, K>, callback: (arg0: K) => K) {
        if (!map1) {
            map1 = new Map<T, K>()
        }
        if (map1 && map2) {
            map1.clear()
            map2.forEach((element, key) => {
                map1.set(key, callback(element))
            })
        }
        return map1
    }
    static copyListValue<T>(list1: T[], list2: T[], callback: (arg0: T) => T) {
        if (!list1) {
            list1 = []
        }
        if (list1 && list2) {
            list1 = []
            for (let c of list2) {
                list1.push(callback(c))
            }
        }
        return list1
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
    /**
     * 获取信息里的数字字符串
     * @param num
     * @returns 不足0的保留2位小数
     */
    public static getinfoNum2String(isSkip: boolean, prefix: string, num?: number, suffix?: string): string {
        if (isSkip) {
            return ''
        }
        if (isNaN(num)) {
            return `${prefix}`
        }
        if (num == 0) {
            return `${prefix}${num}${suffix}`
        }
        let str = `${num.toFixed(2).replace('.00', '')}`
        if (str.indexOf('.') > -1) {
            let arr = str.split('.')
            let end = arr[1]
            if (end.length > 1 && end.endsWith('0')) {
                end = end.substring(0, end.length - 1)
            }
            str = `${arr[0]}.${end}`
        }
        return `${prefix}${str}${suffix}`
    }
}
