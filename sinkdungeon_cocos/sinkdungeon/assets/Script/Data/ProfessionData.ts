import CommonData from "./CommonData";

export default class ProfessionData{
    private common:CommonData;
    id:number = 0;
    desc:string = '';
    nameCn: string = '';
    nameEn: string = '';
    equips:{[key:string]:string}={}
    talent: string = '';
    items: string[] = [];
    constructor(){
        this.common = new CommonData();
    }

    get Common(){
        return this.common;
    }
    public valueCopy(data: ProfessionData): void {
        this.common.valueCopy(data.common);
        this.nameCn = data.nameCn ? data.nameCn : this.nameCn;
        this.nameEn = data.nameEn?data.nameEn:this.nameEn;
        this.desc = data.desc?data.desc:this.desc;
        this.equips = data.equips?data.equips:{};
        this.id = data.id?data.id:0;
        this.talent = data.talent?data.talent:'';
        this.items = data.items?data.items:[];
    }
    public clone(): ProfessionData {
        let e = new ProfessionData();
        e.common = this.common.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.desc = this.desc;
        e.id = this.id;
        e.equips = this.equips;
        e.talent = this.talent;
        e.items = this.items;
        return e;
    }
}