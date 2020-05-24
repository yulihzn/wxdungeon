import RoomData from "./RoomData";

export default class LevelData {
    chapter: number = 0;//章节下标
    level: number = 0;//章节包含的关卡下标
    map: RoomData[] = [];
    constructor(chapter: number, level: number) {
        this.chapter = chapter;
        this.level = level;
    }
}