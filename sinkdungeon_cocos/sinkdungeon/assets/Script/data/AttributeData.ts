export default class AttributeData{
    name:string = '';
    id:number = 0;
    resName:string = '';
    desc:string = '';
    name1  = '';
    desc1 = '';
    constructor(id:number,name:string,resName:string,desc:string,name1:string,desc1:string){
        this.id = id;
        this.name = name;
        this.resName = resName;
        this.desc = desc;
        this.desc1 = desc1;
        this.name1 = name1;
    }
}