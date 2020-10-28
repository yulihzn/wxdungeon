import ExitData from "./ExitData";

export default class LevelData {
    name: string = '';//名称
    index: number = 0;//关卡包含的列表下标
    chapter: number = 0;//章节下标
    width: number = 0;//地图单位宽
    height: number = 0;//地图单位高
    seed: number = 0;//随机种子
    roomWidth: number = 0;//房间宽
    roomHeight: number = 0;//房间高
    floorRes = '';//地板资源名
    floorCoverRes = '';//地板覆盖物
    wallRes = '';//墙壁资源名（只针对非边界装饰墙）
    doorRes = '';//门资源名
    exitRes = '';//出入口资源名
    needRadomDecorate = false;
    map: string[][] = [];
    roomTypes: string[][] = [];
    exits:string='';//16,4,0,1,27,1;27,1,0,0,16,4;分号隔开，出口坐标，章节，入口坐标（y轴向下）

    constructor() {
    }
    // constructor(strs: string) {
    //     this.init(strs);
    // }
    
    private init(strs: string) {
        if (!strs || strs.length < 1) {
            return;
        }
        let split = strs.split('$');
        let temp: LevelData = JSON.parse(split[0]);
        this.valueCopy(temp);
        //去掉第一个回车和最后1个回车
        let str = split[1];
        str = str.substring(2, str.length - 2);
        let arr = str.split('\r\n')
        this.map = new Array();
        for (let i = 0; i < arr.length; i++) {
            this.map[i] = new Array();
        }
        for (let i = 0; i < arr.length; i++) {
            //y的方向在txt里是相反的
            let row = arr[arr.length - 1 - i].split('');
            let k = 0;
            for (let j = 0; j < row.length - 1; k++) {
                this.map[i][k] = row[j] + row[j + 1];
                j += 2;
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
    valueCopy(data: LevelData) {
        this.name = data.name;
        this.index = data.index;
        this.chapter = data.chapter;
        this.width = data.width;
        this.height = data.height;
        this.seed = data.seed;
        this.roomWidth = data.roomWidth;
        this.roomHeight = data.roomHeight;
        this.map = data.map;
        this.roomTypes = data.roomTypes;
        this.floorRes = data.floorRes;
        this.floorCoverRes = data.floorCoverRes;
        this.wallRes = data.wallRes;
        this.doorRes = data.doorRes;
        this.exitRes = data.exitRes;
        this.exits = data.exits;
        this.needRadomDecorate = data.needRadomDecorate;
    }
    getRoomMap(x: number, y: number): string[][] {
        let temp: string[][] = new Array();
        for (let i = 0; i < this.roomWidth; i++) {
            temp[i] = new Array();
            for (let j = 0; j < this.roomHeight; j++) {
                temp[i][j] = this.map[i + x * this.roomWidth][j + y * this.roomHeight];
            }
        }
        return temp;

    }
    getExitList():ExitData[]{
        let list = new Array();
        if(this.exits&&this.exits.length>0){
            let arr = this.exits.split('#');
            for(let str of arr){
                let data = new ExitData();
                let temps = str.split(',');
                let fx = parseInt(temps[0]);
                let fy = this.roomHeight*this.height-parseInt(temps[1])-1;//这里y是反过来的
                let tx = parseInt(temps[4]);
                let ty = parseInt(temps[5]);
                let roomX = Math.floor(fx/this.roomWidth);
                let roomY = Math.floor(fy/this.roomHeight);
                data.fromRoomPos = cc.v3(roomX,roomY);
                data.fromIndexPos = cc.v3(fx%this.roomWidth,fy%this.roomHeight);
                data.toChapter = parseInt(temps[2]);
                data.toLevel = parseInt(temps[3]);
                data.toPos = cc.v3(tx,ty);
                list.push(data);
            }
        }
        return list;
    }
}