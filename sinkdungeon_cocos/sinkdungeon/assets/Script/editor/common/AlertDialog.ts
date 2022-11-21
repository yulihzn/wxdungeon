// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//任务卡片
const { ccclass, property } = cc._decorator

@ccclass
export default class AlertDialog extends cc.Component {
    @property(cc.Label)
    msg: cc.Label = null
    @property(cc.Button)
    ok: cc.Button = null
    @property(cc.Button)
    cancel: cc.Button = null
    callback: Function

    // LIFE-CYCLE CALLBACKS:

    onLoad() {}

    private showAnim() {
        this.node.active = true
    }
    private hideAnim() {
        this.node.active = false
    }
    public show(msg: string, ok: string, cancel: string, callback?: Function) {
        this.msg.string = msg
        this.ok.getComponentInChildren(cc.Label).string = ok
        this.cancel.node.active = cancel.length > 0
        this.cancel.getComponentInChildren(cc.Label).string = cancel
        this.callback = callback
        this.showAnim()
    }

    public hide() {
        this.hideAnim()
    }

    //button
    clickOk() {
        if (this.callback) {
            this.callback(true)
        }
        this.hide()
    }
    //button
    clickCancel() {
        if (this.callback) {
            this.callback(false)
        }
        this.hide()
    }
}
