import CommonData from './CommonData'
import BaseData from './BaseData'
import TriggerData from './TriggerData'
import DataUtils from '../utils/DataUtils'
import AffixData from './AffixData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class EquipmentData extends BaseData {
    uuid: string = '' //唯一标识，用来存档
    id: number = 10000000 //装备类型id，用来排序前四位为大类别后四位为装备贴图id
    pos: cc.Vec3 = cc.v3(0, 0) //下标
    mapKeyPos: string = '' //地图下标，该值只有地图放置的装备才有 '0,0'用来匹配是否加载装备
    quality = 0 //品质 0：白 1：绿 2：蓝 3：紫 4：金 5：橙 6：红
    nameCn: string = ''
    nameEn: string = ''
    equipmetType: string = 'empty'
    equipmetTypeCn: string = ''
    desc: string = ''
    color: string = '#ffffff'
    lightcolor: string = '#ffffff' //刀光的颜色
    titlecolor: string = '#ffffff'
    img: string = 'emptyequipment'
    requireLevel = 0
    stab = 0 //是否突刺
    far = 0 //是否远距离
    blunt = 0 //是否钝器
    isLocked = 0 //是否锁定
    isReflect = 0 //子弹偏转 仅限近战武器
    trouserslong = 0 //是否长裤
    bulletType = '' //子弹类别
    bulletSize = 0 //子弹增加大小 为0代表不改变 1代表加一倍
    bulletArcExNum = 0 //额外扇形喷射子弹数量,为0的时候不计入,最大18,超过的话是一个固定圆，为80的时候是个八方向
    bulletArcOffsetX = 0 //扇形发射距离
    bulletLineExNum = 0 //额外线性喷射子弹数量，为0的时候不计入
    bulletLineInterval = 0 //线性喷射间隔时间（秒）
    exBulletOffsetX = 0 //额外子弹偏移x
    bulletExSpeed = 0 //子弹额外速度
    showShooter = 0 //是否显示发射器
    isHeavy = 0 //是否是重型武器比如 激光,具体影响是开枪时候移动减速 大盾牌 影响举盾速度
    isLineAim = 0 //是否是线性瞄准
    hideHair = 0 //是否隐藏头发
    /**额外效果列表 */
    exTriggers: TriggerData[] = []
    affixs: AffixData[] = [] //随机词缀
    ignoreTrap = 0 //无视尖刺伤害
    remoteAudio = '' //远程音效
    exBeatBack = 0 //额外击退
    test = 0 //测试用武器，测试用武器在有刷新点的情况下不保存
    canUse: number = 0 //是否能使用
    lastTime = 0 //上次使用时间
    cooldown: number = 0 //冷却

    price: number = 0

    private common: CommonData
    private finalCommon: CommonData

    info1: string = ''
    info2: string = ''
    info3: string = ''
    extraInfo: string = ''
    suitType = '' //套装资源名
    suit1: string = ''
    suit2: string = ''
    suit3: string = ''
    infobase: string = ''
    infocolor1: string = '#ffffff'
    infocolor2: string = '#ffffff'
    infocolor3: string = '#ffffff'
    suitcolor1: string = '#ffffff'
    suitcolor2: string = '#ffffff'
    suitcolor3: string = '#ffffff'
    infobasecolor: string = '#ffffff'
    anim = 0 //是否有动画，数字代表帧数
    constructor() {
        super()
        this.common = new CommonData()
        this.finalCommon = new CommonData()
    }

    get FinalCommon() {
        return this.finalCommon
    }
    get Common() {
        return this.common
    }
    public valueCopy(data: EquipmentData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        // this.uuid = data.uuid ? data.uuid : '';
        this.id = data.id ? data.id : 10000000
        this.pos = data.pos ? cc.v3(data.pos.x, data.pos.y) : cc.v3(0, 0)
        this.common.valueCopy(data.common)
        this.color = data.color ? data.color : '#ffffff'
        this.titlecolor = data.titlecolor ? data.titlecolor : '#ffffff'
        this.lightcolor = data.lightcolor ? data.lightcolor : '#ffffff'
        this.img = data.img ? data.img : 'emptyequipment'
        this.infocolor1 = data.infocolor1 ? data.infocolor1 : '#ffffff'
        this.infocolor2 = data.infocolor2 ? data.infocolor2 : '#ffffff'
        this.infocolor3 = data.infocolor3 ? data.infocolor3 : '#ffffff'
        this.suitcolor1 = data.suitcolor1 ? data.suitcolor1 : '#ffffff'
        this.suitcolor2 = data.suitcolor2 ? data.suitcolor2 : '#ffffff'
        this.suitcolor3 = data.suitcolor3 ? data.suitcolor3 : '#ffffff'
        this.infobasecolor = data.infobasecolor ? data.infobasecolor : '#ffffff'
        this.exTriggers = []
        if (data.exTriggers) {
            for (let ex of data.exTriggers) {
                let d = new TriggerData()
                d.valueCopy(ex)
                this.exTriggers.push(d)
            }
        }
        this.affixs = DataUtils.copyListValue(data.affixs, arg0 => {
            return new AffixData().valueCopy(arg0)
        })
        this.updateFinalCommon()
    }
    updateFinalCommon() {
        this.finalCommon = new CommonData()
        this.finalCommon.add(this.common)
        for (let affix of this.affixs) {
            this.finalCommon.add(affix.common)
        }
    }
    public clone(): EquipmentData {
        let e = new EquipmentData()
        e.valueCopy(this)
        return e
    }
    public add(data: EquipmentData): EquipmentData {
        this.common = this.common.clone().add(data.common)
        this.ignoreTrap = this.ignoreTrap + data.ignoreTrap
        this.exBeatBack = this.exBeatBack + data.exBeatBack
        for (let ex of data.exTriggers) {
            this.exTriggers.push(ex)
        }
        for (let affix of data.affixs) {
            this.affixs.push(affix)
        }
        return this
    }
    toJSON(): any {
        const { finalCommon, ...rest } = this
        return rest
    }
}
