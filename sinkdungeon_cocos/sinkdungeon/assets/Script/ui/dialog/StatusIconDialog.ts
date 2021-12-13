
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import StatusData from "../../data/StatusData";
import Logic from "../../logic/Logic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StatusIconDialog extends cc.Component {
    @property(cc.Node)
    layout: cc.Node = null;
    @property(cc.Label)
    labelTitle: cc.Label = null;
    @property(cc.Label)
    infoBase: cc.Label = null;//基础属性
    @property(cc.Label)
    info1: cc.Label = null;//附加词条1
    @property(cc.Label)
    info2: cc.Label = null;//附加词条2
    @property(cc.Label)
    info3: cc.Label = null;//附加词条3
    @property(cc.Label)
    extraInfo: cc.Label = null;//附加词条4
    @property(cc.Label)
    infoDesc: cc.Label = null;//描述
    @property(cc.Label)
    count: cc.Label = null;//时间
    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    }

    private refreshStatusInfo(data: StatusData) {
        this.layout.color = cc.Color.WHITE;
        this.infoBase.node.active = true;
        this.info1.node.active = true;
        this.info2.node.active = true;
        this.info3.node.active = true;
        this.extraInfo.node.active = true;
        this.labelTitle.string = data.nameCn;
        this.infoBase.string = `${data.infobase}`;
        this.infoBase.node.color = this.infoBase.node.color.fromHEX(data.infobasecolor);
        this.info1.string = data.info1;
        this.info1.node.color = this.info1.node.color.fromHEX(data.infocolor1);
        this.info2.string = data.info2;
        this.info2.node.color = this.info2.node.color.fromHEX(data.infocolor2);
        this.info3.string = data.info3;
        this.info3.node.color = this.info3.node.color.fromHEX(data.infocolor3);
        this.extraInfo.string = data.extraInfo;
        this.infoDesc.string = data.desc;
        this.infoBase.node.active = this.infoBase.string.length > 0;
        this.info1.node.active = this.info1.string.length > 0;
        this.info2.node.active = this.info2.string.length > 0;
        this.info3.node.active = this.info3.string.length > 0;
        this.extraInfo.node.active = this.extraInfo.string.length > 0;
        this.count.string = `${data.duration}`;
        if(data.duration == -1){
            this.count.string = '∞';
        }
        this.count.string = `${data.duration > 0 ? data.duration : '∞'}`;
        this.labelTitle.node.color = this.labelTitle.node.color.fromHEX('#F4C021');
    }
    
    public showDialog(position: cc.Vec3, statusData: StatusData) {
        this.refreshStatusInfo(statusData);
        this.node.active = true;
        this.node.position = position.clone();
    }
    hideDialog() {
        this.node.active = false;
    }

}
