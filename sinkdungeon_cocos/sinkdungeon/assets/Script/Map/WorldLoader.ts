import MapData from "../Data/MapData";
import WorldConfigData from "../Data/WorldConfigData";

export default class WorldLoader{
    loadMap(){
        this.loadFile(0,1,[]);
    }
    private loadFile(chapterIndex: number, worldIndex:number,roomMaps: MapData[][]) {
        cc.loader.loadRes(`Data/world${chapterIndex}_${worldIndex}`, (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                let strs: string = resource.text;
                //以$为标签分割字符串
                let arr = strs.split('$');
                let config = new WorldConfigData();
                config.valueCopy(JSON.parse(arr[0]));
                let wholeMapData = new MapData(arr[1]);
                console.log(wholeMapData.logMap());
                for(let i = 0;i<config.width;i++){
                    roomMaps[i]=new Array();
                    for(let j =0;j<config.height;j++){
                        roomMaps[i][j] = this.getRoomMapData(i,j,config,wholeMapData);
                    }
                }
                console.log(roomMaps);
            }
        })
    }
    private getRoomMapData(x:number,y:number,config:WorldConfigData,wholeMapData:MapData):MapData{
        let data = new MapData('');
        for(let i = 0;i<config.roomWidth;i++){
            data.map[i]=new Array();
            for(let j = 0;j<config.roomHeight;j++){
                data.map[i][j] =wholeMapData.map[x*config.roomWidth+i][y*config.roomHeight+j];
            }
        }
        return data;
    }
}