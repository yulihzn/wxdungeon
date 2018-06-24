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
    label:cc.Label;
    isBroken:boolean = false;
    private anim:cc.Animation;
    private timeDelay = 0;
    private isAnimPlaying:boolean = false;
    //正在瓦解
    isBreakingNow = false;
    onLoad () {
        let ss = this.node.getComponentsInChildren(cc.Sprite);
        for(let i = 0;i < ss.length;i++){
            ss[i].spriteFrame.getTexture().setAliasTexParameters();
        }
        this.anim = this.getComponent(cc.Animation);
    }

    start () {

    }
    //animation
    TileBreak(){
        // this.isBroken = true;
    }
    //animation
    TileBreakFinish(){
        this.isBroken = true;
        this.isAnimPlaying = false;
        setTimeout(()=>{
            this.showTile();
        },2000)
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
        if(this.isAnimPlaying){
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
}
