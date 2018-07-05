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
    wallDecoration01: cc.Node = null;
    @property(cc.Node)
    wallDecoration02: cc.Node = null;
    @property(cc.Node)
    wallDecoration03: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //休息区 轮船 丛林 金字塔 地牢
        //黑幕背景top left right室内浅青色墙d1 紧闭的门
        switch(Logic.chapterName){
            case 'chapter00':this.setStyle(null,'restwall','restsides','restdoor','restdecoration01',null);break;
            case 'chapter01':this.setStyle('sea','shipwall','handrail','shipdoor','swimring','swimring');break;
            case 'chapter02':this.setStyle('sea','junglewall','junglesides',null,null,null);break;
            case 'chapter03':this.setStyle('sandsea','pyramidwall','pyramidsides',null,'swimring','swimring');break;
            case 'chapter04':this.setStyle('magmasea','shipwall','dungeonsides','shipdoor','swimring','swimring');break;
        }
    }

    start () {

    }
    
    setStyle(background:string,topwall:string,sidewall:string,d1:string,d2:string,d3:string){
        this.background01.getComponent(cc.Sprite).spriteFrame = background?Logic.spriteFrames[background]:null;
        this.background02.getComponent(cc.Sprite).spriteFrame = background?Logic.spriteFrames[background]:null;
        this.wallTop.getComponent(cc.Sprite).spriteFrame = topwall?Logic.spriteFrames[topwall]:null;
        this.wallLeft.getComponent(cc.Sprite).spriteFrame = sidewall?Logic.spriteFrames[sidewall]:null;
        this.wallRight.getComponent(cc.Sprite).spriteFrame = sidewall?Logic.spriteFrames[sidewall]:null;
        this.wallDecoration01.getComponent(cc.Sprite).spriteFrame = d1?Logic.spriteFrames[d1]:null;
        this.wallDecoration02.getComponent(cc.Sprite).spriteFrame = d2?Logic.spriteFrames[d2]:null;
        this.wallDecoration03.getComponent(cc.Sprite).spriteFrame = d3?Logic.spriteFrames[d3]:null;
    }

    // update (dt) {}
}
