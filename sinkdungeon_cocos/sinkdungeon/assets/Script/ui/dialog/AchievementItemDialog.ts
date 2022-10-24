// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EquipmentData from '../../data/EquipmentData'
import FurnitureData from '../../data/FurnitureData'
import ItemData from '../../data/ItemData'
import NonPlayerData from '../../data/NonPlayerData'
import EquipmentManager from '../../manager/EquipmentManager'
import AudioPlayer from '../../utils/AudioPlayer'
import BaseDialog from './BaseDialog'
import EquipmentAndItemDialog from './EquipmentAndItemDialog'

const { ccclass, property } = cc._decorator

@ccclass
export default class AchievementItemDialog extends BaseDialog {
    static readonly COLORS = ['#ffffff', '#00ff00', '#0000ff', '#800080', '#ffa500']
    @property(cc.Prefab)
    equipmentAndItemDialogPrefab: cc.Prefab = null
    equipmentAndItemDialog: EquipmentAndItemDialog = null
    @property(cc.Sprite)
    icon: cc.Sprite = null
    @property(cc.Label)
    infoLabel: cc.Label = null
    onLoad() {
        this.equipmentAndItemDialog = this.initDialog()
    }
    private initDialog() {
        let node = cc.instantiate(this.equipmentAndItemDialogPrefab)
        node.parent = this.node
        let dialog = node.getComponent(EquipmentAndItemDialog)
        dialog.changeBgAndAnchor(EquipmentAndItemDialog.BG_TYPE_NONE)
        dialog.hideDialog()
        return dialog
    }

    start() {}
    show(nonPlayerData?: NonPlayerData, itemData?: ItemData, equipData?: EquipmentData, furnitureData?: FurnitureData, spriteFrame?: cc.SpriteFrame, count?: number) {
        super.show()
        if (spriteFrame) {
            this.icon.spriteFrame = spriteFrame
            this.icon.node.width = 160
            this.icon.node.height = (160 / spriteFrame.getOriginalSize().width) * spriteFrame.getOriginalSize().height
        }
        if (count > 0) {
            let length = count % 20
            if (count > 100) {
                length = 20
            }
            let str = ''
            for (let i = 0; i < length; i += 4) {
                str += '★'
            }
            this.infoLabel.string = str
            let i = Math.floor(count / 20)
            if (i > AchievementItemDialog.COLORS.length - 1) {
                i = AchievementItemDialog.COLORS.length - 1
            }
            this.infoLabel.node.color = cc.Color.WHITE.fromHEX(AchievementItemDialog.COLORS[i])
        }
        if (equipData) {
            equipData = EquipmentManager.getOriginEquipData(equipData.img)
        }
        this.equipmentAndItemDialog.showDialog(cc.v3(80, 150), nonPlayerData, itemData, equipData, furnitureData)
    }

    close() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.dismiss()
    }
}
