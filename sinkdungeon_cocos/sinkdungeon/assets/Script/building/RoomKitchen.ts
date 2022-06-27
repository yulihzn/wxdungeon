// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Item from '../item/Item'
import Dungeon from '../logic/Dungeon'
import Player from '../logic/Player'
import Utils from '../utils/Utils'

const { ccclass, property } = cc._decorator

@ccclass
export default class RoomKitchen extends cc.Component {
    hasFood = false
    anim: cc.Animation
    isAniming = false
    defaultPos = cc.v3(0, 0)
    onLoad() {
        this.anim = this.getComponent(cc.Animation)
    }
    init(indexPos: cc.Vec3) {
        this.defaultPos = indexPos
    }
    getFood(player: Player) {
        if (this.isAniming) {
            return
        }
        player.cooking()
        this.isAniming = true
        this.scheduleOnce(() => {
            this.hasFood = true
            this.isAniming = false
            Utils.toast(`一份香喷喷的蛋炒饭完成了。`, false, true)
            if (player.dungeon) {
                player.dungeon.addItem(Dungeon.getPosInMap(this.defaultPos).add(cc.v3(0, -24)), Item.FRIEDRICE)
            }
        }, 3)
    }
    //动画结束
    AnimFinish() {}

    update(dt: number) {}
}
