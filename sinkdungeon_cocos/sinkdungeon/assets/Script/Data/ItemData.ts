import BaseData from "./BaseData";

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
 * 物品
 */
export default class ItemData extends BaseData {
    uuid:string = '';//唯一标识，用来存档
    pos:cc.Vec2 = cc.v2(0,0);//下标
    nameCn: string = '';
    nameEn: string = '';
    duration: number = 0;//持续时间
    desc: string = '';//描述
    info:string='';//功能介绍
    resName:string = 'emptyitem';
    price:number = 0;
    isTaken = false;
    canSave = 0;

    public valueCopy(data: ItemData): void {
        this.uuid = data.uuid?data.uuid:'';
        this.pos = data.pos?cc.v2(data.pos.x,data.pos.y):cc.v2(0,0);
        this.nameCn = data.nameCn ? data.nameCn : this.nameCn;
        this.nameEn = data.nameEn;
        this.duration = data.duration;
        this.resName = data.resName?data.resName:'emptyitem';
        this.info = data.info?data.info:'';
        this.desc = data.desc?data.desc:'';
        this.isTaken = data.isTaken?data.isTaken:false;
        this.canSave = data.canSave?data.canSave:0;
        this.price = data.price?data.price:0;
      
    }
    public clone(): ItemData {
        let e = new ItemData();
        e.uuid = this.uuid;
        e.pos = this.pos;
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.duration = this.duration;
        e.info = this.info;
        e.desc = this.desc;
        e.resName = this.resName;
        e.isTaken = this.isTaken;
        e.canSave = this.canSave;
        e.price = this.price;
        return e;
    }
    
}