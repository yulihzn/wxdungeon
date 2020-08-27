import Player from "../Player";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import Building from "./Building";
import IndexZ from "../Utils/IndexZ";
import AudioPlayer from "../Utils/AudioPlayer";
import Dungeon from "../Dungeon";

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
export default class AirExit extends Building {

    isOpen: boolean = false;
    static readonly STATUS_CLOSE = 0;
    static readonly STATUS_WAIT = 1;
    static readonly STATUS_OPEN = 2;
    //0top1bottom2left3right
    dir = 0;
    status = AirExit.STATUS_CLOSE;
    sprite: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.getComponent(cc.Sprite);
        this.node.zIndex = IndexZ.FLOOR;
    }

    init(dir: number, length: number) {
        this.dir = dir;
        switch (dir) {
            case 0:break;
            case 1:this.node.scaleY = -8;break;
            case 2:this.node.angle = 90;break;
            case 3: this.node.angle = 90;this.node.scaleY = -8;break;
        }
        this.node.opacity = 40;
        this.node.width = Dungeon.TILE_SIZE / 8 * length;
        this.getComponent(cc.BoxCollider).size = cc.size(this.node.width,this.node.height);
        this.node.zIndex = IndexZ.OVERHEAD;
        this.changeStatus(AirExit.STATUS_CLOSE);

    }
    changeStatus(status: number) {
        this.status = status;
        let resName = '';
        switch (this.status) {
            case AirExit.STATUS_CLOSE: resName = 'outertips3'; break;
            case AirExit.STATUS_WAIT: resName = 'outertips2'; break;
            case AirExit.STATUS_OPEN: resName = 'outertips1'; break;
        }
        this.sprite.spriteFrame = Logic.spriteFrames[resName];
    }
    start() {

    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let player = other.node.getComponent(Player);
        if (player) {
            if (this.status == AirExit.STATUS_OPEN) {
                Logic.playerData = player.data.clone();
                Logic.loadingNextRoom(this.dir);
            }
        }
    }
}
