import RectRoom from "./RectRoom";
import Logic from "../Logic";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class RectDungeon {
    public static readonly LEVEL_1 = 1;
    public static readonly LEVEL_2 = 2;
    public static readonly LEVEL_3 = 3;
    public static readonly LEVEL_4 = 4;
    public static readonly LEVEL_5 = 5;
    public static readonly PRIMARY = 1000;
    public static readonly SECONDARY = 2000;
    public static readonly EMPTY_ROOM = 0;
    public static readonly START_ROOM = 1;
    public static readonly END_ROOM = 2;
    public static readonly TRAP_ROOM = 3;
    public static readonly LOOT_ROOM = 4;
    public static readonly DANGER_ROOM = 5;
    public static readonly PUZZLE_ROOM = 6;
    public static readonly MERCHANT_ROOM = 7;
    public static readonly BOSS_ROOM = 8;
    private level: number = 1;
    public map: RectRoom[][];
    private size: number;
    private primaryRooms: RectRoom[];
    private secondaryRooms: RectRoom[];
    public startRoom: RectRoom;
    public endRoom: RectRoom;
    public merChantRoom: RectRoom;
    public puzzleRoom: RectRoom;

    public constructor(level: number) {
        this.level = level;
        this.size = level + 2;
        this.primaryRooms = new Array<RectRoom>();
        this.secondaryRooms = new Array<RectRoom>();
        this.buildMap();
    }

    buildMap(): void {
        this.map = new Array();
        for (let i = 0; i < this.size; i++) {
            this.map[i] = new Array();
            for (let j = 0; j < this.size; j++) {
                this.map[i][j] = null;
                if ((i == 1 || i == this.level) && j >= 1 && j <= this.level || (j == 1 || j == this.level) && i >= 1 && i <= this.level) {
                    this.map[i][j] = new RectRoom(true, 0, i, j, RectDungeon.EMPTY_ROOM);
                } else {
                    this.map[i][j] = new RectRoom(false, 0, i, j, RectDungeon.EMPTY_ROOM);
                }
            }
        }
        this.addPrimaryRooms();
        this.addSecondaryRooms();
        this.buildPrimaryRoomsType();
        this.buildSecondaryRoomsType();
        this.addLootKeys();
        this.addDoors();
    }
    /// <summary>
    /// Adds the primary rooms.绕圈
    /// </summary>
    addPrimaryRooms(): void {

        //添加主圈序号
        let index = 1;
        for (let i = 1; i <= this.level; i++) {
            let j = 1;
            if (this.map[i][j].isPrimary) {
                this.map[i][j].index = index;
                if (i == 1) {
                }
                this.primaryRooms.push(this.map[i][j]);
                index++;
            }
        }
        for (let j = 2; j <= this.level; j++) {
            let i = this.level;
            if (this.map[i][j].isPrimary) {
                this.map[i][j].index = index;
                this.primaryRooms.push(this.map[i][j]);
                index++;
            }
        }
        for (let i = this.level - 1; i > 0; i--) {
            let j = this.level;
            if (this.map[i][j].isPrimary) {
                this.map[i][j].index = index;
                this.primaryRooms.push(this.map[i][j]);
                index++;
            }
        }
        for (let j = this.level - 1; j > 1; j--) {
            let i = 1;
            if (this.map[i][j].isPrimary) {
                this.map[i][j].index = index;
                this.primaryRooms.push(this.map[i][j]);
                index++;
            }
        }
    }
    addSecondaryRooms(): void {
        let index = 1;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.isSecondaryRoom(i, j)) {
                    this.map[i][j].index = index++;
                    this.secondaryRooms.push(this.map[i][j]);
                }
            }
        }
    }
    isSecondaryRoom(i:number,j:number): boolean {
        if (this.isPrimaryRoom(i, j)) {
            return false;
        }
        if (this.isPrimaryRoom(i + 1, j) || this.isPrimaryRoom(i, j + 1)
            || this.isPrimaryRoom(i - 1, j) || this.isPrimaryRoom(i, j - 1)) {
            return true;
        }
        return false;
    }
    isPrimaryRoom(i:number,j:number): boolean {
        if (i < this.size - 1 && i > 0 && j < this.size - 1 && j > 0) {
            if (this.map[i][j].isPrimary) {
                return true;
            }
        }
        return false;
    }
    /// <summary>
    /// Builds the type of the primary rooms.只生成一个相邻的S和E,其余是D和T随机
    /// </summary>
    buildPrimaryRoomsType(): void {
        let roomType:number[] = [RectDungeon.TRAP_ROOM, RectDungeon.DANGER_ROOM];
        for(let room of this.primaryRooms) {
            let randomtype = roomType[Logic.getRandomNum(0,roomType.length-1)];
            room.roomType = randomtype;
        }
        let startIndex = Logic.getRandomNum(0,this.primaryRooms.length-1);
        let endIndex = startIndex - 1;
        if (endIndex < 0) {
            endIndex = this.primaryRooms.length - 1;
        }
        this.primaryRooms[endIndex].roomType = RectDungeon.END_ROOM;
        this.endRoom = this.primaryRooms[endIndex];
        this.endRoom.lockAllDoors(true);
        this.primaryRooms[startIndex].roomType = RectDungeon.START_ROOM;
        this.startRoom = this.primaryRooms[startIndex];
        this.startRoom.lockAllDoors(false);

    }
    buildSecondaryRoomsType(): void {
        let roomType:number[] = [RectDungeon.TRAP_ROOM, RectDungeon.DANGER_ROOM];
        for(let room of this.secondaryRooms) {
            let randomtype = roomType[Logic.getRandomNum(0,roomType.length-1)];
            if (this.level == RectDungeon.LEVEL_1) {
                room.roomType = randomtype;
            } else if (Logic.getHalfChance()) {
                room.roomType = randomtype;
            }
        }
        let endIndex = Logic.getRandomNum(0,this.secondaryRooms.length-1);
        if (this.level == RectDungeon.LEVEL_1) {
            this.secondaryRooms[endIndex].roomType = RectDungeon.END_ROOM;
            this.endRoom = this.secondaryRooms[endIndex];
            this.endRoom.lockAllDoors(false);//次级的End不关门
        }
        if (this.level == RectDungeon.LEVEL_3) {
            this.map[2][2].roomType = RectDungeon.MERCHANT_ROOM;
        }
        if (this.level == RectDungeon.LEVEL_5) {
            //add boss room
            this.map[3][3].roomType = RectDungeon.BOSS_ROOM;
            if (this.map[3][4].roomType == RectDungeon.EMPTY_ROOM && this.map[3][2].roomType == RectDungeon.EMPTY_ROOM
                && this.map[2][3].roomType == RectDungeon.EMPTY_ROOM && this.map[4][3].roomType == RectDungeon.EMPTY_ROOM) {
                    this.map[3][4].roomType = Logic.getHalfChance() ? RectDungeon.DANGER_ROOM : RectDungeon.TRAP_ROOM;
            }
            //one more loot
            this.addLootRoom();
        }
        this.addPuzzleRoom();
        this.addLootRoom();
        this.addLootRoom();


    }
    addPuzzleRoom(): void {
        let index = Logic.getRandomNum(0,this.secondaryRooms.length-1);
        let flag = this.secondaryRooms[index].roomType == RectDungeon.TRAP_ROOM
            || this.secondaryRooms[index].roomType == RectDungeon.DANGER_ROOM
            || this.secondaryRooms[index].roomType == RectDungeon.EMPTY_ROOM;
        if (flag) {
            this.secondaryRooms[index].roomType = RectDungeon.PUZZLE_ROOM;
        } else {
            this.addPuzzleRoom();
        }
    }
    addLootRoom(): void {
        let lootCount = 0;
        let dteRooms = new Array<RectRoom>();
        for(let room of this.secondaryRooms) {
            if (room.roomType == RectDungeon.DANGER_ROOM || room.roomType == RectDungeon.TRAP_ROOM || room.roomType == RectDungeon.EMPTY_ROOM) {
                dteRooms.push(room);
            }
            if (room.roomType == RectDungeon.LOOT_ROOM) {
                lootCount++;
            }
        }
        //loot的数目不能超过DTP的总和
        if (dteRooms.length > 1 && lootCount < dteRooms.length + 1) {
            let index = Logic.getRandomNum(0,dteRooms.length-1);
            dteRooms[index].roomType = RectDungeon.LOOT_ROOM;
            dteRooms[index].lockAllDoors(true);
        }

    }
    addLootKeys(): void {
        let lootCount = 0;
        let dtRooms = new Array<RectRoom>();
        for(let room of this.secondaryRooms) {
            if (room.enemyCount == RectDungeon.DANGER_ROOM || room.roomType == RectDungeon.TRAP_ROOM) {
                dtRooms.push(room);
            }
            if (room.roomType == RectDungeon.LOOT_ROOM) {
                lootCount++;
            }
            if (room.roomType == RectDungeon.PUZZLE_ROOM) {
                room.hasKey = true;
            }
        }
        for (let i = 0; i < lootCount; i++) {
            if (dtRooms.length > 0) {
                let index = Logic.getRandomNum(0,dtRooms.length-1);
                dtRooms[index].hasKey = true;
                dtRooms.splice(index,1);
            }
        }

    }
    addDoors(): void {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.map[i][j].roomType != RectDungeon.EMPTY_ROOM) {
                    this.changeDoor(i, j, RectRoom.TOPDOOR, true);
                    this.changeDoor(i, j, RectRoom.BOTTOMDOOR, true);
                    this.changeDoor(i, j, RectRoom.LEFTDOOR, true);
                    this.changeDoor(i, j, RectRoom.RIGHTDOOR, true);
                }
            }
        }
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.map[i][j].roomType == RectDungeon.EMPTY_ROOM) {
                    this.changeDoor(i, j, RectRoom.TOPDOOR, false);
                    this.changeDoor(i, j, RectRoom.BOTTOMDOOR, false);
                    this.changeDoor(i, j, RectRoom.LEFTDOOR, false);
                    this.changeDoor(i, j, RectRoom.RIGHTDOOR, false);
                }
            }
        }
    }
    changeDoor(i:number,j:number,dir:number,open:boolean): void {
        switch (dir) {
            case RectRoom.TOPDOOR:
            this.map[i][j].doors[0].isDoor = open;
                if (j + 1 < this.size) {
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
                if (i + 1 < this.size) {
                    this.map[i + 1][j].doors[2].isDoor = open;
                } else {
                    this.map[i][j].doors[3].isDoor = false;
                }
                break;
        }
    }
    public getDisPlay(): string {
        let str ='';
        for (let j = 0; j < this.size; j++) {
            for (let i = 0; i < this.size; i++) {
                str+=this.getTypeStringLog(this.map[i][j].roomType);
            }
            str+='\n';
        }
        return str;
    }
    public getNeighborRoomType(i:number,j:number,dir:number): RectRoom {
        let x = i;
        let y = j;
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
        if (x >= this.size || x < 0 || y >= this.size || y < 0 || dir < 0 || dir > 4) {
            return null;
        }
        return this.map[x][y];
    }

    public static getTypeString(type: number): string {
        if (type !=RectDungeon.EMPTY_ROOM) {
            return "Room";
        }
        //		switch (type) {
        //		case EMPTY_ROOM:
        //		return "RoomEmpty";break;
        //		case START_ROOM:
        //		return "RoomStart";break;
        //		case END_ROOM:
        //			return "RoomEnd";
        //		case TRAP_ROOM:
        //			return "RoomTrap";
        //		case LOOT_ROOM:
        //			return "RoomLoot";
        //		case DANGER_ROOM:
        //			return "RoomDanger";
        //		case PUZZLE_ROOM:
        //			return "RoomPuzzle";
        //		case MERCHANT_ROOM:
        //			return "RoomMerchant";
        //		case BOSS_ROOM:
        //			return "RoomBoss";
        //		}
        return "RoomEmpty";
    }
    private getTypeStringLog(type: number): string {
        switch (type) {
            case RectDungeon.EMPTY_ROOM:
                return "　";
            case RectDungeon.START_ROOM:
                return "Ｓ";
            case RectDungeon.END_ROOM:
                return "Ｅ";
            case RectDungeon.TRAP_ROOM:
                return "Ｔ";
            case RectDungeon.LOOT_ROOM:
                return "Ｌ";
            case RectDungeon.DANGER_ROOM:
                return "Ｄ";
            case RectDungeon.PUZZLE_ROOM:
                return "Ｐ";
            case RectDungeon.MERCHANT_ROOM:
                return "Ｍ";
            case RectDungeon.BOSS_ROOM:
                return "Ｂ";
        }
        return "　";
    }

}
