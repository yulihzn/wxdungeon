import LevelData from "./LevelData";

export default class ChapterData{
    chapter: number = 0;//章节下标
    map: LevelData[] = [];
    constructor(chapter: number) {
        this.chapter = chapter;
    }
}