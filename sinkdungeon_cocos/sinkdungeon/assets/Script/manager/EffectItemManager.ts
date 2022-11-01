import FloatingLabelData from '../data/FloatingLabelData'
import FloorPaper from '../effect/FloorPaper'
import { EventHelper } from '../logic/EventHelper'
import FloatingLabel from '../ui/FloatingLabel'
import IndexZ from '../utils/IndexZ'
import BaseManager from './BaseManager'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class EffectItemManager extends BaseManager {
    @property(cc.Prefab)
    paper: cc.Prefab = null
    // LIFE-CYCLE CALLBACKS:
    clear(): void {}
    onLoad() {}
    addPaper(targetPos: cc.Vec3, position: cc.Vec3) {
        let paper = cc.instantiate(this.paper).getComponent(FloorPaper)
        paper.node.parent = this.node
        paper.node.position = position.clone()
        paper.entity.Transform.position = position.clone()
        paper.fly(targetPos, false)
    }

    // update (dt) {}
}
