import MapData from "../Data/MapData";
import RectRoom from "../Rect/RectRoom";
import RectDungeon from "../Rect/RectDungeon";
import Logic from "../Logic";
import Box from "../Building/Box";
import BoxData from "../Data/BoxData";
import EquipmentData from "../Data/EquipmentData";
import ShopTableData from "../Data/ShopTableData";
import OilLake from "../Oil/OilLake";

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
    private roomStrs = ['startroom', 'endroom', 'traproom', 'lootroom', 'dangerroom', 'puzzleroom', 'merchantroom', 'bossroom'];
    //文件是否加载成功
    isloaded: boolean = false;
    //地图数据管理类
    rectDungeon: RectDungeon = new RectDungeon(1);
    //当前房间
    currentRectRoom: RectRoom = null;
    //根据下标保存普通箱子的位置
    boxes: { [key: string]: BoxData[] } = {};
    //根据下标保存商店状态
    shopTables: { [key: string]: ShopTableData[] } = {};
    constructor() {
        this.init();
    }
    // LIFE-CYCLE CALLBACKS:


    init() {
        this.isloaded = false;
    }
    loadDataFromSave(){
        if(!Logic.profile.hasSaveData){
            return;
        }
        this.rectDungeon = Logic.profile.rectDungeon;
        this.currentRectRoom = new RectRoom(false,0,0,0,0).initFromSave(Logic.profile.currentRectRoom);
        this.boxes = Logic.profile.boxes;
        this.shopTables = Logic.profile.shopTables;
        cc.log('load',this.rectDungeon.getDisPlay());
    }
    reset(level: number) {
        this.rectDungeon = new RectDungeon(level);
        cc.log(this.rectDungeon.getDisPlay());
        this.resetRooms();
        this.currentRectRoom = this.rectDungeon.startRoom;
        this.changeRoomsIsFound(this.currentRectRoom.x, this.currentRectRoom.y);
        this.boxes = {};
        this.shopTables = {};
        // let oillake:OilLake = new OilLake();
        // cc.log(oillake.getDisPlay());
    }

    loadingNextRoom(dir: number): RectRoom {
        let room = this.rectDungeon.getNeighborRoomType(this.currentRectRoom.x, this.currentRectRoom.y, dir)
        if (room && room.roomType != 0) {
            this.currentRectRoom.initFromSave(room);
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


    public getCurrentMapData(): MapData {
        return this.currentRectRoom.map;
    }
    public getCurrentMapBoxes(): BoxData[] {
        return this.boxes[`x=${this.currentRectRoom.x}y=${this.currentRectRoom.y}`];
    }
    public setCurrentBoxesArr(arr: BoxData[]) {
        this.boxes[`x=${this.currentRectRoom.x}y=${this.currentRectRoom.y}`] = arr;
    }
    public getCurrentMapShopTables(): ShopTableData[] {
        return this.shopTables[`x=${this.currentRectRoom.x}y=${this.currentRectRoom.y}`];
    }
    public setCurrentShopTableArr(arr: ShopTableData[]) {
        this.shopTables[`x=${this.currentRectRoom.x}y=${this.currentRectRoom.y}`] = arr;
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
