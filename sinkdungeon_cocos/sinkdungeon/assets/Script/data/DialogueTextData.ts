import DataUtils from '../utils/DataUtils'
import DialogueButtonData from './DialogueButtonData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class DialogueTextData {
    id = 0 //下标
    actor = 0 //所属对象下标
    text = '' //内容
    next: DialogueButtonData[] = [] //如果不填写，默认读取下一条
    valueCopy(data: DialogueTextData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.next = data.next ?? []
        if (data.next) {
            this.next = []
            for (let d of data.next) {
                let data = new DialogueButtonData()
                data.valueCopy(d)
                this.next.push(data)
            }
        }
    }
    clone(): DialogueTextData {
        let e = new DialogueTextData()
        e.valueCopy(this)
        return e
    }
}
