import FromData from "../Data/FromData";
import Dungeon from "../Dungeon";
import Logic from "../Logic";
import StatusManager from "../Manager/StatusManager";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "../Player";
import Building from "./Building";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RoomBed extends Building {

    isWakeUp = false;
    dungeon:Dungeon;
    isFirst = true;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(dungeon:Dungeon){
        this.dungeon = dungeon;
    }
    start () {

    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player&&!this.isWakeUp&&this.isFirst) {
            this.isFirst = false;
            if(this.dungeon){
                this.dungeon.CameraZoom = 2;
            }
            player.addStatus(StatusManager.DIZZ,new FromData());
            this.scheduleOnce(()=>{
                Logic.playerData = player.data.clone();
                if(Logic.playerData.pos.equals(this.data.defaultPos)){
                    Logic.playerData.pos.y=this.data.defaultPos.y-1;
                }
                Logic.loadingNextLevel(false,false,true,true);
            },1)
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player&&!this.isWakeUp) {
            this.isWakeUp = true;
        }
    }
    // update (dt) {}
}
