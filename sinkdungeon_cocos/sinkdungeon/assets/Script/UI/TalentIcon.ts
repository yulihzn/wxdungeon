const {ccclass, property} = cc._decorator;

@ccclass
export default class TalentIcon extends cc.Component{
    parents:cc.Node[] = null;
    children:cc.Node[] = null;
    currentChild:cc.Node = null;
    currentParent:cc.Node = null;
    isOpen = false;
    onLoad () {

    }
    onClick(){
        this.isOpen = !this.isOpen;
        this.currentParent = null;
        if(this.isOpen){
            for(let parent of this.parents){
                let icon = parent.getComponent(TalentIcon);
                if(icon.isOpen){
                    this.currentParent = parent;
                    icon.currentChild = this.node;
                }
            }
            if(!this.currentParent||this.currentParent==null){
                this.isOpen = false;
            }
            if(this.isOpen){
                this.node.getComponent(cc.Sprite).setState(0);
            }
        }else{
            
        }
    }
    closeAllChildren(children:cc.Node){
        for(let child of this.children){
            let icon = child.getComponent(TalentIcon);
            icon.isOpen = false;
        }
    }
}