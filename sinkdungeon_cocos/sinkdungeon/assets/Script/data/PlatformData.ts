// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import DataUtils from '../utils/DataUtils'

export default class PlatformData {
    nameCn: string = ''
    nameEn: string = ''
    resName: string = ''
    scale = 1
    collider = ''
    spritePos = ''
    z = 0
    custom = false

    valueCopy(data: PlatformData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
    }
    clone(): PlatformData {
        let data = new PlatformData()
        data.valueCopy(this)
        return data
    }
}
