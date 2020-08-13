import RectRoom from "./RectRoom";
import LevelData from "../Data/LevelData";
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
    public width: number = 0;//地图宽
    public height: number = 0;//地图高
    public map: RectRoom[][];
    public startIndex: cc.Vec2 = cc.Vec2.ZERO;
    public endIndex: cc.Vec2 = cc.v2(-1, -1);

    buildMapFromSave(dungeon: RectDungeon): RectDungeon {
        this.width = dungeon.width;
        this.height = dungeon.height;
        this.map = new Array();
        for (let i = 0; i < this.width; i++) {
            this.map[i] = new Array();
            for (let j = 0; j < this.height; j++) {
                this.map[i][j] = new RectRoom(i, j, RoomType.EMPTY_ROOM).initFromSave(dungeon.map[i][j]);
                if (this.map[i][j].roomType.isEqual(RoomType.START_ROOM)) {
                    //开始房间默认被发现
                    if (this.map[i][j].state != RectRoom.STATE_CLEAR) {
                        this.map[i][j].state = RectRoom.STATE_FOUND;
                    }
                    this.startIndex = cc.v2(i, j);
                }
                if (this.map[i][j].roomType.isEqual(RoomType.END_ROOM)) {
                    if (this.map[i][j].state != RectRoom.STATE_CLEAR) {
                        this.map[i][j].state = RectRoom.STATE_FOUND;
                    }
                    this.endIndex = cc.v2(i, j);
                }
            }
        }
        if (this.endIndex.x < 0 && this.endIndex.y < 0) {
            this.endIndex = this.startIndex.clone();
        }
        return this;
    }
    buildMap(levelData: LevelData): void {
        this.map = new Array();
        this.width = levelData.width;
        this.height = levelData.height;
        for (let i = 0; i < levelData.width; i++) {
            this.map[i] = new Array();
            for (let j = 0; j < levelData.height; j++) {
                this.map[i][j] = new RectRoom(i, j, RoomType.getTypeByName(levelData.map[i * levelData.roomWidth][j * levelData.roomHeight][1]));
                if (this.map[i][j].roomType.isEqual(RoomType.START_ROOM)) {
                    //开始房间默认被发现
                    if (this.map[i][j].state != RectRoom.STATE_CLEAR) {
                        this.map[i][j].state = RectRoom.STATE_FOUND;
                    }
                    this.startIndex = cc.v2(i, j);
                }
                if (this.map[i][j].roomType.isEqual(RoomType.END_ROOM)) {
                    if (this.map[i][j].state != RectRoom.STATE_CLEAR) {
                        this.map[i][j].state = RectRoom.STATE_FOUND;
                    }
                    this.endIndex = cc.v2(i, j);
                }
            }
        }
        if (this.endIndex.x < 0 && this.endIndex.y < 0) {
            this.endIndex = this.startIndex.clone();
        }
    }

    public getDisPlay(): string {
        let str = '';
        for (let j = this.height - 1; j >= 0; j--) {
            for (let i = 0; i < this.width; i++) {
                str += this.map[i][j].roomType.NAME;
            }
            str += '\n';
        }
        return str;
    }
    /** dir为-1就是当前房间 */
    public getNeighborRoomType(i: number, j: number, dir: number): RectRoom {
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
        if (x >= this.width || x < 0 || y >= this.height || y < 0 || dir < 0 || dir > 4) {
            return null;
        }
        return this.map[x][y];
    }
    /**设置当前房间和周围四个房间为发现状态 */
    public changeRoomsIsFound(x: number, y: number) {
        this.changeRoomIsFound(x, y);
        this.changeRoomIsFound(x + 1, y);
        this.changeRoomIsFound(x - 1, y);
        this.changeRoomIsFound(x, y + 1);
        this.changeRoomIsFound(x, y - 1);
        this.changeRoomIsFound(x + 1, y - 1);
        this.changeRoomIsFound(x - 1, y - 1);
        this.changeRoomIsFound(x + 1, y - 1);
        this.changeRoomIsFound(x - 1, y - 1);
    }
    private changeRoomIsFound(x: number, y: number): void {
        if (x >= this.width || x < 0 || y >= this.height || y < 0) {
            return;
        }
        if (this.map[x][y].roomType.isNotEqual(RoomType.EMPTY_ROOM) && this.map[x][y].state != RectRoom.STATE_CLEAR) {
            this.map[x][y].state = RectRoom.STATE_FOUND;
        }
    }

    static isRoomEqual(room1: RectRoom, room2: RectRoom): boolean {
        return room1.x == room2.x && room1.y == room2.y;
    }

}
