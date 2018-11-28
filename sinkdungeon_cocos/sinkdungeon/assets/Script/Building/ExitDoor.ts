import Player from "../Player";
import { EventConstant } from "../EventConstant";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ExitDoor extends cc.Component {
    isOpen: boolean = false;
    closeNode:cc.Node;
    wall1: cc.Node = null;
    wall2: cc.Node = null;
    isDoor: boolean = true;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.closeNode = this.node.getChildByName('sprite').getChildByName('exitclose');
    }

    start () {

    }
    hideWall() {
        if(this.wall1){
            this.wall1.zIndex = 500;
            this.wall1.getComponent(cc.PhysicsBoxCollider).sensor = true;
            this.wall1.getComponent(cc.PhysicsBoxCollider).apply();
        }
        if(this.wall2){
            this.wall2.zIndex = 500;
            this.wall2.getComponent(cc.PhysicsBoxCollider).sensor = true;
            this.wall2.getComponent(cc.PhysicsBoxCollider).apply();
        }
     
    }
    openGate() {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        
        this.getComponent(cc.PhysicsBoxCollider).enabled = false;
        this.closeNode.opacity = 0;
    }
    closeGate() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.getComponent(cc.PhysicsBoxCollider).enabled = true;
        this.closeNode.opacity = 255;
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            if (this.isOpen) {
                this.closeGate();
                cc.director.emit(EventConstant.LOADINGNEXTLEVEL);
            }
        }
    }
    // update (dt) {}
}
