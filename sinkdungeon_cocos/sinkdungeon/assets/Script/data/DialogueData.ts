import DataUtils from '../utils/DataUtils'
import DialogueActorData from './DialogueActorData'
import DialogueTextData from './DialogueTextData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class DialogueData {
    id = ''
    list: DialogueTextData[] = []
    actors: DialogueActorData[] = []
    isTalk = false

    valueCopy(data: DialogueData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.list = data.list ?? []
        this.actors = data.actors ?? []
    }
    clone(): DialogueData {
        let e = new DialogueData()
        e.valueCopy(this)
        return e
    }
}
