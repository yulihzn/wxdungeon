import Player from "./Player";

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
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    tile: cc.Prefab = null;
    @property(Player)
    player:Player = null;

    private map: cc.Node[][] = new Array();
    private readonly SIZE: number = 9;
    private readonly MAPX: number = 32;
    private readonly MAPY: number = 32;
    private readonly TILE_SIZE: number = 64;
    private timeDelay = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.map = new Array();
        for (let i = 0; i < this.SIZE; i++) {
            this.map[i] = new Array(i);
            for (let j = 0; j < this.SIZE; j++) {
                let t = cc.instantiate(this.tile);
                t.parent = this.node;
                t.x = this.MAPX + i * this.TILE_SIZE;
                t.y = this.MAPY + j * this.TILE_SIZE;
                t.zIndex = 100+i;
                this.map[i][j] = t;
                let index = Math.floor(this.SIZE / 2)
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
        this.player.node.parent = this.node;
    }

    start() {

    }

    update (dt) {
        this.timeDelay+=dt;
        if(this.timeDelay>1000){
            this.timeDelay = 0;
        }
        let tile = this.map[this.player.posX][this.player.posY];
        
    }
}
