import CommonData from "./CommonData";

export default class WordData {
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
    public valueCopy(data: WordData): void {
        this.common.valueCopy(data.common);
        this.nameCn = data.nameCn ? data.nameCn : this.nameCn;
        this.nameEn = data.nameEn ? data.nameEn : this.nameEn;
        this.index = data.index ? data.index : this.index;
        this.spriteFrameName = data.spriteFrameName;
        this.desc = data.desc;

    }
    public clone(): WordData {
        let e = new WordData();
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