// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CCollider from '../collider/CCollider'
import Dungeon from '../logic/Dungeon'
import IndexZ from '../utils/IndexZ'
import Utils from '../utils/Utils'
import Building from './Building'

const { ccclass, property } = cc._decorator

@ccclass
export default class Stairs extends Building {
    @property(cc.Node)
    root: cc.Node = null
    @property(cc.Node)
    wall: cc.Node = null
    private mat: cc.MaterialVariant
    // LIFE-CYCLE CALLBACKS:
    static readonly TYPE_FRONT = 'V000'
    static readonly TYPE_BEHIND = 'V001'
    static readonly TYPE_LEFT = 'V002'
    static readonly TYPE_RIGHT = 'V003'
    static readonly TYPE_PLATFORM = 'V004'

    init(mapStr: string) {
        //V00000注意，楼梯的root不能绑定到entity上
        let z = (parseInt(mapStr[5]) * Dungeon.TILE_SIZE) / 2
        this.root.y = z
        this.entity.Move.gravity = 0
        this.wall.height = z
        for (let collider of this.ccolliders) {
            collider.zHeight += z
        }
        // if (Utils.hasThe(mapStr, Stairs.TYPE_BEHIND)) {
        //     this.node.zIndex -= 128
        // }
    }

    // update (dt) {}
}
