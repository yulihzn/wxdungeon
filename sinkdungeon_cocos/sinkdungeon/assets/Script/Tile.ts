import Logic from "./Logic";

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
export default class Tile extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Label)
    label:cc.Label = null;
    isBroken:boolean = false;
    isAutoShow = true;
    private anim:cc.Animation;
    private timeDelay = 0;
    private isAnimPlaying:boolean = false;
    //正在瓦解
    isBreakingNow = false;
    floor:cc.Sprite;
    tileType = '**';
    onLoad () {
        this.isAutoShow = true;
        this.anim = this.getComponent(cc.Animation);
        this.floor = this.node.getChildByName('sprite').getChildByName('floor').getComponent(cc.Sprite);
    }

    start () {
        //休息区 轮船 丛林 金字塔 地牢
        switch(Logic.chapterIndex){
            case Logic.CHAPTER00:this.changeRes(this.getLabRes());break;
            case Logic.CHAPTER01:this.changeRes(this.getDeckRes());break;
            case Logic.CHAPTER02:this.changeRes(this.getDirtRes());break;
            case Logic.CHAPTER03:this.changeRes('tile003');break;
            case Logic.CHAPTER04:this.changeRes('tile004');break;
        }
        // Logic.setAlias(this.node);

    }
    getLabRes():string{
        let s = 'tile_lab001';
        switch(this.tileType){
            case '**':s = 'tile_lab001';break;
            case '*0':s = 'tile_lab002';break;
            case '*1':s = 'tile_lab003';break;
            case '*2':s = 'tile_lab003';break;
        }
        return s;
     }
    getDirtRes():string{
        let s = 'tile_dirt001';
        switch(this.tileType){
            case '**':s = 'tile_dirt001';break;
            case '*0':s = 'tile_dirt002';break;
            case '*1':s = 'tile_dirt003';break;
            case '*2':s = 'tile_dirt004';break;
        }
        return s;
     }
     getDeckRes():string{
        let s = 'tile_deck001';
        switch(this.tileType){
            case '**':s = 'tile_deck001';break;
            case '*0':s = 'tile_deck002';break;
            case '*1':s = 'tile_deck003';break;
            case '*2':s = 'tile_deck004';break;
        }
        return s;
     }
    //animation
    TileBreak(){
        // this.isBroken = true;
    }
    //animation
    TileBreakFinish(){
        this.isBroken = true;
        this.isAnimPlaying = false;
        if(this.isAutoShow){
            this.scheduleOnce(()=>{
                this.showTile();
            },2)
        }
        
    }
    //animation
    TileShow(){
        
        this.isAnimPlaying = false;
    }
    breakTile(){
        if(this.isAnimPlaying){
            return;
        }
        this.anim.play('TileBreak');
        this.isBreakingNow = true;
        this.isAnimPlaying = true;
    }
    showTile(){
        if(this.isAnimPlaying||!this.anim){
            return;
        }
        this.anim.play('TileShow');
        this.isBroken = false;
        this.isBreakingNow = false;
        this.isAnimPlaying = true;
    }

    update (dt) {
        this.timeDelay+=dt;
        if(this.timeDelay>1){
            this.timeDelay = 0;
        }
        if(this.label){
            this.label.string = ""+this.node.zIndex;
        }
    }
    changeRes(resName:string){
        this.floor.spriteFrame = Logic.spriteFrames[resName];
    }
}
