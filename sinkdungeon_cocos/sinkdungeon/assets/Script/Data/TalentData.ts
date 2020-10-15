import CommonData from "./CommonData";

export default class TalentData{
    private common:CommonData;//角色属性调整
    desc:string = '';
    nameCn: string = '';
    nameEn: string = '';
    resName:string = '';//资源名

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
        this.desc = data.desc?data.desc:this.desc;
        this.resName = data.resName?data.resName:'';
    }
    public clone(): TalentData {
        let e = new TalentData();
        e.common = this.common.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.desc = this.desc;
        e.resName = this.resName;
        return e;
    }
}