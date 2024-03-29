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

const { ccclass, property } = cc._decorator

@ccclass
export default class MartShelvesDialog extends BaseDialog {
    static readonly SIZE = 21
    static readonly SIZE_FRIDGE = 12
    static readonly TYPE_NORMAL = 'S3'
    static readonly TYPE_WOOD = 'S4'
    static readonly TYPE_FRIDGE = 'S5'
    @property(cc.Prefab)
    goods: cc.Prefab = null
    @property(cc.Node)
    layer: cc.Node = null
    @property(cc.Node)
    spriteNode: cc.Node = null
    @property(cc.Node)
    fridgeNode: cc.Node = null
    @property(cc.Node)
    fridgeLayer: cc.Node = null
    @property(cc.Node)
    doorLeft: cc.Node = null
    @property(cc.Node)
    doorRight: cc.Node = null
    @property(cc.Node)
    payNode: cc.Node = null
    @property(cc.Label)
    payTitle: cc.Label = null
    @property(cc.Label)
    payDesc: cc.Label = null
    @property(cc.Sprite)
    payIcon: cc.Sprite = null
    type: string = MartShelvesDialog.TYPE_NORMAL
    goodsList: Goods[] = []
    martshelvesbg: cc.Node
    martshelvesside0: cc.Node
    martshelvesside1: cc.Node
    martshelvesside2: cc.Node
    martshelvesside3: cc.Node
    anim: cc.Animation
    goodsData: GoodsData
    onLoad() {
        EventHelper.on(EventHelper.HUD_MART_SHELVES_DIALOG_PAY, detail => {
            if (this.node) this.showPay(detail.data)
        })
    }
    showPay(data: GoodsData) {
        this.goodsData = data
        this.payTitle.string = `${data.item.nameCn}`
        this.payDesc.string = `价格：${data.item.price}\n\n说明：${data.item.info}\n${data.item.desc}`
        if (Logic.spriteFrameRes(data.item.resName)) {
            this.payIcon.spriteFrame = Logic.spriteFrameRes(data.item.resName)
            this.payIcon.node.width = this.payIcon.spriteFrame.getOriginalSize().width
            this.payIcon.node.height = this.payIcon.spriteFrame.getOriginalSize().height
        }
        this.payNode.active = true
    }
    //button
    Pay() {
        if (Logic.data.coins >= this.goodsData.item.price) {
            EventHelper.emit(EventHelper.HUD_ADD_COIN, { count: -this.goodsData.item.price })
            AudioPlayer.play(AudioPlayer.CASHIERING)
            EventHelper.emit(EventHelper.PLAYER_CHANGEITEM, { itemData: this.goodsData.item })
            this.close()
        } else {
            AudioPlayer.play(AudioPlayer.SELECT_FAIL)
        }
    }
    //button
    Cancel() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.payNode.active = false
    }
    // update (dt) {}

    updateUI(type: string, goodsNameList: string[]) {
        this.payNode.active = false
        this.spriteNode.active = false
        this.fridgeNode.active = false
        this.type = type
        this.changeBg(type)
        this.addGoods(type, goodsNameList)
    }
    changeBg(type: string) {
        if (!this.martshelvesbg) {
            this.martshelvesbg = this.node.getChildByName('sprite').getChildByName('martshelves')
            this.martshelvesside0 = this.node.getChildByName('sprite').getChildByName('martshelvesside0')
            this.martshelvesside1 = this.node.getChildByName('sprite').getChildByName('martshelvesside1')
            this.martshelvesside2 = this.node.getChildByName('sprite').getChildByName('martshelvesside2')
            this.martshelvesside3 = this.node.getChildByName('sprite').getChildByName('martshelvesside3')
        }
        let isFridge = type == MartShelvesDialog.TYPE_FRIDGE
        if (isFridge) {
            this.fridgeNode.active = true
            this.doorLeft.scaleX = 1
            this.doorRight.scaleX = 1
        } else {
            this.spriteNode.active = true
        }
        let color = type == MartShelvesDialog.TYPE_WOOD ? '#DF8143' : '#FFFFFF'
        this.martshelvesbg.color = cc.color().fromHEX(color)
        this.martshelvesside0.color = cc.color().fromHEX(color)
        this.martshelvesside1.color = cc.color().fromHEX(color)
        this.martshelvesside2.color = cc.color().fromHEX(color)
        this.martshelvesside3.color = cc.color().fromHEX(color)
    }
    addGoods(type: string, goodsNameList: string[]) {
        this.layer.removeAllChildren()
        this.fridgeLayer.removeAllChildren()
        let isFridge = type == MartShelvesDialog.TYPE_FRIDGE
        let layer = isFridge ? this.fridgeLayer : this.layer
        let size = isFridge ? MartShelvesDialog.SIZE_FRIDGE : MartShelvesDialog.SIZE
        for (let i = 0; i < size; i++) {
            if (i > goodsNameList.length - 1) {
                continue
            }
            let goods = cc.instantiate(this.goods).getComponent(Goods)
            let data = new GoodsData()
            data.count = 1
            data.item.valueCopy(Logic.items[goodsNameList[i]])
            goods.init(data)
            this.goodsList.push(goods)
            layer.addChild(goods.node)
        }
        if (isFridge) {
            this.scheduleOnce(() => {
                if (!this.anim) {
                    this.anim = this.getComponent(cc.Animation)
                }
                this.anim.play()
            }, 1)
        }
    }
    close() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.fridgeNode.active = false
        this.spriteNode.active = false
        this.payNode.active = false
        this.dismiss()
    }
}
