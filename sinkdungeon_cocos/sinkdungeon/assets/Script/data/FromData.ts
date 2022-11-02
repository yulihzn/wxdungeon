import DataUtils from '../utils/DataUtils'

export default class FromData {
    name: string = ''
    res: string = ''
    id: number = 0
    public valueCopy(data: FromData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        // this.name = data.name ? data.name : '';
        // this.res = data.res ? data.res : '';
        // this.id = data.id?data.id:0;
    }
    public static getClone(name: string, res: string, id?: number): FromData {
        let e = new FromData()
        e.name = name
        e.res = res
        e.id = id
        return e
    }
    public clone(): FromData {
        let e = new FromData()
        e.valueCopy(this)
        // e.name = this.name;
        // e.res = this.res;
        // e.id = this.id;
        return e
    }
}
