import Chunk from './Chunk'
import { EventHelper } from '../logic/EventHelper'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

/**
 * 大地图
 * 生成一个指定大小的地图，地图的元素按块加载，每次以角色为中心加载25个地图块
 * 不足25个地图块按空地图块来算
 * 目前需要加入的场景是：油湖全貌，实验室内部，金字塔内部，地牢内部，船舱内部
 *
 * 生成策略
 *
 * 油湖全貌：32x32地图,地形元素：陆地和水，交接处，上下左右四个拐角八种类型
 * 实验室内部：7x7地图，五层
 * 金字塔内部：16x16随机生成，五层
 * 船舱内部：3x3地图三层
 */
@ccclass
export default class ChunkWorld extends cc.Component {
    static readonly SIZE = 5
    @property(cc.Prefab)
    chunkPrefab: cc.Prefab = null
    worldMap: string[][] = new Array()
    currentMap: Chunk[][] = new Array()
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        const CENTER = Math.floor(ChunkWorld.SIZE / 2)
        EventHelper.on(EventHelper.CHUNK_LOAD, detail => {
            let pos = detail.pos
            let p = ChunkWorld.getIndexInMap(pos, this.currentMap[0][0].targetPosition)
            cc.log(p)
            this.changeMap(p.x, p.y)
        })
        this.initMap()
    }
    private initMap() {
        for (let i = 0; i < ChunkWorld.SIZE; i++) {
            this.currentMap[i] = new Array(i)
            for (let j = 0; j < ChunkWorld.SIZE; j++) {
                let c = cc.instantiate(this.chunkPrefab)
                c.parent = this.node
                c.position = ChunkWorld.getPosInMap(cc.v3(i, j))
                c.zIndex = 100
                let chunk = c.getComponent(Chunk)
                chunk.data.x = i
                chunk.data.y = j
                this.currentMap[i][j] = chunk
                chunk.targetPosition = c.position.clone()
                chunk.loadMap()
                // chunk.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch)=> {
                //     chunk.onClicked();
                //     cc.log(cc.v3(chunk.data.x,chunk.data.y));
                //     this.changeMap(chunk.data.x,chunk.data.y);
                // }, this);
            }
        }
        this.printMapIndex()
    }

    getTargetChunkPos(targetPosition: cc.Vec3) {
        let leftBottomPos = cc.v3(this.currentMap[0][0].data.x, this.currentMap[0][0].data.y)
    }
    private changeMap(x: number, y: number) {
        const CENTER = Math.floor(ChunkWorld.SIZE / 2)
        if (x == CENTER && y == CENTER) {
            return
        }
        let selectPosition = this.currentMap[x][y].targetPosition.clone()
        let tempMap: Chunk[][] = new Array()
        for (let i = 0; i < ChunkWorld.SIZE; i++) {
            tempMap[i] = new Array(i)
            for (let j = 0; j < ChunkWorld.SIZE; j++) {
                //获取对应旧map的chunk并改变下标
                let pos = this.getCorrectIndex(cc.v3(x, y), cc.v3(i, j))
                tempMap[i][j] = this.currentMap[pos.x][pos.y]
                tempMap[i][j].data.x = i
                tempMap[i][j].data.y = j
                if (pos.z == 1) {
                    let offset = cc.v3(i, j).subSelf(cc.v3(CENTER, CENTER))
                    let offsetPos = ChunkWorld.getPosInMap(offset)
                    tempMap[i][j].targetPosition = selectPosition.clone().addSelf(offsetPos)
                    tempMap[i][j].loadMap()
                }
            }
        }

        this.printMapIndex()
        this.currentMap = tempMap
    }
    private printMapIndex() {
        let str = ''
        for (let i = ChunkWorld.SIZE - 1; i >= 0; i--) {
            for (let j = 0; j < ChunkWorld.SIZE; j++) {
                str += `(${this.currentMap[j][i].data.x},${this.currentMap[j][i].data.y})`
            }
            str += '\n'
        }
        // cc.log(str);
    }
    /**
     * 获取正确的下标
     * @param select 当前选择位置
     * @param target 需要修改的位置
     */
    private getCorrectIndex(select: cc.Vec3, target: cc.Vec3): cc.Vec3 {
        const CENTER = Math.floor(ChunkWorld.SIZE / 2)
        let pos = target.clone()
        let offsetX = select.x - CENTER
        let offsetY = select.y - CENTER
        // let offsetX = CENTER-select.x;
        // let offsetY = CENTER-select.y;
        pos.x = pos.x + offsetX
        pos.y = pos.y + offsetY
        let isOuter = false
        if (pos.x < 0) {
            pos.x = pos.x + ChunkWorld.SIZE
            isOuter = true
        } else if (pos.x >= ChunkWorld.SIZE) {
            pos.x = pos.x - ChunkWorld.SIZE
            isOuter = true
        }
        if (pos.y < 0) {
            pos.y = pos.y + ChunkWorld.SIZE
            isOuter = true
        } else if (pos.y >= ChunkWorld.SIZE) {
            pos.y = pos.y - ChunkWorld.SIZE
            isOuter = true
        }
        return new cc.Vec3(pos.x, pos.y, isOuter ? 1 : 0)
    }
    static getPosInMap(pos: cc.Vec3) {
        let x = pos.x * Chunk.WIDTH * Chunk.TILE_SCALE * Chunk.TILE_SIZE
        let y = pos.y * Chunk.HEIGHT * Chunk.TILE_SCALE * Chunk.TILE_SIZE
        return cc.v3(x, y)
    }
    //获取不超出地图的坐标
    static fixOuterMap(pos: cc.Vec3, offset: cc.Vec3): cc.Vec3 {
        let x = (pos.x - offset.x) / (Chunk.WIDTH * Chunk.TILE_SCALE * Chunk.TILE_SIZE)
        let y = (pos.y - offset.y) / (Chunk.WIDTH * Chunk.TILE_SCALE * Chunk.TILE_SIZE)
        x = Math.round(x)
        y = Math.round(y)
        let isOuter = false
        if (x < 0) {
            x = 0
            isOuter = true
        }
        if (x >= ChunkWorld.SIZE) {
            x = ChunkWorld.SIZE - 1
            isOuter = true
        }
        if (y < 0) {
            y = 0
            isOuter = true
        }
        if (y >= ChunkWorld.SIZE) {
            y = ChunkWorld.SIZE - 1
            isOuter = true
        }
        if (isOuter) {
            return ChunkWorld.getPosInMap(cc.v3(x, y))
        } else {
            return pos
        }
    }
    static getIndexInMap(pos: cc.Vec3, offset: cc.Vec3) {
        let x = (pos.x - offset.x) / (Chunk.WIDTH * Chunk.TILE_SCALE * Chunk.TILE_SIZE)
        let y = (pos.y - offset.y) / (Chunk.WIDTH * Chunk.TILE_SCALE * Chunk.TILE_SIZE)
        x = Math.round(x)
        y = Math.round(y)
        if (x < 0) {
            x = 0
        }
        if (x >= ChunkWorld.SIZE) {
            x = ChunkWorld.SIZE - 1
        }
        if (y < 0) {
            y = 0
        }
        if (y >= ChunkWorld.SIZE) {
            y = ChunkWorld.SIZE - 1
        }
        return cc.v3(x, y)
    }
    start() {}

    // update (dt) {}
}
