import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Building from "./Building";
import { ColliderTag } from "../Actor/ColliderTag";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Wall extends Building {

    pos:cc.Vec3;
    half = false;
    wallsprite:cc.Sprite;
    mapStr:string = '##';
    resName:string = '';
    isCorner = false;
    isBottom = false;
    dir = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.wallsprite = this.node.getChildByName('sprite').getChildByName('wallsprite').getComponent(cc.Sprite);
    }
    changeRes(resName:string){
        this.wallsprite.spriteFrame = Logic.spriteFrames[resName];
    }
    setPos(pos:cc.Vec3){
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
    }
    start () {
        this.node.opacity = 255;
        switch(Logic.chapterIndex){
            case Logic.CHAPTER00:this.changeRes(this.getRes());break;
            case Logic.CHAPTER01:this.changeRes(this.getRes());break;
            case Logic.CHAPTER02:this.changeRes(this.getRes());break;
            case Logic.CHAPTER03:this.changeRes(this.getRes());break;
            case Logic.CHAPTER04:this.changeRes(this.getRes());break;
            case Logic.CHAPTER05:this.changeRes(this.getRes());break;
        }
    }
    getRes():string{
        let s = `walltop0${Logic.chapterIndex}${this.isBottom?'anim001':'anim000'}`;
        if(this.mapStr == "##"){
            s = `walltop0${Logic.chapterIndex}anim002`;
        }
        if(this.dir == 8){
            return this.resName;
        }
        if(this.isCorner){
            s = `wallcorner0${Logic.chapterIndex}${this.isBottom?'anim001':'anim000'}`
        }
        return s;
    }
    
    onCollisionEnter(other:cc.Collider,self:cc.Collider) {
        this.node.opacity = 255;
    }
    onCollisionStay(other:cc.Collider,self:cc.Collider) {
        if(this.dir ==0 && other.tag == ColliderTag.PLAYER||other.tag == ColliderTag.MONSTER){
            this.node.opacity = 128;
        }
    }
    onCollisionExit(other:cc.Collider,self:cc.Collider) {
        this.node.opacity = 255;
    }
    // update (dt) {}
}
