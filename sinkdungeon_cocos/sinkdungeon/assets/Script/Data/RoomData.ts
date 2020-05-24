export default class RoomData{
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
}