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

export default class MetalTalentData extends BaseData {
    static readonly METAL_DAGGER = 'dagger' //0
    static readonly METAL_HAND = 'hand' //1
    static readonly METAL_SHIELD = 'shield' //2
    id = ''
    name = ''
    content = ''
    isUnlock = false
    public valueCopy(data: MetalTalentData): MetalTalentData {
        if (!data) {
            return this
        }
        DataUtils.baseCopy(this, data)
        return this
    }
    public clone(): MetalTalentData {
        let e = new MetalTalentData()
        e.valueCopy(this)
        return e
    }
}
