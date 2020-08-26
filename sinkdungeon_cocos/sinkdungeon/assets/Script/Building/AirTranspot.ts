import Dungeon from "../Dungeon";
import { EventHelper } from "../EventHelper";
import Player from "../Player";
import Box from "./Box";
import Building from "./Building";
import IndexZ from "../Utils/IndexZ";


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
export default class AirTranspot extends Building {

    anim:cc.Animation;
    dungeon:Dungeon;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
    }

    start() {

    }

    setPos(pos: cc.Vec3) {
        this.data.defaultPos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
        this.node.zIndex = IndexZ.WALL;
    }

 
    update(dt) {
        if(this.dungeon&&this.dungeon.player){
            this.node.position = this.dungeon.player.node.position.clone();
        }
    }
}
