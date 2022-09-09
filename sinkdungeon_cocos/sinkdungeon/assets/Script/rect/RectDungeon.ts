import RectRoom from './RectRoom'
import LevelData from '../data/LevelData'
import RoomType from './RoomType'
import BuildingData from '../data/BuildingData'
import EquipmentData from '../data/EquipmentData'
import ItemData from '../data/ItemData'

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
    public id: string = '00' //地图id
    public width: number = 0 //地图宽
    public height: number = 0 //地图高
    public map: RectRoom[][]
    //当前房间下标 默认1-1
    currentPos: cc.Vec3 = cc.v3(-1, -1)

    public buildings: { [key: string]: { [key: string]: BuildingData } } = {} //根据下标保存建筑信息
    //根据下标+uuid保存地上的装备
    equipments: { [key: string]: EquipmentData[] } = {}
    //根据下标+uuid保存地上的物品
    items: { [key: string]: ItemData[] } = {}

    buildMapFromSave(dungeon: RectDungeon, levelData?: LevelData): RectDungeon {
        this.id = dungeon.id
        this.width = dungeon.width
        this.height = dungeon.height
        this.map = new Array()
        //加载当前位置
        this.currentPos = dungeon.currentPos ? cc.v3(dungeon.currentPos.x, dungeon.currentPos.y) : cc.v3(-1, -1)
        //加载建筑
        for (let key1 in dungeon.buildings) {
            let map = dungeon.buildings[key1]
            this.buildings[key1] = {}
            for (let key2 in map) {
                let data = new BuildingData()
                data.valueCopy(map[key2])
                this.buildings[key1][key2] = data
            }
        }
        //加载地上装备
        for (let key in dungeon.equipments) {
            let list = dungeon.equipments[key]
            this.equipments[key] = new Array()
            for (let i = 0; i < list.length; i++) {
                let equip = new EquipmentData()
                equip.valueCopy(list[i])
                this.equipments[key][i] = equip
            }
        }
        //加载地上物品
        for (let key in dungeon.items) {
            let list = dungeon.items[key]
            this.items[key] = new Array()
            for (let i = 0; i < list.length; i++) {
                let item = new ItemData()
                item.valueCopy(list[i])
                this.items[key][i] = item
            }
        }
        for (let i = 0; i < this.width; i++) {
            this.map[i] = new Array()
            for (let j = 0; j < this.height; j++) {
                this.map[i][j] = new RectRoom(i, j, RoomType.EMPTY_ROOM).initFromSave(dungeon.map[i][j])
                if (levelData) {
                    this.map[i][j].roomType = RoomType.getTypeByName(levelData.roomTypes[i][j])
                    if (!this.map[i][j].shadowLevel) {
                        this.map[i][j].shadowLevel = levelData.shadowMap[i][j]
                    }
                }
                // if (this.map[i][j] && this.map[i][j].roomType.isEqual(RoomType.START_ROOM)) {
                //     //开始房间默认被发现
                //     if (this.map[i][j].state != RectRoom.STATE_CLEAR) {
                //         this.map[i][j].state = RectRoom.STATE_FOUND
                //     }
                // }
                // if (this.map[i][j] && this.map[i][j].roomType.isEqual(RoomType.END_ROOM)) {
                //     if (this.map[i][j].state != RectRoom.STATE_CLEAR) {
                //         this.map[i][j].state = RectRoom.STATE_FOUND
                //     }
                // }
            }
        }
        return this
    }
    buildMap(levelData: LevelData): void {
        this.map = new Array()
        this.id = `${levelData.chapter}${levelData.index}`
        this.width = levelData.width
        this.height = levelData.height
        //清空缓存的箱子商店宝箱装备物品数据
        this.buildings = {}
        this.equipments = {}
        this.items = {}
        for (let i = 0; i < levelData.width; i++) {
            this.map[i] = new Array()
            for (let j = 0; j < levelData.height; j++) {
                this.map[i][j] = new RectRoom(i, j, RoomType.getTypeByName(levelData.roomTypes[i][j]))
                this.map[i][j].shadowLevel = levelData.shadowMap[i][j]
                // if (this.map[i][j].roomType.isEqual(RoomType.START_ROOM)) {
                //     //开始房间默认被发现
                //     if (this.map[i][j].state != RectRoom.STATE_CLEAR) {
                //         this.map[i][j].state = RectRoom.STATE_FOUND
                //     }
                // }
                // if (this.map[i][j].roomType.isEqual(RoomType.END_ROOM)) {
                //     if (this.map[i][j].state != RectRoom.STATE_CLEAR) {
                //         this.map[i][j].state = RectRoom.STATE_FOUND
                //     }
                // }
            }
        }
    }

    public getDisPlay(): string {
        let str = ''
        for (let j = this.height - 1; j >= 0; j--) {
            for (let i = 0; i < this.width; i++) {
                str += this.map[i][j].roomType.NAME
            }
            str += '\n'
        }
        return str
    }
    /** dir为-1就是当前房间 */
    public getNeighborRoom(i: number, j: number, dir: number): RectRoom {
        let x = i
        let y = j
        if (dir == -1) {
            return this.map[x][y]
        }
        if (dir == 0) {
            y += 1
        }
        if (dir == 1) {
            y -= 1
        }
        if (dir == 2) {
            x -= 1
        }
        if (dir == 3) {
            x += 1
        }
        if (x >= this.width || x < 0 || y >= this.height || y < 0 || dir < 0 || dir > 4) {
            return null
        }
        return this.map[x][y]
    }
    /**设置当前房间和周围四个房间为发现状态 */
    public changeRoomsIsFound(x: number, y: number) {
        this.changeRoomIsFound(x, y)
        this.changeRoomIsFound(x + 1, y)
        this.changeRoomIsFound(x - 1, y)
        this.changeRoomIsFound(x, y + 1)
        this.changeRoomIsFound(x, y - 1)
        this.changeRoomIsFound(x + 1, y - 1)
        this.changeRoomIsFound(x - 1, y - 1)
        this.changeRoomIsFound(x + 1, y - 1)
        this.changeRoomIsFound(x - 1, y - 1)
    }
    private changeRoomIsFound(x: number, y: number): void {
        if (x >= this.width || x < 0 || y >= this.height || y < 0) {
            return
        }
        if (this.map[x][y].state != RectRoom.STATE_CLEAR) {
            this.map[x][y].state = RectRoom.STATE_FOUND
        }
    }

    static isRoomEqual(room1: RectRoom, room2: RectRoom): boolean {
        return room1.x == room2.x && room1.y == room2.y
    }
    public changeAllClearRoomsReborn() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.map[i][j].isClear()) {
                    this.map[i][j].reborn++
                    this.map[i][j].isReborn = true
                }
            }
        }
    }
}
