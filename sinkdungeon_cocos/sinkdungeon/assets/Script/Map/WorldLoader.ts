import ChapterData from "../Data/ChapterData";
import LevelData from "../Data/LevelData";
import Logic from "../Logic";
/**
 * 地图文件加载器
 * 保存大地图数据和房间数据
 */
export default class WorldLoader {
    private worldMap: ChapterData[] = [];
    private realWorldMap: ChapterData = new ChapterData(99);
    //读取文件的数据
    // private allfileRooms00: { [key: string]: MapData[] } = {};
    // private allfileRooms01: { [key: string]: MapData[] } = {};
    // private allfileRooms02: { [key: string]: MapData[] } = {};
    // private allfileRooms03: { [key: string]: MapData[] } = {};
    // private allfileRooms04: { [key: string]: MapData[] } = {};
    // private allfileRooms05: { [key: string]: MapData[] } = {};
    //文件是否加载成功
    isloaded: boolean = false;
    isloaded00: boolean = false;
    isloaded01: boolean = false;
    isloaded02: boolean = false;
    isloaded03: boolean = false;
    isloaded04: boolean = false;
    isloaded05: boolean = false;
    isloaded99: boolean = false;

    constructor() {
        this.isloaded = false;
    }
    loadWorld() {
        //判断是否加载过地图资源
        if (this.worldMap.length > 0) {
            this.isloaded = true;
            return;
        }
        this.worldMap = new Array();
        for (let i = 0; i < 6; i++) {
            let chapter = new ChapterData(i);
            // this.loadChapterLevel(chapter);
            this.worldMap.push(chapter);
        }
        // this.loadChapterLevel(this.realWorldMap);
        this.loadTileSets();
    }

    // private formatMapArr(maptemp:string[][]):string[][]{
    //     let map:string[][] = new Array();
    //     for (let i = 0; i < maptemp[0].length; i++) {
    //         map[i] = new Array();
    //         for (let j = 0; j < maptemp.length; j++) {
    //             map[i][j] = maptemp[maptemp.length-1-j][i];
    //         }
    //     }
    //     return map;
    // }

