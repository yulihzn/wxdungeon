// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestFrog extends cc.Component {

    mat:cc.MaterialVariant;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    show(){
        if(!this.mat){
            this.mat = this.node.getComponent(cc.Sprite).getMaterial(0);
        }
        this.mat.setProperty('wh_ratio',this.node.width/this.node.height);
        this.mat.setProperty('center',cc.v2(0.5,0.5));
        this.mat.setProperty('radius',0.5);
    }
    // update (dt) {}
}
