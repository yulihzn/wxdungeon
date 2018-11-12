import Status from "../Status";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class StatusManager extends cc.Component {
    iceStatus: Status = null;
    fireStatus: Status = null;
    dizzStatus: Status = null;
    toxicStatus: Status = null;
    curseStatus: Status = null;
    bleedStatus: Status = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.iceStatus = this.node.getChildByName('ice').getComponent(Status);
        this.fireStatus = this.node.getChildByName('fire').getComponent(Status);
        this.dizzStatus = this.node.getChildByName('dizz').getComponent(Status);
        this.toxicStatus = this.node.getChildByName('toxic').getComponent(Status);
        this.curseStatus = this.node.getChildByName('curse').getComponent(Status);
        this.bleedStatus = this.node.getChildByName('bleed').getComponent(Status);
        this.iceStatus.node.active = false;
        this.fireStatus.node.active = false;
        this.dizzStatus.node.active = false;
        this.toxicStatus.node.active = false;
        this.curseStatus.node.active = false;
        this.bleedStatus.node.active = false;
    }

    start () {

    }
    addStatus(type:number,duration:number){
        switch(type){
            case Status.ICE:this.iceStatus.node.active = true;this.iceStatus.showStatus(duration);break;
            case Status.FIRE:this.fireStatus.node.active = true;this.fireStatus.showStatus(duration);break;
            case Status.DIZZ:this.dizzStatus.node.active = true;this.dizzStatus.showStatus(duration);break;
            case Status.TOXIC:this.toxicStatus.node.active = true;this.toxicStatus.showStatus(duration);break;
            case Status.CURSE:this.curseStatus.node.active = true;this.curseStatus.showStatus(duration);break;
            case Status.BLEED:this.bleedStatus.node.active = true;this.bleedStatus.showStatus(duration);break;
        }
    }

    // update (dt) {}
}
