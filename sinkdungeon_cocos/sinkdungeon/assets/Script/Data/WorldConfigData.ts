export default class WorldConfigData{
    index = 0;
    width = 0;
    height = 0;
    seed = 0;
    roomWidth = 0;
    roomHeight = 0;
    public valueCopy(data: WorldConfigData): void {
        this.index = data.index?data.index:0;
        this.width = data.width?data.width:0;
        this.height = data.height?data.height:0;
        this.seed = data.seed?data.seed:0;
        this.roomWidth = data.roomWidth?data.roomWidth:0;
        this.roomHeight = data.roomHeight?data.roomHeight:0;
    }
    public clone(): WorldConfigData {
        let data = new WorldConfigData();
        return data;
    }
}