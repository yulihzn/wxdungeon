import Logic from "../Logic";
import TalentData from "../Data/TalentData";
import { EventConstant } from "../EventConstant";

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
        this.isOpen = true;
        this.isRoot = true;
        for (let parent of this.parents) {
            this.isRoot = false;
            let icon = parent.getComponent(TalentIcon);
            //1.如果父icon当前没有子icon 2.其它子icon打开 3.父icon是根 下才能赋值
            if (icon.isOpen && (!icon.currentChild || icon.currentChild == null||icon.isRoot)) {
                this.currentParent = parent;
                icon.currentChild = this.node;
            }
        }
        //如果不是根而且没有当前父icon则不能打开
        if (!this.isRoot && (!this.currentParent || this.currentParent == null)) {
            this.isOpen = false;
        }

        if (this.isOpen) {
            this.node.color = cc.color(255, 255, 255);
            cc.director.emit(EventConstant.TALENT_TREE_UPDATE);
            return Logic.addTalent(this.data.id);
        }
        return false; 
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