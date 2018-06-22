import Player from "./Player";
import Tile from "./Tile";
import Portal from "./Portal";

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
export default class Dungeon extends cc.Component {

    @property(cc.Prefab)
    tile: cc.Prefab = null;
    @property(Player)
    player: Player = null;
    @property(Portal)
    portal: Portal = null;

    private map: Tile[][] = new Array();
    static readonly SIZE: number = 9;
    static readonly MAPX: number = 32;
    static readonly MAPY: number = 32;
    static readonly TILE_SIZE: number = 64;
    private timeDelay = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.map = new Array();
        for (let i = 0; i < Dungeon.SIZE; i++) {
            this.map[i] = new Array(i);
            for (let j = 0; j < Dungeon.SIZE; j++) {
                let t = cc.instantiate(this.tile);
                t.parent = this.node;
                t.position = Dungeon.getPosInMap(cc.v2(i,j));
                //越往下层级越高，i是行，j是列
                t.zIndex = 1000 + (Dungeon.SIZE-j)*100;
                this.map[i][j] = t.getComponent('Tile');
                let index = Math.floor(Dungeon.SIZE / 2)
                // if (index == i && index == j) {
                // 	this.portal = new Portal(i, j);
                // 	t.addBuilding(this.portal);
                // 	this.portal.show();
                // }
                // if (!(index == i && index == j)) {
                // 	this.addItem(new egret.Point(i, j));
                // }
                // this.randomArr[i * Logic.SIZE + j] = new egret.Point(i, j);
            }
        }
        this.portal.node.parent = this.node;
        this.portal.node.zIndex = 1000 + 5*100+1;
        this.portal.node.setPosition(this.map[4][4].node.position);
        this.player.node.parent = this.node;
    }
    static getPosInMap(pos:cc.Vec2){
        let x = Dungeon.MAPX + pos.x * Dungeon.TILE_SIZE;
        let y = Dungeon.MAPY + pos.y * Dungeon.TILE_SIZE;
        return cc.v2(x,y);
    }

    start() {

    }
    breakTile(x:number,y:number){
        let tile = this.map[x][y];
        if (!tile.isBroken) {
            tile.breakTile();
        } else if(this.player.posX==x&&this.player.posY==y&&!this.player.isMoving){
            this.player.fall();
        }
    }
    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
        }
        this.breakTile(this.player.posX,this.player.posY);
        
    }
}
