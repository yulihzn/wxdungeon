import Logic from "../Logic";
import TalentData from "../Data/TalentData";
import { EventHelper } from "../EventHelper";
import Talent from "../Talent/Talent";
import TalentTree from "./TalentTree";

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
            cc.director.emit(EventHelper.TALENT_TREE_UPDATE);
            return Logic.addTalent(this.data.id);
        }
        return false;
    }
    needAndNot(prefix: number, id: number, needs: string[], not: string[]): boolean {
        let isCan = false;
        if (this.data.id != prefix + id) {
            return false;
        }
        if (1==id) {
            return true;
        }
        for (let i of needs) {
            if (this.hasTalent(prefix + parseInt(i))) {
                isCan = true;
            }
        }
        if (not) {
            for (let i of not) {
                if (this.hasTalent(prefix + parseInt(i))) {
                    isCan = false;
                }
            }
        }
        return isCan;
    }
    parseOpenMapAndCanOpen(prefix: number,info: string): boolean {
        let arr = info.split(';');
        let needs = [];
        let nots = [];
        if (arr[1] && arr[1].length > 0) {
            needs = arr[1].split(',');
        }
        if (arr[1] && arr[2].length > 0) {
            nots = arr[2].split(',');
        }
        if (this.needAndNot(prefix, parseInt(arr[0]), needs, nots)) {
            return true;
        }
        return false;
    }

    checkCanOpen(): boolean {
        for (let info of TalentTree.DASH_CAN_OPEN_MAP) {
            if(this.parseOpenMapAndCanOpen(Talent.DASH,info)){
                return true;
            }
        }
        for (let info of TalentTree.SHIELD_CAN_OPEN_MAP) {
            if(this.parseOpenMapAndCanOpen(Talent.SHIELD,info)){
                return true;
            }
        }
        for (let info of TalentTree.MAGIC_CAN_OPEN_MAP) {
            if(this.parseOpenMapAndCanOpen(Talent.MAGIC,info)){
                return true;
            }
        }
        return false;

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