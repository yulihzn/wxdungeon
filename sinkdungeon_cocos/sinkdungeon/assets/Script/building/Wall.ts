import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Building from "./Building";
import { ColliderTag } from "../actor/ColliderTag";
import LevelData from "../data/LevelData";

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

    static readonly TYPE_EMPTY = -1;//空
    static readonly TYPE_NORMAL = 0;//普通
    static readonly TYPE_CORNER = 1;//外角
    static readonly TYPE_INNER = 2;//内角
    static readonly TYPE_CONVEX = 3;//凸角
    static readonly TYPE_CONCAVE = 4;//凹角
    static readonly TYPE_INNER_CORNER = 5;//内外角
    static readonly TYPE_TWO_SIDES = 6;//横竖
    static readonly TYPE_ALONE = 7;//单独
    static readonly TYPE_ROOF = 8;//房顶
    static readonly TYPE_OTHER1 = 9;//其它1
    static readonly TYPE_OTHER2 = 10;//其它2
    static readonly TYPE_OTHER3 = 11;//其它2
    static readonly TYPE_OTHER4 = 12;//其它2
    pos: cc.Vec3;
    half = false;
    wallsprite: cc.Sprite;
    roofsprite: cc.Sprite;
    shadowsprite: cc.Sprite;
    mapStr: string = '##';
    wallName: string = '';//wall***anim000 roof***anim000
    roofName: string = '';
    resNameSecond: string = '';
    type: number = Wall.TYPE_EMPTY;
    dir = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.wallsprite = this.node.getChildByName('sprite').getChildByName('wallsprite').getComponent(cc.Sprite);
        this.roofsprite = this.node.getChildByName('sprite').getChildByName('roofsprite').getComponent(cc.Sprite);
        this.shadowsprite = this.node.getChildByName('sprite').getChildByName('shadow').getComponent(cc.Sprite);
    }
    changeRes(wallName: string, roofName: string) {
        this.wallsprite.spriteFrame = Logic.spriteFrameRes(wallName);
        this.roofsprite.spriteFrame = Logic.spriteFrameRes(roofName);
        if (this.type == Wall.TYPE_EMPTY) {
            return this.node.opacity = 0;
        }
        if (this.type == Wall.TYPE_OTHER1 || this.type == Wall.TYPE_OTHER2
            || this.type == Wall.TYPE_OTHER3|| this.type == Wall.TYPE_OTHER4) {
            this.roofsprite.node.opacity = 0;
            this.wallsprite.node.height = 256;
        }
    }
    setPos(pos: cc.Vec3) {
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
    }
    start() {
        this.node.opacity = 255;
        this.changeRes(this.wallName, this.roofName);
    }
    private ajustSpriteShow(isShowShadow: boolean, roofAngle: number, flipWall: boolean, flipRoof: cc.Vec3) {
        if (!this.wallsprite) {
            this.wallsprite = this.node.getChildByName('sprite').getChildByName('wallsprite').getComponent(cc.Sprite);
            this.roofsprite = this.node.getChildByName('sprite').getChildByName('roofsprite').getComponent(cc.Sprite);
            this.shadowsprite = this.node.getChildByName('sprite').getChildByName('shadow').getComponent(cc.Sprite);
        }
        this.shadowsprite.node.opacity = isShowShadow ? 80 : 0;
        this.roofsprite.node.angle = roofAngle;
        this.wallsprite.node.scaleX = flipWall ? -1 : 1;
        this.roofsprite.node.scaleX = flipRoof.x;
        this.roofsprite.node.scaleY = flipRoof.y;
    }
    public isTop(): boolean {
        return this.type == Wall.TYPE_NORMAL && this.dir == 0
            || this.type == Wall.TYPE_CORNER && this.dir < 2
            || this.type == Wall.TYPE_INNER && this.dir < 2
            || this.type == Wall.TYPE_INNER_CORNER && this.dir < 2
            || this.type == Wall.TYPE_CONVEX && this.dir == 0
            || this.type == Wall.TYPE_CONCAVE && this.dir == 0;
    }
    public isSide(): boolean {
        return this.type == Wall.TYPE_NORMAL && this.dir > 1;
    }
    init(mapStr: string, leveldata: LevelData, onlyShow: boolean) {
        this.mapStr = mapStr;
        let dir = parseInt(mapStr[2]);
        this.dir = dir;
        let letter = mapStr[1];
        let isSencod = false;
        switch (letter) {
            case '#': this.type = Wall.TYPE_EMPTY; break;
            case '0': this.type = Wall.TYPE_OTHER1; break;
            case '1': this.type = Wall.TYPE_OTHER2; break;
            case '2': this.type = Wall.TYPE_OTHER3; break;
            case '3': this.type = Wall.TYPE_OTHER4; break;
            case 'a': this.type = Wall.TYPE_NORMAL; break;
            case 'b': this.type = Wall.TYPE_CORNER; break;
            case 'c': this.type = Wall.TYPE_INNER; break;
            case 'd': this.type = Wall.TYPE_CONVEX; break;
            case 'e': this.type = Wall.TYPE_CONCAVE; break;
            case 'f': this.type = Wall.TYPE_INNER_CORNER; break;
            case 'g': this.type = Wall.TYPE_TWO_SIDES; break;
            case 'h': this.type = Wall.TYPE_ALONE; break;
            case 'i': this.type = Wall.TYPE_ROOF; break;
            case 'j': this.type = Wall.TYPE_NORMAL; isSencod = true; break;
            case 'k': this.type = Wall.TYPE_CORNER; isSencod = true; break;
            case 'l': this.type = Wall.TYPE_INNER; isSencod = true; break;
            case 'm': this.type = Wall.TYPE_CONVEX; isSencod = true; break;
            case 'n': this.type = Wall.TYPE_CONCAVE; isSencod = true; break;
            case 'o': this.type = Wall.TYPE_INNER_CORNER; isSencod = true; break;
            case 'p': this.type = Wall.TYPE_TWO_SIDES; isSencod = true; break;
            case 'q': this.type = Wall.TYPE_ALONE; isSencod = true; break;
            case 'r': this.type = Wall.TYPE_ROOF; isSencod = true; break;
        }
        let res = isSencod ? leveldata.wallRes2 : leveldata.wallRes1;
        let roofdarkness = `roof${res}anim008`;
        switch (this.type) {
            case Wall.TYPE_EMPTY: break;
            case Wall.TYPE_OTHER1: this.wallName = leveldata.wallRes3; break;
            case Wall.TYPE_OTHER2: this.wallName = leveldata.wallRes4; break;
            case Wall.TYPE_OTHER3: this.wallName = leveldata.wallRes5; break;
            case Wall.TYPE_OTHER4: this.wallName = leveldata.wallRes6; break;
            case Wall.TYPE_NORMAL: this.roofName = `roof${res}anim000`; this.wallName = `wall${res}anim001`; break;
            case Wall.TYPE_CORNER: this.roofName = `roof${res}anim001`; this.wallName = roofdarkness; break;
            case Wall.TYPE_INNER: this.roofName = `roof${res}anim002`; this.wallName = `wall${res}anim002`; break;
            case Wall.TYPE_CONVEX: this.roofName = `roof${res}anim003`; this.wallName = `wall${res}anim000`; break;
            case Wall.TYPE_CONCAVE: this.roofName = `roof${res}anim004`; this.wallName = roofdarkness; break;
            case Wall.TYPE_INNER_CORNER: this.roofName = `roof${res}anim005`; this.wallName = `wall${res}anim002`; break;
            case Wall.TYPE_TWO_SIDES: this.roofName = `roof${res}anim006`; this.wallName = `wall${res}anim001`; break;
            case Wall.TYPE_ALONE: this.roofName = `roof${res}anim007`; this.wallName = `wall${res}anim000`; break;
            case Wall.TYPE_ROOF: this.roofName = roofdarkness; this.wallName = roofdarkness; break;
        }
        let isWallFlip = false;
        let roofAngle = 0;
        let roofFlip = cc.v3(1, 1);
        let showShadow = false;
        switch (dir) {
            case 0: this.ajustSpriteShow(true, roofAngle, isWallFlip, roofFlip);
                break;
            case 1:
                if (this.isInnerOrCorner(this.type)) {
                    isWallFlip = true;
                    roofFlip = cc.v3(-1, 1);
                    showShadow = true;
                } else if (this.type == Wall.TYPE_TWO_SIDES) {
                    roofAngle = 90;
                } else {
                    this.wallName = roofdarkness;
                    roofFlip = cc.v3(1, -1);
                }
                this.ajustSpriteShow(showShadow, roofAngle, isWallFlip, roofFlip); break;
            case 2:
                if (this.isInnerOrCorner(this.type)) {
                    roofFlip = cc.v3(1, -1);
                    this.wallName = roofdarkness;
                } else {
                    if (this.type == Wall.TYPE_CONVEX) {
                        this.wallName = `wall${res}anim002`;
                    }
                    roofAngle = 90;
                }
                this.ajustSpriteShow(false, roofAngle, isWallFlip, roofFlip);
                break;
            case 3:
                if (this.isInnerOrCorner(this.type)) {
                    roofFlip = cc.v3(-1, -1);
                    this.wallName = roofdarkness;
                } else {
                    if (this.type == Wall.TYPE_CONVEX) {
                        this.wallName = `wall${res}anim002`;
                        isWallFlip = true;
                    }
                    roofAngle = -90;
                }
                this.ajustSpriteShow(false, roofAngle, isWallFlip, roofFlip);
                break;
        }
        if (this.isTop()) {
            let collider = this.getComponent(cc.PhysicsBoxCollider);
            collider.tag = ColliderTag.WALL_TOP;
        }
        if (onlyShow) {
            let pcollider = this.getComponent(cc.PhysicsBoxCollider);
            let rigidbody = this.getComponent(cc.RigidBody);
            if (pcollider) { pcollider.enabled = false; }
            if (rigidbody) { rigidbody.active = false; }
        }
    }
    private isInnerOrCorner(type: number): boolean {
        return type == Wall.TYPE_INNER || type == Wall.TYPE_CORNER || type == Wall.TYPE_INNER_CORNER;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (this.type != Wall.TYPE_EMPTY && (other.tag == ColliderTag.PLAYER || other.tag == ColliderTag.NONPLAYER)) {
            if (this.type == Wall.TYPE_OTHER1 || this.type == Wall.TYPE_OTHER2
                || this.type == Wall.TYPE_OTHER3|| this.type == Wall.TYPE_OTHER4) {
                this.wallsprite.node.opacity = 180;
            } else {
                this.roofsprite.node.opacity = 180;
            }
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (this.type != Wall.TYPE_EMPTY && (other.tag == ColliderTag.PLAYER || other.tag == ColliderTag.NONPLAYER)) {
            if (this.type == Wall.TYPE_OTHER1 || this.type == Wall.TYPE_OTHER2
                || this.type == Wall.TYPE_OTHER3|| this.type == Wall.TYPE_OTHER4) {
                this.wallsprite.node.opacity = 180;
            } else {
                this.roofsprite.node.opacity = 180;
            }
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (this.type != Wall.TYPE_EMPTY && (other.tag == ColliderTag.PLAYER || other.tag == ColliderTag.NONPLAYER)) {
            if (this.type == Wall.TYPE_OTHER1 || this.type == Wall.TYPE_OTHER2
                || this.type == Wall.TYPE_OTHER3|| this.type == Wall.TYPE_OTHER4) {
                this.wallsprite.node.opacity = 255;
            } else {
                this.roofsprite.node.opacity = 255;
            }
        }
    }
    // update (dt) {}
}
