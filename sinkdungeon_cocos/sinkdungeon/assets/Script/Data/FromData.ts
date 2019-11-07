export default class FromData{
    name:string;
    res:string;
    public valueCopy(data: FromData): void {
        if(!data){
            return;
        }
        this.name = data.name ? data.name : '';
        this.res = data.res ? data.res : '';
    }
    public static getClone(name:string,res:string):FromData{
        let e = new FromData();
        e.name = name;
        e.res = res;
        return e;
    }
    public clone(): FromData {
        let e = new FromData();
        e.name = this.name;
        e.res = this.res;
        return e;
    }
}