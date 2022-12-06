// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Random from '../utils/Random'

const { ccclass, property } = cc._decorator

@ccclass
export default class StartFlies extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    onLoad() {}
    //Anim
    FlyStart() {
        let sprite = this.node.getChildByName('sprite')
        sprite.y = Random.getRandomNum(0, 200)
        let offset = 1 - sprite.y / 200
        if (offset < 0.5) {
            offset = 0.5
        }
        this.node.getComponent(cc.Animation).getAnimationState('StartFlyMove').speed = offset
        for (let c of sprite.children) {
            let x = Random.getRandomNum(-200 * offset, 200 * offset)
            let y = Random.getRandomNum(-100 * offset, 100 * offset)
            c.x = x
            c.y = y
            c.scale = Random.getRandomNum(50 * offset, 100 * offset) / 10
            c.getComponent(cc.Animation).pause()
            this.scheduleOnce(() => {
                c.getComponent(cc.Animation).resume()
            }, Random.rand())
            c.active = Random.getHalfChance()
            let r = Random.getRandomNum(200, 255)
            let g = Random.getRandomNum(200, 255)
            let b = Random.getRandomNum(200, 255)
            c.color = cc.color(r, g, b)
        }
    }

    start() {}

    // update (dt) {}
}
