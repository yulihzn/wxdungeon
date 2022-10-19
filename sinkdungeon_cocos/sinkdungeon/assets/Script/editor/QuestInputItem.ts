// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import QuestFileEditor from './QuestFileEditor'

const { ccclass, property } = cc._decorator

@ccclass
export default class QuestInputItem extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null

    @property(cc.EditBox)
    editBox: cc.EditBox = null
    editor: QuestFileEditor

    // LIFE-CYCLE CALLBACKS:

    onLoad() {}

    get Value() {
        return this.editBox.string
    }
    set Value(value: string) {
        this.editBox.string = value
    }
    onTextChanged(text: string, editbox: cc.EditBox, customEventData) {
        this.editor.updateData()
    }
    start() {}

    // update (dt) {}
}
