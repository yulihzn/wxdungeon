import ChapterData from "../Data/ChapterData";
import LevelData from "../Data/LevelData";
import RoomData from "../Data/RoomData";

export default class WorldLoader {
    public static readonly EMPTY_ROOM = 0;//空房间 O
    public static readonly START_ROOM = 1;//开始房间 S
    public static readonly END_ROOM = 2;//结束房间 E
    public static readonly MERCHANT_ROOM = 3;//商店 M
    public static readonly BOSS_ROOM = 4;//头目房间 B
    public static readonly ELITE_ROOM = 5;//小头目房间 A
    public static readonly LOOT_ROOM = 6;//宝箱房间 L
    public static readonly CROSS_ROOM = 7;//十字通道 C
    public static readonly VERTICAL_ROOM = 8;//纵向通道 V
    public static readonly HORIZONTAL_ROOM = 9;//横向通道 H
    public static readonly NORMAL_ROOM = 10;//正常房间 N
    public static readonly DANGER_ROOM = 11;//危险房间 D
    public static readonly INSANE_ROOM = 12;//疯狂房间 I
    public static readonly PREPARE_ROOM = 13;//准备房间 P
    public static readonly HIDDEN_ROOM = 14;//隐藏房间 Y
    public static readonly TEST_ROOM = 15;//测试房间 T
    public static readonly REST_ROOM = 16;//休息房间 R
    public static readonly TUTORIAL_ROOM = 17;//教程房间 J
    public static readonly KEY_ROOM = 18;//钥匙房间 K
    public static readonly FINAL_ROOM = 19;//最终房间 F
    private worldMap: ChapterData[] = [];
    //文件是否加载成功
    isloaded: boolean = false;
    constructor(){
        this.isloaded = false;
    }
    loadMap() {
        if(this.worldMap.length>0){
            this.isloaded = true;
            return;
        }
        this.loadFile();
    }
    private loadFile() {
        cc.loader.loadRes(`Data/worlds`, (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                this.worldMap = new Array();
                let arr = resource.json;
                for (let chapter=0;chapter<arr.length;chapter++) {
                    let chapterData = new ChapterData(chapter);
                    chapterData.map = new Array();
                    let maptemp: string[][][][] = arr[chapter].map;
                    for (let level = 0; level < maptemp.length; level++) {
                        let levelData = new LevelData(chapterData.chapter, level);
                        levelData.map = new Array();
                        let maparr: string[][][] = maptemp[level];
                        for (let index = 0; index < maparr.length; index++) {
                            let roomData = new RoomData(chapterData.chapter, levelData.level, index, maparr[index]);
                            levelData.map.push(roomData);
                        }
                        chapterData.map.push(levelData);
                    }
                    this.worldMap.push(chapterData);
                }
                console.log(this.worldMap);
                this.isloaded = true;
            }
        })
    }
}