
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from "../EventHelper";

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
    
    public static toast(msg:string,isCenter?:boolean){
        EventHelper.emit(EventHelper.HUD_TOAST,{msg:msg,isCenter:isCenter});
    }
}
