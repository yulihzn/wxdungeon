import Dungeon from "../Dungeon";
import { EventHelper } from "../EventHelper";
import Player from "../Player";
import Building from "./Building";
import IndexZ from "../Utils/IndexZ";
import Logic from "../Logic";


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
export default class Portal extends Building {


    anim:cc.Animation;
    isOpen:boolean = false;
    pos:cc.Vec3 = cc.v3(4,4);
    isBackDream = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        this.anim = this.getComponent(cc.Animation);
        this.anim.play('PortalCloseIdle');
    }
    setPos(pos:cc.Vec3){
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
        this.node.zIndex = IndexZ.BASE + (Dungeon.HEIGHT_SIZE - pos.y) * 10+1;
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

    transportPlayer(playerPos:cc.Vec3){
        if(playerPos.x==this.pos.x&&playerPos.y==this.pos.y && this.isOpen){
        }
    }
    onBeginContact(contact, selfCollider:cc.PhysicsCollider, otherCollider:cc.PhysicsCollider){
        let player = otherCollider.body.node.getComponent(Player);
        if(player){
            if(this.isOpen){
                this.closeGate();
                Logic.loadingNextLevel(false,true,this.isBackDream);
            }
        }
    }
    

    // update (dt) {}
}
