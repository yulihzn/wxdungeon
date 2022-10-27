// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ActorIcon from './ActorIcon'
const { ccclass, property } = cc._decorator

@ccclass
export default class ActorIconList extends cc.Component {
    @property(cc.Prefab)
    iconPrefab: cc.Prefab = null
    @property(cc.Node)
    layout: cc.Node = null

    // LIFE-CYCLE CALLBACKS:

    onLoad() {}

    getIcon(resName: string): ActorIcon {
        let node: cc.Node = cc.instantiate(this.iconPrefab)
        node.parent = this.layout
        let icon = node.getComponent(ActorIcon)
        icon.show(resName)
        return icon
    }

    // update (dt) {}
}
