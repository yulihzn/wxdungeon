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
    data: TalentData;
    onLoad() {
        this.node.color = cc.color(51, 51, 51);
    }
    onClick(): boolean {
        // this.isOpen = !this.isOpen;
        // if (this.isOpen) {
        //     this.openTalent();
        // } else {
        //     // this.disconnectNode(this);
        //     // this.closeAllChildren(this.children)
        // }
        if (!this.isOpen) {
            this.openTalent();
        }
        return false;
    }
    openTalent(): boolean {
        this.isOpen = this.checkCanOpen();
        if (this.isOpen) {
            this.node.color = cc.color(255, 255, 255);
            cc.director.emit(EventConstant.TALENT_TREE_UPDATE);
            return Logic.addTalent(this.data.id);
        }
        return false;
    }
    needAndNot(id: number, needs?: number[], not?: number[]): boolean {
        let isCan = this.data.id == id;
        for (let i of needs) {
            if (this.hasTalent(i)) {
                isCan = true;
            }
        }
        if (not) {
            for (let i of not) {
                if (this.hasTalent(i)) {
                    isCan = false;
                }
            }
        }
        return isCan;
    }
    checkCanOpen(): boolean {
        if (this.needAndNot(Talent.SHIELD_01, [], [])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_02, [Talent.SHIELD_01])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_03, [Talent.SHIELD_02], [Talent.SHIELD_04])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_04,[Talent.SHIELD_02],[Talent.SHIELD_03])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_05,[Talent.SHIELD_03,Talent.SHIELD_04],[])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_06,[Talent.SHIELD_01],[])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_07,[Talent.SHIELD_06],[Talent.SHIELD_08,Talent.SHIELD_09,Talent.SHIELD_10])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_08,[Talent.SHIELD_06],[Talent.SHIELD_07,Talent.SHIELD_09,Talent.SHIELD_10])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_09,[Talent.SHIELD_06],[Talent.SHIELD_07,Talent.SHIELD_08,Talent.SHIELD_10])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_10,[Talent.SHIELD_06],[Talent.SHIELD_07,Talent.SHIELD_08,Talent.SHIELD_09])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_11,[Talent.SHIELD_07,Talent.SHIELD_08,Talent.SHIELD_09,Talent.SHIELD_10],[])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_12,[Talent.SHIELD_01],[])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_13,[Talent.SHIELD_12],[])) {
            return true;
        } else if (this.needAndNot(Talent.SHIELD_14,[Talent.SHIELD_13],[])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_01,[],[])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_02,[Talent.DASH_01],[])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_03,[Talent.DASH_02],[Talent.DASH_04,Talent.DASH_05,Talent.DASH_06])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_04,[Talent.DASH_02],[Talent.DASH_03,Talent.DASH_05,Talent.DASH_06])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_05,[Talent.DASH_02],[Talent.DASH_03,Talent.DASH_04,Talent.DASH_06])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_06,[Talent.DASH_02],[Talent.DASH_03,Talent.DASH_04,Talent.DASH_05])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_07,[Talent.DASH_03,Talent.DASH_04,Talent.DASH_05,Talent.DASH_06],[])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_08,[Talent.DASH_01],[])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_09,[Talent.DASH_08],[Talent.DASH_10])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_10,[Talent.DASH_08],[Talent.DASH_09])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_11,[Talent.DASH_09,Talent.DASH_10],[])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_12,[Talent.DASH_01],[])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_13,[Talent.DASH_12],[])) {
            return true;
        } else if (this.needAndNot(Talent.DASH_14,[Talent.DASH_13],[])) {
            return true;
        } else {
            return false;
        }
    }
    hasTalent(id: number): boolean {
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