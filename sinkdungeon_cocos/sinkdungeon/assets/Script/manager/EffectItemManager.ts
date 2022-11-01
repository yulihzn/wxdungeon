import FloatingLabelData from '../data/FloatingLabelData'
import ActorEntity from '../ecs/entity/ActorEntity'
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
    private paperPool: cc.NodePool
    // LIFE-CYCLE CALLBACKS:
    clear(): void {}
    onLoad() {
        this.paperPool = new cc.NodePool()
        EventHelper.on(EventHelper.POOL_DESTORY_PAPER, detail => {
            if (this.node) {
                this.destroyPaper(detail.paperNode, detail.entity)
            }
        })
    }
    destroyPaper(paperNode: cc.Node, entity: ActorEntity) {
        paperNode.active = false
        if (this.paperPool && this.paperPool.size() > 20) {
            this.paperPool.put(paperNode)
        } else {
            entity.destroy()
            paperNode.destroy()
        }
    }
    addPaper(targetPos: cc.Vec3, position: cc.Vec3) {
        let paperPrefab: cc.Node = null
        if (this.paperPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            paperPrefab = this.paperPool.get()
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!paperPrefab || paperPrefab.active) {
            paperPrefab = cc.instantiate(this.paper)
        }
        let paper = paperPrefab.getComponent(FloorPaper)
        paper.node.parent = this.node
        paper.node.active = true
        paper.node.position = position.clone()
        paper.entity.Transform.position = position.clone()
        paper.fly(targetPos, false)
    }

    // update (dt) {}
}
