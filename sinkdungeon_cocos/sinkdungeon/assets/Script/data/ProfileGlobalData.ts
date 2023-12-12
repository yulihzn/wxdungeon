import DataUtils from '../utils/DataUtils'

/**全局存档保存数据

 */
export default class ProfileGlobalData {
    realCoin = 0
    public valueCopy(data: ProfileGlobalData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data, true)
    }
    public clone(): ProfileGlobalData {
        let e = new ProfileGlobalData()
        e.valueCopy(this)
        return e
    }
}
