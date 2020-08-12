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
    isCorner = false;
    isBottom = false;
    dir = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // let ss = this.node.getComponentsInChildren(cc.Sprite);
        //     for (let i = 0; i < ss.length; i++) {
        //         if (ss[i].spriteFrame) {
        //             ss[i].spriteFrame.getTexture().setAliasTexParameters();
        //         }
        //     }
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
        if(this.dir == 8){
            s = `walltop0${Logic.chapterIndex}anim002`;
        }
        if(this.isCorner){
            s = `wallcorner0${Logic.chapterIndex}${this.isBottom?'anim001':'anim000'}`
        }
        return s;
    }
    getRes00():string{
        let s = 'walltop00anim000';
        switch(this.mapStr){
            case '##':s = this.isBottom?'walltop00anim001':'walltop00anim000';break;
            case '#0':s = 'wall00anim000';break;
            case '#1':s = 'wall00anim001';break;
        }
        if(this.isCorner){
            s = this.isBottom?'wallcorner00anim001':'wallcorner00anim000';
        }
        return s;
    }
    getRes01():string{
        let s = 'walltop01anim000';
        switch(this.mapStr){
            case '##':s = this.isBottom?'walltop01anim001':'walltop01anim000';break;
            case '#0':s = 'wall01anim000';break;
            case '#1':s = 'wall01anim001';break;
        }
        if(this.isCorner){
            s = this.isBottom?'wallcorner01anim001':'wallcorner01anim000';
        }
        return s;
    }
    getRes02():string{
        let s = 'walltop02anim000';
        switch(this.mapStr){
            case '##':s = this.isBottom?'walltop02anim001':'walltop02anim000';break;
            case '#0':s = 'wall02anim000';break;
            case '#1':s = 'wall02anim001';break;
        }
        if(this.isCorner){
            s = this.isBottom?'wallcorner02anim001':'wallcorner02anim000';
        }
        return s;
    }
    getRes03():string{
        let s = 'walltop03anim000';
        switch(this.mapStr){
            case '##':s = this.isBottom?'walltop03anim001':'walltop03anim000';break;
            case '#0':s = 'wall03anim000';break;
            case '#1':s = 'wall03anim001';break;
            case '#2':s = 'wall03anim002';break;
        }
        if(this.isCorner){
            s = this.isBottom?'wallcorner03anim001':'wallcorner03anim000';
        }
        return s;
    }
    getRes04():string{
        let s = 'walltop04anim000';
        switch(this.mapStr){
            case '##':s = this.isBottom?'walltop04anim001':'walltop04anim000';break;
            case '#0':s = 'wall04anim000';break;
            case '#1':s = 'wall04anim000';break;
        }
        if(this.isCorner){
            s = this.isBottom?'wallcorner04anim001':'wallcorner04anim000';
        }
        return s;
    }
    getRes05():string{
        let s = 'walltop05anim000';
        switch(this.mapStr){
            case '##':s = this.isBottom?'walltop05anim001':'walltop05anim000';break;
            case '#0':s = 'wall05anim000';break;
            case '#1':s = 'wall05anim000';break;
        }
        if(this.isCorner){
            s = this.isBottom?'wallcorner05anim001':'wallcorner05anim000';
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
