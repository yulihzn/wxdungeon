
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
export default class MagicIce extends cc.Component {

    anim:cc.Animation;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    isShow = false;

    showIce () {
        if(!this.anim){
            this.anim = this.getComponent(cc.Animation);
        }
        this.node.opacity = 128;
        this.anim.play('PlayerMagicIceIdle');
        this.isShow = true;
    }
    breakIce(){
        this.anim.play('PlayerMagicIceBreak');
        this.isShow = false;
    }

    // update (dt) {}
}
