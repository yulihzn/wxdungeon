
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from "../logic/EventHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Utils {
    static showLog = false;
    static log(msg: String): void {
        if (this.showLog) {
            cc.log(msg);

        }
    }
    static clearComponentArray(arr: cc.Component[]): void {
        for (let n of arr) {
            if (n && n.isValid) { n.destroy(); }
        }
    }

    public static toast(msg: string, isCenter?: boolean, isTap?: boolean) {
        EventHelper.emit(EventHelper.HUD_TOAST, { msg: msg, isCenter: isCenter, isTap: isTap });
    }

    /**
     * 返回方向偏转角度
     * @param direction 方向
     * @param isFlip? 是否翻转
     * @returns 该方向的偏转角度
     */
    public static getRotateAngle(direction: cc.Vec2, isFlip?: boolean) {
        // 方向向量归一化,计算偏转角度
        let angle = cc.v2(1, 0).signAngle(cc.v2(direction.normalize())) * 180 / Math.PI;
        return isFlip ? -angle : angle;
    }

    static getDay(time: number) {
        let date = new Date(time);
        let m = date.getMonth() + 1;
        let d = date.getDate();
        return `${m < 10 ? '0' : ''}${m}月${d < 10 ? '0' : ''}${d}日 ${this.getWeek(date)}`;
    }
    static getHour(time: number) {
        let date = new Date(time);
        let h = date.getHours() + 1;
        if (h > 23) {
            h = 0;
        }
        let m = date.getMinutes();
        return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
    }
    static getYear(time: number) {
        let date = new Date(time);
        return date.getFullYear() + "年";
    }
    static getWeek(date: Date) {
        let week = '';
        if (date.getDay() == 0) week = "星期日";
        if (date.getDay() == 1) week = "星期一";
        if (date.getDay() == 2) week = "星期二";
        if (date.getDay() == 3) week = "星期三";
        if (date.getDay() == 4) week = "星期四";
        if (date.getDay() == 5) week = "星期五";
        if (date.getDay() == 6) week = "星期六";
        return week;
    }
  
    static clamp(value: number, max: number, min: number):number {
        if (value > max) {
            return max;
        }
        if (value < min) {
            return min;
        }
        return value;
    }
    static clampPos(value: cc.Vec3, max: cc.Vec3, min: cc.Vec3):cc.Vec3 {
        let pos = value.clone();
        if (value.x > max.x) {
            pos.x = max.x;
        }
        if(value.y>max.y){
            pos.y = max.y;
        }
        if (value.x < min.x) {
           pos.x = min.x;
        }
        if (value.y < min.y) {
            pos.y = min.y;
         }
        return pos;
    }
}
