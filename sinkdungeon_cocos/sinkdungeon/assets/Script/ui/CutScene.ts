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
export default class CutScene extends cc.Component {

    cut001:cc.Node;
    cut002:cc.Node;
    cut003:cc.Node;
    cut004:cc.Node;
    cut006:cc.Node;
    cut007:cc.Node;
    cut008:cc.Node;
    cut009:cc.Node;
    // LIFE-CYCLE CALLBACKS:
    cutList:cc.Node[];
    skipNode:cc.Node;
    isSkip = false;

    onLoad () {
        this.skipNode = this.node.getChildByName('skip');
        this.cut001 = this.node.getChildByName('sprite').getChildByName('cut001');
        this.cut002 = this.node.getChildByName('sprite').getChildByName('cut002');
        this.cut003 = this.node.getChildByName('sprite').getChildByName('cut003');
        this.cut004 = this.node.getChildByName('sprite').getChildByName('cut004');
        this.cut006 = this.node.getChildByName('sprite').getChildByName('cut006');
        this.cut007 = this.node.getChildByName('sprite').getChildByName('cut007');
        this.cut008 = this.node.getChildByName('sprite').getChildByName('cut008');
        this.cut009 = this.node.getChildByName('sprite').getChildByName('cut009');
        this.cutList = new Array();
        this.cutList.push(this.cut001);
        this.cutList.push(this.cut002);
        this.cutList.push(this.cut003);
        this.cutList.push(this.cut004);
        this.cutList.push(this.cut006);
        this.cutList.push(this.cut007);
        this.cutList.push(this.cut008);
        this.cutList.push(this.cut009);
        this.skipNode.opacity = 0;
        this.node.opacity = 0;
        this.hideAllCuts();
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch)=> {
            if(this.skipNode.opacity == 255){
                this.isSkip = true;
            }
            this.skipNode.opacity = 255;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch)=> {
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch)=> {
        }, this);
    }
    playShow():void{
        this.node.opacity = 255;
        this.getComponent(cc.Animation).play();
        this.scheduleOnce(()=>{this.isSkip = true},12);
    }

    unregisterClick(){
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL);
        this.node.off(cc.Node.EventType.TOUCH_END);
    }
    hideAllCuts():void{
        for(let cut of this.cutList){
            cut.opacity = 0;
        }
    }
   
    start () {

    }

    // update (dt) {}
}
