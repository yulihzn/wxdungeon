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

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class MapManager {
    //读取文件的数据
    private allfileRooms: { [key: string]: MapData[] } = {};
    private roomStrs = ['startroom', 'endroom', 'traproom', 'lootroom', 'dangerroom',  'merchantroom', 'puzzleroom', 'bossroom','pokerroom','tarotroom','testroom'];
    //文件是否加载成功
    isloaded: boolean = false;
    //地图数据管理类
    rectDungeon: RectDungeon = new RectDungeon(1);
    //当前房间下标
    currentPos: cc.Vec2 = cc.v2(0, 0);
    //根据下标保存普通箱子的位置
    boxes: { [key: string]: BoxData[] } = {};
    //根据下标保存商店状态
    shopTables: { [key: string]: ShopTableData[] } = {};
    //根据下标保存怪物的位置和状态
    monsters:{[key:string]:MonsterData[]} = {};
    constructor() {
        this.init();
    }
    // LIFE-CYCLE CALLBACKS:


    init() {
        this.isloaded = false;
    }
    loadDataFromSave() {
        if (!Logic.profile.hasSaveData) {
            return;
        }
        this.rectDungeon = Logic.profile.rectDungeon;
        this.currentPos = Logic.profile.currentPos.clone();
        this.boxes = Logic.profile.boxes;
        this.shopTables = Logic.profile.shopTables;
        this.monsters = Logic.profile.monsters;
        cc.log('load', this.rectDungeon.getDisPlay());
    }
    reset(level: number) {
        this.rectDungeon = new RectDungeon(level);
        cc.log(this.rectDungeon.getDisPlay());
        this.resetRooms();
        this.currentPos = cc.v2(this.rectDungeon.startRoom.x, this.rectDungeon.startRoom.y);
        this.changeRoomsIsFound(this.currentPos.x, this.currentPos.y);
        Logic.profile.currentPos = this.currentPos.clone();        
        this.boxes = {};
        this.shopTables = {};
        this.monsters = {};
        // let oillake:OilLake = new OilLake();
        // cc.log(oillake.getDisPlay());
    }

    /** dir为-1就是当前房间 */
    loadingNextRoom(dir: number): RectRoom {
        let room = this.rectDungeon.getNeighborRoomType(this.currentPos.x, this.currentPos.y, dir)
        if (room && room.roomType != 0) {
            this.currentPos = cc.v2(room.x, room.y);
        Logic.profile.currentPos = this.currentPos.clone();            
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
        return this.getCurrentRoom().map.clone();
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
    }
    /** 获取当前房间商店*/
    public getCurrentMapShopTables(): ShopTableData[] {
        return this.shopTables[`x=${this.currentPos.x}y=${this.currentPos.y}`];
    }
    /** 设置当前房间商店*/
    public setCurrentShopTableArr(arr: ShopTableData[]) {
        this.shopTables[`x=${this.currentPos.x}y=${this.currentPos.y}`] = arr;
    }
    /** 获取当前房间怪物*/
    public getCurrentMapMonsters(): MonsterData[] {
        return this.monsters[`x=${this.currentPos.x}y=${this.currentPos.y}`];
    }
    /** 设置当前房间怪物*/
    public setCurrentMonstersArr(arr: MonsterData[]) {
        this.monsters[`x=${this.currentPos.x}y=${this.currentPos.y}`] = arr;
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
        if (this.rectDungeon.startRoom.map) {
            this.isloaded = true;
            return;
        }
        cc.loader.loadRes('Data/Rooms/rooms', (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                let strs: string = resource.text;
                let arr = strs.split('room');
                let index = 0;
                for (let i = 0; i < arr.length; i++) {
                    let str = arr[i];
                    let temparr = null;
                    if (str) {
                        str = str.substring(str.indexOf('=') + 1, str.length - 3);
                        temparr = str.split('$');
                    }
                    if (temparr) {
                        let a: MapData[] = new Array();
                        for (let j = 0; j < temparr.length; j++) {
                            let tempstr = temparr[j];
                            a.push(new MapData(tempstr));
                        }
                        this.allfileRooms[this.roomStrs[index]] = a;
                        index++;
                    }
                }
                this.resetRooms();
                this.isloaded = true;
                cc.log('maps loaded');
            }
        })

    }
    private resetRooms() {
        if (this.allfileRooms && this.allfileRooms[this.roomStrs[0]]) {
            for (let i = 0; i < this.rectDungeon.map.length; i++) {
                for (let j = 0; j < this.rectDungeon.map[0].length; j++) {
                    let room = this.rectDungeon.map[i][j];
                    let index = room.roomType - 1;
                    if (index >= 0) {
                        let r = this.allfileRooms[this.roomStrs[index]]
                        //随机取出一个该类型的房间数据
                        room.map = r[Logic.getRandomNum(0, r.length - 1)];
                    }
                }
            }
        }
    }
}
