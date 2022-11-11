// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GoodsData from '../../data/GoodsData'
import { EventHelper } from '../../logic/EventHelper'
import Goods from '../../item/Goods'
import Logic from '../../logic/Logic'
import AudioPlayer from '../../utils/AudioPlayer'
import BaseDialog from './BaseDialog'
import QuestItem from '../QuestItem'

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
    questCheckPrefab: cc.Prefab = null
    @property(cc.Node)
    contentLeft: cc.Node = null
    @property(cc.Node)
    contentRight: cc.Node = null
    @property(cc.Label)
    title: cc.Label = null
    @property(cc.Label)
    desc: cc.Label = null
    @property(cc.Sprite)
    titleBg: cc.Sprite = null
    questList: QuestItem[] = []
    currentItem: QuestItem

    onLoad() {}

    close() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.dismiss()
    }
    show(): void {
        super.show()
        this.updateInfo()
    }
    selectItem(index: number) {
        let len = this.questList.length
        for (let i = 0; i < len; i++) {
            this.questList[i].select(index == i)
        }
        this.currentItem = this.questList[index]
        this.updateInfo()
    }
    private updateInfo() {
        if (!this.currentItem) {
            this.title.string = ''
            this.desc.string = ''
            this.titleBg.spriteFrame = null
            return
        }
        let data = this.currentItem.data
        this.title.string = data.name
        this.desc.string = data.content
        this.titleBg.spriteFrame = Logic.spriteFrameRes(data.iconLarge)
    }
}
