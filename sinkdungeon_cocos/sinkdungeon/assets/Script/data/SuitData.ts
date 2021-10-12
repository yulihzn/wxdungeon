import CommonData from "./CommonData";
import BaseData from "./BaseData";
import EquipmentData from "./EquipmentData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class SuitData extends BaseData{
    nameCn: string = '';
    nameEn: string = '';
    suitType: string = '';
    suitNames:string = '';
    desc: string = '';
    count:number = 0;
    private equipList:EquipmentData[] = [];//叠加装备列表,不指定类型，只读取属性

    constructor(){
        super();
    }
    get EquipList(){
        return this.equipList;
    }
    
    public valueCopy(data:SuitData):void{
        if(!data){
            return;
        }
        for(let equip of data.equipList){
            let e = new EquipmentData();
            e.valueCopy(equip);
            this.equipList.push(e);
        }
        this.count = data.count?data.count:0;
        this.nameCn = data.nameCn?data.nameCn:'';
        this.nameEn = data.nameEn?data.nameEn:'';
        this.suitType = data.suitType?data.suitType:'';
        this.desc = data.desc?data.desc:'';
        this.suitNames = data.suitNames?data.suitNames:'';
    }
    public clone():SuitData{
        let e = new SuitData();
        let list = [];
        for(let equip of this.equipList){
            let eq = new EquipmentData();
            eq.valueCopy(equip);
            list.push(eq);
        }
        e.equipList = list;
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.count = this.count;
        e.suitType = this.suitType;
        e.desc = this.desc;
        e.suitNames = this.suitNames;
        return e;
    }
    
}