    // private loadMap() {
    //     //加载五个章节的地图资源
    //     this.loadChapterMap(0, this.allfileRooms00);
    //     this.loadChapterMap(1, this.allfileRooms01);
    //     this.loadChapterMap(2, this.allfileRooms02);
    //     this.loadChapterMap(3, this.allfileRooms03);
    //     this.loadChapterMap(4, this.allfileRooms04);
    //     this.loadChapterMap(5, this.allfileRooms05);
    // }
    // getAllFileRooms(): { [key: string]: MapData[] } {
    //     let allfileRooms = this.allfileRooms00;
    //     switch (Logic.chapterIndex) {
    //         case Logic.CHAPTER00: allfileRooms = this.allfileRooms00; break;
    //         case Logic.CHAPTER01: allfileRooms = this.allfileRooms01; break;
    //         case Logic.CHAPTER02: allfileRooms = this.allfileRooms02; break;
    //         case Logic.CHAPTER03: allfileRooms = this.allfileRooms03; break;
    //         case Logic.CHAPTER04: allfileRooms = this.allfileRooms04; break;
    //         case Logic.CHAPTER05: allfileRooms = this.allfileRooms05; break;
    //     }
    //     return allfileRooms;
    // }
    private loadTileSets() {
        cc.resources.load('Data/world/tilesets', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                cc.log('tilesets loaded');
                let tilesets: { [key: string]: string[] } = {};
                for (let key in resource.json.tiles) {
                    tilesets[key] = resource.json.tiles[key].objectgroup.name;
                }
                this.loadTiledMaps(tilesets);
            }
        })

    }
    private loadTiledMaps(tilesets: { [key: string]: string[] }) {
        cc.resources.loadDir('Data/world/tiledmap', cc.JsonAsset, (err: Error, assert: cc.JsonAsset[]) => {
            for (let tiledmap of assert) {
                let arr = tiledmap.name.split('_');
                let chapter = parseInt(arr[1]);
                let data = chapter == 99 ? this.realWorldMap : this.worldMap[chapter];
                let temp: LevelData = tiledmap.json.layers[0].properties;
                let map = new Array();
                let rooms = new Array();
                let w = temp.width * temp.roomWidth;
                let h = temp.height * temp.roomHeight;
                for (let i = 0; i < h; i++) {
                    map[i] = new Array();
                    rooms[i] = new Array();
                    for (let j = 0; j < w; j++) {
                        let value1 = tiledmap.json.layers[0].data[i * w + j];
                        map[i][j] = tilesets[value1 - 1];
                        let value2 = tiledmap.json.layers[1].data[i * w + j];
                        rooms[i][j] = tilesets[value2 - 1];
                    }
                }
                //对应行列在里是反过来的
                let turnMap = new Array();
                let turnRooms = new Array();
                for (let i = 0; i < map[0].length; i++) {
                    turnMap[i] = new Array();
                    turnRooms[i] = new Array();
                    for (let j = 0; j < map.length; j++) {
                        turnMap[i][map.length-1-j] = map[j][i];
                        turnRooms[i][rooms.length-1-j] = rooms[j][i];
                    }
                }
                temp.map = turnMap;
                let flagMap = new Array();
                for (let i = 0; i < temp.width; i++) {
                    flagMap[i] = new Array();
                    for (let j = 0; j < temp.height; j++) {
                        flagMap[i][j] = turnRooms[i*temp.roomWidth][j*temp.roomHeight];
                    }
                }
                temp.roomTypes = flagMap;
                let level = new LevelData();
                level.valueCopy(temp);
                data.list.push(level);
            }
            this.isloaded = true;
            cc.log('world loaded');
        })
    }
    // private loadChapterLevel(data: ChapterData) {

    //     cc.resources.load(`Data/world/world0${data.chapter}`, (err: Error, resource: cc.TextAsset) => {
    //         if (err) {
    //             cc.error(err);
    //         } else {
    //             let strs: string = resource.text;
    //             //以====为标签分割字符串
    //             let arr = strs.split('====');
    //             for (let str of arr) {
    //                 let level = new LevelData(str);
    //                 data.list.push(level);
    //             }

    //             switch (data.chapter) {
    //                 case 0: this.isloaded00 = true; break;
    //                 case 1: this.isloaded01 = true; break;
    //                 case 2: this.isloaded02 = true; break;
    //                 case 3: this.isloaded03 = true; break;
    //                 case 4: this.isloaded04 = true; break;
    //                 case 5: this.isloaded05 = true; break;
    //                 case 99: this.isloaded99 = true; break;
    //             }
    //             //资源全部加载完成时，重置房间数据，加载存档
    //             if (this.isloaded00 && this.isloaded01 && this.isloaded02 && this.isloaded03 && this.isloaded04 && this.isloaded05 && this.isloaded99) {
    //                 this.isloaded = true;
    //                 cc.log('world loaded');
    //             }
    //         }
    //     })
    // }
    // private loadChapterMap(chapterIndex: number, allfileRooms: { [key: string]: MapData[] }) {
    //     cc.resources.load(`Data/room/rooms0${chapterIndex}`, (err: Error, resource: cc.TextAsset) => {
    //         if (err) {
    //             cc.error(err);
    //         } else {
    //             let strs: string = resource.text;
    //             //以room为标签分割字符串
    //             let arr = strs.split('room');
    //             let index = 0;
    //             //循环获取各个类型room的地图数组
    //             for (let i = 0; i < arr.length; i++) {
    //                 let str = arr[i];
    //                 let temparr = null;
    //                 if (str) {
    //                     //获取=号以后的该room类型的地图数组（以$分隔）
    //                     str = str.substring(str.indexOf('=') + 1, str.length - 3);
    //                     temparr = str.split('$');
    //                 }
    //                 if (temparr) {
    //                     let a: MapData[] = new Array();
    //                     for (let j = 0; j < temparr.length; j++) {
    //                         let tempstr = temparr[j];
    //                         a.push(new MapData(tempstr));
    //                     }
    //                     //按顺序排列的room类型名来保存该类型的地图数组
    //                     allfileRooms[RoomType.getNameById(index)] = a;
    //                     index++;
    //                 }
    //             }
    //             switch (chapterIndex) {
    //                 case 0: this.isloaded00 = true; break;
    //                 case 1: this.isloaded01 = true; break;
    //                 case 2: this.isloaded02 = true; break;
    //                 case 3: this.isloaded03 = true; break;
    //                 case 4: this.isloaded04 = true; break;
    //             }
    //             //资源全部加载完成时，重置房间数据，加载存档
    //             if (this.isloaded00 && this.isloaded01 && this.isloaded02 && this.isloaded03 && this.isloaded04) {
    //                 this.isloaded = true;
    //                 cc.log('world loaded');
    //             }
    //         }
    //     })
    // }
    getChapterLength(): number {
        return this.worldMap.length;
    }
    getChapterData(chapterIndex: number): ChapterData {
        if (chapterIndex >= 99) {
            return this.realWorldMap;
        }
        return this.worldMap[chapterIndex];
    }

    getLevelList(chapterIndex: number): LevelData[] {
        return this.getChapterData(chapterIndex).list;
    }
    getLevelData(chapterIndex: number, levelIndex: number): LevelData {
        let levelList = this.getLevelList(chapterIndex);
        if(levelList.length<1){
            return null;
        }
        levelList[levelIndex].chapter = chapterIndex;
        return levelList[levelIndex];
    }
    getCurrentLevelData() {
        return this.getLevelData(Logic.chapterIndex, Logic.level);
    }

}