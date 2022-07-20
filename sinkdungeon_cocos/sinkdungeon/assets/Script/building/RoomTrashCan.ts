import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import EquipmentManager from '../manager/EquipmentManager'
import AudioPlayer from '../utils/AudioPlayer'
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import NextStep from '../utils/NextStep'
import Random4Save from '../utils/Random4Save'
import Building from './Building'

const { ccclass, property } = cc._decorator

@ccclass
export default class RoomTrashCan extends cc.Component {
    anim: cc.Animation
    @property(cc.Node)
    trash: cc.Node = null
    next: NextStep = new NextStep()
    rand: Random4Save = new Random4Save(0)

    onLoad() {
        this.anim = this.getComponent(cc.Animation)
        this.trash.active = false
    }

    getTrash() {
        this.next.next(() => {
            this.trash.active = true
            this.anim.play('RoomTrashOut')
            AudioPlayer.play(AudioPlayer.TRASH)
            this.scheduleOnce(() => {
                if (this.rand.rand() > 0.5) {
                    EventHelper.emit(EventHelper.DUNGEON_ADD_ITEM, { res: Logic.getRandomTrashType(this.rand) })
                }
                if (this.rand.rand() > 0.9) {
                    EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: EquipmentManager.WEAPON_BROKEN_GLASS })
                } else if (this.rand.rand() > 0.95) {
                    EventHelper.emit(EventHelper.DUNGEON_SETEQUIPMENT, { res: EquipmentManager.WEAPON_WINE_BOTTLE })
                }
                this.trash.active = false
            }, 1)
        }, 2)
    }
    checkTimeDelay = 0
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt
        if (this.checkTimeDelay > 1) {
            this.checkTimeDelay = 0
            return true
        }
        return false
    }
    update(dt: number) {}
}
