import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Building from "./Building";

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

    pos:cc.Vec2;
    half = false;
    wallsprite:cc.Sprite;
    mapStr:string = '##';

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
    setPos(pos:cc.Vec2){
        this.pos = pos;
        this.node.position = Dungeon.getPosInMap(pos);
    }
    start () {
        this.node.opacity = 255;
        switch(Logic.chapterName){
            case Logic.CHAPTER00:this.changeRes(this.getRes00());break;
            case Logic.CHAPTER01:this.changeRes(this.getRes01());break;
            case Logic.CHAPTER02:this.changeRes(this.getRes02());break;
            case Logic.CHAPTER03:this.changeRes(this.getRes03());break;
            case Logic.CHAPTER04:this.changeRes(this.getRes04());break;
        }
    }
    
    getRes00():string{
        let s = 'wall000';
        switch(this.mapStr){
            case '##':s = 'wall000';break;
            case '#0':s = 'wall000';break;
            case '#1':s = 'wall001';break;
        }
        return s;
    }
    getRes01():string{
        let s = 'wall005';
        switch(this.mapStr){
            case '##':s = 'wall005';break;
            case '#0':s = 'wall005';break;
            case '#1':s = 'wall003';break;
        }
        return s;
    }
    getRes02():string{
        let s = 'wall002';
        switch(this.mapStr){
            case '##':s = 'wall002';break;
            case '#0':s = 'wall002';break;
            case '#1':s = 'wall002';break;
        }
        return s;
    }
    getRes03():string{
        let s = 'wall008';
        switch(this.mapStr){
            case '##':s = 'wall008';break;
            case '#0':s = 'wall007';break;
            case '#1':s = 'wall006';break;
        }
        return s;
    }
    getRes04():string{
        let s = 'wall004';
        switch(this.mapStr){
            case '##':s = 'wall004';break;
            case '#0':s = 'wall004';break;
            case '#1':s = 'wall004';break;
        }
        return s;
    }
    onCollisionEnter(other:cc.Collider,self:cc.Collider) {
        this.node.opacity = 255;
    }
    onCollisionStay(other:cc.Collider,self:cc.Collider) {
        if(other.tag == 3||other.tag == 4){
            this.node.opacity = 128;
        }
    }
    onCollisionExit(other:cc.Collider,self:cc.Collider) {
        this.node.opacity = 255;
    }
    // update (dt) {}
}
