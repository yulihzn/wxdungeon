import DataUtils from '../utils/DataUtils'

export default class FromData {
    name: string = '' //名字
    res: string = '' //贴图名
    seed: number = 0 //随机种子（主要用来统计每一个nonplayer击杀玩家次数
    pos: cc.Vec3 //伤害来源的坐标
    public valueCopy(data: FromData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
    }
    public static getClone(name: string, res: string, pos: cc.Vec3, seed?: number): FromData {
        let e = new FromData()
        e.name = name
        e.res = res
        e.seed = seed
        e.pos = cc.v3(pos.x, pos.y)
        return e
    }
    public clone(): FromData {
        let e = new FromData()
        e.valueCopy(this)
        return e
    }
}
