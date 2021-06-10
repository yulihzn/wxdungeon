import ItemData from "../Data/ItemData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemDialog extends cc.Component {
    @property(cc.Label)
    labelTitle: cc.Label = null;
    @property(cc.Label)
    infoBase: cc.Label = null;//基础属性
    @property(cc.Label)
    infoDesc: cc.Label = null;//描述
    @property(cc.Label)
    count: cc.Label = null;//数量
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start() {
        this.node.opacity = 0;
    }
    private refreshDialog(item: ItemData) {
        this.labelTitle.string = `${item.nameCn}`;
        this.infoBase.string = `价格：${item.price}\n${item.info}`;
        this.infoDesc.string = item.desc;
        this.count.string = `${item.count>0?'×'+item.count:'∞'}`
    }
    showDialog(item: ItemData) {
        this.node.opacity = 255;
        this.refreshDialog(item);
    }
    hideDialog() {
        this.node.opacity = 0;
    }
}
