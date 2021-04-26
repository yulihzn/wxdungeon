import CommonData from "./CommonData";
import BaseData from "./BaseData";

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
    suitNames: string = '';//装备列表，逗号隔开
    desc: string = '';
    count:number = 0;
    private commonList:CommonData[] = [];
    private statusList:string[] = [];//状态列表，每组状态按逗号隔开
    constructor(){
        super();
    }

    get CommonList(){
        return this.commonList;
    }
    get StatusList(){
        return this.statusList;
    }
    public valueCopy(data:SuitData):void{
        if(!data){
            return;
        }
        this.statusList=data.statusList;
        for(let common of data.commonList){
            let c = new CommonData();
            c.valueCopy(common);
            this.commonList.push(c);
        }
        this.count = data.count?data.count:0;
        this.nameCn = data.nameCn?data.nameCn:'';
        this.nameEn = data.nameEn?data.nameEn:'';
        this.suitNames = data.suitNames?data.suitNames:'';
        this.desc = data.desc?data.desc:'';
    }
    public clone():SuitData{
        let e = new SuitData();
        let list = [];
        for(let common of this.commonList){
            let c = new CommonData();
            c.valueCopy(common);
            list.push(c);
        }
        e.commonList = list;
        e.statusList = this.statusList;
        e.nameCn = this.nameCn;
        e.nameEn = this.nameEn;
        e.count = this.count;
        e.suitNames = this.suitNames;
        e.desc = this.desc;
        return e;
    }
    
}
