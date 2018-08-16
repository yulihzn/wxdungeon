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
    isDoor:boolean = true;
    //0top1bottom2left3right
    @property
    dir = 0;
    @property(cc.Node)
    wall:cc.Node=null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        this.anim = this.getComponent(cc.Animation);
    }
    setOpen(isOpen:boolean){
        if(!this.isDoor){
            this.wall.active=true;
            return;
        }
        this.wall.active=false;
        if(isOpen){
            this.openGate();
        }else{
            this.closeGate();
        }
    }
    
    openGate(){
        if(this.isOpen){
            return;
        }
        this.isOpen = true;
        if(!this.anim){
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play('DoorOpen');
    }
    closeGate(){
        if(!this.isOpen){
            return;
        }
        this.isOpen = false;
        if(!this.anim){
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play('DoorClose');
    }

    onCollisionEnter(other:cc.Collider,self:cc.Collider) {
        let player = other.node.getComponent(Player);
        if(player){
            if(this.isOpen){
                cc.director.emit(EventConstant.LOADINGROOM,{detail:{dir:this.dir}});
            }
        }
    }
}
