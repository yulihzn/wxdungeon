import MapData from '../data/MapData'
import RectRoom from '../rect/RectRoom'
import RectDungeon from '../rect/RectDungeon'
import Logic from '../logic/Logic'
import EquipmentData from '../data/EquipmentData'
import ItemData from '../data/ItemData'
import Random4Save from '../utils/Random4Save'
import RoomType from '../rect/RoomType'
import BuildingData from '../data/BuildingData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/*地图管理器
 */
export default class MapManager {
    isloaded: boolean = false
    //地图数据管理类
    rectDungeon: RectDungeon = null
    rand4save: Random4Save
    randMap: Map<string, Random4Save> = new Map()
    static readonly RANDOM_EQUIP = 'RANDOM_EQUIP'
    static readonly RANDOM_BUILDING = 'RANDOM_BUILDING'
    constructor() {
        this.init()
    }
    // LIFE-CYCLE CALLBACKS:

    init() {
        this.isloaded = false
    }
    clear(): void {
        this.rectDungeon = null
        this.rand4save = null
        this.randMap.clear()
    }

    reset() {
        let data = Logic.worldLoader.getCurrentLevelData()
        this.rand4save = null
        //地图重新生成
        this.rectDungeon = new RectDungeon()
        if (Logic.profileManager.data && Logic.profileManager.data.rectDungeons[`${data.chapter}${data.index}`]) {
            this.rectDungeon.buildMapFromSave(Logic.profileManager.data.rectDungeons[`${data.chapter}${data.index}`], data)
        } else {
            this.rectDungeon.buildMap(data)
            //设置当前位置为开始房间位置
            // let index = this.rectDungeon.startIndex
            // this.rectDungeon.currentPos = cc.v3(index.x, index.y)
        }
        cc.log(this.rectDungeon.getDisPlay())
        //修改当前房间和四周房间状态为发现
        this.rectDungeon.changeRoomsIsFound(this.rectDungeon.currentPos.x, this.rectDungeon.currentPos.y)
        this.isloaded = true
        cc.log('加载地图完成')
    }
    changePos(pos: cc.Vec3) {
        this.rectDungeon.currentPos = pos.clone()
        this.rectDungeon.changeRoomsIsFound(this.rectDungeon.currentPos.x, this.rectDungeon.currentPos.y)
    }
    /** dir为-1就是当前房间 */
    loadingNextRoom(dir: number): RectRoom {
        let room = this.rectDungeon.getNeighborRoom(this.rectDungeon.currentPos.x, this.rectDungeon.currentPos.y, dir)
        if (room && room.roomType) {
            this.rectDungeon.currentPos = cc.v3(room.x, room.y)
            this.rectDungeon.changeRoomsIsFound(room.x, room.y)
        }
        return room
    }

    /** 获取当前房间地图数据copy 每次加载dungeon的时候读取一次*/
    public getCurrentMapStringArray(): string[][] {
        let room = this.getCurrentRoom()
        let mdd = new MapData('')
        let data = Logic.worldLoader.getCurrentLevelData()
        mdd.map = data.getRoomMap(room.x, room.y)
        //添加随机元素
        let mapdata = this.addGenerateThings(mdd, room.roomType, room.seed, data.needRandomDecorate)
        return mapdata.map
    }
    public getCurrentSideMapStringArray(offset: cc.Vec3): string[][] {
        let room = this.getCurrentRoom()
        let mdd = new MapData('')
        let data = Logic.worldLoader.getCurrentLevelData()
        mdd.map = data.getRoomMap(room.x + offset.x, room.y + offset.y)
        return mdd.map
    }
    public getCurrentFloorMapStringArray(): string[][] {
        let room = this.getCurrentRoom()
        let mdd = new MapData('')
        let data = Logic.worldLoader.getCurrentLevelData()
        mdd.map = data.getRoomFloorMap(room.x, room.y)
        //添加随机元素
        // let rand4save = new Random4Save(room.seed)
        // this.addRandomTile(mdd, rand4save)
        return mdd.map
    }
    public getCurrentSideFloorMapStringArray(offset: cc.Vec3): string[][] {
        let room = this.getCurrentRoom()
        let mdd = new MapData('')
        let data = Logic.worldLoader.getCurrentLevelData()
        mdd.map = data.getRoomFloorMap(room.x + offset.x, room.y + offset.y)
        return mdd.map
    }
    public getCurrentMapSize(): cc.Vec3 {
        let data = Logic.worldLoader.getCurrentLevelData()
        return cc.v3(data.roomWidth, data.roomHeight)
    }
    /** 获取当前房间*/
    public getCurrentRoom(): RectRoom {
        if (this.rectDungeon && this.rectDungeon.map) {
            let room = this.rectDungeon.map[this.rectDungeon.currentPos.x][this.rectDungeon.currentPos.y]
            return room ? room : new RectRoom(1, 1, RoomType.Z_ROOM)
        }
    }
    getPosKey(pos: cc.Vec3) {
        return `x=${pos}y=${pos}`
    }

    /** 获取当前房间指定建筑*/
    public getCurrentMapBuilding(defaultPos: cc.Vec3): BuildingData {
        let buildings = this.rectDungeon.buildings[this.getPosKey(this.rectDungeon.currentPos)]
        if (buildings) {
            return buildings[this.getPosKey(defaultPos)]
        }
        return null
    }
    /** 设置当前房间建筑*/
    public setCurrentBuildingData(data: BuildingData) {
        let buildings = this.rectDungeon.buildings[this.getPosKey(this.rectDungeon.currentPos)]
        if (!buildings) {
            buildings = {}
            this.rectDungeon.buildings[this.getPosKey(this.rectDungeon.currentPos)] = buildings
        }
        buildings[`x=${data.defaultPos.x}y=${data.defaultPos.y}`] = data
    }

