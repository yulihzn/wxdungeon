import QuestData from '../data/QuestData'
import QuestTreeData from '../data/QuestTreeData'
import QuestCard from '../ui/QuestCard'
const { ccclass, property } = cc._decorator

@ccclass
export default class QuestFileEditManager extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null
    @property(cc.EditBox)
    editBox: cc.EditBox = null
    @property(cc.Node)
    layout: cc.Node = null
    @property(cc.Prefab)
    questCard: cc.Prefab = null
    questTree: QuestTreeData = new QuestTreeData()
    startPos = cc.v3(0, 0)
    touchPos = cc.v2(0, 0)
    cardList: QuestCard[] = []
    protected onLoad(): void {
        this.layout.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.touchPos = event.getLocation()
            this.startPos = this.layout.position.clone()
        })
        this.layout.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let offset = event.getLocation().sub(this.touchPos).mul(0.5)
            this.layout.setPosition(this.startPos.x + offset.x, this.startPos.y + offset.y)
        })
        this.layout.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {})
        this.layout.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {})
    }
    private addQuestNode(parentCard: QuestCard, data: QuestData) {
        let cardNode = cc.instantiate(this.questCard)
        let card = cardNode.getComponent(QuestCard)
        card.updateData(data)
        this.layout.addChild(cardNode)
        this.cardList.push(card)
        if (parentCard) {
            parentCard.cardList.push(card)
        }
        cc.log(this.cardList.length)
        for (let c of data.successList) {
            this.addQuestNode(card, c)
        }
        for (let c of data.failList) {
            this.addQuestNode(card, c)
        }
    }
    updateTree() {
        this.layout.removeAllChildren()
        this.cardList = []
        this.addQuestNode(null, this.questTree.root)
    }

    //button
    buttonUpload() {
        this.uploadForBrowser()
    }
    //button
    buttonSave() {
        this.questTree.name = this.questTree.name + 'test'
        this.saveForBrowser(JSON.stringify(this.questTree), this.editBox.string)
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
