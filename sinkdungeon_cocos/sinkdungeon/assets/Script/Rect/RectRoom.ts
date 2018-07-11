import RectDoor from "./RectDoor";
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
export default class RectRoom {
    //未激活
    public static readonly STATE_SLEEP = 0;
    //已激活
    public static readonly STATE_ACTIVE = 1;
    //已清理
    public static readonly STATE_CLEAR = 2;

    public static readonly ROOM_WIDTH = 15;
    public static readonly ROOM_HEIGHT = 9;
    public static readonly TOPDOOR = 0;
    public static readonly BOTTOMDOOR = 1;
    public static readonly LEFTDOOR = 2;
    public static readonly RIGHTDOOR = 3;
    // The doors.0:top 1:bottom 2:left 3:right
    doors: RectDoor[];
    index: number;
    /// The type.房间类型
    roomType: number;
    isPrimary: boolean = false;
    x: number;
    y: number;
    map: number[][];
    enemyCount: number = 0;
    /// The Key 是否包含钥匙
    hasKey: boolean;
    /// The state.房间状态
    state: number = RectRoom.STATE_SLEEP;
    /// The is found.是否被发现
    isFound: boolean;
    //用来取随机tile的列表
    randomTiles: cc.Vec2[];
    /// The is init.是否是初始化
    isInit: boolean = true;

    constructor(isPrimary: boolean, index: number, x: number, y: number, roomType: number) {
        this.x = x;
        this.y = y;
        this.isPrimary = isPrimary;
        this.index = index;
        this.roomType = roomType;
        this.init();
    }

    private init(): void {
        this.state = RectRoom.STATE_SLEEP;
        if (this.map == null) {
            this.map = new Array();
        }
        if (this.doors == null) {
            this.doors = new Array(4);
            for (let i = 0; i < 4; i++) {
                this.doors[i] = new RectDoor(i, false, false);
            }
        }
        this.randomTiles = new Array();
        for (let i = 0; i < RectRoom.ROOM_WIDTH; i++) {
            this.map[i] = new Array(i);
            this.randomTiles = new Array(i);
            for (let j = 0; j < RectRoom.ROOM_HEIGHT; j++) {
                this.map[i][j] = 0;
                this.randomTiles.push(cc.v2(i, j));
            }
        }
    }

    public lockAllDoors(islock: boolean): void {
        for (let i = 0; i < 4; i++) {
            this.doors[i].isLocked = islock;
        }
    }

    public get positionStr(): string {
        return `${this.x}${this.y}`;
    }


    public randomTile(): cc.Vec2 {
        if (this.randomTiles.length > 0) {
            let index = Logic.getRandomNum(0, this.randomTiles.length - 1);
            let p = this.randomTiles[index];
            this.randomTiles.splice(index, 1);
            return p;
        }
        return null;
    }

}

