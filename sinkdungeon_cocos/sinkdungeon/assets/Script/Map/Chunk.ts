import ChunkData from "../Data/ChunkData";
import { EventHelper } from "../EventHelper";
import Random4Save from "../Utils/Random4Save";
import Random from "../Utils/Random";

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

/**
 * 地图块
 * 按结构来分有空、平地、横墙、竖墙、十字墙
 * 按类型来分有实验室、草地、水面、森林、岩石、甲板、船舱、金字塔、地牢
 * 按功能来分有出生房，boss房，宝箱房，上下切换房
 * 地图块包含了地表，瓷砖，建筑，装饰，生物，物品，装备
 * 地图块需要保存生物列表，包括生物的属性位移血量
 * 以及可以交互产生变化的元素，比如道具，装备，装饰墙，商店购买情况
 * 
 */
@ccclass
export default class Chunk extends cc.Component {

    static readonly TYPE_EMPTY = 0;
    static readonly TYPE_NORMAL = 1;
    static readonly TYPE_WALL_VERTICAL = 2;
    static readonly TYPE_WALL_HORIZONTAL = 3;
    static readonly TYPE_WALL_CROSS = 4;
    @property(cc.Node)
    floor:cc.Node = null;
    @property(cc.Label)
    label:cc.Label = null;
    @property(cc.Node)
    select:cc.Node = null;
    @property(cc.Prefab)
    wall:cc.Prefab = null;
    layer:cc.Node;
    static readonly WIDTH = 5;
    static readonly HEIGHT = 5;
    static readonly TILE_SIZE = 16;
    static readonly TILE_SCALE = 4;

    data:ChunkData = new ChunkData();
    targetPosition:cc.Vec3 = cc.v3(0,0);

    onLoad () {
        this.layer = this.node.getChildByName('layer');
        this.floor.scale = Chunk.TILE_SCALE;
        this.floor.width = Chunk.TILE_SIZE*Chunk.WIDTH;
        this.floor.height = Chunk.TILE_SIZE*Chunk.HEIGHT;
        this.select.scale = Chunk.TILE_SCALE;
        this.select.width = Chunk.TILE_SIZE*Chunk.WIDTH;
        this.select.height = Chunk.TILE_SIZE*Chunk.HEIGHT;
        this.node.width = Chunk.TILE_SCALE*Chunk.TILE_SIZE*Chunk.WIDTH;
        this.node.height = Chunk.TILE_SCALE*Chunk.TILE_SIZE*Chunk.HEIGHT;
        
        
    }
    onClicked(){
        this.floor.color = cc.Color.GREEN;
        this.scheduleOnce(()=>{this.floor.color = cc.Color.WHITE;},1)
    }
    loadMap(){
        this.label.node.position = cc.v3(this.node.width/2,this.node.height/2);
        // this.label.string = `${this.targetPosition.x},${this.targetPosition.y}\n${this.data.x},${this.data.y}`
        this.label.string = `${this.targetPosition.x},${this.targetPosition.y}`;
        this.node.position = this.targetPosition.clone();
        this.layer.removeAllChildren();
        for(let i = 0;i<2;i++){
            let w = cc.instantiate(this.wall);
            w.parent = this.layer;
            w.position = cc.v3(Random.getRandomNum(0,this.node.width),Random.getRandomNum(0,this.node.height));
            w.zIndex = 100;
        }
    }

    lateUpdate(){
        // if(this.targetPosition){
        //     this.node.position = this.lerp(this.node.position,this.node.parent.convertToNodeSpaceAR(this.targetPosition),0.5);
        // }
    }
    lerp(self:cc.Vec3,to:cc.Vec3, ratio:number):cc.Vec3 {
        let out = cc.v3(0,0);
        let x = self.x;
        let y = self.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        return out;
    }
}
