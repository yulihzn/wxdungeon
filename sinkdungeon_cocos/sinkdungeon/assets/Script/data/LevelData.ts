import DataUtils from '../utils/DataUtils'
import ExitData from './ExitData'
import MapLightData from './MapLightData'

export default class LevelData {
    name: string = '' //名称
    index: number = 0 //关卡包含的列表下标
    chapter: number = 0 //章节下标
    width: number = 0 //地图单位宽
    height: number = 0 //地图单位高
    seed: number = 0 //随机种子
    roomWidth: number = 0 //房间宽
    roomHeight: number = 0 //房间高
    floorRes = '' //地板资源名
    floorRes1 = '' //地板资源名1
    floorRes2 = '' //地板资源名2
    floorRes3 = '' //地板资源名3
    floorRes4 = '' //地板资源名4
    floorRes5 = '' //地板资源名5
    floorRes6 = '' //地板资源名6
    floorRes7 = '' //地板资源名7
    floorRes8 = '' //地板资源名8
    floorRes9 = '' //地板资源名9
    /**
     * 墙壁资源名#0000 #00
     * 00右下内角,01下墙,02左下内角,
     * 03右墙,04中墙,05左墙,
     * 06右上内角,07上墙,08左上内角,
     * 09左上角,10右上角,11左下角,
     * 12右下角,13右上左下角,14左上右下内角,
     * ##0独立矮墙体
     * ###空墙
     */
    wallRes0 = '' //墙壁资源名1(#0000)
    wallRes1 = '' //墙壁资源名1(#0100)
    wallRes2 = '' //墙壁资源名2(#0200)
    wallRes3 = '' //墙壁资源名3(#0300)
    wallRes4 = '' //墙壁资源名4(#0400)
    wallRes5 = '' //墙壁资源名5(#0500)
    wallRes6 = '' //墙壁资源名6(#0600)
    wallRes7 = '' //墙壁资源名7(#0700)
    wallRes8 = '' //墙壁资源名8(#0800)
    wallRes9 = '' //墙壁资源名9(#0900)
    wallResOther0 = '' //墙壁资源名1(##0独立矮墙体)
    wallResOther1 = '' //墙壁资源名1(##1独立矮墙体)
    wallResOther2 = '' //墙壁资源名2(##2独立矮墙体)
    wallResOther3 = '' //墙壁资源名3(##3独立矮墙体)
    wallResOther4 = '' //墙壁资源名4(##4独立矮墙体)
    wallResOther5 = '' //墙壁资源名5(##5独立矮墙体)
    wallResOther6 = '' //墙壁资源名6(##6独立矮墙体)
    wallResOther7 = '' //墙壁资源名7(##7独立矮墙体)
    wallResOther8 = '' //墙壁资源名8(##8独立矮墙体)
    wallResOther9 = '' //墙壁资源名9(##9独立矮墙体)
    doorRes = '' //门资源名
    exitRes = '' //出入口资源名
    needRadomDecorate = false
    isWater = false
    map: string[][] = []
    floormap: string[][] = []
    roomTypes: string[][] = []
    minimap: string[][] = []
    minimaplock: string[][] = []
    exits: string = '' //16,4,0,1,27,1;27,1,0,0,16,4;分号隔开，出口坐标，章节，入口坐标（y轴向下）
    lights: MapLightData[]

    getWallRes(index: number, isOther?: boolean) {
        switch (index) {
            case 0:
                return isOther ? this.wallResOther0 : this.wallRes0
            case 1:
                return isOther ? this.wallResOther1 : this.wallRes1
            case 2:
                return isOther ? this.wallResOther2 : this.wallRes2
            case 3:
                return isOther ? this.wallResOther3 : this.wallRes3
            case 4:
                return isOther ? this.wallResOther4 : this.wallRes4
            case 5:
                return isOther ? this.wallResOther5 : this.wallRes5
            case 6:
                return isOther ? this.wallResOther6 : this.wallRes6
            case 7:
                return isOther ? this.wallResOther7 : this.wallRes7
            case 8:
                return isOther ? this.wallResOther8 : this.wallRes8
            case 9:
                return isOther ? this.wallResOther9 : this.wallRes9
        }
    }
    getFloorRes(index: number) {
        switch (index) {
            case 0:
                return this.floorRes
            case 1:
                return this.floorRes1
            case 2:
                return this.floorRes2
            case 3:
                return this.floorRes3
            case 4:
                return this.floorRes4
            case 5:
                return this.floorRes5
            case 6:
                return this.floorRes6
            case 7:
                return this.floorRes7
            case 8:
                return this.floorRes8
            case 9:
                return this.floorRes9
        }
    }
    // constructor(strs: string) {
    //     this.init(strs);
    // }

