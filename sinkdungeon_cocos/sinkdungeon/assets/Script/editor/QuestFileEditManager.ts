import QuestData from './data/QuestData'
import QuestTreeData from './data/QuestTreeData'
import QuestAlertDialog from './QuestAlertDialog'
import QuestCard from './QuestCard'
import QuestFileEditor from './QuestFileEditor'

const { ccclass, property } = cc._decorator

@ccclass
export default class QuestFileEditManager extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null
    @property(cc.EditBox)
    editBox: cc.EditBox = null
    @property(cc.Node)
    layout: cc.Node = null
    @property(cc.Node)
    zoomUp: cc.Node = null
    @property(cc.Node)
    zoomDown: cc.Node = null
    @property(cc.Prefab)
    questCard: cc.Prefab = null
    @property(cc.Node)
    revokeButton: cc.Node = null
    @property(cc.Node)
    revokeCancelButton: cc.Node = null
    @property(QuestFileEditor)
    editor: QuestFileEditor = null
    @property(QuestAlertDialog)
    alertDialog: QuestAlertDialog = null
    private questTree: QuestTreeData = new QuestTreeData()
    private revokeTreeList: QuestTreeData[] = []
    private revokeCancelTreeList: QuestTreeData[] = []
    private startPos = cc.v3(0, 0)
    private touchPos = cc.v2(0, 0)
    private cardList: QuestCard[] = []
    private currentSelectData: QuestData
    zoomOffset = 0
    private isCtrlPressing = false
    private isShiftPressing = false
    protected onLoad(): void {
        this.layout.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.touchPos = event.getLocation()
            this.startPos = this.layout.position.clone()
        })
        this.layout.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let offset = event.getLocation().sub(this.touchPos).mul(0.5)
            this.layout.setPosition(this.startPos.x + offset.x, this.startPos.y + offset.y)
        })
        this.layout.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.startPos.sub(this.layout.position).mag() < 5) {
                this.selectNone()
            }
        })
        this.layout.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {})

        this.zoomUp.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.zoomOffset = 0.025
        })
        this.zoomUp.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.zoomOffset = 0
        })
        this.zoomUp.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.zoomOffset = 0
        })
        this.zoomDown.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.zoomOffset = -0.025
        })
        this.zoomDown.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.zoomOffset = 0
        })
        this.zoomDown.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.zoomOffset = 0
        })
        this.layout.on(cc.Node.EventType.MOUSE_WHEEL, (event: cc.Event.EventMouse) => {
            this.zoom(event.getScrollY() > 0 ? 0.05 : -0.05)
        })
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
        this.editor.editManager = this
        this.editor.node.scaleX = 0
        this.alertDialog.node.active = false
    }
    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.ctrl:
                this.isCtrlPressing = true
                break
            case cc.macro.KEY.shift:
                this.isShiftPressing = true
                break
            case cc.macro.KEY.z:
                break
        }
    }
    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.ctrl:
                this.isCtrlPressing = false
                break
            case cc.macro.KEY.shift:
                this.isShiftPressing = false
                break
            case cc.macro.KEY.z:
                if (this.isCtrlPressing) {
                    if (this.isShiftPressing) {
                        this.revokeCancel()
                    } else {
                        this.revoke()
                    }
                }
                break
            case cc.macro.KEY.escape:
                this.selectNone()
                break
        }
    }
    protected update(dt: number): void {
        if (this.zoomOffset != 0) {
            this.zoom(this.zoomOffset)
        }
        this.revokeButton.active = this.revokeTreeList.length > 0
        this.revokeCancelButton.active = this.revokeCancelTreeList.length > 0
    }
    private zoom(offset: number) {
        this.layout.scale += offset
        if (this.layout.scale < 0) {
            this.layout.scale = 0.1
        }
    }
    private addQuestNode(parentCard: QuestCard, data: QuestData) {
        let cardNode = cc.instantiate(this.questCard)
        let card = cardNode.getComponent(QuestCard)
        card.editManager = this
        card.updateData(data)
        cardNode.parent = this.layout
        this.cardList.push(card)
        let pos = cc.v3(-300, -200)
        if (this.currentSelectData) {
            let mixId1 = `${this.currentSelectData.parentId},${this.currentSelectData.indexId}`
            let mixId2 = `${data.parentId},${data.indexId}`
            if (mixId1 == mixId2) {
                card.isSelected = true
                card.select.active = true
            }
        }
        if (parentCard) {
            parentCard.cardList.push(card)
            let y = 0
            if (data.isSuccessType) {
                y = QuestCard.SIZE * 0.75
            } else {
                y = -QuestCard.SIZE * 0.75
            }
            y += this.getRandomNum(-50, 50)
            pos = parentCard.node.position.add(cc.v3(QuestCard.SIZE * 1.5, y))
        }
        if (!cc.Vec3.ZERO.equals(data.editPos)) {
            pos = data.editPos.clone()
        }
        card.node.setPosition(pos.clone())
        // cc.log(`NEW:${card.data.parentId + card.data.indexId},x=${card.node.position.x},y=${card.node.position.y}`)
        this.questTree.updateTreeNodePos(data.indexId, data.parentId, pos)
        for (let i = 0; i < data.successList.length; i++) {
            let c = data.successList[i]
            QuestTreeData.updateIndexId(c, data, true, i)
            this.addQuestNode(card, c)
        }
        for (let i = 0; i < data.failList.length; i++) {
            let c = data.failList[i]
            QuestTreeData.updateIndexId(c, data, false, i)
            this.addQuestNode(card, c)
        }
    }
    private getRandomNum(min: number, max: number): number {
        //生成一个随机数从[min,max]
        return min + Math.round(Math.random() * (max - min))
    }
    selectNone(callback?: Function) {
        if (!this.editor.canHide()) {
            this.alertDialog.show('数据发生变化，是否放弃更改', '是', '否', (flag: boolean) => {
                if (flag) {
                    this.editor.hide()
                    for (let c of this.cardList) {
                        c.isSelected = false
                    }
                    this.currentSelectData = null
                    if (callback) {
                        callback()
                    }
                }
            })
        } else {
            for (let c of this.cardList) {
                c.isSelected = false
            }
            this.currentSelectData = null
            this.editor.hide()
            if (callback) {
                callback()
            }
        }
    }
    selectCard(card: QuestCard) {
        if (card.isSelected) {
            return
        }
        this.selectNone(() => {
            for (let c of this.cardList) {
                c.isSelected = false
            }
            this.currentSelectData = card.data
            card.isSelected = true
            this.editor.show(this.getTreeNode(card.data.indexId, card.data.parentId))
        })
    }
    private updateRevokTreeList(newTree: QuestTreeData) {
        this.revokeTreeList.push(this.questTree)
        this.questTree = newTree
        this.updateTree()
    }
    updateTreeNodePos(indexId: string, parentId: string, pos: cc.Vec3) {
        let newTree = new QuestTreeData()
        newTree.valueCopy(this.questTree)
        newTree.updateTreeNodePos(indexId, parentId, pos)
        this.updateRevokTreeList(newTree)
    }
    updateTreeNodeData(indexId: string, parentId: string, data: QuestData) {
        let newTree = new QuestTreeData()
        newTree.valueCopy(this.questTree)
        newTree.updateTreeNodeData(indexId, parentId, data)
        this.updateRevokTreeList(newTree)
    }
    addTreeNode(indexId: string, parentId: string, isSuccessType: boolean, newdata: QuestData) {
        let newTree = new QuestTreeData()
        newTree.valueCopy(this.questTree)
        newTree.addTreeNode(indexId, parentId, isSuccessType, newdata)
        this.updateRevokTreeList(newTree)
    }
    removeTreeNode(indexId: string, parentId: string) {
        let newTree = new QuestTreeData()
        newTree.valueCopy(this.questTree)
        newTree.removeTreeNode(indexId, parentId)
        this.updateRevokTreeList(newTree)
    }
    getTreeNode(indexId: string, parentId: string) {
        let mixId = `${parentId},${indexId}`
        return this.questTree.getTreeNode(mixId)
    }
    //button
    revoke() {
        this.selectNone(() => {
            if (this.revokeTreeList.length > 0) {
                //当前修改入栈取消列表里,撤销列表出栈
                this.revokeCancelTreeList.push(this.questTree)
                this.questTree = this.revokeTreeList.pop()
                this.updateTree()
            }
        })
    }
    //button
    revokeCancel() {
        this.selectNone(() => {
            if (this.revokeCancelTreeList.length > 0) {
                this.revokeTreeList.push(this.questTree)
                this.questTree = this.revokeCancelTreeList.pop()
                this.updateTree()
            }
        })
    }
    updateTree() {
        this.layout.removeAllChildren()
        this.cardList = []
        this.addQuestNode(null, this.questTree.root)
    }

    //button
    buttonUpload() {
        this.selectNone(() => {
            this.uploadForBrowser()
        })
    }
    //button
    buttonSave() {
        this.selectNone(() => {
            this.questTree.name = this.questTree.name
            let name = this.editBox.string
            if (name.length < 1) {
                this.showLog('need a name!')
                return
            }
            this.saveForBrowser(JSON.stringify(this.questTree), this.editBox.string)
        })
    }
    showLog(msg: string) {
        this.label.string = msg
        this.unscheduleAllCallbacks()
        this.scheduleOnce(() => {
            this.label.string = ''
        }, 10)
    }
    //button
    newQuestTree() {
        this.selectNone(() => {
            this.questTree = new QuestTreeData()
            this.questTree.id = 'quest000'
            this.questTree.name = '测试树'
            this.questTree.root.name = '序章'
            this.questTree.root.content = '开始卷'
            this.editBox.string = this.questTree.id
            this.label.string = this.questTree.name
            this.revokeTreeList = []
            this.revokeCancelTreeList = []
            this.updateTree()
        })
    }
    private uploadForBrowser() {
        if (!cc.sys.isBrowser) return
        let input = document.createElement('input')
        input.type = 'file'
        input.onchange = e => {
            let files = e.target['files']
            if (files.length == 0) {
                return
            }
            let fileReader = new FileReader()
            fileReader.onload = e => {
                //获得数据
                let dataURL = e.target.result as string
                cc.assetManager.loadRemote(dataURL, (err: Error, resource: any) => {
                    if (err) {
                        cc.error(err)
                    } else {
                        this.questTree.valueCopy(JSON.parse(resource._nativeAsset))
                        this.editBox.string = this.questTree.id
                        this.label.string = this.questTree.name
                        cc.log(`加载任务列表完成`)
                        //清空修改列表
                        this.revokeTreeList = []
                        this.revokeCancelTreeList = []
                        this.updateTree()
                    }
                })
            }
            fileReader.readAsDataURL(files[0])
        }
        input.click()
    }

    /**保存字符串内容到文件。效果相当于从浏览器下载了一个文件到本地。
     * @param textToWrite 要保存的文件内容
     * @param fileNameToSaveAs 要保存的文件名
     */
    private saveForBrowser(textToWrite: string, fileNameToSaveAs: string) {
        if (!cc.sys.isBrowser) return
        var textFileAsBlob = new Blob([textToWrite], { type: 'text' })
        var downloadLink = document.createElement('a')
        downloadLink.download = fileNameToSaveAs
        downloadLink.innerHTML = 'Download File'
        if (window.webkitURL != null) {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            // var url = window.webkitURL.createObjectURL(textFileAsBlob);

            // var downloader = new jsb.Downloader({
            //     // This will match all url with .scene extension or all url with scene type
            //     'scene': function (url, callback) { }
            // });
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob)
        } else {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob)
            downloadLink.onclick = function () {
                if (downloadLink) document.body.removeChild(downloadLink)
            }
            downloadLink.style.display = 'none'
            document.body.appendChild(downloadLink)
        }
        downloadLink.click()
    }
}
