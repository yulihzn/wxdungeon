import MapData from "../Data/MapData";
import RectRoom from "../Rect/RectRoom";
import RectDungeon from "../Rect/RectDungeon";
import Logic from "../Logic";
import Box from "../Building/Box";
import BoxData from "../Data/BoxData";
import EquipmentData from "../Data/EquipmentData";
import ShopTableData from "../Data/ShopTableData";
import OilLake from "../Oil/OilLake";
import MonsterData from "../Data/MonsterData";
import ChestData from "../Data/ChestData";
import ItemData from "../Data/ItemData";
import Random from "../Utils/Random";
import Random4Save from "../Utils/Random4Save";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/*地图资源
*/
export default class MapManager {
    //读取文件的数据
    private allfileRooms00: { [key: string]: MapData[] } = {};
    private allfileRooms01: { [key: string]: MapData[] } = {};
    private allfileRooms02: { [key: string]: MapData[] } = {};
    private allfileRooms03: { [key: string]: MapData[] } = {};
    private allfileRooms04: { [key: string]: MapData[] } = {};
    private roomStrs = ['startroom', 'endroom','primaryroom', 'traproom', 'lootroom', 'dangerroom', 'merchantroom', 'puzzleroom', 'bossroom', 'pokerroom', 'tarotroom', 'testroom','finalroom'];
    //文件是否加载成功
    isloaded: boolean = false;
    isloaded00: boolean = false;
    isloaded01: boolean = false;
    isloaded02: boolean = false;
    isloaded03: boolean = false;
    isloaded04: boolean = false;
    //地图数据管理类
    rectDungeon: RectDungeon = new RectDungeon(1);
    //当前房间下标
    currentPos: cc.Vec2 = cc.v2(0, 0);
    //根据下标保存普通箱子的位置
    boxes: { [key: string]: BoxData[] } = {};
    //根据下标保存商店状态
    shopTables: { [key: string]: ShopTableData[] } = {};
    //根据下标保存箱子信息
    chests:{[key:string]:ChestData[]} = {};
    //根据下标+uuid保存地上的装备
    equipments:{[key:string]:EquipmentData[]} = {};
    //根据下标+uuid保存地上的物品
    items:{[key:string]:ItemData[]} = {};
    constructor() {
        this.init();
    }
    // LIFE-CYCLE CALLBACKS:


    init() {
        this.isloaded = false;
    }
    loadDataFromSave() {
        if (!Logic.profileManager.hasSaveData) {
            return;
        }
        this.rectDungeon = Logic.profileManager.data.rectDungeon;
        this.currentPos = Logic.profileManager.data.currentPos.clone();
        this.boxes = Logic.profileManager.data.boxes;
        this.shopTables = Logic.profileManager.data.shopTables;
        this.chests = Logic.profileManager.data.chests;
        this.equipments = Logic.profileManager.data.equipments;
        this.items = Logic.profileManager.data.items;
        this.changeRoomsIsFound(this.currentPos.x, this.currentPos.y);
        cc.log('load');
        cc.log(this.rectDungeon.getDisPlay());
    }
    reset(level: number) {
        //地图重新生成
        this.rectDungeon = new RectDungeon(level);
        cc.log(this.rectDungeon.getDisPlay());
        //有房间数据的情况下重置房间
        this.resetRooms();
        //设置当前位置为开始房间位置
        this.currentPos = cc.v2(this.rectDungeon.startRoom.x, this.rectDungeon.startRoom.y);
        //修改当前房间和四周房间状态为发现
        this.changeRoomsIsFound(this.currentPos.x, this.currentPos.y);
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
        let room = this.rectDungeon.getNeighborRoomType(this.currentPos.x, this.currentPos.y, dir)
        if (room && room.roomType != 0) {
            this.currentPos = cc.v2(room.x, room.y);
            Logic.profileManager.data.currentPos = this.currentPos.clone();
            this.changeRoomsIsFound(room.x, room.y);
        }
        return room;
    }
    /**设置当前房间和周围四个房间为发现状态 */
    changeRoomsIsFound(x: number, y: number) {
        this.rectDungeon.changeRoomIsFound(x, y);
        this.rectDungeon.changeRoomIsFound(x + 1, y);
        this.rectDungeon.changeRoomIsFound(x - 1, y);
        this.rectDungeon.changeRoomIsFound(x, y + 1);
        this.rectDungeon.changeRoomIsFound(x, y - 1);
    }


