import Chunk from "./Chunk";
import { EventConstant } from "../EventConstant";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChunkWorld extends cc.Component {

    static readonly SIZE = 5;
    @property(cc.Prefab)
    chunkPrefab: cc.Prefab = null;

    map:Chunk[][] = new Array();
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const CENTER = Math.floor(ChunkWorld.SIZE/2);
        cc.director.on(EventConstant.CHUNK_LOAD, (event) => {
            let pos = event.detail.pos;
            let p = ChunkWorld.getIndexInMap(pos,this.map[0][0].targetPosition);
            cc.log(p);
            this.changeMap(p.x,p.y);
        })
        this.initMap();
    }
    private initMap(){
        for (let i = 0; i < ChunkWorld.SIZE; i++) {
            this.map[i] = new Array(i);
            for (let j = 0; j < ChunkWorld.SIZE; j++) {
                let c = cc.instantiate(this.chunkPrefab);
                c.parent = this.node;
                c.position = ChunkWorld.getPosInMap(cc.v2(i, j));
                c.zIndex = 100;
                let chunk = c.getComponent(Chunk);
                chunk.data.x = i;
                chunk.data.y = j;
                this.map[i][j] = chunk;
                chunk.targetPosition = c.position.clone();
                chunk.loadMap();
                // chunk.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch)=> {
                //     chunk.onClicked();
                //     cc.log(cc.v2(chunk.data.x,chunk.data.y));
                //     this.changeMap(chunk.data.x,chunk.data.y);
                // }, this);
            }
        }
        this.printMapIndex();
    }

    getTargetChunkPos(targetPosition:cc.Vec2){
        let leftBottomPos = cc.v2(this.map[0][0].data.x,this.map[0][0].data.y);
    }
    private changeMap(x:number,y:number){
        const CENTER = Math.floor(ChunkWorld.SIZE/2);
        if(x==CENTER&&y==CENTER){
            return;
        }
        let selectPosition = this.map[x][y].targetPosition.clone();
        let tempMap:Chunk[][] = new Array();
        for (let i = 0; i < ChunkWorld.SIZE; i++) {
            tempMap[i] = new Array(i);
            for (let j = 0; j < ChunkWorld.SIZE; j++) {
                //获取对应旧map的chunk并改变下标
                let pos = this.getCorrectIndex(cc.v2(x,y),cc.v2(i,j));
                tempMap[i][j] = this.map[pos.x][pos.y];
                tempMap[i][j].data.x = i;
                tempMap[i][j].data.y = j;
                let offset = cc.v2(i, j).subSelf(cc.v2(CENTER,CENTER));
                let offsetPos = ChunkWorld.getPosInMap(offset);
                tempMap[i][j].targetPosition =selectPosition.clone().addSelf(offsetPos);
                tempMap[i][j].loadMap();
            }
        }
        
        this.printMapIndex();
        this.map = tempMap;
    }
    private printMapIndex(){
        let str = '';
        for (let i = ChunkWorld.SIZE-1; i >=0; i--) {
            for (let j = 0; j < ChunkWorld.SIZE; j++) {
                str+=`(${this.map[j][i].data.x},${this.map[j][i].data.y})`;
            }
            str+='\n';
        }
        // cc.log(str);
    }
    /**
     * 获取正确的下标
     * @param select 当前选择位置
     * @param target 需要修改的位置
     */
    private getCorrectIndex(select:cc.Vec2,target:cc.Vec2):cc.Vec2{
        const CENTER = Math.floor(ChunkWorld.SIZE/2);
        let pos = target.clone();
        let offsetX = select.x-CENTER;
        let offsetY = select.y-CENTER;
        pos.x = pos.x+offsetX;
        pos.y = pos.y+offsetY;
        if(pos.x<0){
            pos.x = pos.x+ChunkWorld.SIZE;
        }else if(pos.x>=ChunkWorld.SIZE){
            pos.x = pos.x-ChunkWorld.SIZE;
        }
        if(pos.y<0){
            pos.y = pos.y+ChunkWorld.SIZE;
        }else if(pos.y>=ChunkWorld.SIZE){
            pos.y = pos.y-ChunkWorld.SIZE;
        }
        return pos;
    }
    static getPosInMap(pos: cc.Vec2) {
        let x = pos.x * Chunk.WIDTH*Chunk.TILE_SCALE*Chunk.TILE_SIZE;
        let y = pos.y * Chunk.HEIGHT*Chunk.TILE_SCALE*Chunk.TILE_SIZE;
        return cc.v2(x, y);
    }
    //获取不超出地图的坐标
    static fixOuterMap(pos: cc.Vec2,offset:cc.Vec2): cc.Vec2 {
        let x = (pos.x - offset.x) / (Chunk.WIDTH*Chunk.TILE_SCALE*Chunk.TILE_SIZE);
        let y = (pos.y - offset.y) / (Chunk.WIDTH*Chunk.TILE_SCALE*Chunk.TILE_SIZE);
        x = Math.round(x);
        y = Math.round(y);
        let isOuter = false;
        if (x < 0) { x = 0; isOuter = true; }
        if (x >= ChunkWorld.SIZE) { x = ChunkWorld.SIZE - 1; isOuter = true; }
        if (y < 0) { y = 0; isOuter = true; }
        if (y >= ChunkWorld.SIZE) { y = ChunkWorld.SIZE - 1; isOuter = true; }
        if (isOuter) {
            return ChunkWorld.getPosInMap(cc.v2(x, y));
        } else {
            return pos;
        }
    }
    static getIndexInMap(pos: cc.Vec2, offset:cc.Vec2) {
        let x = (pos.x - offset.x) / (Chunk.WIDTH*Chunk.TILE_SCALE*Chunk.TILE_SIZE);
        let y = (pos.y - offset.y) / (Chunk.WIDTH*Chunk.TILE_SCALE*Chunk.TILE_SIZE);
        x = Math.round(x);
        y = Math.round(y);
        if (x < 0) { x = 0 }; if (x >= ChunkWorld.SIZE) { x = ChunkWorld.SIZE - 1 };
            if (y < 0) { y = 0 }; if (y >= ChunkWorld.SIZE) { y = ChunkWorld.SIZE - 1 };
        return cc.v2(x, y);
    }
    start () {

    }

    // update (dt) {}
}
