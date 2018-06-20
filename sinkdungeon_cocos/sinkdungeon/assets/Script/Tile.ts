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

    isBroken:boolean = false;
    private anim:cc.Animation;
    private timeDelay = 0;
    private isNeedShow:boolean = false;

    onLoad () {
        let ss = this.node.getComponentsInChildren(cc.Sprite);
        for(let i = 0;i < ss.length;i++){
            ss[i].spriteFrame.getTexture().setAliasTexParameters();
        }
        this.anim = this.getComponent(cc.Animation);
    }

    start () {

    }

    TileBreak(){
        this.isNeedShow = true;
    }
    TileShow(){
        this.isBroken = false;
    }
    breakTile(){
        this.isBroken = true;
        this.anim.play('TileBreak');
    }
    showTile(){
    }

    update (dt) {
        this.timeDelay+=dt;
        if(this.timeDelay>1){
            this.timeDelay = 0;
            if(this.isNeedShow){
                this.isNeedShow = false;
                this.anim.play('TileShow');
            }
        }
    }
}
