import DataUtils from '../utils/DataUtils'
import CommonData from './CommonData'

export default class ProfessionData {
    private common: CommonData
    id: number = 0
    desc: string = ''
    nameCn: string = ''
    nameEn: string = ''
    equips: { [key: string]: string } = {}
    talent: string = ''
    items: string[] = []
    constructor() {
        this.common = new CommonData()
    }

    get Common() {
        return this.common
    }
    public valueCopy(data: ProfessionData): void {
        if (!data) {
            return
        }
        let name = this.nameCn
        DataUtils.baseCopy(this, data, true)
        this.common.valueCopy(data.common)
        this.nameCn = data.nameCn ? data.nameCn : name
        this.equips = data.equips ? data.equips : {}
        this.items = data.items ? data.items : []
    }
    public clone(): ProfessionData {
        let e = new ProfessionData()
        e.valueCopy(this)
        return e
    }
}
