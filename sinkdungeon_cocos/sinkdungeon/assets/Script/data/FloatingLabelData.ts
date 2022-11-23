import DataUtils from '../utils/DataUtils'
import BaseData from './BaseData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class FloatingLabelData extends BaseData {
    worldPos = cc.v3(0, 0)
    d: number = 0
    isDodge: boolean = false
    isMiss: boolean = false
    isCritical: boolean = false
    isBlock: boolean = false
    isBackStab: boolean = false
    isAvoidDeath: boolean = false

    public valueCopy(data: FloatingLabelData): void {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.worldPos = data.worldPos ? cc.v3(data.worldPos.x, data.worldPos.y) : cc.v3(0, 0)
    }
    public clone(): FloatingLabelData {
        let e = new FloatingLabelData()
        e.valueCopy(this)
        return e
    }
    static create(worldPos: cc.Vec3, d: number, isDodge: boolean, isMiss: boolean, isCritical: boolean, isBlock: boolean, isBackStab: boolean, isAvoidDeath: boolean) {
        let data = new FloatingLabelData()
        data.worldPos = cc.v3(worldPos.x, worldPos.y)
        data.d = d
        data.isDodge = isDodge
        data.isMiss = isMiss
        data.isCritical = isCritical
        data.isBlock = isBlock
        data.isBackStab = isBackStab
        data.isAvoidDeath = isAvoidDeath
        return data
    }
}
