import Dungeon from "../Dungeon";
import Logic from "../Logic";

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
export default class Wall extends cc.Component {

    pos:cc.Vec2;
    half = false;
    wallsprite:cc.Sprite;

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
            case Logic.CHAPTER00:this.changeRes('wall000');break;
            case Logic.CHAPTER01:this.changeRes('wall005');break;
            case Logic.CHAPTER02:this.changeRes('wall005');break;
            case Logic.CHAPTER03:this.changeRes('wall005');break;
            case Logic.CHAPTER04:this.changeRes('wall005');break;
        }
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