    /** 获取当前房间装备*/
    public getCurrentMapEquipments(): EquipmentData[] {
        return this.rectDungeon.equipments[this.getPosKey(this.rectDungeon.currentPos)]
    }
    /** 设置当前房间装备*/
    public setCurrentEquipmentsArr(arr: EquipmentData[]) {
        this.rectDungeon.equipments[this.getPosKey(this.rectDungeon.currentPos)] = arr
    }
    /** 获取当前房间物品*/
    public getCurrentMapItems(): ItemData[] {
        return this.rectDungeon.items[this.getPosKey(this.rectDungeon.currentPos)]
    }
    /** 设置当前房间物品*/
    public setCurrentItemsArr(arr: ItemData[]) {
        this.rectDungeon.items[this.getPosKey(this.rectDungeon.currentPos)] = arr
    }
    /** 设置房间状态为清理*/
    public setRoomClear(x: number, y: number) {
        if (this.rectDungeon && this.rectDungeon.map && x < this.rectDungeon.map.length && y < this.rectDungeon.map[0].length) {
            this.rectDungeon.map[x][y].state = RectRoom.STATE_CLEAR
            this.rectDungeon.map[x][y].isReborn = false
        }
    }

    /** 获取当前房间状态*/
    public getCurrentRoomState(): number {
        return this.getCurrentRoom().state
    }
    /** 当前房间状态是否为清理*/
    public isCurrentRoomStateClear(): boolean {
        return this.getCurrentRoomState() == RectRoom.STATE_CLEAR
    }
    /** 获取当前房间类型*/
    public getCurrentRoomType(): RoomType {
        return this.getCurrentRoom().roomType
    }
    public isNeighborRoomExist(dir: number) {
        let room = this.rectDungeon.getNeighborRoom(this.rectDungeon.currentPos.x, this.rectDungeon.currentPos.y, dir)
        if (!room) {
            return false
        }
        return true
    }
    public isNeighborRoomNew(dir: number) {
        let room = this.rectDungeon.getNeighborRoom(this.rectDungeon.currentPos.x, this.rectDungeon.currentPos.y, dir)
        if (!room) {
            return false
        }
        return room.state != RectRoom.STATE_CLEAR
    }
    public isNeighborRoomStateClear(dir: number) {
        let room = this.rectDungeon.getNeighborRoom(this.rectDungeon.currentPos.x, this.rectDungeon.currentPos.y, dir)
        if (!room) {
            return false
        }
        return room.state == RectRoom.STATE_CLEAR
    }
    public getCurrentRoomRandom4Save(keyType: string): Random4Save {
        let room = this.getCurrentRoom()
        if (room) {
            let key = keyType + this.getPosKey(cc.v3(room.x, room.y))
            if (!this.randMap.has(key)) {
                this.randMap.set(key, new Random4Save(room.seed))
            }
            return this.randMap.get(key)
        } else {
            if (!this.rand4save) {
                this.rand4save = new Random4Save(0)
            }
        }
        return this.rand4save
    }
    public getRebornSeed(seed: number) {
        return seed + Logic.mapManager.getCurrentRoom().reborn * 100000000
    }
    public getSeedFromRoom() {
        let rand4save = Logic.mapManager.getCurrentRoomRandom4Save(MapManager.RANDOM_BUILDING)
        return rand4save.getRandomNum(0, 100000000)
    }
    public getRandom4Save(seed: number) {
        let rand4save = new Random4Save(seed > 0 ? seed : this.getSeedFromRoom())
        rand4save.rand()
        return rand4save
    }

    /**添加随机元素 */
    private addGenerateThings(mapData: MapData, roomType: RoomType, seed: number, needDecorate: boolean): MapData {
        let rand4save = new Random4Save(seed)
        cc.log(`seed:${seed}`)

        if (RoomType.isDecorateRoomType(roomType) && needDecorate) {
            rand4save = new Random4Save(seed)
            this.addDecorate(mapData, rand4save)
        }
        return mapData
    }
    private addRandomTile(mapData: MapData, rand4save: Random4Save) {
        let pos = []
        for (let i = 0; i < 10; i++) {
            let dx = rand4save.getRandomNum(0, mapData.map.length - 1)
            let dy = rand4save.getRandomNum(0, mapData.map[0].length - 1)
            pos.push(cc.v3(dx, 0))
            pos.push(cc.v3(0, dy))
            pos.push(cc.v3(dx, dy))
        }
        for (let p of pos) {
            if (mapData.map[p.x][p.y] == '**') {
                mapData.map[p.x][p.y] = `*${rand4save.getRandomNum(0, 2)}`
            }
        }
    }
    private addDecorate(mapData: MapData, rand4save: Random4Save) {
        let pos = []
        for (let i = 0; i < 2; i++) {
            let dx = rand4save.getRandomNum(1, mapData.map.length - 2)
            let dy = rand4save.getRandomNum(1, mapData.map[0].length - 2)
            pos.push(cc.v3(dx, dy))
        }
        for (let p of pos) {
            //装饰建筑或者空
            if (!mapData.map[p.x][p.y] || mapData.map[p.x][p.y].indexOf('W') != -1) {
                mapData.map[p.x][p.y] = `W${rand4save.getRandomNum(0, 2)}`
            }
        }
    }
}
