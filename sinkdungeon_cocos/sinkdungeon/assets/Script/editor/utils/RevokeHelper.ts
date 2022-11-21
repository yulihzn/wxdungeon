export default class RevokeHelper<T> {
    private data: T = null
    private revokeList: T[] = []
    private revokeCancelList: T[] = []
    constructor(data: T) {
        this.data = data
    }
    reset(data: T) {
        this.data = data
        this.revokeList = []
        this.revokeCancelList = []
    }
    get Data() {
        return this.data
    }
    get RevokeLength() {
        return this.revokeList.length
    }
    get RevokeCancelLength() {
        return this.revokeCancelList.length
    }
    revoke() {
        return new Promise<T>(resolve => {
            if (this.revokeList.length > 0) {
                //当前修改入栈取消列表里,撤销列表出栈
                this.revokeCancelList.push(this.data)
                this.data = this.revokeList.pop()
                resolve(this.data)
            }
        })
    }
    revokeCancel() {
        return new Promise<T>(resolve => {
            if (this.revokeCancelList.length > 0) {
                this.revokeList.push(this.data)
                this.data = this.revokeCancelList.pop()
                resolve(this.data)
            }
        })
    }
    addNode(newData: T) {
        return new Promise<T>(resolve => {
            this.revokeList.push(this.data)
            this.data = newData
            resolve(this.data)
        })
    }
}
