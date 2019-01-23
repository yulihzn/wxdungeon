import CommonData from "./CommonData";

export default class TarotData {
    private common: CommonData;
    nameCn: string = '';
    nameEn: string = '';
    desc: string = '';
    spriteFrameName: string = '';
    index = 0;

    constructor() {
        this.common = new CommonData();
    }

    get Common() {
        return this.common;
    }
    public valueCopy(data: TarotData): void {
        this.common.valueCopy(data.common);
        this.nameCn = data.nameCn ? data.nameCn : this.nameCn;
        this.nameEn = data.nameEn ? data.nameEn : this.nameEn;
        this.index = data.index ? data.index : this.index;
        this.spriteFrameName = data.spriteFrameName;
        this.desc = data.desc;

    }
    public clone(): TarotData {
        let e = new TarotData();
        e.common = this.common.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.index = this.index;
        e.spriteFrameName = this.spriteFrameName;
        e.desc = this.desc;

        e.spriteFrameName = this.spriteFrameName;
        return e;
    }
}