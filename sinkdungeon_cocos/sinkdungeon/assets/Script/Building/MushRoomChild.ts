import Player from "../Player";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import Building from "./Building";
import AudioPlayer from "../Utils/AudioPlayer";
import IndexZ from "../Utils/IndexZ";
import ExitData from "../Data/ExitData";
import Dungeon from "../Dungeon";
import Utils from "../Utils/Utils";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MushroomChild extends Building {
    isRotate = false;
    isPlus = false;
   
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            this.isRotate = true;
            let ppos = player.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            let mpos = this.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            this.isPlus = ppos.x>mpos.x;
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            this.isRotate = false;
        }
    }
    update (dt) {
        
        if(this.isRotate){
            this.node.angle = Logic.lerp(this.node.angle,this.isPlus?15:-15,dt*5);
        }else{
            this.node.angle = Logic.lerp(this.node.angle,0,dt*5);
        }
    }
    
    
}
