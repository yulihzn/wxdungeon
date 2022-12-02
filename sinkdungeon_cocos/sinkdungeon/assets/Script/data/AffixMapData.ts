import DataUtils from '../utils/DataUtils'

export default class AffixMapData {
    desc = '' //描述
    id = 0 //id
    factor = 0 //等级系数
    affixs: string[] = [] //词缀名
    levels = [] //词缀强度数值
    common = '' //common的属性名
    public valueCopy(data: AffixMapData): AffixMapData {
        if (!data) {
            return this
        }
        DataUtils.baseCopy(this, data)
        DataUtils.copyListValue(this.affixs, data.affixs, arg0 => {
            return arg0 ? arg0 : ''
        })
        return this
    }

    public clone(): AffixMapData {
        let e = new AffixMapData()
        e.valueCopy(this)
        return e
    }
}
