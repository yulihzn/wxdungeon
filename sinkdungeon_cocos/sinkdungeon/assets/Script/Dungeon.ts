import Player from "./Player";
import Tile from "./Tile";
import Portal from "./Portal";
import Monster from "./Monster";
import Logic from "./Logic";
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

const { ccclass, property } = cc._decorator;
@ccclass
export default class Dungeon extends cc.Component {

    @property(cc.Prefab)
    tile: cc.Prefab = null;
    @property(Player)
    player: Player = null;
    @property(Portal)
    portal: Portal = null;
    @property(Monster)
    monster: Monster = null;

    private map: Tile[][] = new Array();
    static readonly SIZE: number = 9;
    static readonly MAPX: number = 32;
    static readonly MAPY: number = 32;
    static readonly TILE_SIZE: number = 64;
    private timeDelay = 0;
    private npcTimeDelay = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.on(EventConstant.PLAYER_MOVE, (event) => { this.playerAction(event.detail.dir) });
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.map = new Array();
        for (let i = 0; i < Dungeon.SIZE; i++) {
            this.map[i] = new Array(i);
            for (let j = 0; j < Dungeon.SIZE; j++) {
                let t = cc.instantiate(this.tile);
                t.parent = this.node;
                t.position = Dungeon.getPosInMap(cc.v2(i, j));
                //越往下层级越高，i是行，j是列
                t.zIndex = 1000 + (Dungeon.SIZE - j) * 100;
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
        this.portal.node.zIndex = 1000 + 5 * 100 + 1;
        this.portal.node.setPosition(this.map[4][4].node.position);
        this.monster.node.parent = this.node;
        this.player.node.parent = this.node;

        // this.monster.transportPlayer(1,1);
    }
    static getPosInMap(pos: cc.Vec2) {
        let x = Dungeon.MAPX + pos.x * Dungeon.TILE_SIZE;
        let y = Dungeon.MAPY + pos.y * Dungeon.TILE_SIZE;
        return cc.v2(x, y);
    }

    start() {

    }
    breakTile(pos: cc.Vec2) {
        if (pos.x == 4 && pos.y == 4) {
            return;
        }
        let tile = this.map[pos.x][pos.y];
        if (!tile.isBroken) {
            tile.breakTile();
        }
        if (tile.isBroken) {
            if (this.player.pos.equals(pos) && !this.player.isMoving) {
                this.player.fall();
            }

        }
    }
    playerAction(dir:number){
        //事件执行脚本引入的对象有可能为空
        if(!this.player){
            return;
        }
        let newPos = cc.v2(this.player.pos.x,this.player.pos.y);
        switch (dir) {
            case 0: if (newPos.y + 1 < 9) { newPos.y++; } break;
            case 1: if (newPos.y - 1 >= 0) { newPos.y--; } break;
            case 2: if (newPos.x - 1 >= 0) { newPos.x--; } break;
            case 3: if (newPos.x + 1 < 9) { newPos.x++; } break;
        }
        if(newPos.equals(this.monster.pos)&&!this.monster.isDied){
            this.player.attack(dir,(damage:number)=>{
                this.monster.takeDamage(damage);
            });
        }else{
            this.player.move(dir);
        }
    }
    checkPlayerPos() {
        this.breakTile(this.player.pos);
    }
    checkMonstersPos() {
        let tile = this.map[this.monster.pos.x][this.monster.pos.y];
        if (tile.isBroken && !this.monster.isMoving) {
            this.monster.fall();
        }
    }
    monstersAction(){
        let dir = this.getMonsterBestDir(this.monster.pos);
        let newPos = cc.v2(this.monster.pos.x,this.monster.pos.y);
        switch (dir) {
            case 0: if (newPos.y + 1 < 9) { newPos.y++; } break;
            case 1: if (newPos.y - 1 >= 0) { newPos.y--; } break;
            case 2: if (newPos.x - 1 >= 0) { newPos.x--; } break;
            case 3: if (newPos.x + 1 < 9) { newPos.x++; } break;
        }
        if(newPos.equals(this.player.pos)&&!this.player.isDied){
            this.monster.attack(dir,(damage:number)=>{
                this.player.takeDamage(damage);
            });
        }else{
            this.monster.move(dir);
        }
        
    }
    getPosDir(oldPos:cc.Vec2,newPos:cc.Vec2):number{
        let dir = 4;
        if(newPos.x==oldPos.x){
            dir=newPos.y>oldPos.y?0:1;
        }
        if(newPos.y==oldPos.y){
            dir=newPos.x>oldPos.x?3:2;
        }
        if(newPos.equals(oldPos)){
            dir=4;
        }
        return dir;
    }
    getMonsterBestDir(pos:cc.Vec2):number{
        let bestPos = cc.v2(pos.x,pos.y);
        //获取9个点并打乱顺序
        let dirArr = new Array();
        if(pos.y+1<9){
            dirArr.push(cc.v2(pos.x,pos.y+1));
        }
        if(pos.y-1>=0){
            dirArr.push(cc.v2(pos.x,pos.y-1));
        }
        if(pos.x-1>=0){
            dirArr.push(cc.v2(pos.x-1,pos.y));
        }
        if(pos.x+1<9){
            dirArr.push(cc.v2(pos.x+1,pos.y));
        }
        
        dirArr.sort(()=>{
            return 0.5 - Math.random();
        })
        //获取没有塌陷的tile
        let goodArr = new Array();
        for(let i = 0;i<dirArr.length;i++){
            let newPos = dirArr[i];
            let tile = this.map[newPos.x][newPos.y];
            if(!tile.isBroken){
                goodArr.push(newPos);
            }
        }
        for(let i=0;i<goodArr.length;i++){
            let newPos = goodArr[i];
            if(newPos.equals(this.player.pos)){
                bestPos = newPos;
                break;
            }
            let tile = this.map[newPos.x][newPos.y];
            if(!tile.isBreakingNow){
                bestPos = newPos;
            }

        }
        let dir = this.getPosDir(pos,bestPos);
        return dir;
    }
    update(dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
            this.checkPlayerPos();
            this.checkMonstersPos();
        }
        this.npcTimeDelay += dt;
        if (this.npcTimeDelay > 1) {
            this.npcTimeDelay = 0;
            this.monstersAction();
        }
    }
}
