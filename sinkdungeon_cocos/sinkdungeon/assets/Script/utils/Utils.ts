// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from '../logic/EventHelper'

const { ccclass, property } = cc._decorator

@ccclass
export default class Utils {
    static showLog = false
    static log(msg: String): void {
        if (this.showLog) {
            cc.log(msg)
        }
    }
    static clearComponentArray(arr: cc.Component[]): void {
        for (let n of arr) {
            if (n && n.isValid) {
                n.destroy()
            }
        }
    }

    public static toast(msg: string, isCenter?: boolean, isTap?: boolean) {
        EventHelper.emit(EventHelper.HUD_TOAST, { msg: msg, isCenter: isCenter, isTap: isTap })
    }

    /**
     * 返回方向偏转角度
     * @param direction 方向
     * @param isFlip? 是否翻转
     * @returns 该方向的偏转角度
     */
    public static getRotateAngle(direction: cc.Vec2, isFlip?: boolean) {
        // 方向向量归一化,计算偏转角度
        let angle = (cc.v2(1, 0).signAngle(cc.v2(direction.normalize())) * 180) / Math.PI
        return isFlip ? -angle : angle
    }
    static getPlayTime(time: number) {
        let hour = Math.floor(time / 3600000)
        let min = Math.floor((time - hour * 3600000) / 60000)
        let second = Math.floor((time - hour * 3600000 - min * 60000) / 1000)
        return `${Utils.getNumberStr2(hour)}:${Utils.getNumberStr2(min)}:${Utils.getNumberStr2(second)}`
    }
    static getFullFormatTime(time: number) {
        let date = new Date(time)
        let y = date.getFullYear()
        let mo = date.getMonth() + 1
        let d = date.getDate()
        let h = date.getHours() + 1
        if (h > 23) {
            h = 0
        }
        let m = date.getMinutes()
        let s = date.getSeconds()
        return `${Utils.getNumberStr2(y)}/${Utils.getNumberStr2(mo)}/${Utils.getNumberStr2(d)} ${Utils.getNumberStr2(h)}:${Utils.getNumberStr2(m)}:${Utils.getNumberStr2(s)}`
    }
    static getDay(time: number) {
        let date = new Date(time)
        let m = date.getMonth() + 1
        let d = date.getDate()
        return `${m < 10 ? '0' : ''}${m}月${d < 10 ? '0' : ''}${d}日 ${this.getWeek(date)}`
    }
    static getHour(time: number) {
        let date = new Date(time)
        let h = date.getHours() + 1
        if (h > 23) {
            h = 0
        }
        let m = date.getMinutes()
        return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`
    }
    static getYear(time: number) {
        let date = new Date(time)
        return date.getFullYear() + '年'
    }
    static getWeek(date: Date) {
        let week = ''
        if (date.getDay() == 0) week = '星期日'
        if (date.getDay() == 1) week = '星期一'
        if (date.getDay() == 2) week = '星期二'
        if (date.getDay() == 3) week = '星期三'
        if (date.getDay() == 4) week = '星期四'
        if (date.getDay() == 5) week = '星期五'
        if (date.getDay() == 6) week = '星期六'
        return week
    }

    static clamp(value: number, max: number, min: number): number {
        if (value > max) {
            return max
        }
        if (value < min) {
            return min
        }
        return value
    }
    static clampPos(value: cc.Vec3, max: cc.Vec3, min: cc.Vec3): cc.Vec3 {
        let pos = value.clone()
        if (value.x > max.x) {
            pos.x = max.x
        }
        if (value.y > max.y) {
            pos.y = max.y
        }
        if (value.x < min.x) {
            pos.x = min.x
        }
        if (value.y < min.y) {
            pos.y = min.y
        }
        return pos
    }

    static isFirstEqual(mapStr: string, typeStr: string) {
        if (!mapStr) {
            return false
        }
        let isequal = mapStr[0] == typeStr
        return isequal
    }
    static hasThe(mapStr: string, typeStr: string): boolean {
        if (!mapStr) {
            return false
        }
        let isequal = mapStr.indexOf(typeStr) != -1
        return isequal
    }
    static getNumberStr3(i: number) {
        if (i < 10) {
            return `00${i}`
        } else if (i < 100) {
            return `0${i}`
        } else {
            return `${i}`
        }
    }
    static getNumberStr2(i: number) {
        if (i < 10) {
            return `0${i}`
        } else {
            return `${i}`
        }
    }

    /**
     * 获取匀减速的距离，加速度不能为0
     * S=(v*v-v0*v0)/2a
     * @param speed
     * @param damping
     * @returns
     */
    static getDashDistanceBySpeed(speed: number, damping: number) {
        if (damping == 0) {
            return 0
        }
        return Math.abs((speed * speed * 0.5) / damping)
    }
    /**
     * 获取指定距离匀减速初速度
     * @param distance
     * @param damping
     */
    static getDashSpeedByDistance(distance: number, damping: number) {
        if (damping == 0) {
            return 0
        }

        return Math.sqrt(distance * damping * 2)
    }
    /**
     * 获取指定时间内匀减速的距离
     * S=v0t+at^2/2
     * @param speed
     * @param damping
     * @param second
     * @returns
     */
    static getDashDistanceByTime(speed: number, damping: number, second: number) {
        let v = speed
        let a = damping
        let t = second
        if (a != 0) {
            let t0 = v / a
            if (t > t0) {
                t = t0
            }
        }
        return v * t - a * t * t * 0.5
    }

    static getJumpTimeBySpeedDistance(distance: number, speed: number, damping: number) {
        let s = Utils.getDashDistanceBySpeed(speed, damping)
        if (distance < s) {
            return 0
        }
        s = distance - s
        return s / speed
    }
    static getDashTime(speed: number, damping: number) {
        if (damping != 0) {
            return speed / damping
        }
        return 0
    }
    static getDirByHv(hv: cc.Vec2) {
        let dir = 4
        if (!hv || hv.equals(cc.Vec2.ZERO)) {
            return dir
        }
        if (Math.abs(hv.x) < Math.abs(hv.y)) {
            if (hv.y > 0.3) {
                dir = 0
            }
            if (hv.y < -0.3) {
                dir = 1
            }
        }
        if (Math.abs(hv.x) > Math.abs(hv.y)) {
            if (hv.x < -0.3) {
                dir = 2
            }
            if (hv.x > 0.3) {
                dir = 3
            }
        }
        return dir
    }

    static changeNodeGroups(node: cc.Node, group: string) {
        if (node) {
            node.group = group
            if (node.childrenCount > 0) {
                for (let child of node.children) {
                    this.changeNodeGroups(child, group)
                }
            }
        }
    }
    static cloneKeyValue(data: { [key: string]: any }): { [key: string]: any } {
        let newdata = {}
        for (let key in data) {
            newdata[key] = data[key]
        }
        return newdata
    }
    static cloneKeyValueNumber(data: { [key: number]: any }): { [key: number]: any } {
        let newdata = {}
        for (let key in data) {
            newdata[key] = data[key]
        }
        return newdata
    }
    static getMixColor(color1: string, color2: string): string {
        let c1 = cc.color().fromHEX(color1)
        let c2 = cc.color().fromHEX(color2)
        let c3 = cc.color()
        let r = c1.getR() + c2.getR()
        let g = c1.getG() + c2.getG()
        let b = c1.getB() + c2.getB()

        c3.setR(r > 255 ? 255 : r)
        c3.setG(g > 255 ? 255 : g)
        c3.setB(b > 255 ? 255 : b)
        return '#' + c3.toHEX('#rrggbb')
    }
}
