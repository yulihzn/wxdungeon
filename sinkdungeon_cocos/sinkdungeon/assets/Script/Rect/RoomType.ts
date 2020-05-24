/**
 * 房间类型 仅限大写字母
 */
export default class RoomType{
    static readonly ELITE_ROOM = new RoomType(0,'A');//小头目房间 A
    static readonly BOSS_ROOM = new RoomType(1,'B');//头目房间 B
    static readonly CROSS_ROOM = new RoomType(2,'C');//十字通道 C
    static readonly DANGER_ROOM = new RoomType(3,'D');//危险房间 D
    static readonly END_ROOM = new RoomType(4,'E');//结束房间 E
    static readonly FINAL_ROOM = new RoomType(5,'F');//最终房间 F
    static readonly G_ROOM = new RoomType(6,'G');//G
    static readonly HORIZONTAL_ROOM = new RoomType(7,'H');//横向通道 H
    static readonly INSANE_ROOM = new RoomType(8,'I');//疯狂房间 I
    static readonly TUTORIAL_ROOM = new RoomType(9,'J');//教程房间 J
    static readonly KEY_ROOM = new RoomType(10,'K');//钥匙房间 K
    static readonly LOOT_ROOM = new RoomType(11,'L');//宝箱房间 L
    static readonly MERCHANT_ROOM = new RoomType(12,'M');//商店 M
    static readonly NORMAL_ROOM = new RoomType(13,'N');//正常房间 N
    static readonly EMPTY_ROOM = new RoomType(14,'O');//空房间 O
    static readonly PREPARE_ROOM = new RoomType(15,'P');//准备房间 P
    static readonly Q_ROOM = new RoomType(16,'Q');//Q
    static readonly REST_ROOM = new RoomType(17,'R');//休息房间 R
    static readonly START_ROOM = new RoomType(18,'S');//开始房间 S
    static readonly TEST_ROOM = new RoomType(19,'T');//测试房间 T
    static readonly U_ROOM = new RoomType(20,'U');//U
    static readonly VERTICAL_ROOM = new RoomType(21,'V');//纵向通道 V
    static readonly W_ROOM = new RoomType(22,'W');//W
    static readonly X_ROOM = new RoomType(23,'X');//X
    static readonly HIDDEN_ROOM = new RoomType(24,'Y');//隐藏房间 Y
    static readonly Z_ROOM = new RoomType(25,'Z');//Z

    private id = 0;
    private name = '';
    get ID(){
        return this.id;
    }
    get NAME(){
        return this.name;
    }
    constructor(id:number,name:string){
        this.id = id;
        this.name = name;
    }

    static getIdByName(name:string){
        return name.charCodeAt(0)-'A'.charCodeAt(0);
    }
    static getNameById(id:number){
        return String.fromCharCode('A'.charCodeAt(0)+id);
    }
    static getTypeByName(name:string){
        return new RoomType(RoomType.getIdByName(name),name);
    }
    static getTypeById(id:number){
        return new RoomType(id,RoomType.getNameById(id));
    }
    static isDecorateRoomType(roomType:RoomType):boolean{
        return RoomType.START_ROOM.isNotEqual(roomType)&&RoomType.TEST_ROOM.isNotEqual(roomType)&&RoomType.PREPARE_ROOM.isNotEqual(roomType);
    }
    static isMonsterGenerateRoom(roomType:RoomType){
        return RoomType.DANGER_ROOM.isEqual(roomType)||RoomType.END_ROOM.isEqual(roomType)||RoomType.INSANE_ROOM.isEqual(roomType)
        ||RoomType.KEY_ROOM.isEqual(roomType)||RoomType.LOOT_ROOM.isEqual(roomType)||RoomType.NORMAL_ROOM.isEqual(roomType);
    }
    isEqual(roomType:RoomType):boolean{
        return roomType.ID==this.ID;
    }
    isNotEqual(roomType:RoomType):boolean{
        return roomType.ID!=this.ID;
    }
}