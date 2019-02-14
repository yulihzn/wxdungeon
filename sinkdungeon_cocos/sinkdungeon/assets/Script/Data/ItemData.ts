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
export default class ItemData {
    nameCn: string = '';
    nameEn: string = '';
    duration: number = 0;//持续时间
    desc: string = '';
    resName:string = '';

    public valueCopy(data: ItemData): void {
        this.nameCn = data.nameCn ? data.nameCn : this.nameCn;
        this.nameEn = data.nameEn;
        this.duration = data.duration;
        this.resName = data.resName;
        this.desc = data.desc;
      
    }
    public clone(): ItemData {
        let e = new ItemData();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.duration = this.duration;
        e.desc = this.desc;
        e.resName = this.resName;
        return e;
    }
}