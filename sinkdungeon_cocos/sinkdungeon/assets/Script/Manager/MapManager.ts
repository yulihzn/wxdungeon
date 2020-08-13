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
    //当前房间下标
    currentPos: cc.Vec3 = cc.v3(0, 0);
    //根据下标保存建筑信息
    buildings: { [key: string]: { [key: string]: BuildingData} } = {};
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
            Logic.mapManager.reset();
            //加载存档地图数据
            Logic.mapManager.loadDataFromSave();
        }
        cc.log('maps loaded');
    }
    private resetRooms() {
        if(!this.rectDungeon){
            this.rectDungeon.buildMap(Logic.worldLoader.getLevelData(Logic.chapterIndex,Logic.level));
        }
    }
    loadDataFromSave() {
        if (!Logic.profileManager.hasSaveData) {
            return;
        }
        this.rectDungeon.buildMapFromSave(Logic.profileManager.data.rectDungeon);
        this.currentPos = Logic.profileManager.data.currentPos.clone();
        this.buildings = Logic.profileManager.data.buildings;
        this.equipments = Logic.profileManager.data.equipments;
        this.items = Logic.profileManager.data.items;
        this.rectDungeon.changeRoomsIsFound(this.currentPos.x, this.currentPos.y);
        cc.log('load');
        cc.log(this.rectDungeon.getDisPlay());
    }
    reset(isBack?:boolean) {
        let data = Logic.worldLoader.getLevelData(Logic.chapterIndex, Logic.level);
        //地图重新生成
        this.rectDungeon = new RectDungeon();
        this.rectDungeon.buildMap(data);
        cc.log(this.rectDungeon.getDisPlay());
        //有房间数据的情况下重置房间
        this.resetRooms();
        //设置当前位置为开始房间位置
        let index = isBack?this.rectDungeon.endIndex:this.rectDungeon.startIndex;
        this.currentPos = cc.v3(index.x, index.y);
        //修改当前房间和四周房间状态为发现
        this.rectDungeon.changeRoomsIsFound(this.currentPos.x, this.currentPos.y);
        //清空缓存的箱子商店宝箱装备物品数据
        this.buildings = {};
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
        let mdd = new MapData('');
        mdd.map = Logic.worldLoader.getLevelData(Logic.chapterIndex,Logic.level).getRoom(room.x,room.y);
        //添加随机元素
        let mapdata = this.addGenerateThings(mdd, room.roomType, room.seed);
        return mapdata.map;
    }
    public getCurrentMapSize(): cc.Vec3 {
        let data = Logic.worldLoader.getLevelData(Logic.chapterIndex,Logic.level);
        return cc.v3(data.roomWidth, data.roomHeight);
    }
    /** 获取当前房间*/
    public getCurrentRoom(): RectRoom {
        return this.rectDungeon.map[this.currentPos.x][this.currentPos.y];
    }
    /** 获取当前房间指定建筑*/
    public getCurrentMapBuilding(defaultPos:cc.Vec3): BuildingData {
        let buildings = this.buildings[`x=${this.currentPos.x}y=${this.currentPos.y}`];
        if(buildings){
            return buildings[`x=${defaultPos.x}y=${defaultPos.y}`];
        }
        return null;
    }
    /** 设置当前房间建筑*/
    public setCurrentBuildingData(data: BuildingData) {
        let buildings = this.buildings[`x=${this.currentPos.x}y=${this.currentPos.y}`];
        if(!buildings){
            buildings = {}
            this.buildings[`x=${this.currentPos.x}y=${this.currentPos.y}`] = buildings;
        }
        buildings[`x=${data.defaultPos.x}y=${data.defaultPos.y}`] = data;
        Logic.profileManager.data.buildings = this.buildings;
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
