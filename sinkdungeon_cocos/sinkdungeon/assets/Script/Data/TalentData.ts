import CommonData from "./CommonData";

export default class TalentData{
    private common:CommonData;
    id:number = 0;
    nameCn: string = '';
    nameEn: string = '';
    constructor(){
        this.common = new CommonData();
    }

    get Common(){
        return this.common;
    }
    public valueCopy(data: TalentData): void {
        this.common.valueCopy(data.common);
        this.nameCn = data.nameCn ? data.nameCn : this.nameCn;
        this.nameEn = data.nameEn?data.nameEn:this.nameEn;
        this.id = data.id?data.id:0;
    }
    public clone(): TalentData {
        let e = new TalentData();
        e.common = this.common.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.id = this.id;
        return e;
    }
}