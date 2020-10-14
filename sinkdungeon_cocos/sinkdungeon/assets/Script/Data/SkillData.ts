import CommonData from "./CommonData";
import DamageData from "./DamageData";

export default class SkillData{
    private common:CommonData;//角色属性调整
    id:number = 0;
    desc:string = '';
    nameCn: string = '';
    nameEn: string = '';
    organization = 0;//组织
    passive = 0;//是否被动
    target = 0;//作用目标0：自己， 1：敌人， 2：全部
    status = '';//附加状态
    castMode = 0;//施法方式:0释放 1激活 
    children:string[] = [];
    damage:DamageData;

    constructor(){
        this.common = new CommonData();
        this.damage = new DamageData();
    }

    get Common(){
        return this.common;
    }
    get Damage(){
        return this.damage;
    }
    public valueCopy(data: SkillData): void {
        this.common.valueCopy(data.common);
        this.damage.valueCopy(data.damage);
        this.nameCn = data.nameCn ? data.nameCn : this.nameCn;
        this.nameEn = data.nameEn?data.nameEn:this.nameEn;
        this.desc = data.desc?data.desc:this.desc;
        this.id = data.id?data.id:0;
    }
    public clone(): SkillData {
        let e = new SkillData();
        e.common = this.common.clone();
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.desc = this.desc;
        e.id = this.id;
        return e;
    }
}