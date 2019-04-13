const { ccclass, property } = cc._decorator;

@ccclass
export default class TalentIcon extends cc.Component {
    parents: cc.Node[] = null;
    children: cc.Node[] = null;
    currentChild: cc.Node = null;
    currentParent: cc.Node = null;
    isOpen = false;
    onLoad() {

    }
    onClick() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            let isRoot = true;
            for (let parent of this.parents) {
                isRoot = false;
                let icon = parent.getComponent(TalentIcon);
                //如果父icon当前没有其它子icon而且打开的情况下才能赋值
                if (icon.isOpen && (!icon.currentChild || icon.currentChild == null)) {
                    this.currentParent = parent;
                    icon.currentChild = this.node;
                }
            }
            //如果不是根而且没有当前父icon则不能打开
            if (!isRoot && (!this.currentParent || this.currentParent == null)) {
                this.isOpen = false;
            }

            if (this.isOpen) {
                this.node.color = cc.color(255, 255, 255);
            }
        } else {
            // this.disconnectNode(this);
            // this.closeAllChildren(this.children)
        }
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