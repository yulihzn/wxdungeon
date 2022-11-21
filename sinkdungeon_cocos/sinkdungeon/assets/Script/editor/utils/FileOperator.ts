/**
 * 文件保存工具
 */
export default class FileOperator {
    showLog = false
    constructor(showLog?: boolean) {
        this.showLog = showLog
    }
    private fileHandle: any
    /**
     * 清空所选文件
     */
    clear() {
        this.fileHandle = null
    }
    getFileHandle() {
        return this.fileHandle
    }
    getCurrentFileName() {
        if (this.fileHandle) {
            return this.fileHandle.name
        } else {
            return ''
        }
    }
    /**
     * 打开json文件
     * @param callback code:状态code msg
     */
    openJsonFile() {
        return new Promise<string>((resolve, reject) => {
            window
                //@ts-ignore
                .showOpenFilePicker({
                    multiple: false, // 取消多选
                    excludeAcceptAllOption: true,
                    types: [
                        {
                            description: '选择JSON文件',
                            accept: {
                                'application/json': ['.json']
                            }
                        }
                    ]
                })
                .then(fileHandles => {
                    const [fh] = fileHandles
                    this.fileHandle = fh
                    fh.getFile().then(file => {
                        if (this.showLog) {
                            console.log('file:', file)
                        }
                        // 读取文本内容
                        const reader = new FileReader()
                        reader.onload = e => {
                            if (this.showLog) {
                                console.log(`打开文件: ${fh.name}\n文件内容:\n\n%c${e.target.result}`, 'color:#35ccbf;fontsize: 20px;')
                            }
                            resolve(`${e.target.result}`)
                        }
                        reader.readAsText(file)
                    })
                })
                .catch(err => {
                    if (err.name == 'AbortError') {
                        if (this.showLog) {
                            console.log(`取消保存`)
                        }
                    } else {
                        console.error(`showOpenFilePicker打开失败: ${this.fileHandle.name}`)
                        this.uploadForBrowser()
                            .then(value => {
                                resolve(value)
                            })
                            .catch(err => {
                                reject(err)
                            })
                    }
                })
        })
    }
    /**
     * 保存json文件
     * @param textToWrite 需要保存的字符串内容
     * @param fileNameToSaveAs 文件名（如果已经有打开的文件，直接保存在打开的文件,否则会新建一个
     * @returns
     */
    async saveJsonFile(textToWrite: string, fileNameToSaveAs: string) {
        return new Promise<string>(async (resolve, reject) => {
            try {
                if (!this.fileHandle) {
                    this.newFileWrite(textToWrite, fileNameToSaveAs)
                        .then(value => {
                            resolve(value)
                        })
                        .catch(err => {
                            reject(err)
                        })
                    return
                }
                const writableStream = await this.fileHandle.createWritable()
                // 写入文件
                await writableStream.write(textToWrite)
                await writableStream.close()
                resolve(`保存成功: ${this.fileHandle.name}`)
                if (this.showLog) {
                    console.log(`保存成功: ${this.fileHandle.name}`)
                }
            } catch (error) {
                if (error.name == 'AbortError') {
                    if (this.showLog) {
                        console.log('取消保存')
                    }
                } else {
                    console.error(`保存失败writableStream: ${this.fileHandle.name}`)
                    this.newFileWrite(textToWrite, fileNameToSaveAs)
                        .then(value => {
                            resolve(value)
                        })
                        .catch(err => {
                            reject(err)
                        })
                }
            }
        })
    }
    private newFileWrite(textToWrite: string, fileNameToSaveAs: string) {
        return new Promise<string>(async (resolve, reject) => {
            window
                //@ts-ignore
                .showSaveFilePicker({
                    suggestedName: fileNameToSaveAs, // 待写入的文件名
                    types: [
                        {
                            description: '保存JSON文件',
                            accept: {
                                'application/json': ['.json']
                            }
                        }
                    ]
                })
                .then(async writeHandle => {
                    this.fileHandle = writeHandle
                    // create a FileSystemWritableFileStream to write to
                    const writableStream = await writeHandle.createWritable()
                    // 写入文件
                    await writableStream.write(textToWrite)
                    // close the file and write the contents to disk.
                    await writableStream.close()
                    if (this.showLog) {
                        console.log(`保存成功: ${writeHandle.name}`)
                    }
                    resolve(`保存成功: ${writeHandle.name}`)
                })
                .catch(err => {
                    if (err.name == 'AbortError') {
                        if (this.showLog) {
                            console.log('取消保存')
                        }
                    } else {
                        console.error('showSaveFilePicker保存失败,尝试下载方式: ', err)
                        this.saveForBrowser(textToWrite, fileNameToSaveAs)
                            .then(msg => {
                                resolve(msg)
                            })
                            .catch(err => {
                                reject(err)
                            })
                    }
                })
        })
    }

    private uploadForBrowser() {
        return new Promise<string>((resolve, reject) => {
            try {
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
                        resolve(`${dataURL}`)
                    }
                    fileReader.readAsText(files[0], 'utf-8')
                    // fileReader.readAsDataURL(files[0])
                }
                input.click()
            } catch (error) {
                reject(error)
            }
        })
    }

    /**保存字符串内容到文件。效果相当于从浏览器下载了一个文件到本地。
     * @param textToWrite 要保存的文件内容
     * @param fileNameToSaveAs 要保存的文件名
     */
    private saveForBrowser(textToWrite: string, fileNameToSaveAs: string) {
        return new Promise<string>((resolve, reject) => {
            try {
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
                resolve(`下载成功: ${fileNameToSaveAs}`)
            } catch (error) {
                reject(error)
            }
        })
    }
}
