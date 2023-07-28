import DataUtils from '../utils/DataUtils'
import BaseData from './BaseData'
import CommonData from './CommonData'
import TriggerData from './TriggerData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 物品
 */
export default class ItemData extends BaseData {
    uuid: string = '' //唯一标识，用来存档
    id: number = 20000000 //装备类型id，用来排序前四位为大类别后四位为装备贴图id
    pos: cc.Vec3 = cc.v3(0, 0) //下标
    nameCn: string = ''
    nameEn: string = ''
    duration: number = 0 //持续时间
    desc: string = '' //描述
    info: string = '' //功能介绍
    resName: string = 'emptyitem'
    price: number = 0
    isTaken = false
    count = 1 //使用次数，-1为不限使用次数,1为一次性
    cooldown = 1 //冷却时间
    statusList: string = ''
    canSave = 0
    sanity: number = 0 //神志
    solidSatiety: number = 0 //饱腹值
    liquidSatiety: number = 0 //解渴值
    lastTime = 0 //上次使用时间
    /**额外效果列表 */
    exTriggers: TriggerData[] = []
    private common: CommonData
    constructor() {
        super()
        this.common = new CommonData()
    }

    get Common() {
        return this.common
    }
    public valueCopy(data: ItemData): ItemData {
        if (!data) {
            return this
        }
        let name = this.nameCn
        DataUtils.baseCopy(this, data)
        // this.uuid = data.uuid ? data.uuid : '';
        this.id = data.id ? data.id : 20000000
        this.common.valueCopy(data.common)
        this.pos = data.pos ? cc.v3(data.pos.x, data.pos.y) : cc.v3(0, 0)
        this.nameCn = data.nameCn ? data.nameCn : name
        // this.nameEn = data.nameEn;
        // this.duration = data.duration;
        this.resName = data.resName ? data.resName : 'emptyitem'
        // this.info = data.info ? data.info : '';
        // this.desc = data.desc ? data.desc : '';
        // this.isTaken = data.isTaken ? data.isTaken : false;
        // this.canSave = data.canSave ? data.canSave : 0;
        this.count = data.count ? data.count : 1
        this.cooldown = data.cooldown ? data.cooldown : 1
        // this.price = data.price ? data.price : 0;
        // this.statusList = data.statusList ? data.statusList : '';
        // this.sanity = data.sanity?data.sanity:0;
        // this.solidSatiety = data.solidSatiety?data.solidSatiety:0;
        // this.liquidSatiety = data.liquidSatiety?data.liquidSatiety:0;
        this.exTriggers = data.exTriggers ? data.exTriggers : []
        // this.lastTime = data.lastTime?data.lastTime:0;
        return this
    }
    public clone(): ItemData {
        let e = new ItemData()
        e.valueCopy(this)
        return e
    }
}
