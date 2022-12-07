import { EventHelper } from '../../logic/EventHelper'
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import AudioPlayer from '../../utils/AudioPlayer'
import BaseDialog from './BaseDialog'

//再次确认弹窗
const { ccclass, property } = cc._decorator

@ccclass
export default class GameAlertDialog extends BaseDialog {
    @property(cc.Label)
    msg: cc.Label = null
    @property(cc.Button)
    ok: cc.Button = null
    @property(cc.Button)
    cancel: cc.Button = null
    private static callback: Function

    public init(msg: string, ok: string, cancel: string) {
        this.msg.string = msg
        this.ok.getComponentInChildren(cc.Label).string = ok
        this.cancel.node.active = cancel.length > 0
        this.cancel.getComponentInChildren(cc.Label).string = cancel
    }
    static show(msg: string, ok: string, cancel: string, callback?: Function) {
        EventHelper.emit(EventHelper.DIALOG_ALERT_SHOW, { msg: msg, ok: ok, cancel: cancel })
        if (callback) {
            GameAlertDialog.callback = callback
        }
    }

    show() {
        super.show()
    }
    // update (dt) {}
    close() {
        AudioPlayer.play(AudioPlayer.SELECT)
        this.dismiss()
    }

    //button
    clickOk() {
        if (GameAlertDialog.callback) {
            GameAlertDialog.callback(true)
        }
        this.close()
    }
    //button
    clickCancel() {
        if (GameAlertDialog.callback) {
            GameAlertDialog.callback(false)
        }
        this.close()
    }
}
