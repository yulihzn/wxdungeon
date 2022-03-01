import DataUtils from "../utils/DataUtils";
import BaseData from "./BaseData";
import CommonData from "./CommonData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 翠金数据
 */
export default class OilGoldData extends BaseData {
    value = 0;//总数
    fragments = 0;//翠金碎片数
    level = 0;//翠金当前等级
    index = 0;//翠金当前等级在列表里的下标
    private common:CommonData;
    constructor(){
        super();
        this.common = new CommonData();
    }

    get Common(){
        return this.common;
    }
    public valueCopy(data: OilGoldData): void {
        if(!data){
            return;
        }
        DataUtils.baseCopy(this,data);
        this.common.valueCopy(data.common);
        // this.fragments = data.fragments?data.fragments:0;
        // this.level = data.level?data.level:0;
        // this.index = data.index?data.index:0;
        // this.value = data.value?data.value:0;

      
    }
    public clone(): OilGoldData {
        let e = new OilGoldData();
        e.valueCopy(this);
        // e.fragments = this.fragments;
        // e.common = this.common.clone();
        // e.level = this.level;
        // e.index = this.index;
        // e.value = this.value;
        return e;
    }
    
}