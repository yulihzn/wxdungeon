// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from '../../logic/Logic'
import AudioPlayer from '../../utils/AudioPlayer'
import BaseDialog from './BaseDialog'
import QuestItem from '../QuestItem'
import QuestData from '../../editor/data/QuestData'
import QuestTargetData from '../../editor/data/QuestTargetData'
import QuestTargetItem from '../QuestTargetItem'

const { ccclass, property } = cc._decorator

@ccclass
export default class QuestBoardDialog extends BaseDialog {
    static readonly SIZE = 21
    static readonly SIZE_FRIDGE = 12
    static readonly TYPE_NORMAL = 'S3'
    static readonly TYPE_WOOD = 'S4'
    static readonly TYPE_FRIDGE = 'S5'
    @property(cc.Prefab)
    questItemPrefab: cc.Prefab = null
    @property(cc.Prefab)
    questTargetPrefab: cc.Prefab = null
    @property(cc.Node)
    contentLeft: cc.Node = null
    @property(cc.Node)
    contentRight: cc.Node = null
    @property(cc.Node)
    scollRight: cc.Node = null
    @property(cc.Label)
    title: cc.Label = null
    @property(cc.Label)
    desc: cc.Label = null
    @property(cc.Sprite)
    titleBg: cc.Sprite = null
    questList: QuestItem[] = []
    targetList: QuestTargetItem[] = []
    currentItem: QuestItem

    onLoad() {}

    close() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.dismiss()
    }
    show(): void {
        super.show()
        this.clearUi()
        for (let i = 0; i < 6; i++) {
            let data = new QuestData()
            data.name = '测试一下' + i
            data.content = '一个普通的任务' + i
            data.icon = 'questicon' + i
            let t1 = QuestTargetData.build('weapon00' + i, QuestTargetData.TARGET_EQUIP, QuestTargetData.EQUIP_PICK, 1)
            let t2 = QuestTargetData.build('monster00' + i, QuestTargetData.TARGET_MONSTER, QuestTargetData.MONSTER_KILL, 1)
            t2.status = QuestData.STATUS_SUCCESS
            let t3 = QuestTargetData.build('furniture00' + (i + 1), QuestTargetData.TARGET_FURNITURE, QuestTargetData.BUILDING_TRIGGER, 1)
            t3.status = QuestData.STATUS_FAILED
            data.successCondition.list.push(t1)
            data.successCondition.list.push(t2)
            data.successCondition.list.push(t3)
            this.buildQuestItem(data)
        }
        this.selectNone()
    }
    private clearUi() {
        this.currentItem = null
        this.contentLeft.removeAllChildren()
        this.questList = []
        this.targetList = []
        this.scollRight.active = false
    }
    buildQuestItem(data: QuestData) {
        let item = cc.instantiate(this.questItemPrefab).getComponent(QuestItem)
        item.init(this, data, this.questList.length)
        this.questList.push(item)
        this.contentLeft.addChild(item.node)
    }
    buildTargetItem(data: QuestTargetData) {
        let item = cc.instantiate(this.questTargetPrefab).getComponent(QuestTargetItem)
        item.init(data, this.targetList.length)
        this.targetList.push(item)
        this.contentRight.addChild(item.node)
    }
    selectItem(index: number) {
        let len = this.questList.length
        for (let i = 0; i < len; i++) {
            this.questList[i].select(index == i)
        }
        this.currentItem = this.questList[index]
        this.updateInfo()
    }
    selectNone() {
        let len = this.questList.length
        for (let i = 0; i < len; i++) {
            this.questList[i].select(false)
        }
        this.currentItem = null
        this.updateInfo()
    }
    private updateInfo() {
        if (!this.currentItem) {
            this.title.string = ''
            this.desc.string = ''
            this.titleBg.spriteFrame = null
            this.contentRight.removeAllChildren()
            this.scollRight.active = false
            return
        }
        this.scollRight.active = true
        let data = this.currentItem.data
        this.title.string = data.name
        this.desc.string = data.content
        this.titleBg.spriteFrame = Logic.spriteFrameRes(data.iconLarge)
        this.contentRight.removeAllChildren()
        for (let t of data.successCondition.list) {
            this.buildTargetItem(t)
        }
    }
}
