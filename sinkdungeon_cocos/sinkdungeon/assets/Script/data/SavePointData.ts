import DataUtils from '../utils/DataUtils'

/**
 * 保存点
 *
 */
export default class SavePointData {
    x: number = 16 //下标x
    y: number = 16 //下标y
    chapter: number = 0 //章节
    level: number = 0 //关卡
    public valueCopy(data: SavePointData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.x = data.x || data.x == 0 ? data.x : 16
        this.y = data.y || data.y == 0 ? data.y : 16
        // this.chapter = data.chapter ? data.chapter : 0;
        // this.level = data.level ? data.level : 0;
    }
    public clone(): SavePointData {
        let data = new SavePointData()
        data.valueCopy(this)
        // data.x = this.x;
        // data.y = this.y;
        // data.chapter = this.chapter;
        // data.level = this.level;
        return data
    }
    static chapter01() {
        let data = new SavePointData()
        data.chapter = 1
        data.level = 0
        data.x = 17
        data.y = 15
        return data
    }
    static chapter02() {
        let data = new SavePointData()
        data.chapter = 2
        data.level = 0
        data.x = 27
        data.y = 51
        return data
    }
    static chapter03() {
        let data = new SavePointData()
        data.chapter = 3
        data.level = 0
        data.x = 16
        data.y = 28
        return data
    }
    static chapter04() {
        let data = new SavePointData()
        data.chapter = 4
        data.level = 0
        data.x = 38
        data.y = 71
        return data
    }
}
