// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TalentTree extends cc.Component {

    private talentShield:cc.Node[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.talentShield = new Array();
        for(let i = 0;i < 14;i++){
            let index = i<9?`0${i+1}`:`${i+1}`;
            this.talentShield.push(this.node.getChildByName('layout').getChildByName('talentempty').getChildByName(`talentshield${index}`));
        }
        let l = this.talentShield.length;
    }

    start () {

    }

    // update (dt) {}
}
