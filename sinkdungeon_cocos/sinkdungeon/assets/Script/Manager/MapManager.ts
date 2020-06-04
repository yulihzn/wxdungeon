import MapData from "../Data/MapData";
import RectRoom from "../Rect/RectRoom";
import RectDungeon from "../Rect/RectDungeon";
import Logic from "../Logic";
import BoxData from "../Data/BoxData";
import EquipmentData from "../Data/EquipmentData";
import ShopTableData from "../Data/ShopTableData";
import ChestData from "../Data/ChestData";
import ItemData from "../Data/ItemData";
import Random4Save from "../Utils/Random4Save";
import RoomType from "../Rect/RoomType";
import LevelData from "../Data/LevelData";

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
    //当前房间下标
    currentPos: cc.Vec3 = cc.v3(0, 0);
    //根据下标保存普通箱子的位置
    boxes: { [key: string]: BoxData[] } = {};
    //根据下标保存商店状态
    shopTables: { [key: string]: ShopTableData[] } = {};
    //根据下标保存箱子信息
    chests: { [key: string]: ChestData[] } = {};
    //根据下标+uuid保存地上的装备
    equipments: { [key: string]: EquipmentData[] } = {};
    //根据下标+uuid保存地上的物品
    items: { [key: string]: ItemData[] } = {};
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
        if(Logic.isMapReset){
            Logic.isMapReset = false;
            //加载地图
            Logic.mapManager.reset(Logic.worldLoader.getRandomLevelData(Logic.chapterIndex,Logic.level));
            //加载存档地图数据
            Logic.mapManager.loadDataFromSave();
        }
        cc.log('maps loaded');
    }
    private resetRooms() {
        if(!this.rectDungeon){
            this.rectDungeon.buildMap(Logic.worldLoader.getRandomLevelData(Logic.chapterIndex,Logic.level));
        }
        let allfileRooms = Logic.worldLoader.getAllFileRooms();
        if (allfileRooms && allfileRooms[RoomType.getNameById(0)] 
        && this.rectDungeon.map&&this.rectDungeon.map.length>0) {
            for (let i = 0; i < this.rectDungeon.map.length; i++) {
                for (let j = 0; j < this.rectDungeon.map[0].length; j++) {
                    let room = this.rectDungeon.map[i][j];
                    let r = allfileRooms[RoomType.getNameById(room.roomType.ID)]
                    //随机取出一个该类型的房间数据
                    room.saveIndex = Logic.getRandomNum(0, r.length - 1);
                }
            }
        }
    }
    loadDataFromSave() {
        if (!Logic.profileManager.hasSaveData) {
            return;
        }
        this.rectDungeon.buildMapFromSave(Logic.profileManager.data.rectDungeon);
        this.currentPos = Logic.profileManager.data.currentPos.clone();
        this.boxes = Logic.profileManager.data.boxes;
        this.shopTables = Logic.profileManager.data.shopTables;
        this.chests = Logic.profileManager.data.chests;
        this.equipments = Logic.profileManager.data.equipments;
        this.items = Logic.profileManager.data.items;
        let levelData = this.rectDungeon.levelData;
        this.rectDungeon.changeRoomsIsFound(this.currentPos.x, this.currentPos.y);
        cc.log('load');
        cc.log(this.rectDungeon.getDisPlay());
    }
    reset(levelData: LevelData) {
        //地图重新生成
        this.rectDungeon = new RectDungeon();
        this.rectDungeon.buildMap(levelData);
        cc.log(this.rectDungeon.getDisPlay());
        //有房间数据的情况下重置房间
        this.resetRooms();
        //设置当前位置为开始房间位置
        this.currentPos = cc.v3(this.rectDungeon.startIndex.x, this.rectDungeon.startIndex.y);
        //修改当前房间和四周房间状态为发现
        this.rectDungeon.changeRoomsIsFound(this.currentPos.x, this.currentPos.y);
        //清空缓存的箱子商店宝箱装备物品数据
        this.boxes = {};
        this.shopTables = {};
        this.chests = {};
        this.equipments = {};
        this.items = {};
        // let oillake:OilLake = new OilLake();
        // cc.log(oillake.getDisPlay());
    }
    /** dir为-1就是当前房间 */
    loadingNextRoom(dir: number): RectRoom {
        let room = this.rectDungeon.getNeighborRoomType(this.currentPos.x, this.currentPos.y, dir);
        if (room && room.roomType) {
            this.currentPos = cc.v3(room.x, room.y);
            Logic.profileManager.data.currentPos = this.currentPos.clone();
            this.rectDungeon.changeRoomsIsFound(room.x, room.y);
        }
        return room;
    }

    /** 获取当前房间地图数据copy 每次加载dungeon的时候读取一次*/
    public getCurrentMapStringArray(): string[][] {
        let room = this.getCurrentRoom();
        let r = Logic.worldLoader.getAllFileRooms()[RoomType.getNameById(room.roomType.ID)];
        let md = r[room.saveIndex];
        let m = new Array();
        for (let i = 0; i < md.map.length; i++) {
            m[i] = new Array();
            for (let j = 0; j < md.map[0].length; j++) {
                m[i][j] = md.map[i][j];
            }
        }
        let mdd = new MapData('');
        mdd.map = m;
        //添加随机元素
        let mapdata = this.addGenerateThings(mdd, room.roomType, room.seed);
        return mapdata.map;
    }
    public getCurrentMapSize(): cc.Vec3 {
        let room = this.getCurrentRoom();
        let index = room.roomType.ID;
        let r = Logic.worldLoader.getAllFileRooms()[RoomType.getNameById(room.roomType.ID)];
        let map = r[room.saveIndex].clone();
        return cc.v3(map.map.length, map.map[0].length)
    }
    /** 获取当前房间*/
    public getCurrentRoom(): RectRoom {
        return this.rectDungeon.map[this.currentPos.x][this.currentPos.y];
    }
    /** 获取当前房间箱子*/
    public getCurrentMapBoxes(): BoxData[] {
        return this.boxes[`x=${this.currentPos.x}y=${this.currentPos.y}`];
    }
    /** 设置当前房间箱子*/
    public setCurrentBoxesArr(arr: BoxData[]) {
        this.boxes[`x=${this.currentPos.x}y=${this.currentPos.y}`] = arr;
        Logic.profileManager.data.boxes = this.boxes;
    }
    /** 获取当前房间商店*/
    public getCurrentMapShopTables(): ShopTableData[] {
        return this.shopTables[`x=${this.currentPos.x}y=${this.currentPos.y}`];
    }
    /** 设置当前房间商店*/
    public setCurrentShopTableArr(arr: ShopTableData[]) {
        this.shopTables[`x=${this.currentPos.x}y=${this.currentPos.y}`] = arr;
        Logic.profileManager.data.shopTables = this.shopTables;
    }
    /** 获取当前房间箱子*/
    public getCurrentMapChests(): ChestData[] {
        return this.chests[`x=${this.currentPos.x}y=${this.currentPos.y}`];
    }
    /** 设置当前房间箱子*/
    public setCurrentChestsArr(arr: ChestData[]) {
        this.chests[`x=${this.currentPos.x}y=${this.currentPos.y}`] = arr;
        Logic.profileManager.data.chests = this.chests;
    }
    /** 获取当前房间装备*/
    public getCurrentMapEquipments(): EquipmentData[] {
        return this.equipments[`x=${this.currentPos.x}y=${this.currentPos.y}`];
    }
    /** 设置当前房间装备*/
    public setCurrentEquipmentsArr(arr: EquipmentData[]) {
        this.equipments[`x=${this.currentPos.x}y=${this.currentPos.y}`] = arr;
        Logic.profileManager.data.equipments = this.equipments;
    }
    /** 获取当前房间物品*/
    public getCurrentMapItems(): ItemData[] {
        return this.items[`x=${this.currentPos.x}y=${this.currentPos.y}`];
    }
    /** 设置当前房间物品*/
    public setCurrentItemsArr(arr: ItemData[]) {
        this.items[`x=${this.currentPos.x}y=${this.currentPos.y}`] = arr;
        Logic.profileManager.data.items = this.items;
    }
    /** 设置房间状态为清理*/
    public setRoomClear(x: number, y: number) {
        this.rectDungeon.map[x][y].state = RectRoom.STATE_CLEAR;
    }
    /** 获取当前房间状态*/
    public getCurrentRoomState(): number {
        return this.rectDungeon.map[this.currentPos.x][this.currentPos.y].state;
    }
    /** 当前房间状态是否为清理*/
    public isCurrentRoomStateClear(): boolean {
        return this.getCurrentRoomState() == RectRoom.STATE_CLEAR;
    }
    /** 获取当前房间类型*/
    public getCurrentRoomType(): RoomType {
        return this.rectDungeon.map[this.currentPos.x][this.currentPos.y].roomType;
    }
    
   
    /**添加随机元素 */
    private addGenerateThings(mapData: MapData, roomType: RoomType, seed: number): MapData {
        let rand4save = new Random4Save(seed);
        cc.log(`seed:${seed}`);
        this.addRandomTile(mapData, rand4save);
        if (RoomType.isDecorateRoomType(roomType)) {
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
        for (let i = 0; i < 2; i++) {
            let dx = rand4save.getRandomNum(1, mapData.map.length - 2);
            let dy = rand4save.getRandomNum(1, mapData.map[0].length - 2);
            pos.push(cc.v3(dx, 1));
            pos.push(cc.v3(1, dy));
            pos.push(cc.v3(dx, dy));
        }
        for (let p of pos) {
            if (mapData.map[p.x][p.y].indexOf('*') != -1 || mapData.map[p.x][p.y].indexOf('D') != -1) {
                mapData.map[p.x][p.y] = `D${rand4save.getRandomNum(0, 2)}`;
            }
        }

    }
}
