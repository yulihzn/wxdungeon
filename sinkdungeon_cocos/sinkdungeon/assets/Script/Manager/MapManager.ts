import MapData from "../Data/MapData";
import RectRoom from "../Rect/RectRoom";
import RectDungeon from "../Rect/RectDungeon";
import Logic from "../Logic";
import EquipmentData from "../Data/EquipmentData";
import ItemData from "../Data/ItemData";
import Random4Save from "../Utils/Random4Save";
import RoomType from "../Rect/RoomType";
import BuildingData from "../Data/BuildingData";

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
    isloaded: boolean = false;
    //地图数据管理类
    rectDungeon: RectDungeon = null;
    rand4save: Random4Save;
    constructor() {
        this.init();
    }
    // LIFE-CYCLE CALLBACKS:


    init() {
        this.isloaded = false;
    }

    /**
     * 初始化地图数据
     * 读取指定章节和层数的地图列表，随机选取一个
     * 
     */
    public loadMap() {
        if (Logic.isMapReset) {
            //加载地图
            Logic.mapManager.reset();
        }
        cc.log('maps loaded');
    }

    reset(pos?: cc.Vec3) {
        Logic.isMapReset = false;
        let data = Logic.worldLoader.getCurrentLevelData();
        this.rand4save = null;
        //地图重新生成
        this.rectDungeon = new RectDungeon();
        if (Logic.profileManager.data && Logic.profileManager.data.rectDungeons[`${data.chapter}${data.index}`]) {
            this.rectDungeon.buildMapFromSave(Logic.profileManager.data.rectDungeons[`${data.chapter}${data.index}`],data);
        } else {
            this.rectDungeon.buildMap(data);
            //设置当前位置为开始房间位置
            let index = this.rectDungeon.startIndex;
            this.rectDungeon.currentPos = cc.v3(index.x, index.y);
        }
        if(pos){
            this.rectDungeon.currentPos = pos.clone();
        }
        cc.log(this.rectDungeon.getDisPlay());
        //修改当前房间和四周房间状态为发现
        this.rectDungeon.changeRoomsIsFound(this.rectDungeon.currentPos.x, this.rectDungeon.currentPos.y);
    }
    /** dir为-1就是当前房间 */
    loadingNextRoom(dir: number): RectRoom {
        let room = this.rectDungeon.getNeighborRoomType(this.rectDungeon.currentPos.x, this.rectDungeon.currentPos.y, dir);
        if (room && room.roomType) {
            this.rectDungeon.currentPos = cc.v3(room.x, room.y);
            this.rectDungeon.changeRoomsIsFound(room.x, room.y);
        }
        return room;
    }

    /** 获取当前房间地图数据copy 每次加载dungeon的时候读取一次*/
    public getCurrentMapStringArray(): string[][] {
        let room = this.getCurrentRoom();
        let mdd = new MapData('');
        let data = Logic.worldLoader.getCurrentLevelData();
        mdd.map = data.getRoomMap(room.x, room.y);
        //添加随机元素
        let mapdata = this.addGenerateThings(mdd, room.roomType, room.seed, data.needRadomDecorate);
        return mapdata.map;
    }
    public getCurrentMapSize(): cc.Vec3 {
        let data = Logic.worldLoader.getCurrentLevelData();
        return cc.v3(data.roomWidth, data.roomHeight);
    }
    /** 获取当前房间*/
    public getCurrentRoom(): RectRoom {
        if (this.rectDungeon && this.rectDungeon.map) {
            return this.rectDungeon.map[this.rectDungeon.currentPos.x][this.rectDungeon.currentPos.y];
        }
        return null;
    }
    /** 获取当前房间指定建筑*/
    public getCurrentMapBuilding(defaultPos: cc.Vec3): BuildingData {
        let buildings = this.rectDungeon.buildings[`x=${this.rectDungeon.currentPos.x}y=${this.rectDungeon.currentPos.y}`];
        if (buildings) {
            return buildings[`x=${defaultPos.x}y=${defaultPos.y}`];
        }
        return null;
    }
    /** 设置当前房间建筑*/
    public setCurrentBuildingData(data: BuildingData) {
        let buildings = this.rectDungeon.buildings[`x=${this.rectDungeon.currentPos.x}y=${this.rectDungeon.currentPos.y}`];
        if (!buildings) {
            buildings = {}
            this.rectDungeon.buildings[`x=${this.rectDungeon.currentPos.x}y=${this.rectDungeon.currentPos.y}`] = buildings;
        }
        buildings[`x=${data.defaultPos.x}y=${data.defaultPos.y}`] = data;
    }

    /** 获取当前房间装备*/
    public getCurrentMapEquipments(): EquipmentData[] {
        return this.rectDungeon.equipments[`x=${this.rectDungeon.currentPos.x}y=${this.rectDungeon.currentPos.y}`];
    }
    /** 设置当前房间装备*/
    public setCurrentEquipmentsArr(arr: EquipmentData[]) {
        this.rectDungeon.equipments[`x=${this.rectDungeon.currentPos.x}y=${this.rectDungeon.currentPos.y}`] = arr;
    }
    /** 获取当前房间物品*/
    public getCurrentMapItems(): ItemData[] {
        return this.rectDungeon.items[`x=${this.rectDungeon.currentPos.x}y=${this.rectDungeon.currentPos.y}`];
    }
    /** 设置当前房间物品*/
    public setCurrentItemsArr(arr: ItemData[]) {
        this.rectDungeon.items[`x=${this.rectDungeon.currentPos.x}y=${this.rectDungeon.currentPos.y}`] = arr;
    }
    /** 设置房间状态为清理*/
    public setRoomClear(x: number, y: number) {
        this.rectDungeon.map[x][y].state = RectRoom.STATE_CLEAR;
    }
    /** 获取当前房间状态*/
    public getCurrentRoomState(): number {
        return this.getCurrentRoom().state;
    }
    /** 当前房间状态是否为清理*/
    public isCurrentRoomStateClear(): boolean {
        return this.getCurrentRoomState() == RectRoom.STATE_CLEAR;
    }
    /** 获取当前房间类型*/
    public getCurrentRoomType(): RoomType {
        return this.getCurrentRoom().roomType;
    }
    public getCurrentRoomRandom4Save(): Random4Save {
        let room = this.getCurrentRoom();
        if (room) {
            if (!this.rand4save) {
                this.rand4save = new Random4Save(room.seed);
                this.rand4save.Seed = room.seed;
            }
        } else {
            if (!this.rand4save) {
                this.rand4save = new Random4Save(0);
            }
        }
        return this.rand4save;
    }
    public setCurrentRoomExitPos(pos: cc.Vec3) {
        let room = this.getCurrentRoom();
        if (room && pos) {
            room.exitPos = cc.v3(pos.x, pos.y);
        }
    }

    /**添加随机元素 */
    private addGenerateThings(mapData: MapData, roomType: RoomType, seed: number, needDecorate: boolean): MapData {
        let rand4save = new Random4Save(seed);
        cc.log(`seed:${seed}`);
        this.addRandomTile(mapData, rand4save);
        if (RoomType.isDecorateRoomType(roomType) && needDecorate) {
            rand4save = new Random4Save(seed);
            this.addDecorate(mapData, rand4save);
        }
        return mapData;
    }
    private addRandomTile(mapData: MapData, rand4save: Random4Save) {
        let pos = [];
        for (let i = 0; i < 10; i++) {
            let dx = rand4save.getRandomNum(0, mapData.map.length - 1);
            let dy = rand4save.getRandomNum(0, mapData.map[0].length - 1);
            pos.push(cc.v3(dx, 0));
            pos.push(cc.v3(0, dy));
            pos.push(cc.v3(dx, dy));

        }
        for (let p of pos) {
            if (mapData.map[p.x][p.y] == '**') {
                mapData.map[p.x][p.y] = `*${rand4save.getRandomNum(0, 2)}`;
            }
        }
    }
    private addDecorate(mapData: MapData, rand4save: Random4Save) {
        let pos = [];
        for (let i = 0; i < 4; i++) {
            let dx = rand4save.getRandomNum(1, mapData.map.length - 2);
            let dy = rand4save.getRandomNum(1, mapData.map[0].length - 2);
            pos.push(cc.v3(dx, dy));
        }
        for (let p of pos) {
            if (mapData.map[p.x][p.y] == '**' || mapData.map[p.x][p.y].indexOf('W') != -1) {
                mapData.map[p.x][p.y] = `W${rand4save.getRandomNum(0, 2)}`;
            }
        }

    }
}