    // private init(strs: string) {
    //     if (!strs || strs.length < 1) {
    //         return;
    //     }
    //     let split = strs.split('$');
    //     let temp: LevelData = JSON.parse(split[0]);
    //     this.valueCopy(temp);
    //     //去掉第一个回车和最后1个回车
    //     let str = split[1];
    //     str = str.substring(2, str.length - 2);
    //     let arr = str.split('\r\n')
    //     this.map = new Array();
    //     for (let i = 0; i < arr.length; i++) {
    //         this.map[i] = new Array();
    //     }
    //     for (let i = 0; i < arr.length; i++) {
    //         //y的方向在txt里是相反的
    //         let row = arr[arr.length - 1 - i].split('');
    //         let k = 0;
    //         for (let j = 0; j < row.length - 1; k++) {
    //             this.map[i][k] = row[j] + row[j + 1];
    //             j += 2;
    //         }
    //     }
    //     //对应行列在txt里是反过来的
    //     let turnArr = new Array();
    //     for (let i = 0; i < this.map[0].length; i++) {
    //         turnArr[i] = new Array();
    //         for (let j = 0; j < this.map.length; j++) {
    //             turnArr[i][j] = this.map[j][i];
    //         }
    //     }
    //     this.map = turnArr;
    // }
    valueCopy(data: LevelData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data)
        this.map = data.map
        this.floormap = data.floormap
        this.roomTypes = data.roomTypes
        this.minimap = data.minimap
        this.minimaplock = data.minimaplock
        this.lights = data.lights
    }
    getRoomMap(x: number, y: number): string[][] {
        let temp: string[][] = new Array()
        if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) {
            return temp
        }
        for (let i = 0; i < this.roomWidth; i++) {
            temp[i] = new Array()
            for (let j = 0; j < this.roomHeight; j++) {
                temp[i][j] = this.map[i + x * this.roomWidth][j + y * this.roomHeight]
            }
        }
        return temp
    }
    getRoomFloorMap(x: number, y: number): string[][] {
        let temp: string[][] = new Array()
        if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) {
            return temp
        }
        for (let i = 0; i < this.roomWidth; i++) {
            temp[i] = new Array()
            for (let j = 0; j < this.roomHeight; j++) {
                temp[i][j] = this.floormap[i + x * this.roomWidth][j + y * this.roomHeight]
            }
        }
        return temp
    }
    getExitList(): ExitData[] {
        let list = new Array()
        if (this.exits && this.exits.length > 0) {
            let arr = this.exits.split('#')
            for (let str of arr) {
                let data = new ExitData()
                let temps = str.split(',')
                let fx = parseInt(temps[0])
                let fy = this.roomHeight * this.height - parseInt(temps[1]) - 1 //这里y是反过来的
                let tx = parseInt(temps[4])
                let ty = parseInt(temps[5])
                let roomX = Math.floor(fx / this.roomWidth)
                let roomY = Math.floor(fy / this.roomHeight)
                data.fromRoomPos = cc.v3(roomX, roomY)
                data.fromPos = cc.v3(fx % this.roomWidth, fy % this.roomHeight)
                data.fromChapter = this.chapter
                data.fromLevel = this.index
                data.toChapter = parseInt(temps[2])
                data.toLevel = parseInt(temps[3])
                data.toPos = cc.v3(tx, ty)
                list.push(data)
            }
        }
        return list
    }
}
