import RectRoom from "./RectRoom";
import Random from "../Utils/Random";
import RoomData from "../Data/RoomData";
import RoomType from "./RoomType";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class RectDungeon {
    public static readonly LEVEL_1 = 1;
    public static readonly LEVEL_2 = 2;
    public static readonly LEVEL_3 = 3;
    public static readonly LEVEL_4 = 4;
    public static readonly LEVEL_5 = 5;
    public static readonly LEVEL_6 = 6;
    public roomData: RoomData;
    public map: RectRoom[][];
    public startRoom: RectRoom = new RectRoom(0,0,RoomType.START_ROOM);;
    public endRoom: RectRoom = new RectRoom(0,0,RoomType.END_ROOM);;

    buildMapFromSave(dungeon: RectDungeon): RectDungeon {
        this.roomData = dungeon.roomData;
        this.map = new Array();
        for (let i = 0; i < this.roomData.map.length; i++) {
            this.map[i] = new Array();
            for (let j = 0; j < this.roomData.map[0].length; j++) {
                this.map[i][j] = new RectRoom(i, j, RoomType.EMPTY_ROOM).initFromSave(dungeon.map[i][j]);
            }
        }
        this.startRoom = new RectRoom(0, 0, RoomType.EMPTY_ROOM).initFromSave(dungeon.startRoom);
        this.endRoom = new RectRoom(0, 0, RoomType.EMPTY_ROOM).initFromSave(dungeon.endRoom);
        return this;
    }
    buildMap(roomData: RoomData): void {
        if(!roomData){
            return;
        }
        this.roomData = roomData;
        this.map = new Array();
        for (let i = 0; i < roomData.map.length; i++) {
            this.map[i] = new Array();
            for (let j = 0; j < roomData.map[0].length; j++) {
                this.map[i][j] = new RectRoom(i, j, RoomType.getTypeByName(roomData.map[i][j]));
                if (this.map[i][j].roomType.isEqual(RoomType.START_ROOM)) {
                    this.startRoom = this.map[i][j];
                    this.startRoom.lockAllDoors(false);
                    this.startRoom.state = RectRoom.STATE_FOUND;
                }
                if (this.map[i][j].roomType.isEqual(RoomType.END_ROOM)) {
                    this.endRoom = this.map[i][j];
                }
            }
        }
        this.addDoors(roomData);
    }


    addDoors(roomData:RoomData): void {
        for (let i = 0; i < roomData.map.length; i++) {
            for (let j = 0; j < roomData.map[0].length; j++) {
                if (this.map[i][j].roomType.isNotEqual(RoomType.EMPTY_ROOM)) {
                    this.changeDoor(i, j, RectRoom.TOPDOOR, true);
                    this.changeDoor(i, j, RectRoom.BOTTOMDOOR, true);
                    this.changeDoor(i, j, RectRoom.LEFTDOOR, true);
                    this.changeDoor(i, j, RectRoom.RIGHTDOOR, true);
                }
            }
        }
        for (let i = 0; i < roomData.map.length; i++) {
            for (let j = 0; j < roomData.map[0].length; j++) {
                if (this.map[i][j].roomType.isEqual(RoomType.EMPTY_ROOM)) {
                    this.changeDoor(i, j, RectRoom.TOPDOOR, false);
                    this.changeDoor(i, j, RectRoom.BOTTOMDOOR, false);
                    this.changeDoor(i, j, RectRoom.LEFTDOOR, false);
                    this.changeDoor(i, j, RectRoom.RIGHTDOOR, false);
                }
            }
        }
    }
    changeDoor(i: number, j: number, dir: number, open: boolean): void {
        if(!this.roomData){
            return;
        }
        switch (dir) {
            case RectRoom.TOPDOOR:
                this.map[i][j].doors[0].isDoor = open;
                if (j + 1 < this.roomData.map[0].length) {
                    this.map[i][j + 1].doors[1].isDoor = open;
                } else {
                    this.map[i][j].doors[0].isDoor = false;
                }
                break;
            case RectRoom.BOTTOMDOOR:
                this.map[i][j].doors[1].isDoor = open;
                if (j - 1 >= 0) {
                    this.map[i][j - 1].doors[0].isDoor = open;
                } else {
                    this.map[i][j].doors[1].isDoor = false;
                }
                break;
            case RectRoom.LEFTDOOR:
                this.map[i][j].doors[2].isDoor = open;
                if (i - 1 >= 0) {
                    this.map[i - 1][j].doors[3].isDoor = open;
                } else {
                    this.map[i][j].doors[2].isDoor = false;
                }
                break;
            case RectRoom.RIGHTDOOR:
                this.map[i][j].doors[3].isDoor = open;
                if (i + 1 < this.roomData.map.length) {
                    this.map[i + 1][j].doors[2].isDoor = open;
                } else {
                    this.map[i][j].doors[3].isDoor = false;
                }
                break;
        }
    }
    public getDisPlay(): string {
        let str = '';
        if(!this.roomData){
            return str;
        }
        for (let j = this.roomData.map[0].length - 1; j >= 0; j--) {
            for (let i = 0; i < this.roomData.map.length; i++) {
                str += this.map[i][j].roomType.NAME;
            }
            str += '\n';
        }
        return str;
    }
    /** dir为-1就是当前房间 */
    public getNeighborRoomType(i: number, j: number, dir: number): RectRoom {
        if(!this.roomData){
            return;
        }
        let x = i;
        let y = j;
        if (dir == -1) {
            return this.map[x][y];
        }
        if (dir == 0) {
            y += 1;
        }
        if (dir == 1) {
            y -= 1;
        }
        if (dir == 2) {
            x -= 1;
        }
        if (dir == 3) {
            x += 1;
        }
        if (x >= this.roomData.map.length || x < 0 || y >= this.roomData.map[0].length || y < 0 || dir < 0 || dir > 4) {
            return null;
        }
        return this.map[x][y];
    }
    public changeRoomIsFound(x: number, y: number): void {
        if(!this.roomData){
            return;
        }
        if (x >= this.roomData.map.length || x < 0 || y >= this.roomData.map[0].length || y < 0) {
            return;
        }
        if (this.map[x][y].roomType.isNotEqual(RoomType.EMPTY_ROOM)) {
            this.map[x][y].state = RectRoom.STATE_FOUND;
        }
    }

    static isRoomEqual(room1: RectRoom, room2: RectRoom): boolean {
        return room1.x == room2.x && room1.y == room2.y;
    }

}
