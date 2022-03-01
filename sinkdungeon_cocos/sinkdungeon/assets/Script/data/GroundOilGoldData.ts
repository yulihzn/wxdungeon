import DataUtils from "../utils/DataUtils";

/**
 * 地面翠金碎片
 * 
 */
export default class GroundOilGoldData {
    x: number = 0;//房间下标x
    y: number = 0;//房间下标y
    chapter: number = 0;//章节
    level: number = 0;//关卡
    value: number = 0;//数量
    public valueCopy(data: GroundOilGoldData): void {
        if(!data){
            return;
        }
        DataUtils.baseCopy(this,data);
        // this.x = data.x ? data.x : 0;
        // this.y = data.y ? data.y : 0;
        // this.chapter = data.chapter ? data.chapter : 0;
        // this.level = data.level ? data.level : 0;
        // this.value = data.value ? data.value : 0;
    }
    public clone(): GroundOilGoldData {
        let data = new GroundOilGoldData();
        data.valueCopy(this);
        // data.x = this.x;
        // data.y = this.y;
        // data.chapter = this.chapter;
        // data.level = this.level;
        // data.value = this.value;
        return data;
    }
}