import DataUtils from '../utils/DataUtils'

/**
 * 地面翠金碎片
 *
 */
export default class GroundOilGoldData {
    x: number = 0 //房间下标x
    y: number = 0 //房间下标y
    chapter: number = 0 //章节
    level: number = 0 //关卡
    value: number = 0 //数量
    public valueCopy(data: GroundOilGoldData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
    }
    public clone(): GroundOilGoldData {
        let data = new GroundOilGoldData()
        data.valueCopy(this)
        return data
    }
}
