import CCollider from "../collider/CCollider";
import Player from "../logic/Player";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//交互作用的提示,依托于父组件不能独立放置
const { ccclass, property } = cc._decorator;

@ccclass
export default class Tips extends cc.Component {
    private interactCallback: Function;
    private enterCallback:Function;
    private exitCallback:Function;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.opacity = 0;
    }

    start() {

    }
    next(isLongPress: boolean, player: Player): void {
        if (this.node && this.node.active && this.interactCallback) {
            this.interactCallback(isLongPress, player);
        }
    }
    onInteract(callback: Function) {
        this.interactCallback = callback;
    }
    onEnter(callback:Function){
        this.enterCallback = callback;
    }
    onExit(callback:Function){
        this.exitCallback = callback;
    }
    onColliderEnter(other: CCollider, self: CCollider) {
        if (other.tag == CCollider.TAG.PLAYER) {
            this.node.opacity = 255;
            if(this.enterCallback){
                this.enterCallback(other.node);
            }
        }
    }
    onColliderExit(other: CCollider, self: CCollider) {
        if (other.tag == CCollider.TAG.PLAYER) {
            this.node.opacity = 0;
            if(this.exitCallback){
                this.exitCallback(other.node);
            }
        }
    }
    // update (dt) {}
}
