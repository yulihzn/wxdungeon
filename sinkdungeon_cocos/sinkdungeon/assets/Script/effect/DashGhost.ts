// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AreaOfEffect from '../actor/AreaOfEffect'

const { ccclass, property } = cc._decorator

@ccclass
export default class DashGhost extends AreaOfEffect {
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad()
    }
    // show(spriteFrame: cc.SpriteFrame, position: cc.Vec3) {
    //     this.sprite.node.stopAllActions()
    //     this.sprite.spriteFrame = spriteFrame
    //     this.sprite.node.opacity = 255
    //     this.node.position = position.clone()
    //     cc.tween(this.sprite.node)
    //         .to(0.3, { opacity: 0 })
    //         .call(() => {
    //             EventHelper.emit(EventHelper.POOL_DESTORY_DASHGHLOST, { targetNode: this.node })
    //         })
    //         .start()
    // }

    // update (dt) {}
}
