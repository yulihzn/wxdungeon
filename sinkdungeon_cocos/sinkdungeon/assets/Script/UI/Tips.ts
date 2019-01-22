// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//交互作用的提示,依托于父组件不能独立放置
const {ccclass, property} = cc._decorator;

@ccclass
export default class Tips extends cc.Component {
    static readonly TAROT_TABLE = "Tips.TAROT_TABLE";
    isUse = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    next(callback:Function):void{
        if(!this.isUse){
            return;
        }
        this.isUse = true;
        if(callback){
            callback(Tips.TAROT_TABLE);
            setTimeout(()=>{this.isUse = false;},100);
        }
    }
    onDestroy(){
        this.isUse = false;
    }
    // update (dt) {}
}
