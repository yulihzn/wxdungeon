import TalentIcon from "./TalentIcon";
import Talent from "../Talent/Talent";
import TalentData from "../Data/TalentData";
import Logic from "../Logic";
import { EventConstant } from "../EventConstant";

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

    public static readonly TREE_ALL = 0;
    public static readonly TREE_SHIELD = 1;
    public static readonly TREE_DASH = 2;
    public static readonly TREE_SIMPLE = 3;
    @property(cc.Label)
    labelDesc: cc.Label = null;
    @property()
    treeType = 0;
    private talentShield:cc.Node[] = [];
    private talentDash:cc.Node[] = [];
    hasPicked = false;
    static TEXT_PICKSKILL = '选择合适的技能（按住查看技能）';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.labelDesc)this.labelDesc.string = TalentTree.TEXT_PICKSKILL;
        this.talentShield = new Array();
        this.talentDash = new Array();
        if(this.treeType != TalentTree.TREE_DASH){
            this.initTalentSprite('talentshield',this.talentShield);
         }
         if(this.treeType != TalentTree.TREE_SHIELD){
            this.initTalentSprite('talentdash',this.talentDash);
        }
        if(this.treeType == TalentTree.TREE_SIMPLE){
            this.initShieldNode(Talent.SHIELD_01,0,[],[]);
            this.initDashNode(Talent.DASH_01,0,[],[]);
        }else{
            this.initShieldNode(Talent.SHIELD_01,0,[],[1,5,11]);
            this.initShieldNode(Talent.SHIELD_02,1,[0],[2,3]);
            this.initShieldNode(Talent.SHIELD_03,2,[1],[4]);
            this.initShieldNode(Talent.SHIELD_04,3,[1],[4]);
            this.initShieldNode(Talent.SHIELD_05,4,[2,3],[]);
            this.initShieldNode(Talent.SHIELD_06,5,[0],[6,7,8,9]);
            this.initShieldNode(Talent.SHIELD_07,6,[5],[10]);
            this.initShieldNode(Talent.SHIELD_08,7,[5],[10]);
            this.initShieldNode(Talent.SHIELD_09,8,[5],[10]);
            this.initShieldNode(Talent.SHIELD_10,9,[5],[10]);
            this.initShieldNode(Talent.SHIELD_11,10,[6,7,8,9],[]);
            this.initShieldNode(Talent.SHIELD_12,11,[0],[12]);
            this.initShieldNode(Talent.SHIELD_13,12,[11],[13]);
            this.initShieldNode(Talent.SHIELD_14,13,[12],[]);

            this.initDashNode(Talent.DASH_01,0,[],[1,7,12]);
            this.initDashNode(Talent.DASH_02,1,[0],[2,3,4,5]);
            this.initDashNode(Talent.DASH_03,2,[1],[6]);
            this.initDashNode(Talent.DASH_04,3,[1],[6]);
            this.initDashNode(Talent.DASH_05,4,[1],[6]);
            this.initDashNode(Talent.DASH_06,5,[1],[6]);
            this.initDashNode(Talent.DASH_07,6,[2,3,4,5],[]);
            this.initDashNode(Talent.DASH_08,7,[0],[8,9]);
            this.initDashNode(Talent.DASH_09,8,[7],[10]);
            this.initDashNode(Talent.DASH_10,9,[7],[10]);
            this.initDashNode(Talent.DASH_11,10,[8,9],[]);
            this.initDashNode(Talent.DASH_12,11,[0],[12]);
            this.initDashNode(Talent.DASH_13,12,[11],[13]);
            this.initDashNode(Talent.DASH_14,13,[12],[]);
        }
        cc.director.on(EventConstant.TALENT_TREE_UPDATE
            , (event) => { if(this.node&&this.node.active){this.hasPicked = true;} });
    }
    initTalentSprite(name:string,talentList:cc.Node[]){
        for(let i = 0;i < 14;i++){
            if(this.treeType == TalentTree.TREE_SIMPLE && i >0){
                break;
            }
            let index = i<9?`0${i+1}`:`${i+1}`;
            let node = this.node.getChildByName('layout').getChildByName('talentempty').getChildByName(`${name}${index}`);
            node.addComponent(TalentIcon);
            node.color = cc.color(51, 51, 51);
            node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch)=> {
                if(this.labelDesc)this.labelDesc.string = node.getComponent(TalentIcon).data.desc;
            }, this);
            node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch)=> {
                if(this.labelDesc)this.labelDesc.string = '';
            }, this);
            node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch)=> {
                this.talentClick(node);
            }, this);
            talentList.push(node);
        }
    }
    talentClick(node:cc.Node):boolean{
        return node.getComponent(TalentIcon).onClick();
    }
    initShieldNode(id:number,index:number,parentIndexs:number[],childrenIndexs:number[]){
        if(this.treeType == TalentTree.TREE_DASH){
           return; 
        }
        this.initTalentNode(id,this.talentShield,index,parentIndexs,childrenIndexs);
    }
    initDashNode(id:number,index:number,parentIndexs:number[],childrenIndexs:number[]){
        if(this.treeType == TalentTree.TREE_SHIELD){
            return; 
         }
        this.initTalentNode(id,this.talentDash,index,parentIndexs,childrenIndexs);
    }
    initTalentNode(id:number,talentList:cc.Node[],index:number,parentIndexs:number[],childrenIndexs:number[]){
        let icon = talentList[index].getComponent(TalentIcon);
        icon.parents = new Array();
        icon.data = new TalentData();
        icon.data.id = id;
        if(id<2000000){
            icon.data.desc = Talent.DASH_DESC[id%1000000-1];
        }else{
            icon.data.desc = Talent.SHIELD_DESC[id%2000000-1];
        }
        icon.isOpen = Logic.hashTalent(id);
        if(icon.isOpen){
            icon.node.color = cc.color(255, 255, 255);
        }
        for(let i of parentIndexs){
            icon.parents.push(talentList[i]);
        }
        icon.children = new Array();
        for(let i of childrenIndexs){
            icon.children.push(talentList[i]);
        }
    }
    start () {

    }

    // update (dt) {}
}
