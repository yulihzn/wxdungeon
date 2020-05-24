import ChapterData from "../Data/ChapterData";
import LevelData from "../Data/LevelData";
import RoomData from "../Data/RoomData";
import Random from "../Utils/Random";
import Logic from "../Logic";

export default class WorldLoader {
    private worldMap: ChapterData[] = [];
    //文件是否加载成功
    isloaded: boolean = false;
    constructor(){
        this.isloaded = false;
    }
    loadMap() {
        if(this.worldMap.length>0){
            this.isloaded = true;
            return;
        }
        this.loadFile();
    }
    private loadFile() {
        cc.loader.loadRes(`Data/worlds`, (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                this.worldMap = new Array();
                let arr = resource.json;
                for (let chapter=0;chapter<arr.length;chapter++) {
                    let chapterData = new ChapterData(chapter);
                    chapterData.map = new Array();
                    let maptemp: string[][][][] = arr[chapter].map;
                    for (let level = 0; level < maptemp.length; level++) {
                        let levelData = new LevelData(chapterData.chapter, level);
                        levelData.map = new Array();
                        let maparr: string[][][] = maptemp[level];
                        for (let index = 0; index < maparr.length; index++) {
                            let roomData = new RoomData(chapterData.chapter, levelData.level, index, maparr[index]);
                            levelData.map.push(roomData);
                        }
                        chapterData.map.push(levelData);
                    }
                    this.worldMap.push(chapterData);
                }
                console.log(this.worldMap);
                this.isloaded = true;
                Logic.mapManager.isloaded = false;
                Logic.mapManager.rectDungeon.buildMap(this.getRandomRoomData(Logic.chapterName,Logic.level));
                Logic.mapManager.loadMap();
            }
        })
    }
  
    getChapterData(chapterIndex:number):ChapterData{
        if(this.worldMap.length<1){
            return null;
        }
        return this.worldMap[chapterIndex];
    }
    getLevelData(chapterIndex:number,levelIndex:number):LevelData{
        let chapterData = this.getChapterData(chapterIndex);
        if(!chapterData){
            return null;
        }
        return this.getChapterData(chapterIndex)[levelIndex];
    }
    getRoomData(chapterIndex:number,levelIndex:number,roomIndex:number):RoomData{
        let levelData = this.getLevelData(chapterIndex,levelIndex);
        if(!levelData){
            return null;
        }
        return levelData[roomIndex];
    }
    getRandomRoomData(chapterIndex:number,levelIndex:number):RoomData{
        let levelData = this.getLevelData(chapterIndex,levelIndex);
        if(!levelData){
            return null;
        }
        return levelData[Random.getRandomNum(0,levelData.map.length)];
    }
}