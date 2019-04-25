import Logic from "../Logic";
import TalentData from "../Data/TalentData";
import { EventConstant } from "../EventConstant";
import Talent from "../Talent/Talent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentIcon extends cc.Component {
    parents: cc.Node[] = null;
    children: cc.Node[] = null;
    currentChild: cc.Node = null;
    currentParent: cc.Node = null;
    isOpen = false;
    isRoot = false;
    data:TalentData;
    onLoad() {
        this.node.color = cc.color(51, 51, 51);
    }
    onClick():boolean {
        // this.isOpen = !this.isOpen;
        // if (this.isOpen) {
        //     this.openTalent();
        // } else {
        //     // this.disconnectNode(this);
        //     // this.closeAllChildren(this.children)
        // }
        if(!this.isOpen){
            this.openTalent();
        }
        return false;
    }
    openTalent():boolean{
        this.isOpen = this.checkCanOpen();
        if (this.isOpen) {
            this.node.color = cc.color(255, 255, 255);
            cc.director.emit(EventConstant.TALENT_TREE_UPDATE);
            return Logic.addTalent(this.data.id);
        }
        return false; 
    }
    checkCanOpen():boolean{
        if (this.data.id == Talent.SHIELD_01) {
            return true;
        } else if (this.data.id == Talent.SHIELD_02) {
            return this.hasTalent(Talent.SHIELD_01);
        } else if (this.data.id == Talent.SHIELD_03) {
            return this.hasTalent(Talent.SHIELD_02)
            &&!this.hasTalent(Talent.SHIELD_04);
        } else if (this.data.id == Talent.SHIELD_04) {
            return this.hasTalent(Talent.SHIELD_02)
            &&!this.hasTalent(Talent.SHIELD_03);
        } else if (this.data.id == Talent.SHIELD_05) {
            return this.hasTalent(Talent.SHIELD_03)
            ||this.hasTalent(Talent.SHIELD_04);
        } else if (this.data.id == Talent.SHIELD_06) {
            return this.hasTalent(Talent.SHIELD_01);
        } else if (this.data.id == Talent.SHIELD_07) {
            return this.hasTalent(Talent.SHIELD_06)
            &&!this.hasTalent(Talent.SHIELD_08)
            &&!this.hasTalent(Talent.SHIELD_09)
            &&!this.hasTalent(Talent.SHIELD_10); 
        } else if (this.data.id == Talent.SHIELD_08) {
            return this.hasTalent(Talent.SHIELD_06)
            &&!this.hasTalent(Talent.SHIELD_07)
            &&!this.hasTalent(Talent.SHIELD_09)
            &&!this.hasTalent(Talent.SHIELD_10); 
        } else if (this.data.id == Talent.SHIELD_09) {
            return this.hasTalent(Talent.SHIELD_06)
            &&!this.hasTalent(Talent.SHIELD_07)
            &&!this.hasTalent(Talent.SHIELD_08)
            &&!this.hasTalent(Talent.SHIELD_10); 
        } else if (this.data.id == Talent.SHIELD_10) {
            return this.hasTalent(Talent.SHIELD_06)
            &&!this.hasTalent(Talent.SHIELD_07)
            &&!this.hasTalent(Talent.SHIELD_08)
            &&!this.hasTalent(Talent.SHIELD_09); 
        } else if (this.data.id == Talent.SHIELD_11) {
            return this.hasTalent(Talent.SHIELD_07)
            ||this.hasTalent(Talent.SHIELD_08)
            ||this.hasTalent(Talent.SHIELD_09)
            ||this.hasTalent(Talent.SHIELD_10);
        } else if (this.data.id == Talent.SHIELD_12) {
            return this.hasTalent(Talent.SHIELD_01);
        } else if (this.data.id == Talent.SHIELD_13) {
            return this.hasTalent(Talent.SHIELD_12);
        } else if (this.data.id == Talent.SHIELD_14) {
            return this.hasTalent(Talent.SHIELD_13);
        } else if (this.data.id == Talent.DASH_01) {
            return true;
        } else if (this.data.id == Talent.DASH_02) {
            return this.hasTalent(Talent.DASH_01);
        } else if (this.data.id == Talent.DASH_03) {
            return this.hasTalent(Talent.DASH_02)
            &&!this.hasTalent(Talent.DASH_04)
            &&!this.hasTalent(Talent.DASH_05)
            &&!this.hasTalent(Talent.DASH_06);
        } else if (this.data.id == Talent.DASH_04) {
            return this.hasTalent(Talent.DASH_02)
            &&!this.hasTalent(Talent.DASH_03)
            &&!this.hasTalent(Talent.DASH_05)
            &&!this.hasTalent(Talent.DASH_06);
        } else if (this.data.id == Talent.DASH_05) {
            return this.hasTalent(Talent.DASH_02)
            &&!this.hasTalent(Talent.DASH_04)
            &&!this.hasTalent(Talent.DASH_03)
            &&!this.hasTalent(Talent.DASH_06);
        } else if (this.data.id == Talent.DASH_06) {
            return this.hasTalent(Talent.DASH_02)
            &&!this.hasTalent(Talent.DASH_04)
            &&!this.hasTalent(Talent.DASH_05)
            &&!this.hasTalent(Talent.DASH_03);
        } else if (this.data.id == Talent.DASH_07) {
            return this.hasTalent(Talent.DASH_03)
            ||this.hasTalent(Talent.DASH_04)
            ||this.hasTalent(Talent.DASH_05)
            ||this.hasTalent(Talent.DASH_06);
        } else if (this.data.id == Talent.DASH_08) {
            return this.hasTalent(Talent.DASH_01);
        } else if (this.data.id == Talent.DASH_09) {
            return this.hasTalent(Talent.DASH_08)
            &&!this.hasTalent(Talent.DASH_10);
        } else if (this.data.id == Talent.DASH_10) {
            return this.hasTalent(Talent.DASH_08)
            &&!this.hasTalent(Talent.DASH_09);
        } else if (this.data.id == Talent.DASH_11) {
            return this.hasTalent(Talent.DASH_09)
            ||this.hasTalent(Talent.DASH_10);
        } else if (this.data.id == Talent.DASH_12) {
            return this.hasTalent(Talent.DASH_01);
        } else if (this.data.id == Talent.DASH_13) {
            return this.hasTalent(Talent.DASH_12);
        } else if (this.data.id == Talent.DASH_14) {
            return this.hasTalent(Talent.DASH_13);
        }else{
            return false;
        }
    }
    hasTalent(id:number):boolean{
        return Logic.hashTalent(id);
    }
    disconnectNode(icon: TalentIcon) {
        icon.node.color = cc.color(51, 51, 51);
        if (icon.currentParent && icon.currentParent != null) {
            icon.currentParent.getComponent(TalentIcon).currentChild = null;
        }
        icon.currentChild = null;
        icon.currentParent = null;
    }
    closeAllChildren(children: cc.Node[]) {
        for (let child of children) {
            let icon = child.getComponent(TalentIcon);
            icon.isOpen = false;
            this.disconnectNode(icon);
            this.closeAllChildren(icon.children);
        }
    }
}