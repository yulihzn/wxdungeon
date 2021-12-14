// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import StatusData from "../data/StatusData";
import Status from "../status/Status";
import StatusIconDialog from "./dialog/StatusIconDialog";
import StatusIcon from "./StatusIcon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StatusIconList extends cc.Component {

    @property(cc.Prefab)
    iconPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    dialogPrefab: cc.Prefab = null;

    dialog: StatusIconDialog;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dialog = this.initDialog();
    }
    private initDialog() {
        let node = cc.instantiate(this.dialogPrefab);
        node.parent = this.node;
        let dialog = node.getComponent(StatusIconDialog);
        dialog.hideDialog();
        return dialog;
    }
    getIcon(): StatusIcon {
        let statusNode: cc.Node = cc.instantiate(this.iconPrefab);
        statusNode.parent = this.node;
        statusNode.active = true;
        let icon = statusNode.getComponent(StatusIcon);
        this.addIconTouchEvent(icon);
        return icon;
    }
    private addIconTouchEvent(icon: StatusIcon) {
        icon.node.parent.on(cc.Node.EventType.TOUCH_START, () => {
            let data = icon.data;
            if (!data) {
                return;
            }
            let pos = this.node.convertToNodeSpaceAR(icon.node.parent.convertToWorldSpaceAR(cc.Vec3.ZERO));
            this.dialog.showDialog(pos.add(cc.v3(32, 0)), data);
        })
        icon.node.parent.on(cc.Node.EventType.TOUCH_END, () => {
            this.dialog.hideDialog();
        })
        icon.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.dialog.hideDialog();
        })
    }

    // update (dt) {}
}
