import AvatarData from '../data/AvatarData'
import Logic from '../logic/Logic'
import ProfileManager from '../manager/ProfileManager'
import LocalStorage from '../utils/LocalStorage'
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

@ccclass
export default class SaveSlotItem extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null
    index = 0 //列表里的下标
    hasSaveData = false
    // LIFE-CYCLE CALLBACKS:

    onLoad() {}
    init(index: number) {
        this.index = index
        let data = ProfileManager.getSaveData(LocalStorage.getLastSaveSlotKey())
        if (!data) {
            this.hasSaveData = false
        }
        if (this.hasSaveData) {
            this.label.string = `${data.playerData.AvatarData.professionData.nameCn} ${
                AvatarData.ORGANIZATION[data.playerData.AvatarData.organizationIndex]
            }    Lv.${Logic.getOilGoldData(data.oilGolds)}\n${Utils.getDay(data.lastSaveTime)}${Utils.getHour(data.lastSaveTime)}`
        } else {
            this.label.string = '空'
        }
    }
    picked() {}

    start() {}

    // update (dt) {}
}
