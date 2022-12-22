import AudioPlayer from '../utils/AudioPlayer'
import Logic from '../logic/Logic'
import QuestBoardDialog from './dialog/QuestBoardDialog'
import QuestData from '../editor/data/QuestData'
import MetalTalentDialog from './dialog/MetalTalentDialog'
import MetalTalentData from '../data/MetalTalentData'
import GameAlertDialog from './dialog/GameAlertDialog'
import Utils from '../utils/Utils'

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
 */
@ccclass
export default class MetalTalentItem extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    selectNode: cc.Node = null
    @property(cc.Toggle)
    lockToggle: cc.Toggle = null
    index = 0 //列表里的下标
    data: MetalTalentData = new MetalTalentData()
    metalTalentDialog: MetalTalentDialog

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let isLongPress = false
        let touchStart = false
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            touchStart = true
            this.scheduleOnce(() => {
                if (!touchStart) {
                    return
                }
                isLongPress = true
                this.metalTalentDialog.showInfoDialog(this.data.name, this.data.content)
            }, 0.3)
        })
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.metalTalentDialog.hideInfoDialog()
            if (!isLongPress) {
                this.switchOrUnlock()
            }
            touchStart = false
            isLongPress = false
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.metalTalentDialog.hideInfoDialog()
            touchStart = false
            isLongPress = false
        })
        this.node.on(cc.Node.EventType.MOUSE_ENTER, () => {
            this.metalTalentDialog.showInfoDialog(this.data.name, this.data.content)
        })
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, () => {
            this.metalTalentDialog.hideInfoDialog()
        })
    }
    init(metalTalentDialog: MetalTalentDialog, data: MetalTalentData, index: number) {
        this.metalTalentDialog = metalTalentDialog
        this.data.valueCopy(data)
        this.index = index
        this.sprite.spriteFrame = Logic.spriteFrameRes('iconmetal' + this.data.id)
        this.lockToggle.isChecked = this.data.isUnlock
        if (this.lockToggle.isChecked) {
            this.lockToggle.interactable = false
        }
    }

    switchOrUnlock() {
        this.lockToggle.isChecked = this.data.isUnlock
        let count = this.metalTalentDialog.getUnlockCount()
        let left = Logic.playerData.OilGoldData.level - count
        if (this.data.isUnlock) {
            this.metalTalentDialog.selectItem(this.data)
        } else {
            if (left > 0) {
                GameAlertDialog.show(`是否花费一个翠金点解锁该天赋\n当前拥有${left}`, '确定', '取消', (flag: boolean) => {
                    if (flag) {
                        this.data.isUnlock = true
                        this.lockToggle.isChecked = this.data.isUnlock
                        Logic.playerMetals[this.data.id] = this.data.clone()
                    }
                })
            } else {
                Utils.toast('翠金点不够了，去收集更多的翠金点吧', true, true)
            }
        }
    }

    start() {}

    // update (dt) {}
}
