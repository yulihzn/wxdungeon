import Player from "./Player";
import Dungeon from "./Dungeon";
import { EventConstant } from "./EventConstant";

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
export default class Portal extends cc.Component {


    anim:cc.Animation;
    isOpen:boolean = false;
    pos:cc.Vec2;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.setPos(cc.v2(4,4));
        this.anim = this.getComponent(cc.Animation);
        this.anim.play('PortalCloseIdle');
    }
    setPos(pos:cc.Vec2){
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
    }
    AnimGateClose(){
        this.anim.play('PortalCloseIdle');
    }
    AnimGateOpen(){
        this.anim.play('PortalOpenIdle');
    }
    openGate(){
        if(this.isOpen){
            return;
        }
        this.isOpen = true;
        this.anim.play('PortalOpen');
    }
    closeGate(){
        if(!this.isOpen){
            return;
        }
        this.isOpen = false;
        this.anim.play('PortalClose');
    }

    transportPlayer(playerPos:cc.Vec2){
        if(playerPos.x==this.pos.x&&playerPos.y==this.pos.y && this.isOpen){
        }
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        if(other.tag == 3){
            if(this.isOpen){
                this.closeGate();
                cc.director.emit(EventConstant.LOADINGNEXTLEVEL);
            }
        }
    }

    // update (dt) {}
}
