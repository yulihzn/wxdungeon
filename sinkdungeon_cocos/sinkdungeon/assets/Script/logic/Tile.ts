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
    coverPrefix = '';
    cover1 = '';
    cover2 = '';
    cover3 = '';
    cover4 = '';
    cover5 = '';
    floorPrefix = '';
    private isSmall = false;
    onLoad () {
        this.isAutoShow = true;
        this.anim = this.getComponent(cc.Animation);
        this.floor = this.node.getChildByName('sprite').getChildByName('floor').getComponent(cc.Sprite);
    }

    start () {
        //休息区 轮船 丛林 金字塔 地牢
        // switch(Logic.chapterIndex){
        //     case Logic.CHAPTER00:this.changeRes(this.getLabRes());break;
        //     case Logic.CHAPTER01:this.changeRes(this.getDeckRes());break;
        //     case Logic.CHAPTER02:this.changeRes(this.getDirtRes());break;
        //     case Logic.CHAPTER03:this.changeRes('tile003');break;
        //     case Logic.CHAPTER04:this.changeRes('tile004');break;
        //     case Logic.CHAPTER05:this.changeRes('tile004');break;
        // }
        // Logic.setAlias(this.node);
        this.changeRes(this.getRes());

    }
    getRes():string{
        let s = this.floorPrefix+'001';
        switch(this.tileType){
            case '**':s = this.floorPrefix+'001';break;
            case '*0':s = this.floorPrefix+'002';this.isSmall = true;break;
            case '*1':s = this.floorPrefix+'003';this.isSmall = true;break;
            case '*2':s = this.floorPrefix+'001';this.isSmall = true;break;
            case '*3':s = this.floorPrefix+'002';this.isSmall = true;break;
            case '*4':s = this.coverPrefix+'004';break;
            case '*5':s = this.cover1;break;
            case '*6':s = this.cover2;break;
            case '*7':s = this.cover3;break;
            case '*8':s = this.cover4;break;
            case '*9':s = this.cover5;break;
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

    // update (dt) {
    //     this.timeDelay+=dt;
    //     if(this.timeDelay>1){
    //         this.timeDelay = 0;
    //     }
    //     if(this.label){
    //         this.label.string = ""+this.node.zIndex;
    //     }
    // }
    changeRes(resName:string){
        this.floor.spriteFrame = Logic.spriteFrameRes(resName);
        if(this.floor.spriteFrame == null){
            this.floor.spriteFrame = Logic.spriteFrameRes(this.floorPrefix+'001');
        }
        this.floor.node.width = this.isSmall?17:33;
        this.floor.node.height = this.isSmall?17:33;
    }
}
