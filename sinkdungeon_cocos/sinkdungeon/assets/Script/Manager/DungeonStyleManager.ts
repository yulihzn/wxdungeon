import Logic from "../Logic";
import Door from "../Building/Door";

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
export default class DungeonStyleManager extends cc.Component {

   
    @property(cc.Node)
    background01: cc.Node = null;
    @property(cc.Node)
    background02: cc.Node = null;
    @property(cc.Node)
    wallTop: cc.Node = null;
    @property(cc.Node)
    wallLeft: cc.Node = null;
    @property(cc.Node)
    wallRight: cc.Node = null;
    @property(cc.Node)
    wallBottom: cc.Node = null;
    @property(cc.Node)
    wallDecoration01: cc.Node = null;
    @property(cc.Node)
    wallDecoration02: cc.Node = null;

    doorRes:string = null;
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //休息区 轮船 丛林 金字塔 地牢
        //黑幕背景top left right室内浅青色墙d1 紧闭的门
        switch(Logic.chapterName){
            case 'chapter00':this.setStyle(null,'restwall','restsides','restdoor','restdecoration01',null);break;
            case 'chapter01':this.setStyle('sea','shipwall','handrail','shipdoor','swimring','swimring');break;
            case 'chapter02':this.setStyle('sea','junglewall','junglesides','jungledoor',null,null);break;
            case 'chapter03':this.setStyle('sandsea','pyramidwall','pyramidsides','dungeondoor',null,null);break;
            case 'chapter04':this.setStyle('magmasea','dungeonwall','dungeonsides','dungeondoor',null,null);break;
        }
    }

    start () {

    }
    
    setStyle(background:string,topwall:string,sidewall:string,door:string,d1:string,d2:string){
        this.doorRes = door;
        this.background01.getComponent(cc.Sprite).spriteFrame = background?Logic.spriteFrames[background]:null;
        this.background02.getComponent(cc.Sprite).spriteFrame = background?Logic.spriteFrames[background]:null;
        this.setWall(this.wallTop,topwall,door);
        this.setWall(this.wallBottom,topwall,door);
        this.setWall(this.wallLeft,sidewall,door);
        this.setWall(this.wallRight,sidewall,door);
        this.wallDecoration01.getComponent(cc.Sprite).spriteFrame = d1?Logic.spriteFrames[d1]:null;
        this.wallDecoration02.getComponent(cc.Sprite).spriteFrame = d2?Logic.spriteFrames[d2]:null;
    }
    setWall(wallNode:cc.Node,wall:string,door:string){
        wallNode.getChildByName('wallleft').getComponent(cc.Sprite).spriteFrame = wall?Logic.spriteFrames[wall]:null;
        wallNode.getChildByName('wallright').getComponent(cc.Sprite).spriteFrame = wall?Logic.spriteFrames[wall]:null;
        wallNode.getChildByName('wallcenter').getComponent(cc.Sprite).spriteFrame = wall?Logic.spriteFrames[wall]:null;
        wallNode.getChildByName('door').getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = door?Logic.spriteFrames[door]:null;
    }
    setDoor(dir:number,isDoor:boolean,isOpen:boolean){
        let wallNode = null;
        switch(dir){
            case 0:wallNode=this.wallTop;break;
            case 1:wallNode=this.wallBottom;break;
            case 2:wallNode=this.wallLeft;break;
            case 3:wallNode=this.wallRight;break;
        }
        if(!wallNode){
            return;
        }
        let door = this.doorRes;
        wallNode.getChildByName('door').getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = door?Logic.spriteFrames[door]:null;
        let theDoor:Door = wallNode.getChildByName('door').getComponent(Door);
        if(theDoor){
            theDoor.isDoor = isDoor;
            theDoor.setOpen(isOpen);
        }

    }

    // update (dt) {}
}
