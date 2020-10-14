import CommonData from "./CommonData";

export default class ProfessionData{
    private common:CommonData;
    id:number = 0;
    desc:string = '';
    nameCn: string = '';
    nameEn: string = '';
    weapon: string = '';
    remote: string = '';
    shield: string = '';
    helmet: string = '';
    clothes: string = '';
    cloak: string = '';
    trousers: string = '';
    shoes: string = '';
    gloves: string = '';
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
        this.weapon = data.weapon?data.weapon:'';
        this.remote = data.remote?data.remote:'';
        this.shield = data.shield?data.shield:'';
        this.helmet = data.helmet?data.helmet:'';
        this.cloak = data.cloak?data.cloak:'';
        this.shoes = data.shoes?data.shoes:'';
        this.clothes = data.clothes?data.clothes:'';
        this.gloves = data.gloves?data.gloves:'';
        this.trousers = data.trousers?data.trousers:'';
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
        e.weapon = this.weapon;
        e.remote = this.remote;
        e.shield = this.shield;
        e.helmet = this.helmet;
        e.clothes = this.clothes;
        e.cloak = this.cloak;
        e.trousers = this.trousers;
        e.shoes = this.shoes;
        e.gloves = this.gloves;
        e.talent = this.talent;
        e.items = this.items;
        return e;
    }
}