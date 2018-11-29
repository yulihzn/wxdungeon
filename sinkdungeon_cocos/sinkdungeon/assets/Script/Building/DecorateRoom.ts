// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//用来装饰房间周围的房间
const {ccclass, property} = cc._decorator;

@ccclass
export default class DecorateRoom extends cc.Component {

    @property(cc.Node)
    floor:cc.Node = null;
    @property(cc.Node)
    walltop:cc.Node = null;
    @property(cc.Node)
    wallbottom:cc.Node = null;
    @property(cc.Node)
    wallleft:cc.Node = null;
    @property(cc.Node)
    wallright:cc.Node = null;
    width = 15;
    height = 15;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
