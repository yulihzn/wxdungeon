import Logic from "../Logic";

export default class ExitData {
    fromRoomPos = cc.v3(0, 0);
    fromPos = cc.v3(0, 0);
    fromChapter = 0;
    fromLevel = 0;
    toChapter = 0;
    toLevel = 0;
    toPos = cc.v3(0, 0);
    valueCopy(data: ExitData) {
        this.fromChapter = data.fromChapter ? data.fromChapter : 0;
        this.fromLevel = data.fromLevel ? data.fromLevel : 0;
        this.toChapter = data.toChapter ? data.toChapter : 0;
        this.toLevel = data.toLevel ? data.toLevel : 0;
        this.fromRoomPos = data.fromRoomPos ? cc.v3(data.fromRoomPos.x, data.fromRoomPos.y) : cc.v3(0, 0);
        this.toPos = data.toPos ? cc.v3(data.toPos.x, data.toPos.y) : cc.v3(0, 0);
        this.fromPos = data.fromPos ? cc.v3(data.fromPos.x, data.fromPos.y) : cc.v3(0, 0);
    }
    clone(): ExitData {
        let data = new ExitData();
        data.toPos = this.toPos.clone();
        data.fromRoomPos = this.fromRoomPos.clone();
        data.fromPos = this.fromPos.clone();
        data.fromChapter = this.fromChapter;
        data.fromLevel = this.fromLevel;
        data.toChapter = this.toChapter;
        data.toLevel = this.toLevel;
        return data;
    }
    static getRealWorldExitData() {
        let data = new ExitData();
        data.toChapter = Logic.CHAPTER099;
        data.toLevel = 0;
        data.toPos = cc.v3(4, 5);
        return data;
    }

}