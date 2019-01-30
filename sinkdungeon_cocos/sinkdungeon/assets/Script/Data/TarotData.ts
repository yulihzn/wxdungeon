import CommonData from "./CommonData";

export default class TarotData {
    private common: CommonData;
    nameCn: string = '';
    nameEn: string = '';
    desc: string = '';
    resName: string = '';
    index = 0;//下标0-21
    word1: string = '';
    word2: string = '';
    word3: string = '';
    word4: string = '';
    word5: string = '';
    word6: string = '';

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
        this.resName = data.resName?data.resName:this.resName;
        this.desc = data.desc;

    }
    public clone(): TarotData {
        let e = new TarotData();
        e.common = this.common.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.index = this.index;
        e.resName = this.resName;
        e.desc = this.desc;
        return e;
    }
}