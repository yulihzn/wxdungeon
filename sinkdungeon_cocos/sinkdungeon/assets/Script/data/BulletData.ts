import DataUtils from '../utils/DataUtils'
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

export default class BulletData {
    speed: number = 0 //移动速度
    isRect = 0 //碰撞体是否是矩形
    isRotate = 0 //是否旋转
    rotateAngle = 0 //每0.3s旋转角度默认15
    isLaser = 0 //是否是激光
    laserRange = 0 //激光长度
    isDecelerate = 0 //是否减速
    decelerateDelta = 0 //减速系数
    delayDecelerate = 0 //延迟减速
    isBoom = 0 //是否爆炸1 2
    isPhysical = 0 //是否有碰撞
    delaytrack = 0 //延迟追踪s
    isTracking = 0 //是否跟踪 不能和激光同时存在 激光大于跟踪
    lifeTime = 0 //存活时间 秒
    size = 1 //子弹大小
    resName = '' //子弹贴图
    lightName = '' //子弹消失的光芒
    lightColor: string = '#ffffff' //子弹颜色
    fixedRotation = 0 //是否固定方向
    statusType: string = '' //附加状态
    statusRate = 0 //状态几率
    canBreakBuilding = 0 //是否可以打破部分建筑
    isInvincible = 0 //是否无敌，无法被主动销毁
    splitBulletType = '' //分裂子弹名
    splitTime = 0 //分裂时间 如果为0表示不分裂
    splitArcExNum = 0 //分裂额外扇形
    splitLineExNum = 0 //分裂额外线形
    damage: DamageData = new DamageData()
    from: FromData = new FromData() //来源
    hitAudio = '' //击中音效
    valueCopy(data: BulletData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.size = data.size ? data.size : 1
        this.lightColor = data.lightColor ? data.lightColor : '#ffffff'
        this.damage.valueCopy(data.damage)
        this.from.valueCopy(data.from)
    }
    clone(): BulletData {
        let e = new BulletData()
        e.valueCopy(this)
        return e
    }
}
