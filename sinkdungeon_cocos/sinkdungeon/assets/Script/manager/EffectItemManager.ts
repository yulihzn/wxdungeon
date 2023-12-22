import ActorEntity from '../ecs/entity/ActorEntity'
import FloorPaper from '../effect/FloorPaper'
import HitBlood from '../effect/HitBlood'
import { EventHelper } from '../logic/EventHelper'
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
    @property(cc.Prefab)
    hitBlood: cc.Prefab = null
    private hitBloodPool: cc.NodePool
    // LIFE-CYCLE CALLBACKS:
    clear(): void {}
    onLoad() {
        this.hitBloodPool = new cc.NodePool()
    }
    destroyHitBlood(paperNode: cc.Node) {
        paperNode.active = false
        this.hitBloodPool.put(paperNode)
    }
    addHitBlood(fromPos: cc.Vec3, targetPos: cc.Vec3) {
        let paperPrefab: cc.Node = null
        if (this.hitBloodPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            paperPrefab = this.hitBloodPool.get()
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!paperPrefab || paperPrefab.active) {
            paperPrefab = cc.instantiate(this.hitBlood)
        }
        let blood = paperPrefab.getComponent(HitBlood)
        blood.manager = this
        blood.node.parent = this.node
        blood.node.active = true
        blood.node.position = targetPos.clone()
        blood.entity.Transform.position = targetPos.clone()
        blood.entity.Transform.z = 64
        blood.fly(fromPos, true)
    }
    addPaper(fromPos: cc.Vec3, targetPos: cc.Vec3) {
        let paper = cc.instantiate(this.paper).getComponent(FloorPaper)
        paper.node.parent = this.node
        paper.node.active = true
        paper.node.position = targetPos.clone()
        paper.entity.Transform.position = targetPos.clone()
        paper.entity.Transform.z = 32
        paper.fly(fromPos, false)
    }
    // update (dt) {}
}
