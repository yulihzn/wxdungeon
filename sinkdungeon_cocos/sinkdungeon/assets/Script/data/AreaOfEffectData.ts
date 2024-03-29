import DataUtils from '../utils/DataUtils'
import IndexZ from '../utils/IndexZ'
import DamageData from './DamageData'
import FromData from './FromData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class AreaOfEffectData {
    duration = 0 //存活时间 秒
    interval = 0.1 //频率
    delay = 0
    scale = 0
    zIndex = IndexZ.ACTOR
    isRotate = false //是否旋转
    isFromEnemy = false //是否来自敌人
    canBreakBuilding = false //是否破坏建筑
    canBreakBullet = false //是否破坏子弹
    canBeatBack = false //是否击退或者反弹
    damage: DamageData = new DamageData() //伤害
    from: FromData = new FromData() //来源
    statusList: string[] = []
    init(
        duration: number,
        interval: number,
        delay: number,
        scale: number,
        zIndex: number,
        isFromEnemy: boolean,
        canBreakBuilding: boolean,
        canBreakBullet: boolean,
        canBeatBack: boolean,
        isRotate: boolean,
        damage: DamageData,
        from: FromData,
        statusList: string[]
    ): AreaOfEffectData {
        this.duration = duration
        this.delay = delay
        this.interval = interval
        this.scale = scale
        this.zIndex = zIndex
        this.isFromEnemy = isFromEnemy
        this.canBreakBuilding = canBreakBuilding
        this.canBreakBullet = canBreakBullet
        this.canBeatBack = canBeatBack
        this.isRotate = isRotate
        this.damage = damage
        this.from = from
        this.statusList = statusList
        return this
    }
    valueCopy(data: AreaOfEffectData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.interval = data.interval ? data.interval : 0.1
        this.zIndex = data.zIndex ? data.zIndex : IndexZ.ACTOR
        this.statusList = data.statusList ? data.statusList : []
        this.damage.valueCopy(data.damage)
        this.from.valueCopy(data.from)
    }
    clone(): AreaOfEffectData {
        let e = new AreaOfEffectData()
        e.valueCopy(this)
        return e
    }
}
