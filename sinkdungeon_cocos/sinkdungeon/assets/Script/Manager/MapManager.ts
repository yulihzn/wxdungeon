import MapData from "../Data/MapData";
import RectRoom from "../Rect/RectRoom";
import RectDungeon from "../Rect/RectDungeon";
import Logic from "../Logic";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapManager {
    //读取文件的数据
    private allfileRooms: { [key: string]: MapData[] } = {};
    private roomStrs = ['startroom', 'endroom', 'traproom', 'lootroom', 'dangerroom', 'puzzleroom', 'merchantroom', 'bossroom'];
    isloaded: boolean = false;
    rooms:MapData[] = new Array();
    rectDungeon:RectDungeon= new RectDungeon(1);
    currentRectRoom:RectRoom = null;
    constructor(){
        this.init();
    }
    // LIFE-CYCLE CALLBACKS:


    init() {
        this.isloaded = false;
    }
    reset(level:number){
        this.rectDungeon = new RectDungeon(level);
        cc.log (this.rectDungeon.getDisPlay());
        this.resetRooms();
        this.currentRectRoom = this.rectDungeon.startRoom;
        this.changeRoomsIsFound (this.currentRectRoom.x, this.currentRectRoom.y);
    }

    loadingNextRoom(dir:number):RectRoom{
        let room = this.rectDungeon.getNeighborRoomType(this.currentRectRoom.x,this.currentRectRoom.y,dir)
        if(room&&room.roomType!=0){
            this.currentRectRoom = room;
            this.changeRoomsIsFound (room.x, room.y);
        }
        return room;
    }
    changeRoomsIsFound(x:number,y:number){
        this.rectDungeon.changeRoomIsFound (x, y);
        this.rectDungeon.changeRoomIsFound (x + 1, y);
        this.rectDungeon.changeRoomIsFound (x - 1, y);
        this.rectDungeon.changeRoomIsFound (x, y + 1);
        this.rectDungeon.changeRoomIsFound (x, y - 1);
    }
    
    
    getCurrentMapData():MapData{
        return this.rooms[this.currentRectRoom.roomType-1]
    }

    loadMap() {
        if (this.rooms&&this.rooms.length>0) {
            this.isloaded = true;
            return;
        }
        cc.loader.loadRes('Data/Rooms/rooms', (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                let strs: string = resource;
                let arr = strs.split('room');
                let index = 0;
                for (let i = 0; i < arr.length; i++) {
                    let str = arr[i];
                    let temparr = null;
                    if (str) {
                        str = str.substring(str.indexOf('=') + 1, str.length - 3);
                        temparr = str.split('$');
                    }
                    if (temparr) {
                        let a:MapData[] = new Array();
                        for (let j = 0; j < temparr.length; j++) {
                            let tempstr = temparr[j];
                            a.push(new MapData(tempstr));
                        }
                        this.allfileRooms[this.roomStrs[index]] = a;
                        index++;
                    }
                }
                this.resetRooms();
                this.isloaded = true;
            }
        })

    }
    resetRooms(){
        if(this.allfileRooms&&this.allfileRooms[this.roomStrs[0]]){
            this.rooms = new Array();
            for(let i =0;i<this.roomStrs.length;i++){
                let r = this.allfileRooms[this.roomStrs[i]]
                this.rooms.push(r[Logic.getRandomNum(0,r.length-1)]);
            }
        }
    }

    // }
}