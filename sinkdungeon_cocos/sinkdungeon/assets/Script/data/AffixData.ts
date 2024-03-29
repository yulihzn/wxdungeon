import DataUtils from '../utils/DataUtils'
import CommonData from './CommonData'

export default class AffixData {
    name = '' //名称
    desc = '' //描述
    index = 0 //下标 强度需要+1
    groupId = 0 //组id
    factor = 0 //等级系数额外百分比
    type = 0 //0：基础属性 1：元素属性 2：全局属性
    common: CommonData = new CommonData()
    public valueCopy(data: AffixData): AffixData {
        if (!data) {
            return this
        }
        DataUtils.baseCopy(this, data)
        this.common.valueCopy(data.common)
        return this
    }

    public clone(): AffixData {
        let e = new AffixData()
        e.valueCopy(this)
        return e
    }
}
