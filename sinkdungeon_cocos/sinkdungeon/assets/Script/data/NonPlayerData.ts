import DamageData from './DamageData'
import StatusData from './StatusData'
import CommonData from './CommonData'
import DataUtils from '../utils/DataUtils'
import AvatarData from './AvatarData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class NonPlayerData {
    defaultPos: cc.Vec3
    nameCn: string = '' //名字
    nameEn: string = ''
    resName: string = '' //资源名字
    chapter: number = 0 //章节，如果为0所有章节都会出现
    stageLevel: number = 0 //关卡等级，如果为0所有level都会出现
    invisible: number = 0 //是否隐身，发起攻击或者冲刺的时候现形,攻击结束以后1s再次隐身,隐身状态下可以被攻击而且现形
    remote: number = 0 //是否远程大于0 远程会远离目标到一定范围 数字代表CD
    melee: number = 0 //是否近战大于0 近战会接近目标 数字代表CD
    dash: number = 0 //是否冲刺大于0 当距离够的时候会发起冲刺，往目标地点冲刺进行撞击 数字代表CD
    meleeDash: number = 0 //近战冲刺瞬时速度
    disguise: number = 0 //是否伪装大于0,数值为距离 伪装状态下不能移动和攻击，当接近的时候会恢复
    scale: number = 0 //1正常 怪物大小
    bulletType: string = '' //子弹类型
    bulletArcExNum = 0 //额外扇形喷射子弹数量,为0的时候不计入,最大18
    bulletLineExNum = 0 //额外线性喷射子弹数量，为0的时候不计入
    bulletLineInterval = 0 //线性喷射间隔时间（毫秒）
    bulletExSpeed = 0 //子弹额外速度
    specialBulletArcExNum = 0 //特殊额外扇形喷射子弹数量,为0的时候不计入,最大18
    specialBulletLineExNum = 0 //特殊额外线性喷射子弹数量，为0的时候不计入
    specialRemoteAngle: number = 0 //特殊额外子弹准度偏离范围
    isArcAim = 0 //是否是扇形瞄准
    isLineAim = 0 //是否是线性瞄准
    blink = 0 //是否闪烁大于0 数字代表cd
    isBoom = 0 //是否死亡爆炸
    isHeavy = 0 //是否很重 如果很重是转向的
    isStatic = 0 //是否是静态，静态物理属性固定无法移动
    isRecovery = 0 //是否生命回复
    shooterOffsetX = 0 //远程位置x
    shooterOffsetY = 0 //远程位置y
    specialAttack = 0 //是否特殊攻击大于0
    specialType = '' //特殊类型
    specialDistance = 0 //特殊类型位置x
    specialDelay = 0 //特殊攻击延迟放置时间
    specialDash = 0 //特殊攻击是否冲刺 冲刺瞬时速度
    dashJump = 0 //冲刺是否跳跃 数字代表速度
    bodyColor = '#ffffff'
    pos: cc.Vec3 = cc.v3(0, 0)
    currentHealth: number = 0
    /**box规格
     * 小型爬行的21x21 0:y32w80h64，站立的21x21 1:y48w48h96， 占满的21x21 2:y48w80h80，
     * 中等站立的32x32 3:y64w80h128，中等爬行的32x32 4:y32w128h48，大型站立或爬行的48x24 5:y48w128h96*/
    boxType = 0 //废弃
    attackType = 0 //近战攻击模式 0：普通 1：突刺 2：范围
    isEnemy = 0 //是否是敌人
    isFollow = 0 //是否跟随
    lifeTime = 0 //存活时间
    isTest = 0 //是否是测试单位
    reborn = 0 //是否是房间重生的数字代表重生等级
    attackFrames = 2 //攻击帧数
    specialFrames = 2 //特殊攻击帧数
    attackFrameKeyStart = 1 //攻击关键帧开始下标,默认0是准备帧
    specialFrameKeyStart = 1 //特殊攻击关键帧开始下标,默认0是准备帧
    attackFrameKeyEnd = 2 //攻击关键帧结束下标,默认2是结束，常规有些单位没有2
    specialFrameKeyEnd = 2 //特殊攻击关键帧结束下标
    remoteAudio = '' //远程音效
    specialAudio = '' //特殊攻击音效
    isPet = 0 //是否是宠物
    childResName = '' //共生子类资源名
    childMode = 0 //0当前单位死亡会导致其子类一起死亡 1子类全部死亡当前单位才会死亡
    childCount = 0 //子类个数
    flee = 0 //是否逃跑类型 逃跑类型优先远离玩家
    noLoot = 0 //是否没有掉落
    water = 0 //是否水生生物
    fly = 0 //飞
    bodyRect = '' //0,0,48,32,105身形 取代原来的bodyType和attackType
    attackRect = '' //-32,0,112,32,80攻击区域
    private statusTotalData: StatusData
    private common: CommonData
    private statusList: StatusData[]
    private avatar: AvatarData
    private finalCommon: CommonData
    private needUpdateFinalCommon = true
    constructor() {
        this.statusTotalData = new StatusData()
        this.common = new CommonData()
        this.statusList = new Array()
        this.avatar = new AvatarData()
        this.needUpdateFinalCommon = true
    }

    get StatusTotalData() {
        return this.statusTotalData
    }
    get Common() {
        return this.common
    }
    updateFinalCommon() {
        this.needUpdateFinalCommon = true
    }
    get FinalCommon() {
        if (this.needUpdateFinalCommon) {
            this.needUpdateFinalCommon = false
            this.finalCommon = new CommonData().add(this.common).add(this.statusTotalData.Common)
        }
        return this.finalCommon
    }
    get StatusList() {
        return this.statusList
    }
    set StatusList(list: StatusData[]) {
        if (!list) {
            return
        }
        this.statusList = new Array()
        for (let s of list) {
            let data = new StatusData()
            data.valueCopy(s)
            this.statusList.push(data)
        }
    }
    get AvatarData() {
        return this.avatar
    }
    set AvatarData(data: AvatarData) {
        this.avatar = data
    }
    public updateHA(currentHealth: number, maxHealth: number, attackPoint: number) {
        this.currentHealth = currentHealth
        this.common.maxHealth = maxHealth
        this.common.damageMin = attackPoint
    }
    public valueCopy(data: NonPlayerData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.common.valueCopy(data.common)
        this.avatar.valueCopy(data.avatar)
        this.StatusList = data.statusList
        this.pos = data.pos ? cc.v3(data.pos.x, data.pos.y) : cc.v3(0, 0)
        this.attackFrames = data.attackFrames ? data.attackFrames : 2
        this.specialFrames = data.specialFrames ? data.specialFrames : 2
        this.attackFrameKeyStart = data.attackFrameKeyStart ? data.attackFrameKeyStart : 1
        this.specialFrameKeyStart = data.specialFrameKeyStart ? data.specialFrameKeyStart : 1
        this.attackFrameKeyEnd = data.attackFrameKeyEnd ? data.attackFrameKeyEnd : 2
        this.specialFrameKeyEnd = data.specialFrameKeyEnd ? data.specialFrameKeyEnd : 2
        this.bodyColor = data.bodyColor ? data.bodyColor : '#ffffff'
        this.needUpdateFinalCommon = true
    }
    public clone(): NonPlayerData {
        let e = new NonPlayerData()
        e.valueCopy(this)
        return e
    }

    public getAttackPoint(): DamageData {
        let data = this.FinalCommon
        let dd = new DamageData()
        dd.realDamage = data.RealDamage
        dd.physicalDamage = data.DamageMin
        dd.magicDamage = data.MagicDamage
        if (dd.physicalDamage < 0) {
            dd.physicalDamage = 0
        }
        return dd
    }
    //伤害减免
    public getDamage(damageData: DamageData): DamageData {
        let data = this.FinalCommon
        let finalDamageData = damageData.clone()
        let defence = data.Defence
        let defecneMagic = data.magicDefenceRate
        //伤害=攻击*(1-(护甲*0.06)/(护甲*0.06+1))
        //伤害 = 攻击 + 攻击*(2-0.94^(-护甲))
        if (defence >= 0) {
            finalDamageData.physicalDamage = finalDamageData.physicalDamage * (1 - (defence * 0.06) / (defence * 0.06 + 1))
        } else {
            finalDamageData.physicalDamage = finalDamageData.physicalDamage * (2 - Math.pow(0.94, -defence))
        }
        finalDamageData.magicDamage = finalDamageData.magicDamage * (1 - defecneMagic / 100)
        return finalDamageData
    }

    //生命值
    public getHealth(): cc.Vec3 {
        let rate = 1
        let data = this.FinalCommon
        let maxHealth = data.MaxHealth
        if (maxHealth > 0) {
            rate = this.currentHealth / maxHealth
        } else {
            return cc.v3(1, 1)
        }
        return cc.v3(maxHealth * rate, maxHealth)
    }
}
