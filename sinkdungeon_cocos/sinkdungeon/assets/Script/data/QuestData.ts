import DataUtils from '../utils/DataUtils'
import QuestConditionData from './QuestConditionData'
import QuestRewardData from './QuestRewardData'

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
 * 任务数据
 * 关联影响：指定地点刷出物品，npc，改变指定npc对话
 */
export default class QuestData {
    static readonly STATUS_INIT = 0
    static readonly STATUS_RUNNING = 1
    static readonly STATUS_SUCCESS = 2
    static readonly STATUS_FAILED = 3
    static readonly STATUS_DISCARD = 4
    triggerCondition: QuestConditionData = new QuestConditionData() //触发条件
    successCondition: QuestConditionData = new QuestConditionData() //完成条件
    failCondition: QuestConditionData = new QuestConditionData() //失败条件
    status = QuestData.STATUS_INIT
    id = '' //id
    name = '' //名字
    content = '' //内容
    mapThingsList = '' //指定地图刷出物品和npc列表item000,0,0,0,0,0,0;npc000,0,0,0,0,0,0;
    startTime = 0 //任务开始时间
    mapThingsCreated = false //地图物品npc已刷新
    reward: QuestRewardData = new QuestRewardData()

    parent: QuestData //父节点
    successList: QuestData[] = [] //成功子节点列表
    failList: QuestData[] = [] //失败子节点列表
    valueCopy(data: QuestData) {
        if (!data) {
            return this
        }
        DataUtils.baseCopy(this, data)
        this.triggerCondition.valueCopy(data.triggerCondition)
        this.successCondition.valueCopy(data.successCondition)
        this.failCondition.valueCopy(data.failCondition)
        this.reward.valueCopy(data.reward)
        this.parent.valueCopy(data.parent)
        if (data.successList) {
            this.successList = []
            for (let c of data.successList) {
                this.successList.push(new QuestData().valueCopy(c))
            }
        }
        if (data.failList) {
            this.failList = []
            for (let c of data.failList) {
                this.failList.push(new QuestData().valueCopy(c))
            }
        }
        return this
    }
    clone(): QuestData {
        let e = new QuestData()
        e.valueCopy(this)
        return e
    }
}
