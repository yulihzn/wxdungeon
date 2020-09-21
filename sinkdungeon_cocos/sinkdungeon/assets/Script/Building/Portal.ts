import Dungeon from "../Dungeon";
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
        this.scheduleOnce(()=>{
            if(!this.anim){
                this.anim = this.getComponent(cc.Animation);
            }
            this.anim.play('PortalOpen');
        },0.1);
        
    }
    closeGate(){
        if(!this.isOpen){
            return;
        }
        this.isOpen = false;
        this.anim.play('PortalClose');
    }

    onBeginContact(contact, selfCollider:cc.PhysicsCollider, otherCollider:cc.PhysicsCollider){
        let player = otherCollider.body.node.getComponent(Player);
        if(player){
            if(this.isOpen){
                this.closeGate();
                Logic.playerData = player.data.clone();
                if(Logic.playerData.pos.equals(this.data.defaultPos)){
                    Logic.playerData.pos.y=this.data.defaultPos.y-1;
                }
                Logic.loadingNextLevel(false,!this.isBackDream,this.isBackDream,true);
            }
        }
    }
    

    // update (dt) {}
}
