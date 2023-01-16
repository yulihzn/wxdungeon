import DataUtils from '../../utils/DataUtils'
import QuestConditionData from './QuestConditionData'

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
    static readonly TYPE_ROOT = 0
    static readonly TYPE_SUCCESS = 1
    static readonly TYPE_FAIL = 2
    triggerCondition: QuestConditionData = new QuestConditionData() //触发条件
    successCondition: QuestConditionData = new QuestConditionData() //完成条件
    failCondition: QuestConditionData = new QuestConditionData() //失败条件
    status = QuestData.STATUS_INIT
    id = '' //id
    name = '' //名字
    content = '' //内容
    icon = '' //任务图标
    iconLarge = '' //任务图标
    mapThingsList = '' //指定地图刷出物品.npc以及地图元素列表item000,0,0,0,0,0,0;npc000,0,0,0,0,0,0;z1,0,0,0,0,0
    startTime = 0 //任务开始时间
    mapThingsCreated = false //地图物品npc已刷新
    reward: QuestConditionData = new QuestConditionData()

    indexId = 'r0' //下标 s0  f0
    //下标 s0,f0,s0,f0 r0
    parentId: string = 'e0' //父节点id
    successList: QuestData[] = [] //成功子节点列表
    failList: QuestData[] = [] //失败子节点列表

    editPos: cc.Vec3 = cc.v3(0, 0) //editor

    isTracked = false //是否追踪

    get isSuccessType() {
        return this.indexId.indexOf('s') != -1
    }
    valueCopy(data: QuestData) {
        if (!data) {
            return this
        }
        DataUtils.baseCopy(this, data)
        this.triggerCondition.valueCopy(data.triggerCondition)
        this.successCondition.valueCopy(data.successCondition)
        this.failCondition.valueCopy(data.failCondition)
        this.reward.valueCopy(data.reward)
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
        this.editPos = data.editPos ? cc.v3(data.editPos.x, data.editPos.y) : cc.v3(0, 0)
        return this
    }
    clone(): QuestData {
        let e = new QuestData()
        e.valueCopy(this)
        return e
    }
}
