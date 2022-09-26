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
    count: number = 0 //出现次数

    valueCopy(data: DialogueData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        if (data.list) {
            this.list = []
            for (let d of data.list) {
                let data = new DialogueTextData()
                data.valueCopy(d)
                this.list.push(data)
            }
        }
        if (data.actors) {
            this.actors = []
            for (let d of data.actors) {
                let data = new DialogueActorData()
                data.valueCopy(d)
                this.actors.push(data)
            }
        }
    }
    clone(): DialogueData {
        let e = new DialogueData()
        e.valueCopy(this)
        return e
    }
}
