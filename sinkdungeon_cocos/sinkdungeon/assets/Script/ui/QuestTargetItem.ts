import AudioPlayer from '../utils/AudioPlayer'
import QuestTreeData from '../editor/data/QuestTreeData'
import Logic from '../logic/Logic'
import QuestBoardDialog from './dialog/QuestBoardDialog'
import QuestData from '../editor/data/QuestData'
import QuestTargetData from '../editor/data/QuestTargetData'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator
/**
 * 任务选项 图标和标题组成
 * 任务按设定分为不同的支线且对应不同图标
 * 主线：吸收翠金力量一步一步变强最后选择关闭通道或者成为通道
 * 弥世逐流：偏向于帮助其他人解决梦境任务，奖励多为经验和黑金币
 * 异闻猎手：偏向于寻宝收集线索，奖励为金币和道具偏多
 * 幽光守卫：偏向于杀敌和守卫，奖励为武器装备偏多
 * 翠金科技：偏向研究报告，制造药水，奖励为解锁翠金能力，
 * 教程：主要是引导性质的
 * 杂项：多为堆数量之类的任务
 */
@ccclass
export default class QuestTargetItem extends cc.Component {
    @property(cc.Toggle)
    toggle: cc.Toggle = null
    @property(cc.Label)
    title: cc.Label = null
    index = 0 //列表里的下标
    data: QuestTargetData = new QuestTargetData()

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {}, this)
        // this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {}, this)
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {}, this)
    }
    init(data: QuestTargetData, index: number) {
        this.data.valueCopy(data)
        this.index = index
        this.title.string = data.getDesc()
        this.toggle.isChecked = data.status == QuestData.STATUS_SUCCESS
        this.node.opacity = data.status == QuestData.STATUS_FAILED ? 128 : 255
        this.title.node.color = data.status == QuestData.STATUS_FAILED ? cc.Color.RED : cc.Color.WHITE
    }

    start() {}

    // update (dt) {}
}
