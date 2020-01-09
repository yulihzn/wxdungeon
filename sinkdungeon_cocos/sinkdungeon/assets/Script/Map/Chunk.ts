import ChunkData from "../Data/ChunkData";
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
export default class Chunk extends cc.Component {

    @property(cc.Node)
    floor:cc.Node = null;
    @property(cc.Label)
    label:cc.Label = null;
    static readonly WIDTH = 5;
    static readonly HEIGHT = 5;
    static readonly TILE_SIZE = 16;
    static readonly TILE_SCALE = 4;

    static readonly LOAD_LEVEL0 = 0;
    static readonly LOAD_LEVEL1 = 1;
    static readonly LOAD_LEVEL2 = 2;

    loadLevel = Chunk.LOAD_LEVEL0;
    data:ChunkData = new ChunkData();
    targetPosition:cc.Vec2 = cc.v2(0,0);

    onLoad () {
        this.floor.scale = Chunk.TILE_SCALE;
        this.floor.width = Chunk.TILE_SIZE*Chunk.WIDTH;
        this.floor.height = Chunk.TILE_SIZE*Chunk.HEIGHT;
        this.node.width = Chunk.TILE_SCALE*Chunk.TILE_SIZE*Chunk.WIDTH;
        this.node.height = Chunk.TILE_SCALE*Chunk.TILE_SIZE*Chunk.HEIGHT;
        
    }
    onClicked(){
        cc.director.emit(EventConstant.CAMERA_LOOK, { detail: { position: this.node.convertToWorldSpaceAR(cc.v2(this.floor.width/2,this.floor.height/2)) } });
        this.floor.color = cc.Color.GREEN;
        this.scheduleOnce(()=>{this.floor.color = cc.Color.WHITE;},1)
    }
    loadMap(){
        this.label.node.position = cc.v2(this.node.width/2,this.node.height/2);
        this.label.string = `${this.targetPosition.x},${this.targetPosition.y}\n${this.data.x},${this.data.y}`
    }

    lateUpdate(){
        if(this.targetPosition){
            this.node.position = this.lerp(this.node.position,this.node.parent.convertToNodeSpaceAR(this.targetPosition),0.02);
        }
    }
    lerp(self:cc.Vec2,to:cc.Vec2, ratio:number):cc.Vec2 {
        let out = cc.v2(0,0);
        let x = self.x;
        let y = self.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        return out;
    }
}
