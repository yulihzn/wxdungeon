// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from '../logic/EventHelper'

const { ccclass, property } = cc._decorator

@ccclass
export default class ReflectLight extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(cc.Node)
    root: cc.Node = null
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    show(isFar: boolean, isStab: boolean, isWall: boolean, hv: cc.Vec2) {
        let fix = ''
        if (isWall) {
            fix = 'wall'
        } else if (isFar) {
            fix = 'far'
        } else if (isStab) {
            fix = 'stab'
        }
        let name = `weaponreflectlight${fix}anim000`
        cc.tween(this.sprite.node).call(() => {})
        this.scheduleOnce(() => {
            EventHelper.emit(EventHelper.POOL_DESTORY_REFLECTLIGHT, { targetNode: this.node })
        }, 0.5)
    }

    // update (dt) {}
}
