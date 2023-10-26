import DataUtils from '../utils/DataUtils'
import CommonData from './CommonData'

export default class TalentData {
    private common: CommonData //角色属性调整
    desc: string = ''
    nameCn: string = ''
    nameEn: string = ''
    resName: string = '' //资源名
    cooldown: number = 0
    passive: number = 0 //是否被动，0是主动
    lastTime = 0 //上次使用时间
    cost: number = 1 //消耗
    storePoint: number = 0 //当前技能拥有点数

    useCount = 0 //使用次数

    constructor() {
        this.common = new CommonData()
    }

    get Common() {
        return this.common
    }

    public valueCopy(data: TalentData): void {
        if (!data) {
            return
        }
        let nameCn = this.nameCn
        let nameEn = this.nameEn
        let desc = this.desc
        DataUtils.baseCopy(this, data)
        this.common.valueCopy(data.common)
        this.nameCn = data.nameCn ? data.nameCn : nameCn
        this.nameEn = data.nameEn ? data.nameEn : nameEn
        this.desc = data.desc ? data.desc : desc
        // this.resName = data.resName ? data.resName : '';
        // this.cooldown = data.cooldown ? data.cooldown : 0;
        // this.passive = data.passive ? data.passive : 0;
        this.storePoint = data.storePoint || data.storePoint == 0 ? data.storePoint : 1
        this.cost = data.cost || data.cost == 0 ? data.cost : 1
        // this.useCount = data.useCount?data.useCount:0;
        // this.lastTime = data.lastTime?data.lastTime:0;
    }
    public clone(): TalentData {
        let e = new TalentData()
        e.valueCopy(this)
        // e.common = this.common.clone();
        // e.nameCn = this.nameCn;
        // e.nameEn = this.nameEn;
        // e.desc = this.desc;
        // e.resName = this.resName;
        // e.cooldown = this.cooldown;
        // e.passive = this.passive;
        // e.lastTime = this.lastTime;
        // e.storePoint = this.storePoint;
        // e.cost = this.cost;
        // e.useCount = this.useCount;
        return e
    }
    toJSON(): any {
        const { ...rest } = this
        for (const key in rest) {
            if (rest.hasOwnProperty(key) && (rest[key] === 0 || rest[key] === '')) {
                delete rest[key]
            }
        }
        return rest
    }
}
