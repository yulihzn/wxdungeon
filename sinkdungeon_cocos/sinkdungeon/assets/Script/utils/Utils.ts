
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
    
    public static toast(msg:string,isCenter?:boolean,isTap?:boolean){
        EventHelper.emit(EventHelper.HUD_TOAST,{msg:msg,isCenter:isCenter,isTap:isTap});
    }

    /**
     * 返回方向偏转角度
     * @param direction 方向
     * @param isFlip? 是否翻转
     * @returns 该方向的偏转角度
     */
    public static getRotateAngle(direction:cc.Vec2,isFlip?:boolean){
        // 方向向量归一化,计算偏转角度
        let angle = cc.v2(1,0).signAngle(cc.v2(direction.normalize())) * 180 / Math.PI;
        return isFlip?-angle:angle;
    }
}