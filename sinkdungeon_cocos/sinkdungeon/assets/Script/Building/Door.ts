import Dungeon from "../Dungeon";
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
export default class Door extends cc.Component {

    anim:cc.Animation;
    isOpen:boolean = false;
    //0top1bottom2left3right
    @property
    dir = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.anim = this.getComponent(cc.Animation);
        this.anim.play('DoorCloseIdle');
    }
    AnimGateClose(){
        this.anim.play('DoorCloseIdle');
    }
    AnimGateOpen(){
        this.anim.play('DoorOpenIdle');
    }
    openGate(){
        if(this.isOpen){
            return;
        }
        this.isOpen = true;
        this.anim.play('DoorOpen');
    }
    closeGate(){
        if(!this.isOpen){
            return;
        }
        this.isOpen = false;
        this.anim.play('DoorClose');
    }

    onBeginContact(contact, selfCollider:cc.PhysicsCollider, otherCollider:cc.PhysicsCollider){
        let player = otherCollider.body.node.getComponent(Player);
        if(player){
            if(this.isOpen){
                this.closeGate();
                cc.director.emit(EventConstant.LOADINGROOM);
            }
        }
    }
}
