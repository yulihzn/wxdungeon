import QuestData from './data/QuestData'
import QuestFileEditManager from './QuestFileEditManager'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//任务卡片
const { ccclass, property } = cc._decorator

@ccclass
export default class QuestCard extends cc.Component {
    static readonly SIZE = 256
    @property(cc.Node)
    layout: cc.Node = null
    @property(cc.Label)
    title: cc.Label = null
    @property(cc.Label)
    content: cc.Label = null
    @property(cc.Graphics)
    graphics: cc.Graphics = null
    @property(cc.Node)
    select: cc.Node = null
    data: QuestData = new QuestData()
    startPos = cc.v3(0, 0)
    touchPos = cc.v2(0, 0)
    cardList: QuestCard[] = []
    parentCard: QuestCard
    isSelected = false
    editManager: QuestFileEditManager
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.touchPos = event.getLocation()
            this.startPos = this.node.position.clone()
        })
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let offset = event.getLocation().sub(this.touchPos)
            this.node.setPosition(this.startPos.x + offset.x / this.node.parent.scale, this.startPos.y + offset.y / this.node.parent.scale)
        })
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.startPos.sub(this.node.position).mag() < 5) {
                this.editManager.selectCard(this)
            } else {
                // cc.log(`END:${this.data.parentId + this.data.indexId},x=${this.node.position.x},y=${this.node.position.y}`)
                this.editManager.updateTreeNodePos(this.data.indexId, this.data.parentId, this.node.position.clone())
            }
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {})
        this.select.active = this.isSelected
    }
    //button
    addSuccessChildCard() {
        this.addChildCard(true)
    }
    //button
    addFailChildCard() {
        this.addChildCard(false)
    }
    private addChildCard(isSuccessType: boolean) {
        let newdata = new QuestData()
        this.editManager.addTreeNode(this.data.indexId, this.data.parentId, isSuccessType, newdata)
    }
    //button
    removeSelfCard() {
        if (this.data.successList.length > 0) {
            this.editManager.showLog('has successList!')
        }
        if (this.data.failList.length > 0) {
            this.editManager.showLog('has failList!')
        }
        this.editManager.removeTreeNode(this.data.indexId, this.data.parentId)
    }
    updateData(data: QuestData) {
        this.data.valueCopy(data)
        this.title.string = this.data.name
        this.content.string = this.data.content
    }
    timeDelay = 0
    isTimeDelay(dt: number): boolean {
        this.timeDelay += dt
        if (this.timeDelay > 0.1) {
            this.timeDelay = 0
            return true
        }
        return false
    }
    private updateLine() {
        this.graphics.clear()
        this.graphics.moveTo(QuestCard.SIZE / 2, 0)
        this.graphics.lineWidth = 5 + (5 * this.node.parent.scale) / 2
        for (let c of this.cardList) {
            this.graphics.strokeColor = c.data.isSuccessType ? cc.Color.GREEN : cc.Color.RED
            let pos = c.node.convertToWorldSpaceAR(cc.v3(0, 0))
            pos = this.node.convertToNodeSpaceAR(pos)
            this.graphics.moveTo(QuestCard.SIZE / 2, 0)
            this.graphics.lineTo(pos.x, pos.y)
            this.graphics.stroke()
        }
    }
    update(dt) {
        if (this.isTimeDelay(dt)) {
            this.updateLine()
            this.select.active = this.isSelected
        }
    }
}
