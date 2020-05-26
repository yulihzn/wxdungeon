export default class LevelData{
    index: number = 0;//关卡包含的列表下标
    chapter: number = 0;//章节下标
    level: number = 0;//章节包含的关卡下标
    map: string[][] = [];
    constructor(chapter: number, level: number, index: number, map: string[][]) {
        this.chapter = chapter;
        this.level = level;
        this.index = index;
        this.map = map;
    }
    valueCopy(data:LevelData){
        this.chapter = data.chapter?data.chapter:0;
        this.level = data.level?data.level:0;
        this.index = data.index?data.index:0;
        if(data.map&&data.map.length>0){
         for (let i = 0; i < data.map.length; i++) {
             this.map[i] = new Array();
             for (let j = 0; j < data.map[0].length; j++) {
                 this.map[i][j] = data.map[i][j];
             } 
         }   
        }
    }
}