    /** 获取当前房间地图数据copy*/
    public getCurrentMapData(): MapData {
        let room = this.getCurrentRoom();
        let index = room.roomType - 1;
        let r = this.getAllFileRooms()[this.roomStrs[index]];
        let md = r[room.saveIndex];
        let m = new Array();
        for(let i = 0;i<md.map.length;i++){
            m[i] = new Array();
            for(let j =0;j<md.map[0].length;j++){
                m[i][j]=md.map[i][j];
            }
        }
        let mdd = new MapData('');
        mdd.map = m;
        let map = this.addGenerateThings(mdd,room.roomType,room.seed);
        return map;
    }
    public getCurrentMapSize():cc.Vec2{
        let room = this.getCurrentRoom();
        let index = room.roomType - 1;
        let r = this.getAllFileRooms()[this.roomStrs[index]];
        let map = r[room.saveIndex].clone();
        return cc.v2(map.map.length,map.map[0].length)
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
    public getCurrentRoomType(): number {
        return this.rectDungeon.map[this.currentPos.x][this.currentPos.y].roomType;
    }
    public loadMap() {
        //判断是否加载过地图资源
        if (this.allfileRooms00[this.roomStrs[0]]) {
            this.isloaded = true;
            return;
        }
        //加载五个章节的地图资源
        this.loadChapterMap(0, this.allfileRooms00);
        this.loadChapterMap(1, this.allfileRooms01);
        this.loadChapterMap(2, this.allfileRooms02);
        this.loadChapterMap(3, this.allfileRooms03);
        this.loadChapterMap(4, this.allfileRooms04);
    }
    private loadChapterMap(chapterIndex: number, allfileRooms: { [key: string]: MapData[] }) {
        cc.loader.loadRes(`Data/rooms0${chapterIndex}`, (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                let strs: string = resource.text;
                //以room为标签分割字符串
                let arr = strs.split('room');
                let index = 0;
                //循环获取各个类型room的地图数组
                for (let i = 0; i < arr.length; i++) {
                    let str = arr[i];
                    let temparr = null;
                    if (str) {
                        //获取=号以后的该room类型的地图数组（以$分隔）
                        str = str.substring(str.indexOf('=') + 1, str.length - 3);
                        temparr = str.split('$');
                    }
                    if (temparr) {
                        let a: MapData[] = new Array();
                        for (let j = 0; j < temparr.length; j++) {
                            let tempstr = temparr[j];
                            a.push(new MapData(tempstr));
                        }
                        //按顺序排列的room类型名来保存该类型的地图数组
                        allfileRooms[this.roomStrs[index]] = a;
                        index++;
                    }
                }
                switch (chapterIndex) {
                    case 0: this.isloaded00 = true; break;
                    case 1: this.isloaded01 = true; break;
                    case 2: this.isloaded02 = true; break;
                    case 3: this.isloaded03 = true; break;
                    case 4: this.isloaded04 = true; break;
                }
                //资源全部加载完成时，重置房间数据，加载存档
                if (this.isloaded00 && this.isloaded01 && this.isloaded02 && this.isloaded03 && this.isloaded04) {
                    this.resetRooms();
                    this.loadDataFromSave();
                    this.isloaded = true;
                    cc.log('maps loaded');
                }
            }
        })
    }
    /**添加随机元素 */
    private addGenerateThings(mapData:MapData,roomType:number,seed:number):MapData{
        let rand4save = new Random4Save(seed);
        cc.log(`seed:${seed}`);
        this.addRandomTile(mapData,rand4save);
        if(RectDungeon.TEST_ROOM != roomType&&RectDungeon.TAROT_ROOM != roomType&&RectDungeon.START_ROOM != roomType){
            rand4save = new Random4Save(seed);
            this.addDecorate(mapData,rand4save);
        }
        return mapData;
    }
    private addRandomTile(mapData:MapData,rand4save:Random4Save){
        let pos = [];
        for(let i = 0;i<10;i++){
            let dx = rand4save.getRandomNum(0,mapData.map.length-1);
            let dy = rand4save.getRandomNum(0,mapData.map[0].length-1);
            pos.push(cc.v2(dx,0));
            pos.push(cc.v2(0,dy));
            pos.push(cc.v2(dx,dy));
            
        }
        for(let p of pos){
            if(mapData.map[p.x][p.y] == '**'){
                mapData.map[p.x][p.y] = `*${rand4save.getRandomNum(0,2)}`;
            }
        }
    }
    private addDecorate(mapData:MapData,rand4save:Random4Save){
        let pos = [];
        for(let i = 0;i<2;i++){
            let dx = rand4save.getRandomNum(1,mapData.map.length-2);
            let dy = rand4save.getRandomNum(1,mapData.map[0].length-2);
            pos.push(cc.v2(dx,1));
            pos.push(cc.v2(1,dy));
            pos.push(cc.v2(dx,dy));
        }
        for(let p of pos){
            if(mapData.map[p.x][p.y].indexOf('*')!=-1||mapData.map[p.x][p.y].indexOf('D')!=-1){
                mapData.map[p.x][p.y] = `D${rand4save.getRandomNum(0,2)}`;
                cc.log(`addDecorate:${p}`);
            }
        }
        
    }
    private getAllFileRooms():{ [key: string]: MapData[] }{
        let allfileRooms = this.allfileRooms00;
        switch(Logic.chapterName){
            case Logic.CHAPTER00:allfileRooms = this.allfileRooms00;break;
            case Logic.CHAPTER01:allfileRooms = this.allfileRooms01;break;
            case Logic.CHAPTER02:allfileRooms = this.allfileRooms02;break;
            case Logic.CHAPTER03:allfileRooms = this.allfileRooms03;break;
            case Logic.CHAPTER04:allfileRooms = this.allfileRooms04;break;
        }
        return allfileRooms;
    }
    private resetRooms() {
        let allfileRooms = this.getAllFileRooms();
        if (allfileRooms && allfileRooms[this.roomStrs[0]]) {
            for (let i = 0; i < this.rectDungeon.map.length; i++) {
                for (let j = 0; j < this.rectDungeon.map[0].length; j++) {
                    let room = this.rectDungeon.map[i][j];
                    let index = room.roomType - 1;
                    if (index >= 0) {
                        let r = allfileRooms[this.roomStrs[index]]
                        //随机取出一个该类型的房间数据
                        room.saveIndex = Logic.getRandomNum(0, r.length - 1);
                        if(room.roomType == RectDungeon.PRIMARY_ROOM){
                            if(this.rectDungeon.isPrimaryHorizontal(i,j)){
                                room.saveIndex = 0;
                            }
                            if(this.rectDungeon.isPrimaryVertical(i,j)){
                                room.saveIndex = 1;
                            }
                            if(this.rectDungeon.isPrimaryRoomCorner(i,j)){
                                room.saveIndex = r.length - 1;
                            }
                        }
                        // room.map = r[roomInex];
                    }
                }
            }
        }
    }
}
