import Logic from "../Logic";
import Door from "../Building/Door";
import Dungeon from "../Dungeon";
import DungeonStyleData from "../Data/DungeonStyleData";
import RectDungeon from "../Rect/RectDungeon";
import ExitDoor from "../Building/ExitDoor";
import DecorateRoom from "../Building/DecorateRoom";
import RectRoom from "../Rect/RectRoom";
import ParallexBackground from "../UI/ParallaxBackground";

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
export default class DungeonStyleManager extends cc.Component {


    @property(cc.Node)
    background01: cc.Node = null;


    @property(cc.Prefab)
    wallTopDecoration: cc.Prefab = null;
    @property(cc.Prefab)
    wallBottomDecoration: cc.Prefab = null;
    @property(cc.Prefab)
    wallLeftDecoration: cc.Prefab = null;
    @property(cc.Prefab)
    doorDecoration: cc.Prefab = null;
    @property(cc.Prefab)
    exitdoorPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    parallaxBackground: cc.Prefab = null;
    exitdoor: ExitDoor = null;

    doorRes: string = null;
    styleData: DungeonStyleData;
    doors: cc.Node[] = new Array();
    walltops:cc.Node[] = new Array();


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //休息区 轮船 丛林 金字塔 地牢
        //黑幕背景top left right室内浅青色墙d1 紧闭的门
        // switch (Logic.chapterName) {
        //     case 'chapter00': this.setStyle(null, 'restwall', 'restsides', 'restdoor', 'restdecoration01', null); break;
        //     case 'chapter01': this.setStyle('sea', 'shipwall', 'handrail', 'shipdoor', 'swimring', 'swimring'); break;
        //     case 'chapter02': this.setStyle('sea', 'junglewall', 'junglesides', 'jungledoor', null, null); break;
        //     case 'chapter03': this.setStyle('sandsea', 'pyramidwall', 'pyramidsides', 'dungeondoor', null, null); break;
        //     case 'chapter04': this.setStyle('magmasea', 'dungeonwall', 'dungeonsides', 'dungeondoor', null, null); break;
        // }
    }

    start() {

    }
    changeTopWalls(isShow:boolean){
        for(let w of this.walltops){
            w.opacity = isShow?255:0;
        }
        this.doors[0].opacity = isShow?255:0;
    }
    runBackgroundAnim(resName: string) {
        if (!this.background01) {
            return;
        }
        let spf1 = Logic.spriteFrames[resName];
        let spf2 = Logic.spriteFrames[resName + '1'];
        if (!spf2) { spf2 = Logic.spriteFrames[resName]; }
        if (!spf1) {
            return;
        }
        this.background01.stopAllActions();
        let sprite = this.background01.getComponent(cc.Sprite);
        let action = cc.repeatForever(cc.sequence(
            cc.moveBy(0.4, 0, 0), cc.callFunc(() => { sprite.spriteFrame = spf1; }),
            cc.moveBy(0.4, 0, 0), cc.callFunc(() => { sprite.spriteFrame = spf2; })));
        this.background01.runAction(action);

    }
    addDecorations() {
        switch (Logic.chapterName) {
            case Logic.CHAPTER00: this.styleData = new DungeonStyleData('pipeline', 'restwall', 'restsides', 'restdoor', 'restdoorframe', '#323c39', null); break;
            case Logic.CHAPTER01: this.styleData = new DungeonStyleData('sea', 'shipwall', 'shipsides', 'shipdoor', 'shipdoorframe', '#12222e', 'null'); break;
            case Logic.CHAPTER02: this.styleData = new DungeonStyleData('grass', 'junglewall', 'junglesides', 'jungledoor', 'jungledoorframe', '#1b300d', null); break;
            case Logic.CHAPTER03: this.styleData = new DungeonStyleData('sandsea', 'pyramidwall', 'pyramidsides', 'pyramiddoor', 'pyramiddoorframe', '#c8bc69', null); break;
            case Logic.CHAPTER04: this.styleData = new DungeonStyleData('magmasea', 'dungeonwall', 'dungeonsides', 'dungeondoor', 'dungeondoorframe', '#1f1e1e', null); break;
        }
        if (!this.styleData) {
            return;
        }
        this.doors = new Array(4);
        for (let i = 0; i < Dungeon.WIDTH_SIZE; i++) {
            let walltop = this.getWallTop(i);
            this.walltops.push(walltop);
            let wallbottom = this.getWallBottom(i);
            if (i == Math.floor(Dungeon.WIDTH_SIZE / 2)) {
                this.doors[0] = cc.instantiate(this.doorDecoration);
                this.doors[0].parent = this.node;
                let postop = Dungeon.getPosInMap(cc.v2(i, Dungeon.HEIGHT_SIZE));
                this.doors[0].setPosition(cc.v2(postop.x, postop.y + 32));
                this.doors[0].zIndex = 2000;
                this.doors[0].getComponent(Door).wall = walltop;
                this.doors[0].getComponent(Door).dir = 0;
                this.doors[1] = cc.instantiate(this.doorDecoration);
                this.doors[1].parent = this.node;
                let posbottom = Dungeon.getPosInMap(cc.v2(i, -1));
                this.doors[1].setPosition(cc.v2(posbottom.x, posbottom.y));
                this.doors[1].setScale(4, 2);
                this.doors[1].zIndex = 2000;
                this.doors[1].getComponent(Door).wall = wallbottom;
                this.doors[1].getComponent(Door).dir = 1;
            }
            this.addExitDoor(i, walltop);
        }
        for (let j = -1; j < Dungeon.HEIGHT_SIZE + 4; j++) {
            let wallleft = this.getWallLeft(j);
            let wallright = this.getWallRight(j);
            if(j>Dungeon.HEIGHT_SIZE-1){
                this.walltops.push(wallleft);
                this.walltops.push(wallright);
            }
            if (j == Math.floor(Dungeon.HEIGHT_SIZE / 2)) {
                this.doors[2] = cc.instantiate(this.doorDecoration);
                this.doors[2].parent = this.node;
                let posleft = Dungeon.getPosInMap(cc.v2(-1, j));
                this.doors[2].setPosition(cc.v2(posleft.x, posleft.y));
                this.doors[2].zIndex = 2000;
                this.doors[2].angle = 90;
                this.doors[2].setScale(4, 2);
                this.doors[2].getComponent(Door).wall = wallleft;
                this.doors[2].getComponent(Door).dir = 2;
                this.doors[3] = cc.instantiate(this.doorDecoration);
                this.doors[3].parent = this.node;
                let posright = Dungeon.getPosInMap(cc.v2(Dungeon.WIDTH_SIZE, j));
                this.doors[3].setPosition(cc.v2(posright.x, posright.y));
                this.doors[3].zIndex = 2000;
                this.doors[3].setScale(4, 2);
                this.doors[3].angle = -90;
                this.doors[3].getComponent(Door).wall = wallright;
                this.doors[3].getComponent(Door).dir = 3;
            }
        }

        this.background01.getComponent(cc.Sprite).spriteFrame = this.styleData.background ? Logic.spriteFrames[this.styleData.background] : null;
        this.runBackgroundAnim(this.styleData.background);
        this.addDecorateBg();
    }
    private addExitDoor(posX: number, walltop: cc.Node) {
        let oneIndex = Dungeon.WIDTH_SIZE - 3;
        let otherIndex = Dungeon.WIDTH_SIZE - 2;
        // if (Logic.chapterName != 'chapter00') {
        //     return;
        // }
        let isStartRoom = Logic.mapManager.getCurrentRoomType() == RectDungeon.START_ROOM;
        let isEndRoom = Logic.mapManager.getCurrentRoomType() == RectDungeon.END_ROOM&&Logic.level != 3&&Logic.level != 5;
        let isPuzzleRoom = Logic.mapManager.getCurrentRoomType() == RectDungeon.PUZZLE_ROOM;
        let isBossRoom = Logic.mapManager.getCurrentRoomType() == RectDungeon.BOSS_ROOM;
        let isTarotRoom = Logic.mapManager.getCurrentRoomType() == RectDungeon.TAROT_ROOM;
        let isFinalRoom = Logic.mapManager.getCurrentRoomType() == RectDungeon.FINAL_ROOM;
        if (isStartRoom) {
            oneIndex = 1;
            otherIndex = 2;
        }
        if (posX == oneIndex) {
            let needAdd = isEndRoom || isStartRoom || isPuzzleRoom || isBossRoom || isTarotRoom||isFinalRoom;
            if (needAdd) {
                let postop = Dungeon.getPosInMap(cc.v2(oneIndex, Dungeon.HEIGHT_SIZE));
                let exit = cc.instantiate(this.exitdoorPrefab);
                exit.parent = this.node;
                exit.setPosition(cc.v2(postop.x + 32, postop.y + 32));
                exit.zIndex = 2000;
                this.exitdoor = exit.getComponent(ExitDoor);
                this.exitdoor.wall1 = walltop;
                this.exitdoor.hideWall();
                this.walltops.push(exit);
            }
        }
        if (posX == otherIndex && this.exitdoor) {
            this.exitdoor.wall2 = walltop;
            this.exitdoor.hideWall();
        }
    }

    private getWallTop(posX: number): cc.Node {
        let walltop = cc.instantiate(this.wallTopDecoration);
        walltop.parent = this.node;
        let postop = Dungeon.getPosInMap(cc.v2(posX, Dungeon.HEIGHT_SIZE));
        walltop.setPosition(cc.v2(postop.x, postop.y + 32));
        walltop.zIndex = 2500;
        walltop.getComponent(cc.Sprite).spriteFrame = this.styleData.topwall ? Logic.spriteFrames[this.styleData.topwall] : null;
        return walltop;
    }
    private getWallBottom(posX: number): cc.Node {
        let wallbottom = cc.instantiate(this.wallBottomDecoration);
        wallbottom.parent = this.node;
        wallbottom.angle = 90;
        let posbottom = Dungeon.getPosInMap(cc.v2(posX, -1));
        wallbottom.setPosition(cc.v2(posbottom.x, posbottom.y));
        wallbottom.zIndex = 2500;
        wallbottom.getComponent('cc.PhysicsBoxCollider').tag = 0;
        wallbottom.getComponent(cc.Sprite).spriteFrame = this.styleData.sidewall ? Logic.spriteFrames[this.styleData.sidewall] : null;
        return wallbottom;
    }
    private getWallLeft(posY: number): cc.Node {
        let wallleft = cc.instantiate(this.wallLeftDecoration);
        wallleft.parent = this.node;
        let posleft = Dungeon.getPosInMap(cc.v2(-1, posY));
        wallleft.setPosition(cc.v2(posleft.x, posleft.y));
        wallleft.zIndex = 2500;
        wallleft.getComponent(cc.Sprite).spriteFrame = this.styleData.sidewall ? Logic.spriteFrames[this.styleData.sidewall] : null;
        return wallleft;
    }
    private getWallRight(posY: number): cc.Node {
        let wallright = cc.instantiate(this.wallLeftDecoration);
        wallright.parent = this.node;
        let posright = Dungeon.getPosInMap(cc.v2(Dungeon.WIDTH_SIZE, posY));
        wallright.setPosition(cc.v2(posright.x, posright.y));
        wallright.zIndex = 2500;
        wallright.setScale(-4, 4);
        wallright.getComponent(cc.Sprite).spriteFrame = this.styleData.sidewall ? Logic.spriteFrames[this.styleData.sidewall] : null;
        return wallright;
    }

    private addDecorateBg(){
        let bg = cc.instantiate(this.parallaxBackground);
        bg.parent = this.node;
        let pos = Dungeon.getPosInMap(cc.v2(Dungeon.WIDTH_SIZE/2, Dungeon.HEIGHT_SIZE/2));
        bg.setPosition(pos);
        bg.zIndex = 100;
        let pbg = bg.getComponent(ParallexBackground);
        pbg.background.width = 32*Dungeon.WIDTH_SIZE;
        pbg.background.height = 32*(Dungeon.HEIGHT_SIZE+4);
        pbg.background.color = cc.Color.WHITE.fromHEX(this.styleData.bg02color);
        pbg.init();
    }

    setDoor(dir: number, isDoor: boolean, isOpen: boolean) {
        let door = this.styleData.door;
        let frame = this.styleData.doorframe;
        this.doors[dir].getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = door ? Logic.spriteFrames[door] : null;
        this.doors[dir].getChildByName('bg').getChildByName('frame').getComponent(cc.Sprite).spriteFrame = frame ? Logic.spriteFrames[frame] : null;
        let theDoor: Door = this.doors[dir].getComponent(Door);
        if (theDoor) {
            theDoor.isDoor = isDoor;
            theDoor.setOpen(isOpen);
        }

    }

    // update (dt) {}
}
