import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Building from "./Building";
import { ColliderTag } from "../Actor/ColliderTag";
import IndexZ from "../Utils/IndexZ";
import LevelData from "../Data/LevelData";

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
export default class Wall extends Building {

    pos: cc.Vec3;
    half = false;
    wallsprite: cc.Sprite;
    shadowsprite: cc.Sprite;
    mapStr: string = '##';
    resName: string = '';
    resNameSecond: string = '';
    isCorner = false;//是否角落
    isInteral = false;//是否内角
    isBottom = false;
    isEmpty = false;
    isSecond = false;//是否次级墙体

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.wallsprite = this.node.getChildByName('sprite').getChildByName('wallsprite').getComponent(cc.Sprite);
        this.shadowsprite = this.node.getChildByName('sprite').getChildByName('shadow').getComponent(cc.Sprite);
    }
    changeRes(resName: string) {
        this.wallsprite.spriteFrame = Logic.spriteFrames[resName];
        if (this.isEmpty) {
            return this.node.opacity = 0;
        }
    }
    setPos(pos: cc.Vec3) {
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
    }
    start() {
        this.node.opacity = 255;
        this.changeRes(this.getRes());
        if (this.mapStr[1] == '8' || this.mapStr[1] == '9' || this.mapStr[1] == '#') {
            let collider = this.node.getComponent(cc.BoxCollider);
            collider.offset = cc.Vec2.ZERO;
        } else if (this.isCorner) {
            this.node.zIndex = IndexZ.WALLCORNER;
        } else {
            this.node.zIndex = IndexZ.WALL;
        }
    }
    init(mapStr: string, leveldata: LevelData) {
        this.mapStr = mapStr;
        if (mapStr == '##') {
            this.isEmpty = true;
        }
        let index = parseInt(mapStr[1]);
        if (isNaN(index)&&mapStr != '##'&&mapStr != '#a'
        &&mapStr != '#b'&&mapStr != '#c'&&mapStr != '#d') {
            this.isSecond = true;
        }
        switch (mapStr) {
            case '##': this.isEmpty = true;
                break;

            case '#e':
            case '#0':
                break;

            case '#f':
            case '#1': this.node.angle = 180; this.isBottom = true;
                break;

            case '#g':
            case '#2': this.node.angle = 90;
                break;

            case '#h':
            case '#3': this.node.angle = -90;
                break;


            case '#m':
            case '#a': this.isInteral = true;
            case '#i':
            case '#4': this.node.angle = -90;
                break;

            case '#n':
            case '#b': this.isInteral = true;
            case '#j':
            case '#5': this.node.angle = 180;
                break;

            case '#o':
            case '#c': this.isInteral = true;
            case '#k':
            case '#6': this.isBottom = true;
                break;

            case '#p':
            case '#d': this.isInteral = true;
            case '#l':
            case '#7': this.isBottom = true; this.node.scaleX = -1;
                this.getComponent(cc.PhysicsBoxCollider).offset.x = 64;
                this.getComponent(cc.PhysicsBoxCollider).apply();
                break;
        }
        if (this.isInteral) {
            this.node.zIndex = IndexZ.WALLINTERNAL;
        }
        this.resName = leveldata.wallRes1;
        if(this.isSecond){
            this.resName = leveldata.wallRes2;
        }else if(this.mapStr == '#8'){
            this.resName = leveldata.wallRes3;
        }else if(this.mapStr == '#9'){
            this.resName = leveldata.wallRes4;
        }
    }
    getRes(): string {
        let s = `${this.resName}anim000`;
        if (this.mapStr[1] == '8' || this.mapStr[1] == '9' || this.mapStr[1] == '#') {
            return this.resName;
        }
        if (this.isBottom) {
            this.shadowsprite.node.opacity = 0;
        }
        if (this.isCorner) {
            if (!this.isInteral) {
                this.shadowsprite.node.opacity = 0;
            }
            return `${this.resName}corner${this.isInteral ? 'anim001' : 'anim000'}`
        }
        return s;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (!this.isEmpty) {
            this.node.opacity = 255;
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (this.mapStr[1] == '0' && !this.isEmpty && (other.tag == ColliderTag.PLAYER || other.tag == ColliderTag.MONSTER)) {
            this.node.opacity = 128;
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (!this.isEmpty) {
            this.node.opacity = 255;
        }
    }
    // update (dt) {}
}
