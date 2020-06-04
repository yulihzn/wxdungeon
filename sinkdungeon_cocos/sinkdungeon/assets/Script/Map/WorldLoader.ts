import ChapterData from "../Data/ChapterData";
import LevelData from "../Data/LevelData";
import Random from "../Utils/Random";
import Logic from "../Logic";
import MapData from "../Data/MapData";
import RoomType from "../Rect/RoomType";
/**
 * 地图文件加载器
 * 保存大地图数据和房间数据
 */
export default class WorldLoader {
    private worldMap: ChapterData[] = [];
    //读取文件的数据
    private allfileRooms00: { [key: string]: MapData[] } = {};
    private allfileRooms01: { [key: string]: MapData[] } = {};
    private allfileRooms02: { [key: string]: MapData[] } = {};
    private allfileRooms03: { [key: string]: MapData[] } = {};
    private allfileRooms04: { [key: string]: MapData[] } = {};
    //文件是否加载成功
    isloaded: boolean = false;
    isloaded00: boolean = false;
    isloaded01: boolean = false;
    isloaded02: boolean = false;
    isloaded03: boolean = false;
    isloaded04: boolean = false;
    constructor(){
        this.isloaded = false;
    }
    loadWorld() {
        //判断是否加载过地图资源
        if(this.worldMap.length>0&&this.allfileRooms00[RoomType.getNameById(0)]){
            this.isloaded = true;
            return;
        }
        cc.loader.loadRes(`Data/worlds`, (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                this.worldMap = new Array();
                let arr = resource.json;
                for (let chapter=0;chapter<arr.length;chapter++) {
                    let chapterData = new ChapterData(chapter);
                    chapterData.list = new Array();
                    let maptemp: string[][][][] = arr[chapter].list;
                    for (let level = 0; level < maptemp.length; level++) {
                        let levelList:LevelData[] = new Array();
                        let maparr: string[][][] = maptemp[level];
                        for (let index = 0; index < maparr.length; index++) {
                            let levelData = new LevelData(chapterData.chapter, level, index, this.formatMapArr(maparr[index]));
                            levelList.push(levelData);
                        }
                        chapterData.list.push(levelList);
                    }
                    this.worldMap.push(chapterData);
                }
                this.loadMap();
            }
        })
    }
    private formatMapArr(maptemp:string[][]):string[][]{
        let map:string[][] = new Array();
        for (let i = 0; i < maptemp[0].length; i++) {
            map[i] = new Array();
            for (let j = 0; j < maptemp.length; j++) {
                map[i][j] = maptemp[maptemp.length-1-j][i];
            }
        }
        return map;
    }
  
    private loadMap() {
        //加载五个章节的地图资源
        this.loadChapterMap(0, this.allfileRooms00);
        this.loadChapterMap(1, this.allfileRooms01);
        this.loadChapterMap(2, this.allfileRooms02);
        this.loadChapterMap(3, this.allfileRooms03);
        this.loadChapterMap(4, this.allfileRooms04);
    }
    getAllFileRooms(): { [key: string]: MapData[] } {
        let allfileRooms = this.allfileRooms00;
        switch (Logic.chapterIndex) {
            case Logic.CHAPTER00: allfileRooms = this.allfileRooms00; break;
            case Logic.CHAPTER01: allfileRooms = this.allfileRooms01; break;
            case Logic.CHAPTER02: allfileRooms = this.allfileRooms02; break;
            case Logic.CHAPTER03: allfileRooms = this.allfileRooms03; break;
            case Logic.CHAPTER04: allfileRooms = this.allfileRooms04; break;
        }
        return allfileRooms;
    }
    private loadChapterMap(chapterIndex: number, allfileRooms: { [key: string]: MapData[] }) {
        cc.loader.loadRes(`Data/room/rooms0${chapterIndex}`, (err: Error, resource) => {
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
                        allfileRooms[RoomType.getNameById(index)] = a;
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
                    this.isloaded = true;
                    cc.log('world loaded');
                }
            }
        })
    }
    getChapterData(chapterIndex:number):ChapterData{
        return this.worldMap[chapterIndex];
    }
    getLevelList(chapterIndex:number,levelIndex:number):LevelData[]{
        let chapterData = this.getChapterData(chapterIndex);
        return this.getChapterData(chapterIndex).list[levelIndex];
    }
    getLevelData(chapterIndex:number,levelIndex:number,roomIndex:number):LevelData{
        let levelList = this.getLevelList(chapterIndex,levelIndex);
        return levelList[roomIndex];
    }
    getRandomLevelData(chapterIndex:number,levelIndex:number):LevelData{
        let levelList = this.getLevelList(chapterIndex,levelIndex);
        return levelList[Random.getRandomNum(0,levelList.length-1)];
    }
}