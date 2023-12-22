// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventHelper } from '../logic/EventHelper'
import Shield from '../logic/Shield'

const { ccclass, property } = cc._decorator

@ccclass
export default class BlockLight extends cc.Component {
    anim: cc.Animation
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    show(shield: Shield) {
        if (!this.anim) {
            this.anim = this.getComponent(cc.Animation)
        }
        this.anim.play()
        this.scheduleOnce(() => {
            shield.destroyBlockLight(this.node)
        }, 0.5)
    }

    // update (dt) {}
}
