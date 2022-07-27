import DataUtils from '../utils/DataUtils'
import EquipmentData from './EquipmentData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class EquipmentStringData {
    nameCn: string = ''
    nameEn: string = ''
    equipmetType: string = 'empty'
    desc: string = ''
    img: string = 'emptyequipment'

    maxHealth: number = 0 //最大生命
    maxDream: number = 0 //最大梦境值
    damageMin: number = 0 //最小攻击
    damageMax: number = 0 //最大攻击
    criticalStrikeRate: number = 0 //暴击
    defence: number = 0 //物理防御
    lifeDrain: number = 0 //吸血
    damageBack: number = 0 //生命回复
    moveSpeed: number = 0 //移速
    attackSpeed: number = 0 //攻速
    jumpSpeed: number = 0 //跳速
    jumpHeight: number = 0 //跳跃高度
    dodge: number = 0 //闪避
    remoteCooldown: number = 0 //远程冷却或者充能时间
    remoteDamage: number = 0 //远程攻击
    remoteCritRate: number = 0 //远程暴击
    remoteInterval: number = 0 //远程子弹间隔

    realDamage = 0 //真实伤害
    realRate = 0 //真实伤害几率
    magicDamage = 0 //魔法伤害
    magicDefence = 0 //魔法抗性
    iceRate = 0 //冰元素几率
    fireRate = 0 //火元素几率
    lighteningRate = 0 //雷元素几率
    toxicRate = 0 //毒元素几率
    curseRate = 0 //诅咒元素几率

    stab = 0 //是否突刺
    far = 0 //是否远距离
    trouserslong = 0 //是否长裤
    bulletType = '' //子弹类别
    bulletSize = 0 //子弹增加大小 为0代表不改变 1代表加一倍
    bulletArcExNum = 0 //额外扇形喷射子弹数量,为0的时候不计入,最大18
    bulletLineExNum = 0 //额外线性喷射子弹数量，为0的时候不计入
    bulletLineInterval = 0 //线性喷射间隔时间（秒）
    showShooter = 0 //是否显示发射器
    isHeavy = 0 //是否是重型武器比如激光,具体影响是开枪时候减速
    isLineAim = 0 //是否是线性瞄准
    hideHair = 0 //是否隐藏头发
    bulletExSpeed = 0 //子弹额外速度

    constructor() {}

    public valueCopy(data: EquipmentData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.img = data.img ? data.img : 'emptyequipment'
    }
    public valueCopySelf(data: EquipmentStringData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.img = data.img ? data.img : 'emptyequipment'
    }
    public clone(): EquipmentStringData {
        let e = new EquipmentStringData()
        e.valueCopySelf(this)
        return e
    }
}
