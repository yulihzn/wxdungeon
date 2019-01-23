import TarotData from "../Data/TarotData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TarotCard extends cc.Component {

    indexLabel: cc.Label = null;
    anim:cc.Animation = null;
    frontNode:cc.Node = null;
    backNode:cc.Node = null;
    data:TarotData = new TarotData();

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
        this.frontNode = this.node.getChildByName('sprite').getChildByName('front');
        this.backNode = this.node.getChildByName('sprite').getChildByName('back');
        this.indexLabel = this.node.getChildByName('sprite').getChildByName('front').getChildByName('index').getComponent(cc.Label);
        this.frontNode.scaleX = 0;
        this.backNode.scaleY = 1;
    }
    initFromGround():void{
        if(!this.anim){
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play("TarotIdle");
    }
    showCard():void{
        if(!this.anim){
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play("TarotFilpToFront");
    }
    coverCard():void{
        if(!this.anim){
            this.anim = this.getComponent(cc.Animation);
        }
        this.anim.play("TarotFilpToBack");
    }
    start () {

    }

    // update (dt) {}
}
