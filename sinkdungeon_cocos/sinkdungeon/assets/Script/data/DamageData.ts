// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import DataUtils from '../utils/DataUtils'

/**
 * 状态
 * 负面：冰冻、燃烧、减速、中毒、诅咒、流血、道具
 * 正面：祝福、道具、天赋
 */
export default class DamageData {
    realDamage: number = 0 //真实伤害
    physicalDamage: number = 0 //物理伤害
    magicDamage: number = 0 //魔法伤害
    realRate = 0 //真实伤害释放几率
    iceRate = 0 //冰元素释放几率
    fireRate = 0 //火元素释放几率
    lighteningRate = 0 //雷元素释放几率
    toxicRate = 0 //毒元素释放几率
    curseRate = 0 //诅咒元素释放几率
    stoneRate = 0 //石化释放几率(目前仅限于boss眼魔激光使用)
    isCriticalStrike = false
    isBackAttack = false //背刺
    isRemote = false //远程
    isStab = false //刺
    isFar = false //近程
    isFist = false //空手
    isBlunt = false //钝器
    isMelee = false //是否近战
    comboType = 0 //连击级别

    constructor(realDamage?: number) {
        this.realDamage = realDamage ? realDamage : 0
    }

    public valueCopy(data: DamageData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
    }

    public clone(): DamageData {
        let e = new DamageData()
        e.valueCopy(this)
        return e
    }
    public getTotalDamage(): number {
        let d = this.physicalDamage + this.magicDamage + this.realDamage
        if (isNaN(d)) {
            console.log(d)
            d = 0
        }
        return d
    }
}
