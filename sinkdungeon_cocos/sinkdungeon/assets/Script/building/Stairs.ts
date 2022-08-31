// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Building from './Building'
import Dungeon from '../logic/Dungeon'

const { ccclass, property } = cc._decorator

@ccclass
export default class Stairs extends Building {
    @property(cc.Node)
    root: cc.Node = null
    dungeon: Dungeon
    private mat: cc.MaterialVariant
    // LIFE-CYCLE CALLBACKS:
    static readonly TYPE_FRONT = 'V000'
    static readonly TYPE_BEHIND = 'V001'
    static readonly TYPE_LEFT = 'V002'
    static readonly TYPE_RIGHT = 'V003'
    static readonly TYPE_PLATFORM = 'V004'

    init(dungeon: Dungeon) {
        this.dungeon = dungeon
        this.root.y = this.data.z
        this.entity.Transform.z = this.data.z
        this.entity.Move.gravity = 0
    }
    // update (dt) {}
}
