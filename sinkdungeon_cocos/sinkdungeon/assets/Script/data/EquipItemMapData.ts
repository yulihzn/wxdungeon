import DataUtils from '../utils/DataUtils'

export default class EquipItemMapData {
    fromRoomPos = cc.v3(0, 0)
    fromPos = cc.v3(0, 0)
    resName = ''
    valueCopy(data: EquipItemMapData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.fromRoomPos = data.fromRoomPos ? cc.v3(data.fromRoomPos.x, data.fromRoomPos.y) : cc.v3(0, 0)
        this.fromPos = data.fromPos ? cc.v3(data.fromPos.x, data.fromPos.y) : cc.v3(0, 0)
    }
    clone(): EquipItemMapData {
        let data = new EquipItemMapData()
        data.valueCopy(this)
        return data
    }
}
