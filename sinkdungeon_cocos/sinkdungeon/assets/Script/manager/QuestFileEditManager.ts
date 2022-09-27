import QuestTreeData from '../data/QuestTreeData'
const { ccclass, property } = cc._decorator

@ccclass
export default class QuestFileEditManager extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null
    @property(cc.EditBox)
    editBox: cc.EditBox = null
    questTree: QuestTreeData = new QuestTreeData()
    buttonUpload() {
        this.uploadForBrowser()
    }
    buttonSave() {
        this.questTree.name = this.questTree.name + 'test'
        this.saveForBrowser(JSON.stringify(this.questTree), this.editBox.string)
    }
    uploadForBrowser() {
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
                        this.label.string = JSON.stringify(this.questTree)
                        cc.log(`加载任务列表完成`)
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
    saveForBrowser(textToWrite: string, fileNameToSaveAs: string) {
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
