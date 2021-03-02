import BaseData from "./BaseData";
import ItemData from "./ItemData";

export default class GoodsData extends BaseData{
    uuid:string = '';//唯一标识，用来存档
    item:ItemData;//关联的item
    count:number = 10;//货架上的数量
    constructor(){
        super();
        this.item = new ItemData();
    }
    public valueCopy(data: GoodsData): void {
        this.uuid = data.uuid?data.uuid:'';
        this.count = data.count ? data.count : this.count;
        this.item.valueCopy(data.item);

    }
    public clone(): GoodsData {
        let e = new GoodsData();
        e.uuid = this.uuid;
        e.count = this.count;
        e.item = this.item.clone();
        return e;
    }
}