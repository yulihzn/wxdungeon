import DataUtils from '../utils/DataUtils'
import QuestData from './QuestData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
/**
 * 任务树
 * 任务树里的所有节点完成代表任务完成
 */
export default class QuestTreeData {
    status = QuestData.STATUS_INIT
    id = '' //id
    name = '' //名字
    content = '' //内容
    root: QuestData = new QuestData()
    valueCopy(data: QuestTreeData) {
        if (!data) {
            return this
        }
        DataUtils.baseCopy(this, data)
        if (data.root) {
            this.root.valueCopy(data.root)
        }
        return this
    }
    clone(): QuestTreeData {
        let e = new QuestTreeData()
        e.valueCopy(this)
        return e
    }
    //s0s0s1f0
    getTreeNode(mixId: string) {
        let data = this.root
        if (mixId.length < 2) {
            return data
        }
        let arr = mixId.split(',')
        for (let indexType of arr) {
            if (indexType.indexOf('s') != -1) {
                data = data.successList[parseInt(indexType[1])]
            } else if (indexType.indexOf('f') != -1) {
                data = data.failList[parseInt(indexType[1])]
            }
        }
        return data
    }
    addTreeNode(indexId: string, parentId: string, isSuccessType: boolean, newdata: QuestData) {
        let mixId = `${parentId},${indexId}`
        let data = this.getTreeNode(mixId)
        let list = isSuccessType ? data.successList : data.failList
        let length = list.length
        newdata.indexId = `${isSuccessType ? 's' : 'f'}${length}`
        newdata.parentId = `${data.parentId},${data.indexId}`
        newdata.name = isSuccessType ? `任务成功支线${newdata.indexId[1]}` : `任务失败支线${newdata.indexId[1]}`
        newdata.content = '开始卷'
        list.push(newdata)
    }
    static updateIndexId(data: QuestData, parent: QuestData, isSuccessType: boolean) {
        data.indexId = `${isSuccessType ? 's' : 'f'}${length}`
        if (parent.parentId.length > 0) {
            data.parentId = `${parent.parentId},${parent.indexId}`
        }
    }
    removeTreeNode(indexId: string, parentId: string) {
        if (indexId.length < 1) {
            return
        }
        let isSuccess = indexId.indexOf('s') != -1
        let i = parseInt(indexId[1])
        let data = this.getTreeNode(parentId)
        let list = isSuccess ? data.successList : data.failList
        list.splice(i, 1)
    }
}
