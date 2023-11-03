import EquipmentData from './EquipmentData'
import DamageData from './DamageData'
import StatusData from './StatusData'
import CommonData from './CommonData'
import Random from '../utils/Random'
import AvatarData from './AvatarData'
import OilGoldData from './OilGoldData'
import TalentData from './TalentData'
import Shield from '../logic/Shield'
import LifeData from './LifeData'
import DataUtils from '../utils/DataUtils'
import ItemData from './ItemData'
import InventoryData from './InventoryData'
import BaseData from './BaseData'

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
 * AI玩家行为
 * 包含一个计划表，这个计划表有计划的坐标，时间，动作和交互，比如某个时间点到某个地点停下来会在指定次数下和坐标位置机关交互或者做出什么动作
 * 计划表的指定会根据npc的状态改变
 * npc会有几条固定的计划路线作为日常，如果玩家打断他们的作息表，比如赶往下一个坐标时错过时间段就会直接去再下一个目的地
 * npc还会有对应任务激活的时候的计划路线，这类任务的时刻表会覆盖日常表，最小单位是小时
 * 关于npc不在当前房间的情况，会根据走路速度来判断当前应该在的位置
 */
export default class PlayerBehaviorData extends BaseData {
    
    pos: cc.Vec3 = cc.v3(5, 5)
    posZ: number = 0
    roomPos: cc.Vec3 = cc.v3(0, 0)
    isWakeUp = false
    chapterIndex = 999
    chapterLevel = 999
    isEnemy = false



    public valueCopy(data: PlayerBehaviorData): PlayerBehaviorData {
        if (!data) {
            return this
        }
        DataUtils.baseCopy(this, data)
        
        return this
    }

    public clone(): PlayerBehaviorData {
        let e = new PlayerBehaviorData()
        e.valueCopy(this)
        return e
    }

    
    toJSON(): any {
        const { ...rest } = this
        return rest
    }
}
