import Achievement from '../logic/Achievement'
import EquipmentData from '../data/EquipmentData'
import FurnitureData from '../data/FurnitureData'
import ItemData from '../data/ItemData'
import NonPlayerData from '../data/NonPlayerData'
import AudioPlayer from '../utils/AudioPlayer'
import QuestData from '../data/QuestData'

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
    data: QuestData = new QuestData()
    startPos = cc.v3(0, 0)
    touchPos = cc.v2(0, 0)
    cardList: QuestCard[] = []
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.touchPos = event.getLocation()
            this.startPos = this.node.position.clone()
        })
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let offset = event.getLocation().sub(this.touchPos).mul(0.5)
            this.node.setPosition(this.startPos.x + offset.x, this.startPos.y + offset.y)
        })
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {})
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {})
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
    update(dt) {
        if (this.isTimeDelay(dt)) {
            this.graphics.clear()
            this.graphics.moveTo(QuestCard.SIZE / 2, 0)
            for (let c of this.cardList) {
                this.graphics.lineTo(c.node.position.x + QuestCard.SIZE, c.node.position.y)
                this.graphics.moveTo(QuestCard.SIZE / 2, 0)
            }
            this.graphics.stroke()
        }
    }
}
