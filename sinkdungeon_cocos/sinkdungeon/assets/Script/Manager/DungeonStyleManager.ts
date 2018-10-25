import Logic from "../Logic";
import Door from "../Building/Door";
import Dungeon from "../Dungeon";
import DungeonStyleData from "../Data/DungeonStyleData";

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

    doorRes: string = null;
    styleData: DungeonStyleData;
    doors:cc.Node[] = new Array();


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
    runBackgroundAnim(resName:string) {
        if (!this.background01) {
            return;
        }
        let spf1=Logic.spriteFrames[resName];
        let spf2=Logic.spriteFrames[resName+'1'];
        if(!spf2){spf2=Logic.spriteFrames[resName];}
        if(!spf1){
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
            case 'chapter00': this.styleData = new DungeonStyleData(null, 'restwall1','restwall', 'restsides', 'restdoor', 'restdecoration01', null); break;
            case 'chapter01': this.styleData = new DungeonStyleData('sea', 'shipwall','shipwall', 'handrail', 'shipdoor', 'swimring', 'swimring'); break;
            case 'chapter02': this.styleData = new DungeonStyleData('grass', 'junglewall1','junglewall', 'junglesides', 'jungledoor', null, null); break;
            case 'chapter03': this.styleData = new DungeonStyleData('sandsea', 'pyramidwall','pyramidwall', 'pyramidsides', 'dungeondoor', null, null); break;
            case 'chapter04': this.styleData = new DungeonStyleData('magmasea', 'dungeonwall','dungeonwall', 'dungeonsides', 'dungeondoor', null, null); break;
        }
        if(!this.styleData){
            return;
        }
        this.doors = new Array(4);
        for (let i = 0; i < Dungeon.WIDTH_SIZE; i++) {
            let walltop = cc.instantiate(this.wallTopDecoration);
            walltop.parent = this.node;
            let postop = Dungeon.getPosInMap(cc.v2(i, Dungeon.HEIGHT_SIZE));
            walltop.setPosition(cc.v2(postop.x, postop.y + 32));
            walltop.zIndex = 2500;
            walltop.getComponent(cc.Sprite).spriteFrame = this.styleData.topwall ? Logic.spriteFrames[this.styleData.topwall] : null;

            let wallbottom = cc.instantiate(this.wallBottomDecoration);
            wallbottom.parent = this.node;
            let posbottom = Dungeon.getPosInMap(cc.v2(i, -1));
            wallbottom.setScale(4, 2);
            wallbottom.setPosition(cc.v2(posbottom.x, posbottom.y));
            wallbottom.zIndex = 2500;
            wallbottom.getComponent('cc.PhysicsBoxCollider').tag = 0;
            wallbottom.getComponent(cc.Sprite).spriteFrame = this.styleData.topwall ? Logic.spriteFrames[this.styleData.bottomwall] : null;
            if (i == Math.floor(Dungeon.WIDTH_SIZE / 2)) {
                this.doors[0] = cc.instantiate(this.doorDecoration);
                this.doors[0].parent = this.node;
                let postop = Dungeon.getPosInMap(cc.v2(i, Dungeon.HEIGHT_SIZE));
                this.doors[0].setPosition(cc.v2(postop.x, postop.y+32));
                this.doors[0].zIndex = 2000;
                this.doors[0].getComponent(Door).wall = walltop;
                this.doors[0].getComponent(Door).dir = 0;
                this.doors[1] = cc.instantiate(this.doorDecoration);
                this.doors[1].parent = this.node;
                let posbottom = Dungeon.getPosInMap(cc.v2(i, -1));
                this.doors[1].setPosition(cc.v2(posbottom.x, posbottom.y));
                this.doors[1].setScale(4,2);
                this.doors[1].zIndex = 2000;
                this.doors[1].getComponent(Door).wall = wallbottom;
                this.doors[1].getComponent(Door).dir = 1;
            }
        }
        for (let j = -1; j < Dungeon.HEIGHT_SIZE + 2; j++) {
            let wallleft = cc.instantiate(this.wallLeftDecoration);
            wallleft.parent = this.node;
            let posleft = Dungeon.getPosInMap(cc.v2(-1, j));
            wallleft.setPosition(cc.v2(posleft.x, posleft.y));
            wallleft.zIndex = 2500;
            wallleft.getComponent(cc.Sprite).spriteFrame = this.styleData.sidewall ? Logic.spriteFrames[this.styleData.sidewall] : null;

            let wallright = cc.instantiate(this.wallLeftDecoration);
            wallright.parent = this.node;
            let posright = Dungeon.getPosInMap(cc.v2(Dungeon.WIDTH_SIZE, j));
            wallright.setPosition(cc.v2(posright.x, posright.y));
            wallright.zIndex = 2500;
            wallright.setScale(-4, 4);
            wallright.getComponent(cc.Sprite).spriteFrame = this.styleData.sidewall ? Logic.spriteFrames[this.styleData.sidewall] : null;
            if (j == Math.floor(Dungeon.HEIGHT_SIZE / 2)) {
                this.doors[2] = cc.instantiate(this.doorDecoration);
                this.doors[2].parent = this.node;
                let posleft = Dungeon.getPosInMap(cc.v2(-1, j));
                this.doors[2].setPosition(cc.v2(posleft.x, posleft.y));
                this.doors[2].zIndex = 2000;
                this.doors[2].rotation = -90;
                this.doors[2].setScale(4,2);
                this.doors[2].getComponent(Door).wall = wallleft;
                this.doors[2].getComponent(Door).dir = 2;
                this.doors[3] = cc.instantiate(this.doorDecoration);
                this.doors[3].parent = this.node;
                let posright = Dungeon.getPosInMap(cc.v2(Dungeon.WIDTH_SIZE, j));
                this.doors[3].setPosition(cc.v2(posright.x, posright.y));
                this.doors[3].zIndex = 2000;
                this.doors[3].setScale(4,2);
                this.doors[3].rotation = 90;
                this.doors[3].getComponent(Door).wall = wallright;
                this.doors[3].getComponent(Door).dir = 3;
            }
        }
        this.background01.getComponent(cc.Sprite).spriteFrame = this.styleData.background ? Logic.spriteFrames[this.styleData.background] : null;
        this.runBackgroundAnim(this.styleData.background);
    }

    // setStyle(background: string, topwall: string, sidewall: string, door: string, d1: string, d2: string) {
    //     this.doorRes = door;
    //     this.background01.getComponent(cc.Sprite).spriteFrame = background ? Logic.spriteFrames[background] : null;
    //     this.background02.getComponent(cc.Sprite).spriteFrame = background ? Logic.spriteFrames[background] : null;
    //     this.setWall(this.wallTop, topwall, door);
    //     this.setWall(this.wallBottom, topwall, door);
    //     this.setWall(this.wallLeft, sidewall, door);
    //     this.setWall(this.wallRight, sidewall, door);
    //     this.wallDecoration01.getComponent(cc.Sprite).spriteFrame = d1 ? Logic.spriteFrames[d1] : null;
    //     this.wallDecoration02.getComponent(cc.Sprite).spriteFrame = d2 ? Logic.spriteFrames[d2] : null;
    // }
    // setWall(wallNode: cc.Node, wall: string, door: string) {
    //     wallNode.getChildByName('wallleft').getComponent(cc.Sprite).spriteFrame = wall ? Logic.spriteFrames[wall] : null;
    //     wallNode.getChildByName('wallright').getComponent(cc.Sprite).spriteFrame = wall ? Logic.spriteFrames[wall] : null;
    //     wallNode.getChildByName('wallcenter').getComponent(cc.Sprite).spriteFrame = wall ? Logic.spriteFrames[wall] : null;
    //     wallNode.getChildByName('door').getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = door ? Logic.spriteFrames[door] : null;
    // }
    setDoor(dir: number, isDoor: boolean, isOpen: boolean) {
        // let wallNode = null;
        // switch (dir) {
        //     case 0: wallNode = this.wallTop; break;
        //     case 1: wallNode = this.wallBottom; break;
        //     case 2: wallNode = this.wallLeft; break;
        //     case 3: wallNode = this.wallRight; break;
        // }
        // if (!wallNode) {
        //     return;
        // }
        let door = this.styleData.door;
        this.doors[dir].getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = door ? Logic.spriteFrames[door] : null;
        let theDoor: Door = this.doors[dir].getComponent(Door);
        if (theDoor) {
            theDoor.isDoor = isDoor;
            theDoor.setOpen(isOpen);
        }

    }

    // update (dt) {}
}
