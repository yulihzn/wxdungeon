import TalentIcon from "./TalentIcon";
import Talent from "../Talent/Talent";
import TalentData from "../Data/TalentData";
import Logic from "../Logic";
import { EventHelper } from "../EventHelper";
import AudioPlayer from "../Utils/AudioPlayer";

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
    public static readonly TREE_MAGIC = 4;
    public static readonly TREE_ARCHER = 5;
    @property(cc.Label)
    labelDesc: cc.Label = null;
    @property(cc.Label)
    labelTitle: cc.Label = null;
    @property()
    treeType = 0;
    private talentShield:cc.Node[] = [];
    private talentDash:cc.Node[] = [];
    private talentMagic:cc.Node[] = [];
    hasPicked = false;
    static TEXT_PICKSKILL = '选择合适的技能（按住查看技能）';
    private selectIcon:TalentIcon;
    private graphics:cc.Graphics;
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.labelDesc)this.labelDesc.string = TalentTree.TEXT_PICKSKILL;
        this.talentShield = new Array();
        this.talentDash = new Array();
        this.talentMagic = new Array();
        this.initTalentSprite('talentdash',this.talentDash);
        this.initTalentSprite('talentshield',this.talentShield);
        this.initTalentSprite('talentmagic',this.talentMagic);
      
        if(this.treeType == TalentTree.TREE_SIMPLE){
            this.initTalentNode(Talent.SHIELD_01,this.talentShield,0,[],[]);
            this.initTalentNode(Talent.DASH_01,this.talentDash,0,[],[]);
            this.initTalentNode(Talent.MAGIC_01,this.talentMagic,0,[],[]);
        }else if(this.treeType == TalentTree.TREE_SHIELD){
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
        }else if(this.treeType == TalentTree.TREE_DASH){
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
        }else if(this.treeType == TalentTree.TREE_MAGIC){
            this.initMagicNode(Talent.MAGIC_01,0,[],[2,4,7,10,13]);
            this.initMagicNode(Talent.MAGIC_02,1,[9,12,15],[]);
            this.initMagicNode(Talent.MAGIC_03,2,[0],[3]);
            this.initMagicNode(Talent.MAGIC_04,3,[2],[]);
            this.initMagicNode(Talent.MAGIC_05,4,[0],[6]);
            this.initMagicNode(Talent.MAGIC_06,5,[6],[]);
            this.initMagicNode(Talent.MAGIC_07,6,[4],[5]);
            this.initMagicNode(Talent.MAGIC_08,7,[0],[8]);
            this.initMagicNode(Talent.MAGIC_09,8,[7],[9]);
            this.initMagicNode(Talent.MAGIC_10,9,[8],[1]);
            this.initMagicNode(Talent.MAGIC_11,10,[0],[11]);
            this.initMagicNode(Talent.MAGIC_12,11,[10],[12]);
            this.initMagicNode(Talent.MAGIC_13,12,[11],[1]);
            this.initMagicNode(Talent.MAGIC_14,13,[0],[14]);
            this.initMagicNode(Talent.MAGIC_15,14,[13],[15]);
            this.initMagicNode(Talent.MAGIC_16,15,[14],[1]);
        }
        cc.director.on(EventHelper.TALENT_TREE_UPDATE
            , (event) => { if(this.node&&this.node.active){this.hasPicked = true;} });
    }
    get SelectIcon(){
        return this.selectIcon;
    }
    initTalentSprite(name:string,talentList:cc.Node[]){
        let length = 14;
        if(this.treeType == TalentTree.TREE_MAGIC){
            length = 16;
        }
        for(let i = 0;i < length;i++){
            if(this.treeType == TalentTree.TREE_SIMPLE && i >0){
                break;
            }
            
            let index = i<9?`0${i+1}`:`${i+1}`;
            let node = this.node.getChildByName('layout').getChildByName('talentempty').getChildByName(`${name}${index}`);
            if(!node){
                cc.log('worng skill name');
                break;
            }
            node.addComponent(TalentIcon);
            node.color = cc.color(51, 51, 51);
            node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch)=> {
                if(this.labelDesc)this.labelDesc.string = node.getComponent(TalentIcon).data.desc;
                if(this.labelTitle)this.labelTitle.string = node.getComponent(TalentIcon).data.nameCn;
            }, this);
            node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch)=> {
            }, this);
            node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch)=> {
                let t = node.getComponent(TalentIcon);
                if(!t.isOpen){
                    if(this.selectIcon)this.selectIcon.node.color = cc.color(51, 51, 51);
                    this.selectIcon = node.getComponent(TalentIcon);
                    node.color = cc.color(255, 255, 255);
                    AudioPlayer.play(AudioPlayer.SELECT);
                    cc.director.emit(EventHelper.TALENT_TREE_SELECT);
                }
            }, this);
            talentList.push(node);
        }
    }
    private drawLines(pos1:cc.Vec3,pos2:cc.Vec3){
        if(!this.graphics){
            this.graphics = this.getComponent(cc.Graphics);
        }
        if(!this.graphics){
            return;
        }
        this.graphics.lineWidth = 2;
        this.graphics.moveTo(pos1.x,pos1.y);
        this.graphics.lineTo(pos2.x,pos2.y);
        this.graphics.close();
        this.graphics.stroke();
    }
    talentClick(){
        if(this.selectIcon){
            this.selectIcon.onClick();
        }
    }
    initShieldNode(id:number,index:number,parentIndexs:number[],childrenIndexs:number[]){
        if(this.treeType != TalentTree.TREE_SHIELD){
           return; 
        }
        this.initTalentNode(id,this.talentShield,index,parentIndexs,childrenIndexs);
    }
    initDashNode(id:number,index:number,parentIndexs:number[],childrenIndexs:number[]){
        if(this.treeType != TalentTree.TREE_DASH){
            return; 
         }
        this.initTalentNode(id,this.talentDash,index,parentIndexs,childrenIndexs);
    }
    initMagicNode(id:number,index:number,parentIndexs:number[],childrenIndexs:number[]){
        if(this.treeType != TalentTree.TREE_MAGIC){
            return; 
         }
        this.initTalentNode(id,this.talentMagic,index,parentIndexs,childrenIndexs);
    }
    initTalentNode(id:number,talentList:cc.Node[],index:number,parentIndexs:number[],childrenIndexs:number[]){
        if(index < 0 || index > talentList.length-1){
            return;
        }
        let icon = talentList[index].getComponent(TalentIcon);
        icon.parents = new Array();
        icon.data = new TalentData();
        icon.data.id = id;
        if(id<Talent.SHIELD){
            icon.data.nameCn = Talent.DASH_DESC[id%Talent.DASH-1].split(';')[0];
            icon.data.desc = Talent.DASH_DESC[id%Talent.DASH-1].split(';')[1];
        }else if(id<Talent.MAGIC){
            icon.data.nameCn = Talent.SHIELD_DESC[id%Talent.SHIELD-1].split(';')[0];
            icon.data.desc = Talent.SHIELD_DESC[id%Talent.SHIELD-1].split(';')[1];
        }else if(id<Talent.ARCHER){
            icon.data.nameCn = Talent.MAGIC_DESC[id%Talent.MAGIC-1].split(';')[0];
            icon.data.desc = Talent.MAGIC_DESC[id%Talent.MAGIC-1].split(';')[1];
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
            let p1 = icon.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            p1 = this.node.convertToNodeSpaceAR(p1);
            let p2 = talentList[i].convertToWorldSpaceAR(cc.Vec3.ZERO);
            p2 = this.node.convertToNodeSpaceAR(p2);
            this.drawLines(p1,p2);
        }
    }
    start () {

    }

    // update (dt) {}
}
