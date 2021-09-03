const { ccclass, property } = cc._decorator;
export default class NodeKey  {
    node:cc.Node;
    key:string;
    constructor(key:string,node:cc.Node){
        this.key = key;
        this.node = node;
    }
}