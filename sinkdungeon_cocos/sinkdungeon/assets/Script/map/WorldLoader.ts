import ChapterData from '../data/ChapterData'
import LevelData from '../data/LevelData'
import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import LoadingIcon from '../ui/LoadingIcon'
/**
 * 地图文件加载器
 * 保存大地图数据和房间数据
 */
export default class WorldLoader {
    private worldMap: ChapterData[] = []
    private realWorldMap: ChapterData = new ChapterData(99)
    //读取文件的数据
    // private allfileRooms00: { [key: string]: MapData[] } = {};
    // private allfileRooms01: { [key: string]: MapData[] } = {};
    // private allfileRooms02: { [key: string]: MapData[] } = {};
    // private allfileRooms03: { [key: string]: MapData[] } = {};
    // private allfileRooms04: { [key: string]: MapData[] } = {};
    // private allfileRooms05: { [key: string]: MapData[] } = {};
    //文件是否加载成功
    isloaded: boolean = false
    isloaded00: boolean = false
    isloaded01: boolean = false
    isloaded02: boolean = false
    isloaded03: boolean = false
    isloaded04: boolean = false
    isloaded05: boolean = false
    isloaded99: boolean = false
    isLoading = false
    callbacks: Function[] = []

    constructor() {
        this.isloaded = false
    }
    private emitCallbacks() {
        for (let i = this.callbacks.length - 1; i >= 0; i--) {
            let c = this.callbacks.pop()
            if (c) {
                c()
            }
        }
    }
    loadWorld(callback?: Function) {
        if (callback) {
            this.callbacks.push(callback)
        }
        if (this.isLoading) {
            return
        }
        this.isLoading = true
        if (this.worldMap.length > 0) {
            //判断是否加载过地图资源
            this.emitCallbacks()
            this.isloaded = true
            this.isLoading = false
            EventHelper.emit(EventHelper.LOADING_ICON, { type: LoadingIcon.TYPE_MAP })
            return
        }
        this.worldMap = new Array()
        for (let i = 0; i < 6; i++) {
            let chapter = new ChapterData(i)
            this.worldMap.push(chapter)
        }
        this.loadTileSets()
    }

    private loadTileSets() {
        cc.log('加载地图块')
        cc.resources.load('Data/world/tileset', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err)
            } else {
                cc.log('加载地图块完成')
                let tileset: { [key: string]: string[] } = {}
                for (let value of resource.json.tiles) {
                    tileset[value.id] = value.type
                }
                this.loadTiledMaps(tileset)
            }
        })
    }
    private loadTiledMaps(tileset: { [key: string]: string[] }) {
        cc.log('加载世界')
        cc.resources.loadDir('Data/world/tiledmap', cc.JsonAsset, (err: Error, assert: cc.JsonAsset[]) => {
            for (let tiledmap of assert) {
                let arr = tiledmap.name.split('_')
                let chapter = parseInt(arr[1])
                let data = chapter == 99 ? this.realWorldMap : this.worldMap[chapter]
                let temp: LevelData = tiledmap.json.layers[1].properties
                //新版是数组
                if (!temp.width) {
                    temp = new LevelData()
                    let tarr = tiledmap.json.layers[1].properties
                    for (let ld of tarr) {
                        if (ld.name) {
                            temp[ld.name] = ld.value
                        }
                    }
                }
                let map = new Array()
                let floormap = new Array()
                let rooms = new Array()
                let w = temp.width * temp.roomWidth
                let h = temp.height * temp.roomHeight
                for (let i = 0; i < h; i++) {
                    map[i] = new Array()
                    floormap[i] = new Array()
                    rooms[i] = new Array()
                    for (let j = 0; j < w; j++) {
                        let value0 = tiledmap.json.layers[0].data[i * w + j]
                        floormap[i][j] = tileset[value0 - 1]
                        let value1 = tiledmap.json.layers[1].data[i * w + j]
                        map[i][j] = tileset[value1 - 1]
                        let value2 = tiledmap.json.layers[2].data[i * w + j]
                        rooms[i][j] = tileset[value2 - 1]
                    }
                }
                //对应行列在里是反过来的
                let turnMap = new Array()
                let turnfloorMap = new Array()
                let turnRooms = new Array()
                for (let i = 0; i < map[0].length; i++) {
                    turnfloorMap[i] = new Array()
                    turnMap[i] = new Array()
                    turnRooms[i] = new Array()
                    for (let j = 0; j < map.length; j++) {
                        turnfloorMap[i][map.length - 1 - j] = floormap[j][i]
                        turnMap[i][map.length - 1 - j] = map[j][i]
                        turnRooms[i][rooms.length - 1 - j] = rooms[j][i]
                    }
                }
                temp.map = turnMap
                temp.floormap = turnfloorMap
                let flagMap = new Array()
                let shadowMap = new Array()
                let miniLockMap = new Array()
                for (let i = 0; i < temp.width; i++) {
                    flagMap[i] = new Array()
                    shadowMap[i] = new Array()
                    miniLockMap[i] = new Array()
                    for (let j = 0; j < temp.height; j++) {
                        flagMap[i][j] = turnRooms[i * temp.roomWidth][j * temp.roomHeight]
                        shadowMap[i][j] = turnRooms[i * temp.roomWidth + 1][j * temp.roomHeight]
                        miniLockMap[i][j] = turnRooms[i * temp.roomWidth + 2][j * temp.roomHeight]
                    }
                }
                temp.roomTypes = flagMap
                temp.shadowMap = shadowMap
                temp.minimaplock = miniLockMap
                if (tiledmap.json.layers[3] && tiledmap.json.layers[3].objects) {
                    temp.lights = tiledmap.json.layers[3].objects
                }
                let level = new LevelData()
                level.valueCopy(temp)
                data.list.push(level)
            }
            //按下标由低到高排序level
            this.realWorldMap.list.sort((a: LevelData, b: LevelData) => {
                return a.index - b.index
            })
            for (let c of this.worldMap) {
                c.list.sort((a: LevelData, b: LevelData) => {
                    return a.index - b.index
                })
            }
            this.emitCallbacks()
            this.isloaded = true
            this.isLoading = false
            cc.log('加载世界完成')
            EventHelper.emit(EventHelper.LOADING_ICON, { type: LoadingIcon.TYPE_MAP })
        })
    }

    getChapterLength(): number {
        return this.worldMap.length
    }
    getChapterData(chapterIndex: number): ChapterData {
        if (chapterIndex >= 99) {
            return this.realWorldMap
        }
        return this.worldMap[chapterIndex]
    }

    private getLevelList(chapterIndex: number): LevelData[] {
        return this.getChapterData(chapterIndex).list
    }
    getLevelData(chapterIndex: number, levelIndex: number): LevelData {
        let levelList = this.getLevelList(chapterIndex)
        if (levelList.length < 1) {
            return null
        }
        levelList[levelIndex].chapter = chapterIndex
        return levelList[levelIndex]
    }
    getCurrentLevelData() {
        return this.getLevelData(Logic.chapterIndex, Logic.level)
    }
}
