// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//读取配置
export default class MapData {
    map: string[][] = new Array();
    constructor(str: string) {
        this.init(str);
    }
    private init(str: string) {
        if(!str){
            return;
        }
        //去掉第一个回车和最后1个回车
        str = str.substring(2, str.length - 2);
        let arr = str.split('\r\n')
        this.map = new Array();
        for (let i = 0; i < arr.length; i++) {
            this.map[i] = new Array();
        }
        for (let i = 0; i < arr.length; i++) {
            //y的方向在txt里是相反的
            let row = arr[arr.length-1-i].split('');
            let k = 0;
            for (let j = 0; j < row.length -1; k++) {
                this.map[i][k] = row[j]+row[j+1];
                j+=2;
            }
        }
        //对应行列在txt里是反过来的
        let turnArr = new Array();
        for (let i = 0; i < this.map[0].length; i++) {
            turnArr[i] = new Array();
            for (let j = 0; j < this.map.length; j++) {
                turnArr[i][j] = this.map[j][i];
            }
        }
        this.map = turnArr;
    }
    
    clone():MapData{
        let data = new MapData('');
        data.map = data.map.concat(this.map);
        return data;
    }
    valueCopy(data:MapData):MapData{
        this.map = data&&data.map?data.map:null;
        return this;
    }
}
