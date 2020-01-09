import { EventConstant } from "../EventConstant";

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
export default class ChunkLookCamera extends cc.Component {
    camera:cc.Camera;

    targetPosition:cc.Vec2;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.camera = this.getComponent(cc.Camera);
        cc.director.on(EventConstant.CAMERA_LOOK, (event) => {
            this.lookAt(event.detail.position);
        })
    }
    lookAt(position){
        this.targetPosition = position;
    }
    lateUpdate(){
        if(this.targetPosition){
            // this.node.position = this.lerp(this.node.position,this.node.parent.convertToNodeSpaceAR(this.targetPosition),0.1);
        }
    }
    lerp(self:cc.Vec2,to:cc.Vec2, ratio:number):cc.Vec2 {
        let out = cc.v2(0,0);
        let x = self.x;
        let y = self.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        return out;
    }
}
