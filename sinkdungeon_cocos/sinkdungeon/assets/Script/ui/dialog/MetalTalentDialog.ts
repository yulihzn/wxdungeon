// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from '../../logic/Logic'
import AudioPlayer from '../../utils/AudioPlayer'
import BaseDialog from './BaseDialog'
import MetalTalentData from '../../data/MetalTalentData'
import MetalTalentItem from '../MetalTalentItem'
import { EventHelper } from '../../logic/EventHelper'

const { ccclass, property } = cc._decorator

@ccclass
export default class MetalTalentDialog extends BaseDialog {
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null
    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null
    @property(cc.Node)
    daggerNode: cc.Node = null
    @property(cc.Node)
    handNode: cc.Node = null
    @property(cc.Node)
    shieldNode: cc.Node = null
    @property(cc.Node)
    infoDialog: cc.Node = null
    @property(cc.Label)
    infoTitle: cc.Label = null
    @property(cc.Label)
    infoContent: cc.Label = null
    list: MetalTalentItem[][] = []

    onLoad() {}

    close() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.dismiss()
    }
    show(): void {
        super.show()
        this.clearUi()
        this.list = [[], [], []]
        for (let key in Logic.metals) {
            let data = new MetalTalentData()
            data.valueCopy(Logic.metals[key])
            if (Logic.metalData.id.length > 0 && Logic.metalData.id == data.id) {
                data.isUnlock = Logic.metalData.isUnlock
            }
            if (key.indexOf(MetalTalentData.METAL_DAGGER) != -1) {
                this.buildItem(data, this.list[0], this.daggerNode)
            } else if (key.indexOf(MetalTalentData.METAL_HAND) != -1) {
                this.buildItem(data, this.list[1], this.handNode)
            } else if (key.indexOf(MetalTalentData.METAL_SHIELD) != -1) {
                this.buildItem(data, this.list[2], this.shieldNode)
            }
        }
        if (Logic.metalData.id.indexOf(MetalTalentData.METAL_DAGGER) != -1) {
            this.toggleContainer.toggleItems[0].uncheck()
            this.toggleContainer.toggleItems[1].check()
            this.toggleContainer.toggleItems[2].uncheck()
        } else if (Logic.metalData.id.indexOf(MetalTalentData.METAL_HAND) != -1) {
            this.toggleContainer.toggleItems[0].uncheck()
            this.toggleContainer.toggleItems[1].check()
            this.toggleContainer.toggleItems[2].uncheck()
        } else if (Logic.metalData.id.indexOf(MetalTalentData.METAL_SHIELD) != -1) {
            this.toggleContainer.toggleItems[0].uncheck()
            this.toggleContainer.toggleItems[1].uncheck()
            this.toggleContainer.toggleItems[2].check()
        }
    }
    private clearUi() {
        this.daggerNode.removeAllChildren()
        this.handNode.removeAllChildren()
        this.shieldNode.removeAllChildren()
        this.list = [[], [], []]
        this.hideInfoDialog()
    }
    buildItem(data: MetalTalentData, list: MetalTalentItem[], parent: cc.Node) {
        let item = cc.instantiate(this.itemPrefab).getComponent(MetalTalentItem)
        item.init(this, data, list.length)
        list.push(item)
        parent.addChild(item.node)
    }
    selectTalentGroup(toggle: cc.Toggle, index: number) {
        if (index == 0) {
            Logic.metalData.valueCopy(this.list[0][0].data)
            EventHelper.emit(EventHelper.SELECT_METAL_TALENT)
        } else if (index == 1) {
            Logic.metalData.valueCopy(this.list[1][0].data)
            EventHelper.emit(EventHelper.SELECT_METAL_TALENT)
        } else if (index == 2) {
            Logic.metalData.valueCopy(this.list[2][0].data)
            EventHelper.emit(EventHelper.SELECT_METAL_TALENT)
        }
    }

    showInfoDialog(pos: cc.Vec3, title: string, content: string) {
        this.infoDialog.active = true
        this.infoDialog.position = pos.clone()
        this.infoDialog.getChildByName('title').getComponent(cc.Label).string = title
        this.infoDialog.getChildByName('content').getComponent(cc.Label).string = content
    }
    hideInfoDialog() {
        this.infoDialog.active = false
    }
    getUnlockCount() {
        let count = 0
        for (let d of this.list) {
            for (let d1 of d) {
                if (d1.data.isUnlock) {
                    count++
                }
            }
        }
        return count
    }
    selectItem(data: MetalTalentData) {
        for (let d of this.list) {
            for (let d1 of d) {
                d1.selectNode.active = false
                if (data.id == d1.data.id) {
                    d1.selectNode.active = true
                    Logic.metalData.valueCopy(data)
                    EventHelper.emit(EventHelper.SELECT_METAL_TALENT)
                }
            }
        }
    }
}
