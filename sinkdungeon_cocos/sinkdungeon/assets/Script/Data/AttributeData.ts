export default class AttributeData{
    name:string = '';
    id:number = 0;
    resName:string = '';
    desc:string = '';
    constructor(id:number,name:string,resName:string,desc:string){
        this.id = id;
        this.name = name;
        this.resName = resName;
        this.desc = desc;
    }
}