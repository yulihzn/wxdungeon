// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class BoxData {

    pos:cc.Vec3;
    defaultPos:cc.Vec3;
    position:cc.Vec3;
    status = 0;//0:未破坏 1:已破坏
    valueCopy(data:BoxData){
        this.pos = data.pos?cc.v3(data.pos.x,data.pos.y):cc.v3(0,0);
        this.defaultPos = data.defaultPos?cc.v3(data.defaultPos.x,data.defaultPos.y):cc.v3(0,0);
        this.position = data.position?cc.v3(data.position.x,data.position.y):cc.v3(0,0);
        this.status = data.status?data.status:0;
    }
}
