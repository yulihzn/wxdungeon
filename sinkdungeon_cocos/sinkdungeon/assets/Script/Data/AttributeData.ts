export default class AttributeData{
    name:string = '';
    id:number = 0;
    resName:string = '';
    constructor(id:number,name:string,resName:string){
        this.id = id;
        this.name = name;
        this.resName = resName;
    }
}