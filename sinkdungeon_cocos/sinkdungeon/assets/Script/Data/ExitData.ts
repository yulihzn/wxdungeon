import Logic from "../Logic";

export default class ExitData {
    fromRoomPos = cc.v3(0, 0);
    fromIndexPos = cc.v3(0, 0);
    toChapter = 0;
    toLevel = 0;
    toPos = cc.v3(0, 0);
    valueCopy(data: ExitData) {
        this.toChapter = data.toChapter ? data.toChapter : 0;
        this.toLevel = data.toLevel ? data.toLevel : 0;
        this.fromRoomPos = data.fromRoomPos ? cc.v3(data.fromRoomPos.x, data.fromRoomPos.y) : cc.v3(0, 0);
        this.toPos = data.toPos ? cc.v3(data.toPos.x, data.toPos.y) : cc.v3(0, 0);
        this.fromIndexPos = data.fromIndexPos ? cc.v3(data.fromIndexPos.x, data.fromIndexPos.y) : cc.v3(0, 0);
    }
    clone(): ExitData {
        let data = new ExitData();
        data.toPos = this.toPos.clone();
        data.fromRoomPos = this.fromRoomPos.clone();
        data.fromIndexPos = this.fromIndexPos.clone();
        data.toChapter = this.toChapter;
        data.toLevel = this.toLevel;
        return data;
    }
    static getRealWorldExitData() {
        let data = new ExitData();
        data.toChapter = Logic.CHAPTER099;
        data.toLevel = Logic.realLevel;
        data.toPos = cc.v3(15, 16);
        return data;
    }

}