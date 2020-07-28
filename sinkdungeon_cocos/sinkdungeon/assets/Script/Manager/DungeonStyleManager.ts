import Logic from "../Logic";
import Door from "../Building/Door";
import Dungeon from "../Dungeon";
import DungeonStyleData from "../Data/DungeonStyleData";
import ExitDoor from "../Building/ExitDoor";
import ParallexBackground from "../UI/ParallaxBackground";
import RoomType from "../Rect/RoomType";
import { ColliderTag } from "../Actor/ColliderTag";
import IndexZ from "../Utils/IndexZ";

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
    @property(cc.Node)
    floor: cc.Node = null;
    @property(cc.Node)
    floorShadow: cc.Node = null;


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
    walltops: cc.Node[] = new Array();
    readonly darksides = 'darksides';


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
    changeTopWalls(isShow: boolean) {
        for (let w of this.walltops) {
            w.opacity = isShow ? 255 : 0;
        }
        this.doors[0].opacity = isShow ? 255 : 0;
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
        switch (Logic.chapterIndex) {
            case Logic.CHAPTER00: this.styleData = new DungeonStyleData('pipeline', 'restwall1', 'restsides', 'restdoor', 'restdoorframe', '#000000', 'tile_lab001'); break;
            case Logic.CHAPTER01: this.styleData = new DungeonStyleData('sea', 'shipwall1', 'shipsides', 'shipdoor', 'shipdoorframe', '#000000', 'tile_deck001'); break;
            case Logic.CHAPTER02: this.styleData = new DungeonStyleData('grass', 'junglewall1', 'junglesides', 'jungledoor', 'jungledoorframe', '#000000', 'tile_dirt001'); break;
            case Logic.CHAPTER03: this.styleData = new DungeonStyleData('sandsea', 'pyramidwall1', 'pyramidsides', 'pyramiddoor', 'pyramiddoorframe', '#000000', 'tile003'); break;
            case Logic.CHAPTER04: this.styleData = new DungeonStyleData('magmasea', 'dungeonwall1', 'dungeonsides', 'dungeondoor', 'dungeondoorframe', '#000000', 'tile004'); break;
            case Logic.CHAPTER05: this.styleData = new DungeonStyleData('magmasea', 'dungeonwall1', 'dungeonsides', 'dungeondoor', 'dungeondoorframe', '#000000', 'tile004'); break;
        }
        if (!this.styleData) {
            return;
        }
        this.addFloor();
        this.doors = new Array(4);
        for (let i = -1; i < Dungeon.WIDTH_SIZE+1; i++) {
            let walltop = this.getWallTop(i);
            this.walltops.push(walltop);
            let wallbottom = this.getWallBottom(i,-1);
            let wb = this.getWallBottom(i,-2);
            if (i == Math.floor(Dungeon.WIDTH_SIZE / 2)) {
                wb.y-=16;
                this.doors[0] = cc.instantiate(this.doorDecoration);
                this.doors[0].parent = this.node;
                let postop = Dungeon.getPosInMap(cc.v3(i, Dungeon.HEIGHT_SIZE));
                this.doors[0].setPosition(cc.v3(postop.x, postop.y + 32));
                this.doors[0].zIndex = IndexZ.FLOOR;
                this.doors[0].getComponent(Door).wall = walltop;
                this.doors[0].getComponent(Door).dir = 0;
                this.doors[1] = cc.instantiate(this.doorDecoration);
                this.doors[1].parent = this.node;
                let posbottom = Dungeon.getPosInMap(cc.v3(i, -1));
                this.doors[1].setPosition(cc.v3(posbottom.x, posbottom.y));
                this.doors[1].setScale(4, -2);
                this.doors[1].zIndex = IndexZ.FLOOR;
                this.doors[1].getComponent(Door).wall = wallbottom;
                this.doors[1].getComponent(Door).dir = 1;
            }
            this.addExitDoor(i, walltop);
        }

        for (let j = -1; j < Dungeon.HEIGHT_SIZE + 3; j++) {
            let wallleft = this.getWallLeft(j);
            let wallright = this.getWallRight(j);
            if (j > Dungeon.HEIGHT_SIZE - 1) {
                this.walltops.push(wallleft);
                this.walltops.push(wallright);
            }
            if (j == Math.floor(Dungeon.HEIGHT_SIZE / 2)) {
                this.doors[2] = cc.instantiate(this.doorDecoration);
                this.doors[2].parent = this.node;
                let posleft = Dungeon.getPosInMap(cc.v3(-1, j));
                this.doors[2].setPosition(cc.v3(posleft.x, posleft.y));
                this.doors[2].zIndex = IndexZ.FLOOR;
                this.doors[2].angle = -90;
                this.doors[2].setScale(4, -2);
                this.doors[2].getComponent(Door).wall = wallleft;
                this.doors[2].getComponent(Door).dir = 2;
                this.doors[3] = cc.instantiate(this.doorDecoration);
                this.doors[3].parent = this.node;
                let posright = Dungeon.getPosInMap(cc.v3(Dungeon.WIDTH_SIZE, j));
                this.doors[3].setPosition(cc.v3(posright.x, posright.y));
                this.doors[3].zIndex = IndexZ.FLOOR;
                this.doors[3].setScale(4, 2);
                this.doors[3].angle = -90;
                this.doors[3].getComponent(Door).wall = wallright;
                this.doors[3].getComponent(Door).dir = 3;
            }
            if(j>Dungeon.HEIGHT_SIZE / 2&&j<Dungeon.HEIGHT_SIZE / 2+2){
                wallleft.zIndex = IndexZ.WALL;
                wallright.zIndex = IndexZ.WALL;
            }
        }
        let walltopleft = this.getWallTop(0);
        let walltopright = this.getWallTop(0);
        let leftpos = Dungeon.getPosInMap(cc.v3(-1, Math.floor(Dungeon.HEIGHT_SIZE / 2) + 1));
        leftpos.y += 32;
        let rightpos = Dungeon.getPosInMap(cc.v3(Dungeon.WIDTH_SIZE, Math.floor(Dungeon.HEIGHT_SIZE / 2) + 1));
        rightpos.y += 32;
        walltopleft.setPosition(leftpos);
        walltopright.setPosition(rightpos);
        this.walltops.push(walltopleft);
        this.walltops.push(walltopright);
        this.doors[2].getComponent(Door).sideWall = walltopleft;
        this.doors[3].getComponent(Door).sideWall = walltopright;
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
        let isStartRoom = Logic.mapManager.getCurrentRoomType().isEqual(RoomType.START_ROOM);
        let isEndRoom = Logic.mapManager.getCurrentRoomType().isEqual(RoomType.END_ROOM);
        let isEliteRoom = Logic.mapManager.getCurrentRoomType().isEqual(RoomType.ELITE_ROOM);
        let isBossRoom = Logic.mapManager.getCurrentRoomType().isEqual(RoomType.BOSS_ROOM);
        let isPrepareRoom = Logic.mapManager.getCurrentRoomType().isEqual(RoomType.PREPARE_ROOM);
        let isFinalRoom = Logic.mapManager.getCurrentRoomType().isEqual(RoomType.FINAL_ROOM);
        if (isStartRoom) {
            oneIndex = 1;
            otherIndex = 2;
        }
        if (posX == oneIndex) {
            let needAdd = isEndRoom || isStartRoom || isEliteRoom || isBossRoom || isPrepareRoom || isFinalRoom;
            if (needAdd) {
                let postop = Dungeon.getPosInMap(cc.v3(oneIndex, Dungeon.HEIGHT_SIZE));
                let exit = cc.instantiate(this.exitdoorPrefab);
                exit.parent = this.node;
                exit.setPosition(cc.v3(postop.x + 32, postop.y + 32));
                exit.zIndex = IndexZ.FLOOR;
                this.exitdoor = exit.getComponent(ExitDoor);
                this.exitdoor.wall1 = walltop;
                this.exitdoor.hideWall();
                this.exitdoor.isBackToUpLevel = isStartRoom;
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
        let postop = Dungeon.getPosInMap(cc.v3(posX, Dungeon.HEIGHT_SIZE));
        walltop.setPosition(cc.v3(postop.x, postop.y + 32));
        walltop.zIndex = IndexZ.WALL;
        walltop.getComponent(cc.Sprite).spriteFrame = this.styleData.topwall ? Logic.spriteFrames[this.styleData.topwall] : null;
        return walltop;
    }
    private getWallBottom(posX: number,posY:number): cc.Node {
        let wallbottom = cc.instantiate(this.wallBottomDecoration);
        wallbottom.parent = this.node;
        wallbottom.angle = 180;
        let posbottom = Dungeon.getPosInMap(cc.v3(posX, posY));
        wallbottom.setPosition(cc.v3(posbottom.x, posbottom.y));
        wallbottom.zIndex = IndexZ.ROOF;
        wallbottom.getComponent(cc.PhysicsBoxCollider).tag = ColliderTag.DEFAULT;
        wallbottom.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrames[posY<-1?this.darksides:'darksidesbottom'];
        return wallbottom;
    }
    private getWallLeft(posY: number): cc.Node {
        let wallleft = cc.instantiate(this.wallLeftDecoration);
        wallleft.parent = this.node;
        let posleft = Dungeon.getPosInMap(cc.v3(-1, posY));
        wallleft.setPosition(cc.v3(posleft.x, posleft.y));
        wallleft.zIndex = IndexZ.WALLSIDEFRONT;
        wallleft.getComponent(cc.Sprite).spriteFrame = this.styleData.sidewall ? Logic.spriteFrames[this.styleData.sidewall] : null;
        if(posY<0){
            wallleft.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrames[this.darksides];
        }
        return wallleft;
    }
    private getWallRight(posY: number): cc.Node {
        let wallright = cc.instantiate(this.wallLeftDecoration);
        wallright.parent = this.node;
        let posright = Dungeon.getPosInMap(cc.v3(Dungeon.WIDTH_SIZE, posY));
        wallright.setPosition(cc.v3(posright.x, posright.y));
        wallright.zIndex = IndexZ.WALLSIDEFRONT;
        wallright.setScale(-4, 4);
        wallright.getComponent(cc.Sprite).spriteFrame = this.styleData.sidewall ? Logic.spriteFrames[this.styleData.sidewall] : null;
        if(posY<0){
            wallright.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrames[this.darksides];
        }
        return wallright;
    }

    private addDecorateBg() {
        let bg = cc.instantiate(this.parallaxBackground);
        bg.parent = this.node;
        let pos = Dungeon.getPosInMap(cc.v3(Dungeon.WIDTH_SIZE / 2, Dungeon.HEIGHT_SIZE / 2));
        bg.setPosition(pos);
        bg.zIndex = IndexZ.BACKGROUND;
        let pbg = bg.getComponent(ParallexBackground);
        pbg.background.width = 32 * Dungeon.WIDTH_SIZE;
        pbg.background.height = 32 * (Dungeon.HEIGHT_SIZE + 4);
        pbg.background.color = cc.Color.WHITE.fromHEX(this.styleData.bg02color);
        pbg.init();
    }
    private addFloor() {
        this.floor.width = 16 * (Dungeon.WIDTH_SIZE + 0);
        this.floor.height = 16 * (Dungeon.HEIGHT_SIZE + 0);
        let pos = Dungeon.getPosInMap(cc.v3(0, 0));
        this.floor.position = cc.v3(pos.x - 32, pos.y - 32);
        this.floor.zIndex = IndexZ.BACKGROUNDFLOOR;
        this.floor.getComponent(cc.Sprite).spriteFrame = Logic.spriteFrames[this.styleData.floor];
        this.floorShadow.width = 16 * (Dungeon.WIDTH_SIZE + 0);
        this.floorShadow.height = 16 * (Dungeon.HEIGHT_SIZE + 0);
        this.floorShadow.position = cc.v3(pos.x - 32, pos.y - 32);
        this.floorShadow.opacity = 128;
        this.floorShadow.zIndex = IndexZ.FLOOR;
    }

    setDoor(dir: number, isDoor: boolean, isOpen: boolean,isHidden:boolean) {
        let door = this.styleData.door;
        let floor = this.styleData.floor;
        let frame = this.styleData.doorframe;
        let doorSprite = this.doors[dir].getChildByName('sprite').getComponent(cc.Sprite);
        let bg = this.doors[dir].getChildByName('bg').getComponent(cc.Sprite);
        let frameSprite = this.doors[dir].getChildByName('bg').getChildByName('frame').getComponent(cc.Sprite);
        bg.spriteFrame = floor ? Logic.spriteFrames[floor] : null;
        doorSprite.spriteFrame = door ? Logic.spriteFrames[door] : null;
        frameSprite.spriteFrame = frame ? Logic.spriteFrames[frame] : null;
        doorSprite.node.color = isDoor?cc.Color.GRAY:cc.Color.BLACK;
        frameSprite.node.color = cc.Color.GRAY;
        bg.node.color = dir > 1 ? cc.Color.GRAY : cc.Color.BLACK;
        let theDoor: Door = this.doors[dir].getComponent(Door);
        if (theDoor) {
            theDoor.isDoor = isDoor;
            theDoor.setOpen(isOpen);
        }

    }

    // update (dt) {}
}
