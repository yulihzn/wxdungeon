import TalentIcon from "./TalentIcon";

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
    private talentDash:cc.Node[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.talentShield = new Array();
        this.talentDash = new Array();
        for(let i = 0;i < 14;i++){
            let index = i<9?`0${i+1}`:`${i+1}`;
            let nodeshield = this.node.getChildByName('layout').getChildByName('talentempty').getChildByName(`talentshield${index}`);
            let nodedash = this.node.getChildByName('layout').getChildByName('talentempty').getChildByName(`talentdash${index}`);
            nodeshield.addComponent(TalentIcon);
            nodedash.addComponent(TalentIcon);
            nodeshield.color = cc.color(51, 51, 51);
            nodedash.color = cc.color(51, 51, 51);
            nodeshield.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch)=> {
                this.talentClick(nodeshield);
            }, this);
            nodedash.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch)=> {
                this.talentClick(nodedash);
            }, this);
            this.talentShield.push(nodeshield);
            this.talentDash.push(nodedash);
        }
        this.initShieldNode(0,[],[1,5,11]);
        this.initShieldNode(1,[0],[2,3]);
        this.initShieldNode(2,[1],[4]);
        this.initShieldNode(3,[1],[4]);
        this.initShieldNode(4,[2,3],[]);
        this.initShieldNode(5,[0],[6,7,8,9]);
        this.initShieldNode(6,[5],[10]);
        this.initShieldNode(7,[5],[10]);
        this.initShieldNode(8,[5],[10]);
        this.initShieldNode(9,[5],[10]);
        this.initShieldNode(10,[6,7,8,9],[]);
        this.initShieldNode(11,[0],[12]);
        this.initShieldNode(12,[11],[13]);
        this.initShieldNode(13,[12],[]);

        this.initDashNode(0,[],[1,7,12]);
        this.initDashNode(1,[0],[2,3,4,5]);
        this.initDashNode(2,[1],[6]);
        this.initDashNode(3,[1],[6]);
        this.initDashNode(4,[1],[6]);
        this.initDashNode(5,[1],[6]);
        this.initDashNode(6,[2,3,4,5],[]);
        this.initDashNode(7,[0],[8,9,10]);
        this.initDashNode(8,[7],[11]);
        this.initDashNode(9,[7],[11]);
        this.initDashNode(10,[7],[11]);
        this.initDashNode(11,[8,9,10],[]);
        this.initDashNode(12,[0],[13]);
        this.initDashNode(13,[12],[]);
    }
    talentClick(node:cc.Node){
        node.getComponent(TalentIcon).onClick();
    }
    initShieldNode(index:number,parentIndexs:number[],childrenIndexs:number[]){
        this.talentShield[index].getComponent(TalentIcon).parents = new Array();
        for(let i of parentIndexs){
            this.talentShield[index].getComponent(TalentIcon).parents.push(this.talentShield[i]);
        }
        this.talentShield[index].getComponent(TalentIcon).children = new Array();
        for(let i of childrenIndexs){
            this.talentShield[index].getComponent(TalentIcon).children.push(this.talentShield[i]);
        }
    }
    initDashNode(index:number,parentIndexs:number[],childrenIndexs:number[]){
        this.talentDash[index].getComponent(TalentIcon).parents = new Array();
        for(let i of parentIndexs){
            this.talentDash[index].getComponent(TalentIcon).parents.push(this.talentDash[i]);
        }
        this.talentDash[index].getComponent(TalentIcon).children = new Array();
        for(let i of childrenIndexs){
            this.talentDash[index].getComponent(TalentIcon).children.push(this.talentDash[i]);
        }
    }
    start () {

    }

    // update (dt) {}
}
