import FloatingLabelData from '../data/FloatingLabelData'
import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import FloatingLabel from '../ui/FloatingLabel'
import IndexZ from '../utils/IndexZ'

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
export default class FloatinglabelManager extends cc.Component {
    @property(cc.Prefab)
    label: cc.Prefab = null
    private labelPool: cc.NodePool
    // LIFE-CYCLE CALLBACKS:
    clear(): void {}
    onLoad() {
        this.labelPool = new cc.NodePool()
        EventHelper.on(EventHelper.POOL_DESTROY_LABEL, detail => {
            this.destroyLabel(detail.labelNode)
        })
        EventHelper.on(EventHelper.HUD_SHOW_FLOATING_LABEL, detail => {
            this.showFloatFont(detail.data)
        })
    }
    private showFloatFont(data: FloatingLabelData) {
        let flabel = this.getFloaingLabel(data.worldPos)
        if (data.isDodge) {
            flabel.showDoge()
        } else if (data.isMiss) {
            flabel.showMiss()
        } else if (data.isBlock) {
            flabel.showBlock()
        } else if (data.isAvoidDeath) {
            flabel.showAvoidDeath()
        } else if (data.d != 0 && data.d) {
            flabel.showDamage(-data.d, data.isCritical, data.isBackStab)
        } else {
            flabel.hideLabel()
        }
    }
    private getFloaingLabel(worldPos: cc.Vec3) {
        let p = this.node.convertToNodeSpaceAR(worldPos)
        let labelPrefab: cc.Node = null
        if (this.labelPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            labelPrefab = this.labelPool.get()
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!labelPrefab || labelPrefab.active) {
            labelPrefab = cc.instantiate(this.label)
        }
        labelPrefab.parent = this.node
        labelPrefab.position = p
        let label = labelPrefab.getComponent(FloatingLabel)
        labelPrefab.zIndex = IndexZ.UI
        labelPrefab.opacity = 255
        labelPrefab.active = true
        return label
    }
    destroyLabel(labelNode: cc.Node) {
        labelNode.active = false
        if (this.labelPool) {
            this.labelPool.put(labelNode)
        }
    }
    start() {}

    // update (dt) {}
}
