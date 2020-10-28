// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import IndexZ from "../Utils/IndexZ";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Light extends cc.Component {

    @property(cc.Node)
    layer: cc.Node = null;
    @property(cc.Prefab)
    lightPrefab:cc.Prefab = null;

    playerLight:cc.Node;
    playerNode:cc.Node;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {

    }
    // init(playerNode:cc.Node){
    //     this.playerNode = playerNode;
    //     this.addPlayerLight();
    //     this.node.zIndex = IndexZ.UI;
    // }
    // addPlayerLight(){
    //     this.playerLight = cc.instantiate(this.lightPrefab);
    //     this.playerLight.parent = this.layer;
    //     this.playerLight.scaleX = 16;
    //     this.playerLight.scaleY = 14;
    //     this.playerLight.opacity = 80;
    // }

    // update (dt) {
    //     if(this.playerLight&&this.playerNode){
    //         this.playerLight.position = this.playerNode.position.clone();
    //     }
    // }
}
