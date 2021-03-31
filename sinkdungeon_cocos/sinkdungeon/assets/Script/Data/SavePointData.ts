/**
 * 地图块
 * 
 */
export default class SavePointData{
    x:number;//下标x
    y:number;//下标y
    chapter:number//章节
    level:number;//关卡
    public valueCopy(data: SavePointData): void {
        this.x = data.x ? data.x : 0;
        this.y =data.y?data.y:0;
        this.chapter = data.chapter?data.chapter:0;
        this.level = data.level?data.level:0;
    }
    public clone():SavePointData{
        let data = new SavePointData();
        data.x=this.x;
        data.y= this.y;
        data.chapter = this.chapter;
        data.level = this.level;
        return data;
    }
}